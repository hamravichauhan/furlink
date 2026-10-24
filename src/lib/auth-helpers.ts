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

export async function requireVerifier() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect('/sign-in');
  if (!hasRole(user, 'VERIFIER')) redirect('/');
  return user;
}

export async function requireAdmin() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect('/sign-in');
  if (!hasRole(user, 'ADMIN')) redirect('/');
  return user;
}

export function isVerifier(user: { role: string } | null | undefined): boolean {
  return hasRole(user, 'VERIFIER');
}

export function isAdmin(user: { role: string } | null | undefined): boolean {
  return hasRole(user, 'ADMIN');
}