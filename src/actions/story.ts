'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

export type CreateStoryResult =
  | { success: true; storyId: string }
  | { success: false; error: string };

export type UpdateStoryResult =
  | { success: true }
  | { success: false; error: string };

export type DeleteStoryResult =
  | { success: true }
  | { success: false; error: string };

function parseImageUrls(formData: FormData): string[] {
  const raw = formData.get('imageUrls');
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === 'string' && u.length > 0);
  } catch {
    return [];
  }
}

export async function createStory(
  formData: FormData
): Promise<CreateStoryResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in to share your story.' };
  }

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const imageUrls = parseImageUrls(formData);

  if (!title || !content) {
    return { success: false, error: 'Title and story content are required.' };
  }

  const coverImage = imageUrls[0] ?? null;

  try {
    const story = await prisma.furStory.create({
      data: {
        userId: dbUser.id,
        title,
        content,
        imageUrl: coverImage,
        images: {
          create: imageUrls.map((url, i) => ({ url, order: i })),
        },
      },
    });

    revalidatePath('/stories');
    return { success: true, storyId: story.id };
  } catch (err) {
    console.error('[createStory]', err);
    return { success: false, error: 'Failed to publish story.' };
  }
}

export async function updateStory(
  storyId: string,
  formData: FormData
): Promise<UpdateStoryResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in.' };
  }

  const story = await prisma.furStory.findUnique({ where: { id: storyId } });
  if (!story) {
    return { success: false, error: 'Story not found.' };
  }

  if (story.userId !== dbUser.id && dbUser.role !== 'ADMIN') {
    return { success: false, error: 'You can only edit your own stories.' };
  }

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const imageUrls = parseImageUrls(formData);

  if (!title || !content) {
    return { success: false, error: 'Title and story content are required.' };
  }

  const coverImage = imageUrls[0] ?? null;

  try {
    await prisma.$transaction([
      prisma.furStoryImage.deleteMany({ where: { storyId } }),
      prisma.furStory.update({
        where: { id: storyId },
        data: {
          title,
          content,
          imageUrl: coverImage,
          images: {
            create: imageUrls.map((url, i) => ({ url, order: i })),
          },
        },
      }),
    ]);

    revalidatePath('/stories');
    revalidatePath(`/stories/${storyId}`);
    return { success: true };
  } catch (err) {
    console.error('[updateStory]', err);
    return { success: false, error: 'Failed to update story.' };
  }
}

export async function deleteStory(storyId: string): Promise<DeleteStoryResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in.' };
  }

  const story = await prisma.furStory.findUnique({ where: { id: storyId } });
  if (!story) {
    return { success: false, error: 'Story not found.' };
  }

  if (story.userId !== dbUser.id && dbUser.role !== 'ADMIN') {
    return { success: false, error: 'You can only delete your own stories.' };
  }

  try {
    await prisma.furStory.delete({ where: { id: storyId } });
    revalidatePath('/stories');
    return { success: true };
  } catch (err) {
    console.error('[deleteStory]', err);
    return { success: false, error: 'Failed to delete story.' };
  }
}