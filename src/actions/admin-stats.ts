'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';

async function requireAdminActor() {
  const actor = await getOrCreateCurrentUser();
  if (!actor) return { ok: false as const };
  if (actor.role !== 'ADMIN') return { ok: false as const };
  return { ok: true as const, actor };
}

export interface AdminOverviewStats {
  users: { total: number; admins: number; verifiers: number; regular: number };
  sterilization: {
    total: number;
    pending: number;
    scheduled: number;
    proofSubmitted: number;
    verified: number;
    disputed: number;
    cancelled: number;
  };
  rescues: { total: number; open: number; inProgress: number; resolved: number };
  adoptions: {
    pets: number;
    available: number;
    applications: number;
    pendingApplications: number;
  };
  donations: { total: number; count: number };
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats | null> {
  const guard = await requireAdminActor();
  if (!guard.ok) {
    console.log('[admin-stats] not admin');
    return null;
  }

  const [
    totalUsers,
    adminCount,
    verifierCount,
    regularCount,
    sterilizationByStatus,
    rescuesByStatus,
    petsTotal,
    petsAvailable,
    appsTotal,
    appsPending,
    donationsAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'VERIFIER' } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.sterilizationRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.rescueReport.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.pet.count(),
    prisma.pet.count({ where: { status: 'AVAILABLE' } }),
    prisma.adoptionApplication.count(),
    prisma.adoptionApplication.count({ where: { status: 'PENDING' } }),
    prisma.donation.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const stMap: Record<string, number> = {};
  for (const row of sterilizationByStatus) stMap[row.status] = row._count._all;

  const rescueMap: Record<string, number> = {};
  for (const row of rescuesByStatus) rescueMap[row.status] = row._count._all;

  const result: AdminOverviewStats = {
    users: {
      total: totalUsers,
      admins: adminCount,
      verifiers: verifierCount,
      regular: regularCount,
    },
    sterilization: {
      total: Object.values(stMap).reduce((a, b) => a + b, 0),
      pending: stMap.PENDING ?? 0,
      scheduled: stMap.SCHEDULED ?? 0,
      proofSubmitted: stMap.PROOF_SUBMITTED ?? 0,
      verified: (stMap.VERIFIED ?? 0) + (stMap.COMPLETED ?? 0),
      disputed: stMap.DISPUTED ?? 0,
      cancelled: stMap.CANCELLED ?? 0,
    },
    rescues: {
      total: Object.values(rescueMap).reduce((a, b) => a + b, 0),
      open: rescueMap.REPORTED ?? 0,
      inProgress: rescueMap.IN_PROGRESS ?? 0,
      resolved: (rescueMap.RESCUED ?? 0) + (rescueMap.CLOSED ?? 0),
    },
    adoptions: {
      pets: petsTotal,
      available: petsAvailable,
      applications: appsTotal,
      pendingApplications: appsPending,
    },
    donations: {
      total: donationsAgg._sum.amount ?? 0,
      count: donationsAgg._count._all,
    },
  };

  console.log('[admin-stats] result:', JSON.stringify(result));
  return result;
}