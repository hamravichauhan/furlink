"use client";

import React from "react";
import Link from "next/link";

export default function ShelterHero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & CTA Buttons */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#163829] tracking-tight leading-[1.08] font-black">
              Find Your Pawfect Companion Today!
            </h1>

            <p className="font-body text-base sm:text-lg text-[#163829]/75 leading-relaxed max-w-xl">
              Browse through our adoptable friends from local shelters around you.
              Every animal is verified, vaccinated, sterilized, and waiting for a loving home.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="#adoptable-pets"
                className="btn-paw-primary px-8 py-3.5 text-sm sm:text-base font-semibold shadow-md inline-flex items-center justify-center text-center"
              >
                Browse Pets
              </Link>
              <Link
                href="#care-guides"
                className="btn-paw-secondary px-8 py-3.5 text-sm sm:text-base font-semibold inline-flex items-center justify-center text-center"
              >
                Learn More About Pet Care
              </Link>
            </div>

            {/* Trust Footnote */}
            <div className="pt-2 flex items-center gap-6 text-xs text-[#163829]/60 font-body">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>100% No-Kill Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>Medically Checked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>Transparent Adoption</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Organic Mint Shape and 3 Floating Pet Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
            {/* Organic Soft Mint Curved Backdrop */}
            <div
              className="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] bg-[#D8F3DC] opacity-90 rounded-[48%_52%_58%_42%/42%_58%_42%_58%] transition-transform duration-700 hover:scale-105"
              style={{
                filter: "blur(0.5px)",
              }}
            />

            {/* Central Hero Dog: Real smiling puppy with green bandana */}
            <div className="relative z-10 w-[260px] sm:w-[340px] aspect-[4/5] rounded-[36px] overflow-hidden shadow-xl border-4 border-white/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pets/hero-dog.jpg"
                alt="Pawfect companion dog with bandana"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Badge 1: Yellow circle with curious dog (Top-Left) */}
            <div className="absolute z-20 top-2 sm:top-6 left-2 sm:left-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F9C74F] p-1.5 shadow-lg border-2 border-white transition-transform duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pets/badge-pug.jpg"
                  alt="Curious puppy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge 2: Sky Blue circle with playful kitten looking up (Bottom-Left) */}
            <div className="absolute z-20 bottom-4 sm:bottom-6 left-6 sm:left-16 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#70B8F5] p-1.5 shadow-lg border-2 border-white transition-transform duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pets/badge-cat.jpg"
                  alt="Playful kitten"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge 3: Coral Orange circle with fluffy puppy (Right-Center) */}
            <div className="absolute z-20 top-1/2 -translate-y-1/2 right-0 sm:right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4A261] p-1.5 shadow-lg border-2 border-white transition-transform duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pets/badge-pup.jpg"
                  alt="Fluffy puppy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
