import React from "react";
import StickerNavbar from "@/components/sticker-course/navbar";
import HeroSection from "@/components/sticker-course/hero-section";
import CurriculumSheet from "@/components/sticker-course/curriculum-sheet";
import MaterialLegend from "@/components/sticker-course/material-legend";
import InstructorSection from "@/components/sticker-course/instructor-section";
import FaqSection from "@/components/sticker-course/faq-section";
import EnrollBand from "@/components/sticker-course/enroll-band";
import StickerFooter from "@/components/sticker-course/footer";

export const dynamic = "force-static";

export default function StickerLandingPage() {
  return (
    <div className="min-h-screen bg-[#f3c9d5] text-[#1A2540] flex flex-col">
      {/* Slim Nav */}
      <StickerNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero with Proof Exhibit */}
        <HeroSection />

        {/* The Curriculum as a Fresh Kiss-Cut Sheet */}
        <CurriculumSheet />

        {/* Three-State Material Legend */}
        <MaterialLegend />

        {/* Arced-Text Instructor Seal & Bio */}
        <InstructorSection />

        {/* Course Material FAQs */}
        <FaqSection />

        {/* Full-Width Navy Enroll Band with Crimson Top Border */}
        <EnrollBand />
      </main>

      {/* Cream Backing Paper Footer */}
      <StickerFooter />
    </div>
  );
}
