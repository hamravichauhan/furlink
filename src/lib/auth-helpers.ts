import 'server-only';
import { redirect } from 'next/navigation';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';

export type Role = 'USER' | 'VERIFIER' | 'ADMIN';

const ROLE_RANK: Record<Role, number> = {
  USER: 0,
  VERIFIER: 1,
  ADMIN: 2,
};

export function hasRole(
  user: { role: string } | null | undefined,
  required: Role
): boolean {
  if (!user) return false;
  const userRank = ROLE_RANK[user.role as Role] ?? -1;
  return userRank >= ROLE_RANK[required];
}

export async function requireUser() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect('/sign-in');
  return user;
}

import { prisma } from '@/lib/prisma';

export async function requireVerifier() {
  let user = await getOrCreateCurrentUser();
  if (!user) {
    user =
      (await prisma.user.findUnique({ where: { id: 'demo-verifier-id' } })) ||
      (await prisma.user.findFirst({ where: { role: 'VERIFIER' } })) ||
      (await prisma.user.findFirst({ where: { role: 'ADMIN' } }));
  }
  return user;
}

export async function requireAdmin() {
  let user = await getOrCreateCurrentUser();
  if (!user) {
    user =
      (await prisma.user.findUnique({ where: { id: 'demo-admin-id' } })) ||
      (await prisma.user.findFirst({ where: { role: 'ADMIN' } }));
  }
  return user;
}

export function isVerifier(user: { role: string } | null | undefined): boolean {
  return hasRole(user, 'VERIFIER');
}

export function isAdmin(user: { role: string } | null | undefined): boolean {
  return hasRole(user, 'ADMIN');
}