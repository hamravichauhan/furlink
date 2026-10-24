'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

export async function updateProfileName(formData: FormData) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in.' };
  }

  const name = (formData.get('name') as string)?.trim();
  if (!name || name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters.' };
  }

  try {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { name },
    });

    revalidatePath('/profile');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('[updateProfileName]', err);
    return { success: false, error: 'Failed to update profile.' };
  }
}
