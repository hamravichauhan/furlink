import { currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getOrCreateCurrentUser() {
  // 1. Try Clerk first
  try {
    const user = await currentUser();
    if (user) {
      const email = user.emailAddresses[0]?.emailAddress ?? '';
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null;

      return await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email,
          name: fullName,
        },
        create: {
          id: user.id,
          email,
          name: fullName,
        },
      });
    }
  } catch (err: any) {
    // Next.js dynamic prerendering uses DYNAMIC_SERVER_USAGE to bail out to dynamic
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw err;
    }
  }

  // 2. Check for offline/demo user cookie
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('furlink_demo_user')?.value;

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
