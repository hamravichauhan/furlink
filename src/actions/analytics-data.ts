'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export interface AnalyticsData {
  kpis: {
    totalRescues: number;
    rescueResolutionRate: number; // percentage
    totalSterilizations: number;
    sterilizationVerifiedRate: number; // percentage
    totalPets: number;
    adoptionRate: number; // percentage
    totalDonationsAmount: number;
    totalDonationsCount: number;
    totalUsers: number;
  };
  sterilizationByStatus: { name: string; count: number; fill: string }[];
  rescuesByStatus: { name: string; count: number; fill: string }[];
  petSpeciesBreakdown: { name: string; count: number; fill: string }[];
  monthlyTrends: {
    month: string;
    rescues: number;
    sterilizations: number;
    donations: number;
  }[];
}

export async function getPlatformAnalytics(): Promise<AnalyticsData | null> {
  await requireAdmin();

  const [
    totalUsers,
    rescues,
    sterilizations,
    pets,
    adoptions,
    donations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.rescueReport.findMany({ select: { createdAt: true, status: true, animalType: true } }),
    prisma.sterilizationRequest.findMany({ select: { createdAt: true, status: true, animalType: true } }),
    prisma.pet.findMany({ select: { status: true, species: true } }),
    prisma.adoptionApplication.findMany({ select: { status: true, createdAt: true } }),
    prisma.donation.findMany({ where: { status: 'SUCCESS' }, select: { amount: true, createdAt: true } }),
  ]);

  // KPIs
  const totalRescues = rescues.length;
  const resolvedRescues = rescues.filter((r) => r.status === 'RESCUED' || r.status === 'CLOSED').length;
  const rescueResolutionRate = totalRescues > 0 ? Math.round((resolvedRescues / totalRescues) * 100) : 0;

  const totalSterilizations = sterilizations.length;
  const verifiedSterilizations = sterilizations.filter((s) => s.status === 'VERIFIED' || s.status === 'COMPLETED').length;
  const sterilizationVerifiedRate = totalSterilizations > 0 ? Math.round((verifiedSterilizations / totalSterilizations) * 100) : 0;

  const totalPets = pets.length;
  const adoptedPets = pets.filter((p) => p.status === 'ADOPTED').length;
  const adoptionRate = totalPets > 0 ? Math.round((adoptedPets / totalPets) * 100) : 0;

  const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonationsCount = donations.length;

  // Sterilization status distribution
  const stStatusCounts: Record<string, number> = {
    PENDING: 0,
    SCHEDULED: 0,
    PROOF_SUBMITTED: 0,
    VERIFIED: 0,
    DISPUTED: 0,
    CANCELLED: 0,
  };
  sterilizations.forEach((s) => {
    stStatusCounts[s.status] = (stStatusCounts[s.status] ?? 0) + 1;
  });

  const sterilizationByStatus = [
    { name: 'Pending', count: stStatusCounts.PENDING, fill: '#f59e0b' },
    { name: 'Scheduled', count: stStatusCounts.SCHEDULED, fill: '#3b82f6' },
    { name: 'In Review', count: stStatusCounts.PROOF_SUBMITTED, fill: '#8b5cf6' },
    { name: 'Verified', count: stStatusCounts.VERIFIED + (stStatusCounts.COMPLETED ?? 0), fill: '#10b981' },
    { name: 'Disputed', count: stStatusCounts.DISPUTED, fill: '#f43f5e' },
    { name: 'Cancelled', count: stStatusCounts.CANCELLED, fill: '#9ca3af' },
  ].filter((item) => item.count > 0);

  // Rescue status distribution
  const rescueStatusCounts: Record<string, number> = {
    REPORTED: 0,
    IN_PROGRESS: 0,
    RESCUED: 0,
    CLOSED: 0,
  };
  rescues.forEach((r) => {
    rescueStatusCounts[r.status] = (rescueStatusCounts[r.status] ?? 0) + 1;
  });

  const rescuesByStatus = [
    { name: 'Reported', count: rescueStatusCounts.REPORTED, fill: '#f59e0b' },
    { name: 'In Progress', count: rescueStatusCounts.IN_PROGRESS, fill: '#3b82f6' },
    { name: 'Rescued', count: rescueStatusCounts.RESCUED, fill: '#10b981' },
    { name: 'Closed', count: rescueStatusCounts.CLOSED, fill: '#6b7280' },
  ];

  // Pet Species Breakdown
  const speciesCounts: Record<string, number> = {
    Dog: 0,
    Cat: 0,
    Other: 0,
  };
  pets.forEach((p) => {
    speciesCounts[p.species] = (speciesCounts[p.species] ?? 0) + 1;
  });

  const petSpeciesBreakdown = [
    { name: 'Dogs', count: speciesCounts.Dog, fill: '#059669' },
    { name: 'Cats', count: speciesCounts.Cat, fill: '#0284c7' },
    { name: 'Other', count: speciesCounts.Other, fill: '#d97706' },
  ];

  // Monthly trends (grouping recent 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const monthsMap: Record<string, { rescues: number; sterilizations: number; donations: number }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthsMap[key] = { rescues: 0, sterilizations: 0, donations: 0 };
  }

  rescues.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (monthsMap[key]) monthsMap[key].rescues += 1;
  });

  sterilizations.forEach((s) => {
    const d = new Date(s.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (monthsMap[key]) monthsMap[key].sterilizations += 1;
  });

  donations.forEach((dn) => {
    const d = new Date(dn.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (monthsMap[key]) monthsMap[key].donations += dn.amount;
  });

  const monthlyTrends = Object.entries(monthsMap).map(([month, data]) => ({
    month,
    rescues: data.rescues,
    sterilizations: data.sterilizations,
    donations: data.donations,
  }));

  return {
    kpis: {
      totalRescues,
      rescueResolutionRate,
      totalSterilizations,
      sterilizationVerifiedRate,
      totalPets,
      adoptionRate,
      totalDonationsAmount,
      totalDonationsCount,
      totalUsers,
    },
    sterilizationByStatus: sterilizationByStatus.length > 0 ? sterilizationByStatus : [{ name: 'Pending', count: 1, fill: '#f59e0b' }],
    rescuesByStatus,
    petSpeciesBreakdown,
    monthlyTrends,
  };
}
