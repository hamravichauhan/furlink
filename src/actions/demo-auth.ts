'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function setDemoRole(role: 'ADMIN' | 'VERIFIER' | 'USER' | 'GUEST') {
  const cookieStore = await cookies();
  
  if (role === 'GUEST') {
    cookieStore.delete('furlink_demo_user');
  } else {
    cookieStore.set('furlink_demo_user', role.toLowerCase(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    // Ensure the demo user exists in the database
    const users = {
      ADMIN: {
        id: 'demo-admin-id',
        email: 'admin@furlink.org',
        name: 'Neha Narvekar (Admin)',
        role: 'ADMIN' as const,
      },
      VERIFIER: {
        id: 'demo-verifier-id',
        email: 'verifier@furlink.org',
        name: 'Dr. Ramesh Sharma (Verifier)',
        role: 'VERIFIER' as const,
      },
      USER: {
        id: 'demo-user-id',
        email: 'user@furlink.org',
        name: 'Rahul Patil (Member)',
        role: 'USER' as const,
      },
    };

    const target = users[role];
    if (target) {
      await prisma.user.upsert({
        where: { id: target.id },
        update: { role: target.role, name: target.name, email: target.email },
        create: target,
      });
    }
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
