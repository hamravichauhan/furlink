const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') return '';
  const trimmed = plaintext.trim();
  if (trimmed.length === 0) return '';
  const secret =
    process.env.DATA_ENCRYPTION_KEY ||
    process.env.CLERK_SECRET_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    'furlink-core-sanctuary-production-key-2026';
  const masterKey = crypto.createHash('sha256').update(secret, 'utf8').digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
  let ciphertext = cipher.update(trimmed, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `enc:v1:${iv.toString('hex')}:${authTag}:${ciphertext}`;
}

async function main() {
  console.log('Starting FurLink database seed with 100% real animal data...');

  // 1. Clean existing records
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

  // Ravi Chauhan Administrator Accounts
  await prisma.user.create({
    data: {
      id: 'user_3JUMHv2imlH1ITHUWcW2aUQFEUS',
      email: 'ravi486chauhan@gmail.com',
      name: 'Ravi Chauhan (Admin)',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      id: 'user_3KBossT56k3DezRg8POSDWROSd2',
      email: 'ravichauhanbhai26@gmail.com',
      name: 'RAVI CHAUHAN (Admin)',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      id: 'user_3KBrzKyVHDPAPwE3bj6VBElQX8b',
      email: '2305040.stu@dmscollege.ac.in',
      name: 'RAVI CHAUHAN (Admin)',
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

  const jayesh = await prisma.user.create({
    data: {
      id: 'user-jayesh-id',
      email: 'jayesh@test.com',
      name: 'Jayesh Patel (Guardian)',
      role: 'USER',
    },
  });

  const rina = await prisma.user.create({
    data: {
      id: 'user-rina-id',
      email: 'rina@test.com',
      name: 'Rina Sharma (Volunteer)',
      role: 'USER',
    },
  });

  console.log('[OK] Created users: Admins, Verifier, Rescuers, and Pet Guardians');

  // 3. Create Real Pets for Adoption (12 distinct animals with high-res real photography)
  const petRani = await prisma.pet.create({
    data: {
      name: 'Rani',
      species: 'Dog',
      breed: 'Indie Pariah',
      age: '3 years',
      gender: 'Female',
      description: 'Gentle shadow who walks with a healed paw and loves quiet morning tea. Sterilized (TNVR), fully vaccinated (7-in-1), right hind paw healed after splint.',
      imageUrl: '/pets/rani.jpg',
      status: 'AVAILABLE',
      userId: verifier.id,
      ownerName: 'Belagavi Sanctuary Station (Dr. Ramesh Sharma)',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Tilakwadi Sanctuary Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petKaju = await prisma.pet.create({
    data: {
      name: 'Kaju',
      species: 'Dog',
      breed: 'Terrier Indie Mix',
      age: '2 years',
      gender: 'Male',
      description: 'Rescued from a storm drain at 4 weeks. An observant, attentive listener who loves gentle head pats. Sterilized, dewormed, anti-rabies certified, zero chronic conditions.',
      imageUrl: '/pets/recovery-after.jpg',
      status: 'AVAILABLE',
      userId: user.id,
      ownerName: 'Rahul Patil (Foster Volunteer)',
      contactPhone: '+91 99887 66554',
      contactEmail: 'foster.kaju@furlink.org',
      location: 'RPD College Road, Belagavi',
      visitingHours: '11:00 AM - 5:00 PM Weekends',
    },
  });

  const petTara = await prisma.pet.create({
    data: {
      name: 'Tara',
      species: 'Dog',
      breed: 'Indie Pup',
      age: '1 year',
      gender: 'Female',
      description: 'Warm-hearted pup who greets every volunteer by resting her chin on your shoes. Sterilization scheduled this week, core puppy booster shots completed.',
      imageUrl: '/pets/tara.jpg',
      status: 'AVAILABLE',
      userId: anita.id,
      ownerName: 'Anita Kamat (Community Rescuer)',
      contactPhone: '+91 98451 22334',
      contactEmail: 'anita.kamat@gmail.com',
      location: 'Tilakwadi 2nd Gate, Belagavi',
      visitingHours: '10:00 AM - 7:00 PM Daily',
    },
  });

  const petBruno = await prisma.pet.create({
    data: {
      name: 'Bruno',
      species: 'Dog',
      breed: 'Indie Shepherd Mix',
      age: '2.5 years',
      gender: 'Male',
      description: 'Quiet guardian who sits next to the clinic gate and watches over injured puppies. Complete orthopedic clearance, sterilized, microchipped.',
      imageUrl: '/pets/bruno.jpg',
      status: 'AVAILABLE',
      ownerName: 'Belagavi Sanctuary Station (Dr. Sharma)',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Tilakwadi Sanctuary Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petSheru = await prisma.pet.create({
    data: {
      name: 'Sheru',
      species: 'Dog',
      breed: 'Belagavi Indie',
      age: '3 years',
      gender: 'Male',
      description: 'Hit-and-run survivor who completed orthopedic physiotherapy with triumphant spirits. Hind femur healed, energetic appetite, ready for a loving home.',
      imageUrl: '/pets/sheru.jpg',
      status: 'AVAILABLE',
      ownerName: 'Belagavi Animal Rescue Trust',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Club Road Clinic, Belagavi',
      visitingHours: '2:00 PM - 6:00 PM Daily',
    },
  });

  const petMisty = await prisma.pet.create({
    data: {
      name: 'Misty',
      species: 'Cat',
      breed: 'Domestic Longhair Mix',
      age: '1.5 years',
      gender: 'Female',
      description: 'Calm window-watcher with silk fur who purrs the moment anyone enters the room. Spayed, feline leukemia negative, flea and tick cleared.',
      imageUrl: '/pets/misty.jpg',
      status: 'AVAILABLE',
      ownerName: 'Anita Kamat (Foster Caregiver)',
      contactPhone: '+91 98451 22334',
      contactEmail: 'anita.kamat@gmail.com',
      location: 'Tilakwadi 2nd Gate, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petLeo = await prisma.pet.create({
    data: {
      name: 'Leo',
      species: 'Dog',
      breed: 'Golden Indie Mix',
      age: '2 years',
      gender: 'Male',
      description: 'Joyful sunbeam rescued near Khanapur road. Loves gentle head pats and sunlit lawns. Neutered, vaccinated, full health certificate issued.',
      imageUrl: '/pets/leo.jpg',
      status: 'AVAILABLE',
      ownerName: 'Belagavi Sanctuary Station',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Tilakwadi Sanctuary Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petBella = await prisma.pet.create({
    data: {
      name: 'Bella',
      species: 'Cat',
      breed: 'Ginger Calico Tabby',
      age: '1 year',
      gender: 'Female',
      description: 'Playful acrobat rescued from a spice warehouse. Will investigate every playful feather. Spayed, fully vaccinated, indoor litter box certified.',
      imageUrl: '/pets/bella.jpg',
      status: 'PENDING',
      ownerName: 'Belagavi Sanctuary Station (Dr. Sharma)',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Tilakwadi Sanctuary Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petTommy = await prisma.pet.create({
    data: {
      name: 'Tommy',
      species: 'Dog',
      breed: 'Indie Hound Mix',
      age: '2 years',
      gender: 'Male',
      description: 'Charming companion who loves brisk morning walks and calm sofa snuggles. Sterilized, vaccinated, calm with cats.',
      imageUrl: '/pets/asher.jpg',
      status: 'AVAILABLE',
      userId: jayesh.id,
      ownerName: 'Jayesh Patel (Guardian)',
      contactPhone: '+91 98200 88776',
      contactEmail: 'jayesh@test.com',
      location: 'Camp Area Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petQueenSofia = await prisma.pet.create({
    data: {
      name: 'Queen Sofia',
      species: 'Cat',
      breed: 'Turkish Angora Mix',
      age: '2 years',
      gender: 'Female',
      description: 'Gentle purr machine with silk-white fur and alert green eyes. Independent napper, spayed, feline leukemia negative.',
      imageUrl: '/pets/queen-sofia.jpg',
      status: 'AVAILABLE',
      ownerName: 'Anita Kamat (Foster Caregiver)',
      contactPhone: '+91 98451 22334',
      contactEmail: 'anita.kamat@gmail.com',
      location: 'Tilakwadi Sanctuary Station, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petAxel = await prisma.pet.create({
    data: {
      name: 'Axel',
      species: 'Dog',
      breed: 'Black Lab Indie Mix',
      age: '2 years',
      gender: 'Male',
      description: 'Loyal scout with soulful amber eyes who loves fetch and companionship. Neutered, fully vaccinated, eager learner.',
      imageUrl: '/pets/axel.jpg',
      status: 'AVAILABLE',
      ownerName: 'Rahul Patil (Foster Volunteer)',
      contactPhone: '+91 99887 66554',
      contactEmail: 'adoptions@furlink.org',
      location: 'RPD College Road, Belagavi',
      visitingHours: '10:00 AM - 6:00 PM Daily',
    },
  });

  const petRocky = await prisma.pet.create({
    data: {
      name: 'Rocky',
      species: 'Dog',
      breed: 'Senior Indie Pariah',
      age: '3 years',
      gender: 'Male',
      description: 'Loyal companion who found his permanent family home in Mumbai. Thriving, sleeping at the foot of the bed every night.',
      imageUrl: '/pets/rocky.jpg',
      status: 'ADOPTED',
      ownerName: 'Belagavi Sanctuary Station',
      contactPhone: '+91 94812 00000',
      contactEmail: 'adoptions@furlink.org',
      location: 'Mumbai Placed',
      visitingHours: 'Placed',
    },
  });

  console.log('[OK] Created 12 pets in adoption catalog with 100% real animal photos');

  // 4. Adoption Applications (with AES-256 encrypted contact details)
  await prisma.adoptionApplication.create({
    data: {
      petId: petBella.id,
      userId: anita.id,
      fullName: 'Anita Kamat',
      phone: encrypt('+91 98451 22334'),
      address: encrypt('Plot 45, Tilakwadi 2nd Gate, Belagavi, Karnataka'),
      reason: 'We are a pet-loving family of three with a secure apartment. We had a cat for 12 years and would love to give Bella a loving home.',
      preferredCallTime: 'Afternoon (12 PM - 4 PM)',
      housingType: 'Apartment with secure balcony netting',
      priorExperience: '12 years experienced cat parent',
      status: 'PENDING',
    },
  });

  await prisma.adoptionApplication.create({
    data: {
      petId: petBruno.id,
      userId: user.id,
      fullName: 'Rahul Patil',
      phone: encrypt('+91 99887 66554'),
      address: encrypt('House #12, RPD College Road, Belagavi'),
      reason: 'Looking for a playful companion for my retired parents. Large fenced yard with someone home 24/7.',
      preferredCallTime: 'Evening (4 PM - 7 PM)',
      housingType: 'Independent House with compound',
      priorExperience: 'First-time adopting a rescue dog',
      status: 'PENDING',
    },
  });

  await prisma.adoptionApplication.create({
    data: {
      petId: petTommy.id,
      userId: rina.id,
      fullName: 'Rina Sharma',
      phone: encrypt('+91 98233 44556'),
      address: encrypt('Flat 4B, Silver Heights, Camp, Belagavi'),
      reason: 'I am a veterinary nurse and would love to adopt Tommy as my personal companion.',
      preferredCallTime: 'Morning (10 AM - 1 PM)',
      housingType: 'Apartment',
      priorExperience: 'Veterinary Nurse & Animal Caregiver',
      status: 'PENDING',
    },
  });

  await prisma.adoptionApplication.create({
    data: {
      petId: petRocky.id,
      userId: anita.id,
      fullName: 'Anita Kamat',
      phone: encrypt('+91 98451 22334'),
      address: encrypt('Plot 45, Tilakwadi 2nd Gate, Belagavi'),
      reason: 'Adopted Rocky successfully last month!',
      preferredCallTime: 'Morning (9 AM - 12 PM)',
      housingType: 'Independent House with compound',
      priorExperience: 'Experienced with Indies',
      status: 'APPROVED',
    },
  });

  console.log('[OK] Created 4 adoption applications (AES-256 encrypted at rest)');

  // 5. Real Field Rescue Cases
  // Case 1: Open Report
  await prisma.rescueReport.create({
    data: {
      userId: user.id,
      animalType: 'Dog',
      urgency: 'CRITICAL',
      description: 'Stray puppy with injured left front paw, limping heavily and hiding behind the tea stall near the railway crossing.',
      location: 'Near Tilakwadi 3rd Railway Gate, Belagavi',
      latitude: 15.8497,
      longitude: 74.5089,
      imageUrl: '/pets/rescue-pup.jpg',
      status: 'REPORTED',
    },
  });

  // Case 2: In Progress
  await prisma.rescueReport.create({
    data: {
      userId: anita.id,
      animalType: 'Cat',
      urgency: 'HIGH',
      description: 'Litter of 4 newborn kittens found inside a cardboard box near platform 3. Mother not seen.',
      location: 'CBT Central Bus Terminal, Belagavi',
      latitude: 15.8612,
      longitude: 74.5165,
      imageUrl: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=800&q=80',
      status: 'IN_PROGRESS',
      rescuerId: rina.id,
      claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      rescuerNotes: 'Secured in heated carrier with kitten milk replacer. En route to emergency clinic.',
    },
  });

  // Case 3: Rescued
  await prisma.rescueReport.create({
    data: {
      userId: admin.id,
      animalType: 'Cattle',
      urgency: 'STANDARD',
      description: 'Injured calf with deep cut on leg from loose wire fencing. Antiseptic dressing administered, safe in sanctuary shed.',
      location: 'Khanapur Road, Camp area, Belagavi',
      latitude: 15.8560,
      longitude: 74.5020,
      imageUrl: '/pets/calf.jpg',
      proofImageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
      treatmentBillUrl: '/pets/receipt.jpg',
      clinicName: 'Belagavi Gaushala & Large Animal Clinic',
      veterinarianName: 'Dr. Suresh Kulkarni',
      treatmentCost: 1800,
      status: 'RESCUED',
    },
  });

  // Case 4: Proof Submitted (Awaiting Admin / Verifier Review)
  await prisma.rescueReport.create({
    data: {
      userId: user.id,
      animalType: 'Dog',
      urgency: 'CRITICAL',
      description: 'Roadside trauma with compound hind paw fracture. Transferred to emergency veterinary clinic.',
      location: 'Club Road near Golf Ground, Belagavi',
      latitude: 15.8710,
      longitude: 74.5120,
      imageUrl: '/pets/sheru.jpg',
      proofImageUrl: '/pets/vet-clinic.jpg',
      treatmentBillUrl: '/pets/receipt.jpg',
      clinicName: 'Belagavi Veterinary Emergency Clinic',
      veterinarianName: 'Dr. Ramesh Sharma',
      treatmentCost: 3450,
      completionNotes: 'Hind leg compound fracture stabilized with orthopedic splint. Anti-inflammatory and antibiotic course completed. Animal safe in observation kennel.',
      proofSubmittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'PROOF_SUBMITTED',
      rescuerId: rina.id,
      claimedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
    },
  });

  // Case 5: Disputed / Under Citizen Watchdog Flag
  await prisma.rescueReport.create({
    data: {
      userId: anita.id,
      animalType: 'Dog',
      urgency: 'STANDARD',
      description: 'Brown indie dog reported for severe skin infection and dehydration.',
      location: 'Shahapur Vegetable Market, Belagavi',
      latitude: 15.8340,
      longitude: 74.5180,
      imageUrl: '/pets/asher.jpg',
      status: 'DISPUTED',
      disputedById: user.id,
      disputedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      disputeReason: 'Local shopkeeper stated that animal was never picked up by this reporter and is currently near the south gate.',
    },
  });

  // Case 6: Closed & Rehabilitated
  await prisma.rescueReport.create({
    data: {
      userId: verifier.id,
      animalType: 'Dog',
      urgency: 'STANDARD',
      description: 'Dehydrated dog rescued from open gutter during hot afternoon. Given saline and rehydration fluids. Fully recovered.',
      location: 'Hindwadi Main Road, Belagavi',
      latitude: 15.8420,
      longitude: 74.5110,
      imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
      proofImageUrl: '/pets/leo.jpg',
      treatmentBillUrl: '/pets/receipt.jpg',
      treatmentCost: 950,
      clinicName: 'Tilakwadi Veterinary Clinic',
      veterinarianName: 'Dr. Ramesh Sharma',
      status: 'CLOSED',
      verifiedById: admin.id,
      verifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      verificationNote: 'Treatment proof verified, rehydration completed, animal safe with community feeder.',
      outcome: 'Fully rehabilitated and returned to original street territory under community feeder supervision.',
    },
  });

  console.log('[OK] Created 6 rescue cases across lifecycle with real animal photos and receipts');

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
      completionCertificateUrl: '/pets/vet-clinic.jpg',
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
      completionCertificateUrl: '/pets/receipt.jpg',
      completionNotes: 'Both female cats spayed, vaccinated against rabies and feline viral rhinotracheitis. Post-op recovery completed.',
      completionLatitude: 15.8640,
      completionLongitude: 74.5210,
      proofSubmittedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
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

  // Request 5: Disputed
  await prisma.sterilizationRequest.create({
    data: {
      userId: user.id,
      animalType: 'Street Dog',
      count: 4,
      location: 'Railway Colony Road, Belagavi',
      latitude: 15.8510,
      longitude: 74.5050,
      notes: 'Pack of 4 community dogs.',
      status: 'DISPUTED',
      disputedById: admin.id,
      disputedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      disputeReason: 'Municipal records show 2 of these dogs were already ear-notched and vaccinated in 2025.',
    },
  });

  console.log('[OK] Created 5 sterilization requests across lifecycle');

  // 7. FurStories (with Real Photo Galleries)
  await prisma.furStory.create({
    data: {
      userId: user.id,
      title: 'From Roadside Fracture to Sofa King: Bruno’s Story',
      content: `Three months ago, we found Bruno shivering near a rain drain after a massive downpour in Belagavi. He had a fractured paw, severe mange, and was terrified of human touch.

Thanks to the emergency rescue team on FurLink, Dr. Sharma arrived within 45 minutes. After six weeks of medicated baths, orthopedic care, and countless boiled eggs, Bruno transformed into the happiest, most loving dog you could ever imagine.

Today, he sleeps on our sofa, greets every visitor with wagging tail, and reminds us why community animal care matters so much. Please consider adopting an indie pup — they have hearts of pure gold!`,
      imageUrl: '/pets/bruno.jpg',
      images: {
        create: [
          { url: '/pets/rescue-pup.jpg', order: 0 },
          { url: '/pets/vet-clinic.jpg', order: 1 },
          { url: '/pets/bruno.jpg', order: 2 },
        ],
      },
    },
  });

  await prisma.furStory.create({
    data: {
      userId: anita.id,
      title: 'Our Neighborhood TNVR Success: 18 Dogs Neutered & Healthy',
      content: `A year ago, our street in Tilakwadi had over 20 stray puppies born in a single winter, most of whom suffered from disease and traffic accidents. 

Working together through FurLink’s Sterilization portal, our resident association pooled resources and reported each dog. Rescuers coordinated with the veterinary clinic, and every dog was vaccinated, neutered, and returned safely.

Today, dog fights have stopped completely, the pack is calm and beloved by everyone on the lane, and we haven’t had a single rabies scare. Humane TNVR works!`,
      imageUrl: '/pets/pack-dogs.jpg',
      images: {
        create: [
          { url: '/pets/pack-dogs.jpg', order: 0 },
        ],
      },
    },
  });

  await prisma.furStory.create({
    data: {
      userId: user.id,
      title: 'From Roadside Cast to Pure Joy: Bruno’s 45-Day Recovery',
      content: `Bruno was rescued near the Belagavi bypass after suffering a fractured hind leg in a severe hit-and-run incident.

Following immediate surgical stabilization, orthopedic casting, and 45 days of intensive veterinary foster care, his bones completely fused. Today, he lives with Pooja and Sameer in Tilakwadi, completely healthy, running, and smiling every morning.

Every rescue case is worth the fight. Thank you to everyone who supports FurLink!`,
      imageUrl: '/pets/recovery-after.jpg',
      images: {
        create: [
          { url: '/pets/recovery-before.jpg', order: 0 },
          { url: '/pets/recovery-after.jpg', order: 1 },
        ],
      },
    },
  });

  console.log('[OK] Created 3 FurStories with real photo transformation galleries');

  // 8. Donations (realistic time series for analytics)
  const donationAmounts = [
    { amount: 1000, daysAgo: 1, user: user.id, name: 'Rahul Patil', type: 'Clinical Meal' },
    { amount: 2500, daysAgo: 3, user: anita.id, name: 'Anita Kamat', type: 'Emergency Surgery' },
    { amount: 500, daysAgo: 7, user: null, name: 'Vikram Joshi', type: 'Vaccine Kit' },
    { amount: 5000, daysAgo: 14, user: user.id, name: 'Rahul Patil', type: 'Sanctuary Patron' },
    { amount: 1500, daysAgo: 22, user: anita.id, name: 'Anita Kamat', type: 'TNVR Pack Support' },
    { amount: 2000, daysAgo: 35, user: null, name: 'Pooja Hegde', type: 'Foster Food' },
    { amount: 3500, daysAgo: 48, user: user.id, name: 'Rahul Patil', type: 'Trauma ICU Care' },
    { amount: 1000, daysAgo: 60, user: null, name: 'Kiran Desai', type: 'Clinical Meal' },
    { amount: 4500, daysAgo: 75, user: anita.id, name: 'Anita Kamat', type: 'Orthopedic Recovery' },
    { amount: 3000, daysAgo: 90, user: null, name: 'Siddharth Rao', type: 'Sanctuary Patron' },
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
        donorName: item.name,
        donorEmail: encrypt(`${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com`),
        sponsorshipType: item.type,
        targetName: 'FurLink Lifesaving Sanctuary Care',
        createdAt: date,
      },
    });
  }

  console.log(`[OK] Created ${donationAmounts.length} donation records with historical analytics data`);
  console.log('Seed completed successfully with 100% real animal photography!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
