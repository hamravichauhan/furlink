const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting FurLink database seed...');

  // 1. Clean existing records (optional cascade)
  await prisma.furStoryImage.deleteMany();
  await prisma.furStory.deleteMany();
  await prisma.adoptionApplication.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.rescueReport.deleteMany();
  await prisma.sterilizationRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();

  console.log('[SEED] Cleaned existing database tables.');

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      id: 'demo-admin-id',
      email: 'admin@furlink.org',
      name: 'Neha Narvekar (Admin)',
      role: 'ADMIN',
    },
  });

  const verifier = await prisma.user.create({
    data: {
      id: 'demo-verifier-id',
      email: 'verifier@furlink.org',
      name: 'Dr. Ramesh Sharma (Verifier)',
      role: 'VERIFIER',
      promotedById: admin.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      id: 'demo-user-id',
      email: 'user@furlink.org',
      name: 'Rahul Patil (Member)',
      role: 'USER',
    },
  });

  const anita = await prisma.user.create({
    data: {
      id: 'user-anita-id',
      email: 'anita.kamat@gmail.com',
      name: 'Anita Kamat',
      role: 'USER',
    },
  });

  console.log('[OK] Created users: Admin, Verifier, Regular Users');

  // 3. Create Pets
  const petBruno = await prisma.pet.create({
    data: {
      name: 'Bruno',
      species: 'Dog',
      breed: 'Desi Indie Pup',
      age: '4 months',
      gender: 'Male',
      description: 'Bruno was rescued near Belagavi railway station. He is full of energy, loves cuddles, vaccinated, and gets along well with other pets.',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
    },
  });

  const petMisty = await prisma.pet.create({
    data: {
      name: 'Misty',
      species: 'Cat',
      breed: 'Domestic Longhair Mix',
      age: '1 year',
      gender: 'Female',
      description: 'Misty is a gentle, sweet cat who loves napping in sunbeams. Spayed, dewormed, and litter-box trained.',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
    },
  });

  const petLeo = await prisma.pet.create({
    data: {
      name: 'Leo',
      species: 'Dog',
      breed: 'Golden Retriever Indie Mix',
      age: '2 years',
      gender: 'Male',
      description: 'Leo is an obedient, friendly boy rescued from neglect. He loves brisk walks, ball games, and is great with children.',
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
    },
  });

  const petBella = await prisma.pet.create({
    data: {
      name: 'Bella',
      species: 'Cat',
      breed: 'Calico',
      age: '3 months',
      gender: 'Female',
      description: 'Rescued from a vegetable market stall. Tiny, curious, and loves climbing onto laps for belly rubs.',
      imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
      status: 'PENDING',
    },
  });

  const petRocky = await prisma.pet.create({
    data: {
      name: 'Rocky',
      species: 'Dog',
      breed: 'Indie Pariah',
      age: '3 years',
      gender: 'Male',
      description: 'Loyal guard dog and loving companion. Fully vaccinated, neutered, and looking for a farmhouse or loving home.',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      status: 'ADOPTED',
    },
  });

  console.log('[OK] Created 5 pets in adoption catalog');

  // 4. Adoption Applications
  await prisma.adoptionApplication.create({
    data: {
      petId: petBella.id,
      userId: anita.id,
      fullName: 'Anita Kamat',
      phone: '+91 98451 22334',
      address: 'Plot 45, Tilakwadi 2nd Gate, Belagavi, Karnataka',
      reason: 'We are a pet-loving family of three with a secure apartment. We had a cat for 12 years and would love to give Bella a loving home.',
      status: 'PENDING',
    },
  });

  await prisma.adoptionApplication.create({
    data: {
      petId: petBruno.id,
      userId: user.id,
      fullName: 'Rahul Patil',
      phone: '+91 99887 66554',
      address: 'House #12, RPD College Road, Belagavi',
      reason: 'Looking for a playful companion for my retired parents. Large fenced yard with someone home 24/7.',
      status: 'PENDING',
    },
  });

  await prisma.adoptionApplication.create({
    data: {
      petId: petRocky.id,
      userId: anita.id,
      fullName: 'Anita Kamat',
      phone: '+91 98451 22334',
      address: 'Plot 45, Tilakwadi 2nd Gate, Belagavi',
      reason: 'Adopted Rocky successfully last month!',
      status: 'APPROVED',
    },
  });

  console.log('[OK] Created 3 adoption applications');

  // 5. Rescue Reports
  await prisma.rescueReport.create({
    data: {
      userId: user.id,
      animalType: 'Dog',
      description: 'Stray puppy with an injured left front paw, limping heavily and hiding behind the tea stall.',
      location: 'Near Tilakwadi 3rd Railway Gate, Belagavi',
      latitude: 15.8497,
      longitude: 74.5089,
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      status: 'REPORTED',
    },
  });

  await prisma.rescueReport.create({
    data: {
      userId: anita.id,
      animalType: 'Cat',
      description: 'Litter of 4 newborn kittens found inside a cardboard box near the market entrance. Mother not seen.',
      location: 'CBT Central Bus Terminal, Belagavi',
      latitude: 15.8612,
      longitude: 74.5165,
      imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.rescueReport.create({
    data: {
      userId: admin.id,
      animalType: 'Cattle',
      description: 'Injured calf with deep cut on leg from loose wire. Administered antiseptic dressing and placed in shelter.',
      location: 'Khanapur Road, Camp area, Belagavi',
      latitude: 15.8560,
      longitude: 74.5020,
      imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      status: 'RESCUED',
    },
  });

  await prisma.rescueReport.create({
    data: {
      userId: verifier.id,
      animalType: 'Dog',
      description: 'Dehydrated dog rescued from open storm drain during hot afternoon. Given saline and rehydration fluids. Fully recovered.',
      location: 'Club Road near Golf Ground, Belagavi',
      latitude: 15.8710,
      longitude: 74.5120,
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      status: 'CLOSED',
    },
  });

  console.log('[OK] Created 4 rescue cases');

  // 6. Sterilization Requests (TNVR)
  // Request 1: Verified
  await prisma.sterilizationRequest.create({
    data: {
      userId: user.id,
      animalType: 'Street Dog',
      count: 3,
      location: 'Camp Area, near Army School, Belagavi',
      latitude: 15.8550,
      longitude: 74.5015,
      notes: 'Group of 3 friendly community dogs that need neutering and anti-rabies vaccination.',
      status: 'VERIFIED',
      rescuerId: verifier.id,
      scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      scheduledNotes: 'Collected in morning vehicle for clinic surgery.',
      clinicName: 'Belagavi Government Veterinary Hospital',
      veterinarianName: 'Dr. Suresh Kulkarni',
      completionCertificateUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      completionNotes: 'All 3 dogs neutered successfully with ear-notching and ARV given. Released back at pickup spot.',
      completionLatitude: 15.8550,
      completionLongitude: 74.5015,
      proofSubmittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      verifiedById: admin.id,
      verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      verificationNote: 'Surgery certificates, clinic stamp, and ear-tip photos verified. Approved.',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Request 2: Proof submitted awaiting review
  await prisma.sterilizationRequest.create({
    data: {
      userId: anita.id,
      animalType: 'Feral Cat',
      count: 2,
      location: 'Subhash Nagar 4th Cross, Belagavi',
      latitude: 15.8640,
      longitude: 74.5210,
      notes: 'Two community cats in the residential lane.',
      status: 'PROOF_SUBMITTED',
      rescuerId: verifier.id,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      clinicName: 'Paws & Claws Pet Care Center',
      veterinarianName: 'Dr. Ramesh Sharma',
      completionCertificateUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      completionNotes: 'Both female cats spayed, vaccinated against rabies and feline viral rhinotracheitis. Post-op recovery completed.',
      completionLatitude: 15.8640,
      completionLongitude: 74.5210,
      proofSubmittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });

  // Request 3: Scheduled
  await prisma.sterilizationRequest.create({
    data: {
      userId: user.id,
      animalType: 'Street Dog',
      count: 2,
      location: 'Hindwadi near Ganpati Temple, Belagavi',
      latitude: 15.8420,
      longitude: 74.5110,
      notes: 'Pack of 2 unsterilized stray dogs near the temple entrance.',
      status: 'SCHEDULED',
      rescuerId: verifier.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      scheduledNotes: 'Coordinating with local feeder for pickup on Wednesday morning.',
    },
  });

  // Request 4: Pending
  await prisma.sterilizationRequest.create({
    data: {
      userId: anita.id,
      animalType: 'Street Dog',
      count: 1,
      location: 'Bogarves Circle, Belagavi',
      latitude: 15.8680,
      longitude: 74.5090,
      notes: 'One female stray dog frequently seen near bakery shop. Needs sterilization.',
      status: 'PENDING',
    },
  });

  console.log('[OK] Created 4 sterilization requests across lifecycle');

  // 7. FurStories
  const story1 = await prisma.furStory.create({
    data: {
      userId: user.id,
      title: 'From Near-Death in a Drain to King of the Living Room: Bruno’s Story',
      content: `Three months ago, we found Bruno shivering in a rainwater drain after a massive downpour in Belagavi. He had a fractured paw, severe mange, and was terrified of human touch.

Thanks to the emergency rescue team on FurLink, Dr. Sharma arrived within 45 minutes. After six weeks of medicated baths, orthopedic care, and countless boiled eggs, Bruno transformed into the happiest, most loving dog you could ever imagine.

Today, he sleeps on our sofa, greets every visitor with wagging tail, and reminds us why community animal care matters so much. Please consider adopting an indie pup — they have hearts of pure gold!`,
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', order: 0 },
          { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', order: 1 },
        ],
      },
    },
  });

  const story2 = await prisma.furStory.create({
    data: {
      userId: anita.id,
      title: 'Our Neighborhood TNVR Success: 18 Dogs Neutered & Healthy',
      content: `A year ago, our street in Tilakwadi had over 20 stray puppies born in a single winter, most of whom suffered from disease and traffic accidents. 

Working together through FurLink’s Sterilization portal, our resident association pooled resources and reported each dog. Rescuers coordinated with the veterinary clinic, and every dog was vaccinated, neutered, and returned safely.

Today, dog fights have stopped completely, the pack is calm and beloved by everyone on the lane, and we haven’t had a single rabies scare. Humane TNVR works!`,
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80', order: 0 },
        ],
      },
    },
  });

  console.log('[OK] Created 2 FurStories');

  // 8. Donations (realistic time series for analytics)
  const donationAmounts = [
    { amount: 1000, daysAgo: 1, user: user.id },
    { amount: 2500, daysAgo: 5, user: anita.id },
    { amount: 500, daysAgo: 12, user: null },
    { amount: 5000, daysAgo: 22, user: user.id },
    { amount: 1500, daysAgo: 35, user: anita.id },
    { amount: 2000, daysAgo: 50, user: null },
    { amount: 3500, daysAgo: 65, user: user.id },
    { amount: 1000, daysAgo: 80, user: null },
    { amount: 4000, daysAgo: 95, user: anita.id },
  ];

  for (let i = 0; i < donationAmounts.length; i++) {
    const item = donationAmounts[i];
    const date = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.donation.create({
      data: {
        userId: item.user,
        amount: item.amount,
        currency: 'INR',
        paymentId: `pay_demo_${100000 + i}`,
        orderId: `order_demo_${100000 + i}`,
        status: 'SUCCESS',
        createdAt: date,
      },
    });
  }

  console.log(`[OK] Created ${donationAmounts.length} donation records with historical dates for charts`);

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
