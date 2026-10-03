'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

async function requireAdminActor() {
  const actor = await getOrCreateCurrentUser();
  if (!actor) return { ok: false as const, error: 'Please sign in.' };
  if (actor.role !== 'ADMIN') {
    return { ok: false as const, error: 'Only admins can do this.' };
  }
  return { ok: true as const, actor };
}

export interface AdminApplicationRow {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  petImageUrl: string;
  applicantName: string;
  applicantEmail: string;
  applicantId: string;
  fullName: string;
  phone: string;
  address: string;
  reason: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export async function listApplicationsForAdmin(): Promise<
  AdminApplicationRow[]
> {
  const guard = await requireAdminActor();
  if (!guard.ok) return [];

  const rows = await prisma.adoptionApplication.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: {
      user: { select: { id: true, name: true, email: true } },
      pet: { select: { id: true, name: true, species: true, imageUrl: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    petId: r.pet.id,
    petName: r.pet.name,
    petSpecies: r.pet.species,
    petImageUrl: r.pet.imageUrl,
    applicantId: r.user.id,
    applicantName: r.user.name ?? 'Applicant',
    applicantEmail: r.user.email,
    fullName: r.fullName,
    phone: r.phone,
    address: r.address,
    reason: r.reason,
    status: r.status as ApplicationStatus,
    createdAt: r.createdAt,
  }));
}

export async function setApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus
): Promise<ActionResult> {
  const guard = await requireAdminActor();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(newStatus)) {
    return { success: false, error: 'Invalid status.' };
  }

  const app = await prisma.adoptionApplication.findUnique({
    where: { id: applicationId },
    select: { id: true, petId: true, status: true },
  });

  if (!app) return { success: false, error: 'Application not found.' };

  if (app.status === newStatus) {
    return { success: false, error: `Already ${newStatus}.` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adoptionApplication.update({
        where: { id: applicationId },
        data: { status: newStatus },
      });

      // If approving, mark pet as ADOPTED
      // If rejecting, revert pet to AVAILABLE (unless another app approved)
      if (newStatus === 'APPROVED') {
        await tx.pet.update({
          where: { id: app.petId },
          data: { status: 'ADOPTED' },
        });
      } else if (newStatus === 'REJECTED') {
        const approvedCount = await tx.adoptionApplication.count({
          where: { petId: app.petId, status: 'APPROVED' },
        });
        if (approvedCount === 0) {
          await tx.pet.update({
            where: { id: app.petId },
            data: { status: 'AVAILABLE' },
          });
        }
      }
    });

    revalidatePath('/admin/adoptions');
    revalidatePath('/adoptions');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('[setApplicationStatus]', err);
    return { success: false, error: 'Failed to update status.' };
  }
}