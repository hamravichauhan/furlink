import React from "react";
import ShelterHero from "@/components/pet-shelter/shelter-hero";
import WaitingBoard from "@/components/pet-shelter/waiting-board";
import AdoptionLegend from "@/components/pet-shelter/adoption-legend";
import ConversationalMatcher from "@/components/pet-shelter/conversational-matcher";
import TransformationReveal from "@/components/pet-shelter/transformation-reveal";
import DonationImpactEngine from "@/components/pet-shelter/donation-impact-engine";
import SanctuarySeal from "@/components/pet-shelter/sanctuary-seal";
import FinalCallBand from "@/components/pet-shelter/final-call-band";
import ShelterStickyBar from "@/components/pet-shelter/shelter-sticky-bar";

export const dynamic = "force-static";

export default function PetAdoptionHomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero: Urgent Waiting Animal + Wall of Happy Homes Proof Exhibit */}
      <ShelterHero />

      {/* 2. The Waiting Board: 8 Animal Badges in Checkerboard with Lifted Corner */}
      <WaitingBoard />

      {/* 3. Three-State Material Legend for Animal Cases */}
      <AdoptionLegend />

      {/* 4. Find Your Match: Conversational Interactive Matcher */}
      <ConversationalMatcher />

      {/* 5. Stories That Ended Well: Draggable Before/After Transformation Reveal */}
      <TransformationReveal />

      {/* 6. Where Your Money Goes: Direct Medical Care Allocation Engine */}
      <DonationImpactEngine />

      {/* 7. Ethical Operating Charter: Arced-Text SVG Roundel Seal & Staff Team */}
      <SanctuarySeal />

      {/* 8. Final Call: Full-Width Navy Band with Crimson Top Border & Dual Actions */}
      <FinalCallBand />

      {/* 9. Floating Sticky Action Bar on Scroll */}
      <ShelterStickyBar />
    </div>
  );
}
