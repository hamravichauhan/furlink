import React from "react";
import ShelterHero from "@/components/pet-shelter/shelter-hero";
import WaitingBoard from "@/components/pet-shelter/waiting-board";
import CareGuides from "@/components/pet-shelter/care-guides";
import ConversationalMatcher from "@/components/pet-shelter/conversational-matcher";
import TransformationReveal from "@/components/pet-shelter/transformation-reveal";
import DonationImpactEngine from "@/components/pet-shelter/donation-impact-engine";
import SanctuarySeal from "@/components/pet-shelter/sanctuary-seal";
import FinalCallBand from "@/components/pet-shelter/final-call-band";
import ShelterStickyBar from "@/components/pet-shelter/shelter-sticky-bar";

export const dynamic = "force-static";

export default function PetAdoptionHomePage() {
  return (
    <div className="w-full bg-[#F8FAF8]">
      {/* 1. Hero: Pawpals Organic Mint Hero + 3 Floating Pet Badges */}
      <ShelterHero />

      {/* 2. Adoptable Pets: 4-Column Vibrant Grid + Search & Filter Pills */}
      <WaitingBoard />

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
