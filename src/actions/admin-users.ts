'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

// ─── Types ─────────────────────────────────────────────────────────────────
export type UserRole = 'USER' | 'VERIFIER' | 'ADMIN';

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  roleUpdatedAt: Date | null;
  counts: {
    requests: number;
    rescues: number;
    verified: number;
  };
}

export type SetRoleResult =
  | { success: true }
  | { success: false; error: string };

// ─── Guards ────────────────────────────────────────────────────────────────
async function requireAdminActor() {
  const actor = await getOrCreateCurrentUser();
  if (!actor) return { ok: false as const, error: 'Please sign in.' };
  if (actor.role !== 'ADMIN') {
    return { ok: false as const, error: 'Only admins can manage users.' };
  }
  return { ok: true as const, actor };
}

// ─── List users ────────────────────────────────────────────────────────────
export async function listUsersForAdmin(): Promise<AdminUserRow[]> {
  const guard = await requireAdminActor();
  if (!guard.ok) return [];

  const users = await prisma.user.findMany({
    orderBy: [{ role: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      roleUpdatedAt: true,
      _count: {
        select: {
          sterilizations: true,
          rescues: true,
          verifiedSterilizations: true,
        },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role as UserRole,
    createdAt: u.createdAt,
    roleUpdatedAt: u.roleUpdatedAt,
    counts: {
      requests: u._count.sterilizations,
      rescues: u._count.rescues,
      verified: u._count.verifiedSterilizations,
    },
  }));
}

// ─── Set role ──────────────────────────────────────────────────────────────
export async function setUserRole(
  targetUserId: string,
  newRole: UserRole
): Promise<SetRoleResult> {
  const guard = await requireAdminActor();
  if (!guard.ok) return { success: false, error: guard.error };

  const actor = guard.actor;

  if (!['USER', 'VERIFIER', 'ADMIN'].includes(newRole)) {
    return { success: false, error: 'Invalid role.' };
  }

  if (targetUserId === actor.id) {
    return {
      success: false,
      error: 'You cannot change your own role.',
    };
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, email: true },
  });

  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  if (target.role === newRole) {
    return { success: false, error: `User is already ${newRole}.` };
  }

  // Prevent demoting the last remaining admin
  if (target.role === 'ADMIN' && newRole !== 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount <= 1) {
      return {
        success: false,
        error: 'Cannot demote the last remaining admin.',
      };
    }
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        role: newRole,
        roleUpdatedAt: new Date(),
        promotedById: actor.id,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err) {
    console.error('[setUserRole]', err);
    return { success: false, error: 'Failed to update role.' };
  }
}

// ─── Admin overview counts ─────────────────────────────────────────────────
export interface AdminOverview {
  users: number;
  verifiers: number;
  admins: number;
  sterilizationTotal: number;
  sterilizationPending: number;
  sterilizationAwaitingReview: number;
  sterilizationVerified: number;
  rescuesOpen: number;
  adoptionsPending: number;
}

export async function getAdminOverview(): Promise<AdminOverview | null> {
  const guard = await requireAdminActor();
  if (!guard.ok) return null;

  const [
    users,
    verifiers,
    admins,
    sterilizationTotal,
    sterilizationPending,
    sterilizationAwaitingReview,
    sterilizationVerified,
    rescuesOpen,
    adoptionsPending,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'VERIFIER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.sterilizationRequest.count(),
    prisma.sterilizationRequest.count({ where: { status: 'PENDING' } }),
    prisma.sterilizationRequest.count({
      where: { status: 'PROOF_SUBMITTED' },
    }),
    prisma.sterilizationRequest.count({
      where: { status: { in: ['VERIFIED', 'COMPLETED'] } },
    }),
    prisma.rescueReport.count({
      where: { status: { in: ['REPORTED', 'IN_PROGRESS'] } },
    }),
    prisma.adoptionApplication.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    users,
    verifiers,
    admins,
    sterilizationTotal,
    sterilizationPending,
    sterilizationAwaitingReview,
    sterilizationVerified,
    rescuesOpen,
    adoptionsPending,
  };
}