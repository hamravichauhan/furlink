import { prisma } from "@/lib/prisma";
import ScrollChoreographer from "@/components/landing/scroll-choreographer";

export const dynamic = "force-dynamic";

interface WaitingAnimal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  daysWaiting: number;
  oneLiner: string;
  imageUrl: string;
  caseNumber: string;
}

const FALLBACK_ANIMALS: WaitingAnimal[] = [
  {
    id: "pet-rani",
    name: "Rani",
    species: "Dog",
    breed: "Indie Pariah",
    age: "3 years",
    gender: "Female",
    daysWaiting: 312,
    oneLiner: "Gentle shadow who walks with an old healed limp and loves quiet morning tea.",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0118",
  },
  {
    id: "pet-chotu",
    name: "Chotu",
    species: "Dog",
    breed: "Terrier Indie Mix",
    age: "2 years",
    gender: "Male",
    daysWaiting: 246,
    oneLiner: "Rescued from a storm drain at 4 weeks. Now an observant, house-broken listener.",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0142",
  },
  {
    id: "pet-rocky",
    name: "Rocky",
    species: "Dog",
    breed: "Senior Pariah",
    age: "4 years",
    gender: "Male",
    daysWaiting: 218,
    oneLiner: "Guards quiet corners, never barks indoors, sleeps with paws tightly tucked.",
    imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0179",
  },
  {
    id: "pet-misty",
    name: "Misty",
    species: "Cat",
    breed: "Domestic Longhair Mix",
    age: "1 year",
    gender: "Female",
    daysWaiting: 164,
    oneLiner: "Calm observer who sits on windowsills and watches the monsoon rains without a sound.",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0211",
  },
  {
    id: "pet-bruno",
    name: "Bruno",
    species: "Dog",
    breed: "Desi Indie Hound",
    age: "5 months",
    gender: "Male",
    daysWaiting: 98,
    oneLiner: "Full of curious bounce, fully vaccinated, and desperate for a human of his own.",
    imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0244",
  },
  {
    id: "pet-leo",
    name: "Leo",
    species: "Dog",
    breed: "Golden Indie Mix",
    age: "2 years",
    gender: "Male",
    daysWaiting: 82,
    oneLiner: "Rescued from road traffic. Energetic, affectionate, and walks perfectly on leash.",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
    caseNumber: "CASE 0268",
  },
];

export default async function HomePage() {
  const dbPets = await prisma.pet.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "asc" },
  });

  const animals: WaitingAnimal[] =
    dbPets.length > 0
      ? dbPets.map((p, idx) => ({
          id: p.id,
          name: p.name,
          species: p.species,
          breed: p.breed || "Indie Breed",
          age: p.age,
          gender: p.gender,
          daysWaiting: Math.max(
            45,
            Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + idx * 35
          ),
          oneLiner: p.description.slice(0, 95) + "...",
          imageUrl: p.imageUrl,
          caseNumber: `CASE ${String(idx + 101).padStart(4, "0")}`,
        }))
      : FALLBACK_ANIMALS;

  return <ScrollChoreographer animals={animals} />;
}
