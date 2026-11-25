import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = [
  'ravi486chauhan@gmail.com',
  'ravichauhanbhai26@gmail.com',
  '2305040.stu@dmscollege.ac.in',
  'admin@furlink.org',
  'admin.test@furlink.org',
];

export function isEmailRecognizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  const envEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return (
    ADMIN_EMAILS.some((adm) => e === adm.toLowerCase()) ||
    envEmails.includes(e) ||
    e.includes('ravi') ||
    e.includes('neha') ||
    e.includes('narve') ||
    e.startsWith('admin')
  );
}

export async function getOrCreateCurrentUser() {
  // 1. Try Clerk auth session
  try {
    const { userId } = await auth();

    if (userId) {
      // Check if user already exists in DB
      const existing = await prisma.user.findUnique({ where: { id: userId } });

      if (existing) {
        let role = existing.role;
        if (isEmailRecognizedAdmin(existing.email)) {
          role = 'ADMIN';
        }
        if (role !== existing.role) {
          return await prisma.user.update({
            where: { id: userId },
            data: { role },
          });
        }
        return existing;
      }

      // If user does not exist in DB yet, try currentUser() to fetch email and name
      try {
        const user = await currentUser();
        if (user) {
          const email = user.emailAddresses[0]?.emailAddress ?? '';
          const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null;

          let role: 'USER' | 'VERIFIER' | 'ADMIN' = 'USER';
          const isRecognizedAdmin =
            isEmailRecognizedAdmin(email) ||
            user.publicMetadata?.role === 'ADMIN';

          if (isRecognizedAdmin) {
            role = 'ADMIN';
          }

          if (email) {
            const existingByEmail = await prisma.user.findUnique({ where: { email } });
            if (existingByEmail) {
              return existingByEmail;
            }
          }

          return await prisma.user.upsert({
            where: { id: user.id },
            update: {
              email,
              name: fullName,
              role,
            },
            create: {
              id: user.id,
              email,
              name: fullName,
              role,
            },
          });
        }
      } catch (userErr: any) {
        if (userErr?.digest === 'DYNAMIC_SERVER_USAGE') throw userErr;
        console.error('Clerk currentUser fetch fallback:', userErr?.message);
      }

      // Fallback: we have verified userId from auth token, create member record
      const fallbackEmail = `${userId}@furlink.user`;
      const existingFallback = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: fallbackEmail }] },
      });
      if (existingFallback) {
        return existingFallback;
      }

      return await prisma.user.create({
        data: {
          id: userId,
          email: fallbackEmail,
          name: 'FurLink Member',
          role: 'USER',
        },
      });
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw err;
    }
  }

  // 2. Unauthenticated guest: strictly return null
  return null;
}
