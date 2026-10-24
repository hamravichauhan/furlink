"use client";

import React from "react";
import Link from "next/link";
import { ADOPTED_ALUMNI, AnimalLineIcon } from "./animals-data";

export default function ShelterHero() {
  // Static slight rotations for the 8 peeled badges on the ledger (tilted documentary feel)
  const lidPlacements = [
    { rotate: "-2.5deg" },
    { rotate: "1.8deg" },
    { rotate: "-1.5deg" },
    { rotate: "2.2deg" },
    { rotate: "-3deg" },
    { rotate: "1.2deg" },
    { rotate: "-1deg" },
    { rotate: "2.5deg" },
  ];

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Story on Left, The Wall of Happy Homes Proof Exhibit on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-10 items-center">
          {/* Left Column (7 cols): The Urgent Case Dossier */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Header Docket Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#cc2b3f] bg-[#f2e9db] text-[#cc2b3f] text-xs font-heading uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-[#cc2b3f] animate-pulse" />
              <span>URGENT SANCTUARY CASE · CASE #B-0118</span>
            </div>

            {/* Giant Headline with scale contrast */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#1A2540] tracking-tight leading-[0.98]">
              Someone here has been waiting{" "}
              <span className="text-[#cc2b3f] underline decoration-[#cc2b3f]/40 decoration-wavy underline-offset-8">
                312 days
              </span>{" "}
              for you.
            </h1>

            {/* Editorial Case Note for Rani */}
            <div className="border-l-2 border-[#cc2b3f] pl-4 sm:pl-6 space-y-2">
              <p className="font-body text-base sm:text-lg text-[#1A2540]/85 leading-relaxed">
                Her name is <strong>Rani</strong>. Rescued from the Belagavi bypass with an injured hind paw,
                she is gentle, house-trained, and walks quietly beside you. She has watched twenty other
                dogs leave with families while her day counter kept ticking.
              </p>
              <div className="font-body text-xs text-[#1A2540]/60 flex items-center gap-3">
                <span>3 years old</span>
                <span>·</span>
                <span>Indie Pariah</span>
                <span>·</span>
                <span>Sterilized &amp; Vaccinated</span>
                <span>·</span>
                <span>Fully cleared for adoption</span>
              </div>
            </div>

            {/* Primary Action Button Cluster: ADOPT or DONATE only */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="#waiting-board"
                className="btn-enroll-pill px-8 py-4 text-center text-sm tracking-wider shadow-lg hover:shadow-xl transition"
              >
                MEET RANI &amp; WAITING ANIMALS
              </Link>
              <Link
                href="#donate-section"
                className="px-7 py-3.5 rounded-full border-2 border-[#1A2540] text-[#1A2540] font-heading text-xs tracking-wider uppercase font-extrabold hover:bg-[#1A2540] hover:text-[#f2e9db] transition text-center"
              >
                SPONSOR A MEDICAL MEAL (₹450)
              </Link>
            </div>

            {/* Daily Ticking Assurance */}
            <div className="font-body text-xs text-[#1A2540]/65 flex items-center gap-2 pt-1">
              <span className="font-semibold text-[#1A2540]">Zero euthanasia sanctuary charter</span>
              <span>·</span>
              <span>Every animal has a name before a number</span>
            </div>
          </div>

          {/* Right Column (5 cols): The Proof Exhibit (Wall of Happy Homes Overlapped by Adopter Family Ledger) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Layer 1: The Finished Sheet (Backing Paper with 8 Empty Dated Wells) */}
            <div className="bg-[#f2e9db] rounded-3xl p-5 sm:p-6 shadow-xl border-[1.5px] border-[#1A2540]/25 max-w-md mx-auto">
              {/* Sheet Eyebrow */}
              <div className="flex items-center justify-between border-b-[1.5px] border-[#1A2540]/15 pb-3 mb-4">
                <div>
                  <span className="font-heading text-xs uppercase tracking-wider text-[#1A2540] block font-bold">
                    Wall of Happy Homes
                  </span>
                  <span className="font-body text-[11px] text-[#1A2540]/60">
                    8 animals placed into verified homes
                  </span>
                </div>
                <span className="font-body text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 border border-[#EF9CC0] text-[#cc2b3f] rounded-full">
                  100% Placed
                </span>
              </div>

              {/* 2-Column Grid of 8 Empty Dated Wells with Ghost Photo */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {ADOPTED_ALUMNI.map((alumni) => (
                  <div
                    key={`alumni-well-${alumni.number}`}
                    className="relative rounded-2xl p-2.5 border-[1.5px] border-dashed border-[#EF9CC0] bg-[#EF9CC0]/10 flex items-center gap-2.5 min-h-[96px] sm:min-h-[104px]"
                  >
                    {/* Ghost photo thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-dashed border-[#EF9CC0] shrink-0 bg-white/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={alumni.imageUrl}
                        alt={alumni.name}
                        className="w-full h-full object-cover opacity-40 grayscale"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <span className="font-heading text-base text-[#EF9CC0] font-black leading-none">
                          {alumni.number}
                        </span>
                        <span className="font-body text-[9px] text-[#1A2540]/50 tracking-tight">
                          {alumni.city}
                        </span>
                      </div>

                      <div className="mt-1">
                        <div className="font-heading text-xs text-[#1A2540] font-bold leading-tight truncate">
                          {alumni.name}
                        </div>
                        <div className="font-body text-[9px] text-[#cc2b3f] mt-0.5 font-semibold">
                          Adopted {alumni.adoptionDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 2: The Permanent Home Ledger (Carrying the 8 Peeled Animal Badges WITH PET PHOTOS, tilted +3.5deg) */}
            <div className="relative mt-6 md:mt-0 md:absolute md:top-10 md:-right-4 md:w-[92%] bg-[#1A2540] rounded-3xl p-5 sm:p-6 shadow-2xl border-[2px] border-[#1A2540] transform md:rotate-3 transition-transform duration-300">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A2540]/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cc2b3f] inline-block animate-pulse" />
                  <span className="font-body text-[11px] text-[#f2e9db] font-bold tracking-wider uppercase">
                    Verified Adopter Family Registry
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#f2e9db]/40" />
              </div>

              {/* 8 Peeled Animal Badges Carried on the Board WITH REAL PET PHOTOS */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {ADOPTED_ALUMNI.map((alumni, index) => {
                  const isCrimson = alumni.colorway === "crimson";
                  const placement = lidPlacements[index];

                  return (
                    <div
                      key={`alumni-badge-${alumni.number}`}
                      style={{ transform: `rotate(${placement.rotate})` }}
                      className={`rounded-2xl p-2.5 sm:p-3 border-[1.5px] border-[#1A2540] shadow-md transition-transform hover:scale-105 duration-200 cursor-default flex items-center gap-2.5 min-h-[96px] sm:min-h-[104px] ${
                        isCrimson
                          ? "bg-[#cc2b3f] text-[#f2e9db]"
                          : "bg-[#f2e9db] text-[#cc2b3f] ring-[2px] ring-[#cc2b3f]"
                      }`}
                    >
                      {/* Pet Photo Frame */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-[1.5px] border-current/30 shrink-0 bg-white/20 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={alumni.imageUrl}
                          alt={alumni.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Pet Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-base sm:text-lg font-black leading-none">
                            {alumni.number}
                          </span>
                          <AnimalLineIcon species={alumni.species} className="w-4 h-4 shrink-0 opacity-80" />
                        </div>
                        <div className="font-heading text-xs sm:text-sm font-bold leading-tight line-clamp-1 mt-1">
                          {alumni.name}
                        </div>
                        <div
                          className={`font-body text-[9.5px] mt-0.5 line-clamp-1 font-medium ${
                            isCrimson ? "text-[#f2e9db]/85" : "text-[#cc2b3f]/85"
                          }`}
                        >
                          Home in {alumni.city}
                        </div>
                        <div
                          className={`font-body text-[8.5px] mt-0.5 ${
                            isCrimson ? "text-[#f2e9db]/65" : "text-[#1A2540]/60"
                          }`}
                        >
                          Placed {alumni.adoptionDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Conservation Proof Caption */}
          <div className="mt-6 md:mt-10 text-center px-4 lg:col-span-12">
            <p className="font-body text-xs sm:text-sm text-[#1A2540]/80 italic max-w-md mx-auto">
              &ldquo;All 8 animals missing from our waiting board are now thriving in permanent homes.&rdquo;
            </p>
            <p className="font-body text-[11px] text-[#1A2540]/55 mt-1">
              Exact 1:1 outcome conservation · Count all 8 empty wells and all 8 placed badges
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
