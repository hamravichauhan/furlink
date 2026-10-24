'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';
import { RescueStatus } from '@prisma/client';

export type CreateRescueResult =
  | { success: true; rescueId: string }
  | { success: false; error: string };

export async function createRescueReport(
  formData: FormData
): Promise<CreateRescueResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in to file a report.' };
  }

  const animalType = (formData.get('animalType') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const imageUrl = (formData.get('imageUrl') as string)?.trim();

  if (!animalType || !description || !location) {
    return {
      success: false,
      error: 'Animal type, description, and location are required.',
    };
  }

  if (!imageUrl) {
    return {
      success: false,
      error: 'A photo of the animal is required.',
    };
  }

  if (!/^(https?:\/\/|data:image\/).+/i.test(imageUrl)) {
    return {
      success: false,
      error:
        'Invalid image URL. Please upload a photo through the form.',
    };
  }

  const latRaw = formData.get('latitude');
  const lngRaw = formData.get('longitude');

  let latitude: number | null = null;
  let longitude: number | null = null;

  if (typeof latRaw === 'string' && latRaw.trim().length > 0) {
    const parsed = Number(latRaw);
    if (Number.isFinite(parsed) && parsed >= -90 && parsed <= 90) {
      latitude = parsed;
    }
  }
  if (typeof lngRaw === 'string' && lngRaw.trim().length > 0) {
    const parsed = Number(lngRaw);
    if (Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
      longitude = parsed;
    }
  }

  try {
    const rescue = await prisma.rescueReport.create({
      data: {
        userId: dbUser.id,
        animalType,
        description,
        location,
        latitude,
        longitude,
        imageUrl,
      },
    });

    revalidatePath('/rescues');
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true, rescueId: rescue.id };
  } catch (err) {
    console.error('[createRescueReport]', err);
    return {
      success: false,
      error: 'Failed to submit report. Please try again.',
    };
  }
}

export async function updateRescueStatus(
  rescueId: string,
  status: RescueStatus
) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };
  if (dbUser.role !== 'ADMIN' && dbUser.role !== 'VERIFIER') {
    return { success: false, error: 'Only admins or verifiers can update rescue status.' };
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: { status },
    });

    revalidatePath('/rescues');
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('[updateRescueStatus]', err);
    return { success: false, error: 'Failed to update rescue status.' };
  }
}

export async function deleteRescueReport(rescueId: string) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };
  if (dbUser.role !== 'ADMIN') {
    return { success: false, error: 'Only admins can delete rescue reports.' };
  }

  try {
    await prisma.rescueReport.delete({
      where: { id: rescueId },
    });

    revalidatePath('/rescues');
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('[deleteRescueReport]', err);
    return { success: false, error: 'Failed to delete rescue report.' };
  }
}
