'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

// Create a new pet listing (Admin or Rescuer or Community Member)
export async function createPetListing(formData: FormData) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const species = formData.get('species') as string;
  const breed = (formData.get('breed') as string) || null;
  const age = formData.get('age') as string;
  const gender = formData.get('gender') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;

  // Guardian contact info
  const ownerName = (formData.get('ownerName') as string) || dbUser.name || 'Belagavi Sanctuary Station';
  const contactPhone = (formData.get('contactPhone') as string) || '+91 94812 00000';
  const contactEmail = (formData.get('contactEmail') as string) || dbUser.email || 'adoptions@furlink.org';
  const location = (formData.get('location') as string) || 'Tilakwadi, Belagavi';
  const visitingHours = (formData.get('visitingHours') as string) || '10:00 AM - 6:00 PM Daily';

  if (!name || !species || !age || !gender || !description) {
    throw new Error('Please fill in all required fields.');
  }

  const pet = await prisma.pet.create({
    data: {
      name,
      species,
      breed,
      age,
      gender,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      ownerName,
      contactPhone,
      contactEmail,
      location,
      visitingHours,
    },
  });

  revalidatePath('/adoptions');
  return { success: true, petId: pet.id };
}

// Submit an adoption application
export async function submitAdoptionApplication(formData: FormData) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) throw new Error('Please sign in to apply for adoption.');

  const petId = formData.get('petId') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const reason = formData.get('reason') as string;
  const preferredCallTime = (formData.get('preferredCallTime') as string) || 'Anytime (10 AM - 7 PM)';
  const housingType = (formData.get('housingType') as string) || 'Apartment or Independent Flat';
  const priorExperience = (formData.get('priorExperience') as string) || 'Yes, experienced pet parent';

  if (!petId || !fullName || !phone || !address || !reason) {
    throw new Error('All fields are required.');
  }

  // Check if user already applied for this pet
  const existingApp = await prisma.adoptionApplication.findFirst({
    where: { petId, userId: dbUser.id },
  });

  if (existingApp) {
    throw new Error('You have already submitted an active application for this pet.');
  }

  const app = await prisma.adoptionApplication.create({
    data: {
      petId,
      userId: dbUser.id,
      fullName,
      phone,
      address,
      reason,
      preferredCallTime,
      housingType,
      priorExperience,
      status: 'PENDING',
    },
  });

  revalidatePath(`/adoptions/${petId}`);
  revalidatePath('/adoptions');
  revalidatePath('/profile');

  return {
    success: true,
    applicationId: app.id,
    preferredCallTime: app.preferredCallTime,
  };
}
