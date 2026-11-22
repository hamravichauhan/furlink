import React from "react";
import { prisma } from "@/lib/prisma";
import ShelterHero from "@/components/pet-shelter/shelter-hero";
import WaitingBoard from "@/components/pet-shelter/waiting-board";
import CareGuides from "@/components/pet-shelter/care-guides";
import ConversationalMatcher from "@/components/pet-shelter/conversational-matcher";
import TransformationReveal from "@/components/pet-shelter/transformation-reveal";
import DonationImpactEngine from "@/components/pet-shelter/donation-impact-engine";
import SanctuarySeal from "@/components/pet-shelter/sanctuary-seal";
import FinalCallBand from "@/components/pet-shelter/final-call-band";
import ShelterStickyBar from "@/components/pet-shelter/shelter-sticky-bar";
import { ShelterAnimal } from "@/components/pet-shelter/animals-data";

export const dynamic = "force-dynamic";

export default async function PetAdoptionHomePage() {
  const dbPets = await prisma.pet.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const cardBgs = ["#5B9BD5", "#F9C74F", "#74C69D", "#2A9D8F", "#95D5B2", "#E76F51", "#A8DADC", "#F4A261"];

  const initialAnimals: ShelterAnimal[] = dbPets.map((p, idx) => ({
    id: p.id,
    number: String(idx + 1).padStart(2, "0"),
    name: p.name,
    species: (p.species === "Cat" ? "Cat" : "Dog") as "Dog" | "Cat",
    breed: p.breed || "Indie Mix",
    age: p.age,
    gender: (p.gender === "Female" ? "Female" : "Male") as "Male" | "Female",
    daysWaiting: Math.max(12, 160 - idx * 14),
    oneLiner: p.description.slice(0, 85) + "...",
    colorway: (idx % 2 === 0 ? "crimson" : "cream") as "crimson" | "cream",
    cardBg: cardBgs[idx % cardBgs.length],
    badgeColor: "#FBBF24",
    imageUrl: p.imageUrl,
    caseRef: `CASE #${p.id.slice(-6).toUpperCase()}`,
    isUrgent: idx === 0,
    medicalStatus: p.description,
    personality: ["Gentle companion", "Rescued & thriving", "Vaccinated"],
    goodWith: ["Loving homes", "Apartment or yard", "Gentle families"],
  }));

  return (
    <div className="w-full bg-[#F8FAF8]">
      {/* 1. Hero: FurLink Organic Mint Hero + 3 Floating Pet Badges */}
      <ShelterHero />

      {/* 2. Adoptable Pets: 4-Column Vibrant Grid + Search & Filter Pills */}
      <WaitingBoard initialAnimals={initialAnimals} />

      {/* 3. Caring for Your New Best Friend: Pastel Resource Guide Cards */}
      <CareGuides />

      {/* 4. Find Your Purrrfect Match: Conversational Interactive Matcher */}
      <ConversationalMatcher />

      {/* 5. Stories That Ended Well: Draggable Before/After Transformation Reveal */}
      <TransformationReveal />

      {/* 6. Where Your Money Goes: Direct Medical Care Allocation Engine */}
      <DonationImpactEngine />

      {/* 7. Ethical Operating Charter: Arced-Text SVG Roundel Seal & Staff Team */}
      <SanctuarySeal />

      {/* 8. Final Call: Action Band */}
      <FinalCallBand />

      {/* 9. Floating Sticky Action Bar on Scroll */}
      <ShelterStickyBar />
    </div>
  );
}
