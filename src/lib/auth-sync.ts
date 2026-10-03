import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getOrCreateCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

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