"use client";

import React from "react";
import Link from "next/link";

export default function ShelterHero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & CTA Buttons */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            {/* SRS Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#163829] px-3.5 py-1.5 rounded-full text-xs font-bold font-body">
              <span className="w-2 h-2 rounded-full bg-[#163829] animate-pulse" />
              <span>FurLink · Rescue, Adopt &amp; Care</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#163829] tracking-tight leading-[1.08] font-black">
              Connecting Animal Rescue, Adoption &amp; Lifesaving Care
            </h1>

            <p className="font-body text-base sm:text-lg text-[#163829]/75 leading-relaxed max-w-xl">
              A unified platform connecting compassionate citizens, rescuers, and veterinarians.
              Report emergency roadside rescues, adopt vaccinated &amp; sterilized companions, sponsor trauma recovery, and celebrate inspiring FurStories.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="#adoptable-pets"
                className="btn-paw-primary px-7 py-3.5 text-sm sm:text-base font-semibold shadow-md inline-flex items-center justify-center text-center"
              >
                Browse Adoptable Pets
              </Link>
              <Link
                href="/rescues/new"
                className="bg-[#cc2b3f] hover:bg-[#b02234] text-white px-6 py-3.5 text-sm sm:text-base font-semibold rounded-full shadow-md inline-flex items-center gap-2 justify-center text-center transition"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Report Emergency Rescue
              </Link>
            </div>

            {/* Trust Footnote */}
            <div className="pt-2 flex items-center gap-6 text-xs text-[#163829]/60 font-body">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>24/7 Roadside Rescue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>Humane TNVR &amp; Vaccines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#163829]" />
                <span>100% Transparent Care</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Organic Mint Shape and 3 Floating Pet Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[520px]">
            {/* Organic Soft Mint Curved Backdrop */}
            <div
              className="absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] bg-[#D8F3DC] opacity-90 rounded-[48%_52%_58%_42%/42%_58%_42%_58%] transition-transform duration-700 hover:scale-105 pointer-events-none"
              style={{
                filter: "blur(0.5px)",
              }}
            />

            {/* Central Hero Dog: Real cutout puppy seamlessly sitting on the organic mint backdrop */}
            <div className="relative z-10 w-[260px] sm:w-[360px] flex items-center justify-center transition-transform duration-500 hover:scale-105 drop-shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pets/hero-dog.png"
                alt="Pawfect companion dog"
                className="w-full h-auto max-h-[440px] object-contain"
              />
            </div>

            {/* Floating Badge 1: Yellow circle with real dog (Top-Left) */}
            <div className="absolute z-20 top-2 sm:top-6 left-2 sm:left-8 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F9C74F] p-1 shadow-xl border-2 border-white transition-transform duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pets/badge-pug.jpg"
                  alt="Curious dog"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge 2: Sky Blue circle with real cat looking up (Bottom-Left) */}
            <div className="absolute z-20 bottom-2 sm:bottom-4 left-4 sm:left-12 w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-[#70B8F5] p-1 shadow-xl border-2 border-white transition-transform duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pets/badge-cat.jpg"
                  alt="Playful cat"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge 3: Coral Orange circle with real puppy (Right-Center) */}
            <div className="absolute z-20 top-1/2 -translate-y-1/2 right-0 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4A261] p-1 shadow-xl border-2 border-white transition-transform duration-300 hover:scale-110">
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
