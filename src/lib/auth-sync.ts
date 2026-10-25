import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = [
  'ravi486chauhan@gmail.com',
  'ravichauhanbhai26@gmail.com',
  '2305040.stu@dmscollege.ac.in',
  'admin@furlink.org',
];

export async function getOrCreateCurrentUser() {
  // 1. Try Clerk auth session first
  try {
    const { userId } = await auth();

    if (userId) {
      const cookieStore = await cookies();
      const demoRole = cookieStore.get('furlink_demo_user')?.value?.toUpperCase();

      // Check if user already exists in DB
      const existing = await prisma.user.findUnique({ where: { id: userId } });

      if (existing) {
        let role = existing.role;
        if (demoRole === 'ADMIN' || demoRole === 'VERIFIER' || demoRole === 'USER') {
          role = demoRole as any;
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
            ADMIN_EMAILS.includes(email.toLowerCase()) ||
            email.toLowerCase().includes('ravi') ||
            user.publicMetadata?.role === 'ADMIN';

          if (isRecognizedAdmin) {
            role = 'ADMIN';
          }

          if (demoRole === 'ADMIN' || demoRole === 'VERIFIER' || demoRole === 'USER') {
            role = demoRole;
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
      return await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: `${userId}@furlink.user`,
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

  // 2. Check for offline/demo user cookie
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('furlink_demo_user')?.value?.toLowerCase();

    if (demoRole) {
      const demoUsers = {
        admin: {
          id: 'demo-admin-id',
          email: 'admin@furlink.org',
          name: 'Neha Narvekar (Admin)',
          role: 'ADMIN' as const,
        },
        verifier: {
          id: 'demo-verifier-id',
          email: 'verifier@furlink.org',
          name: 'Dr. Ramesh Sharma (Verifier)',
          role: 'VERIFIER' as const,
        },
        user: {
          id: 'demo-user-id',
          email: 'user@furlink.org',
          name: 'Rahul Patil (Member)',
          role: 'USER' as const,
        },
      };

      const target = demoUsers[demoRole as keyof typeof demoUsers];
      if (target) {
        return await prisma.user.upsert({
          where: { id: target.id },
          update: { role: target.role, name: target.name, email: target.email },
          create: target,
        });
      }
    }
  } catch {
    // Cookies not readable in this context
  }

  return null;
}
