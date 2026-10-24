import React from "react";
import Link from "next/link";
import { ADOPTED_ALUMNI, AnimalLineIcon } from "./animals-data";

export default function ShelterHero() {
  // Placement rotations for the 8 adopted alumni badges on the permanent home ledger
  const lidPlacements = [
    { rotate: "-4deg" },
    { rotate: "5deg" },
    { rotate: "-2deg" },
    { rotate: "4deg" },
    { rotate: "3deg" },
    { rotate: "-5deg" },
    { rotate: "-3deg" },
    { rotate: "6deg" },
  ];

  return (
    <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Urgent Narrative & Dual Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-block font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold">
            ANIMAL WELFARE &amp; RESCUE INITIATIVE · NO-KILL SANCTUARY
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#1A2540] tracking-tight leading-[0.95]">
            Someone here has been
            <br />
            waiting for you.
          </h1>

          <div className="font-body text-xs font-semibold text-[#cc2b3f] tracking-wide uppercase">
            Waiting 312 days · Case #B-0118 (Rani) · Belagavi Recovery Station
          </div>

          <p className="font-body text-base sm:text-lg text-[#1A2540]/80 leading-relaxed max-w-xl">
            Every rescued animal has an individual name before a case number. We treat trauma on the street, nurse them to health in our clinical shelter, and keep their kiss-cut case badge on our waiting board until you take them home.
          </p>

          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border-[1.5px] border-[#1A2540] bg-[#f2e9db] font-body text-xs sm:text-sm font-semibold text-[#1A2540] shadow-xs">
            <span>8 waiting cases</span>
            <span className="text-[#cc2b3f]">•</span>
            <span>100% no-kill</span>
            <span className="text-[#cc2b3f]">•</span>
            <span>adopt or sponsor</span>
          </div>

          {/* Exactly Two Buttons: Adopt or Donate */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#waiting-board"
              className="btn-enroll-pill px-8 py-3.5 text-center text-xs sm:text-sm font-bold shadow-md"
            >
              MEET RANI &amp; WAITING ANIMALS
            </a>
            <Link
              href="/donate"
              className="px-6 py-3.5 rounded-full border-[1.5px] border-[#1A2540] bg-[#f2e9db] hover:bg-white text-center font-body text-xs sm:text-sm font-bold text-[#1A2540] transition-colors"
            >
              SPONSOR A MEDICAL MEAL
            </Link>
          </div>
        </div>

        {/* Right Column: The Proof Exhibit — Wall of Happy Homes */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[540px] flex flex-col md:block py-4">
            {/* Layer 1: The Completed Adoption Board (8 Empty Dated Wells, tilted -2deg) */}
            <div className="relative md:w-[92%] bg-[#f2e9db] rounded-3xl p-5 sm:p-6 shadow-xl border-[1.5px] border-[#1A2540]/30 transform md:-rotate-2 transition-transform duration-300">
              <div className="flex items-center justify-between border-b-[1.5px] border-dashed border-[#EF9CC0] pb-3 mb-4">
                <div>
                  <span className="font-heading text-xs tracking-wider uppercase text-[#1A2540]">
                    Wall of Happy Homes · Series #104
                  </span>
                  <p className="font-body text-[11px] text-[#1A2540]/60 mt-0.5">
                    8 animals placed into verified permanent families
                  </p>
                </div>
                <span className="font-body text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 border border-[#EF9CC0] text-[#cc2b3f] rounded-full">
                  100% Placed
                </span>
              </div>

              {/* 2-Column Grid of 8 Empty Dated Wells */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {ADOPTED_ALUMNI.map((alumni) => (
                  <div
                    key={`alumni-well-${alumni.number}`}
                    className="relative rounded-2xl p-3 border-[1.5px] border-dashed border-[#EF9CC0] bg-[#EF9CC0]/8 flex flex-col justify-between min-h-[96px] sm:min-h-[104px]"
                  >
                    <div className="absolute right-2.5 top-2.5 opacity-20 text-[#EF9CC0] pointer-events-none">
                      <AnimalLineIcon species={alumni.species} className="w-8 h-8" />
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="font-heading text-xl text-[#EF9CC0] font-black leading-none">
                        {alumni.number}
                      </span>
                      <span className="font-body text-[9.5px] text-[#1A2540]/50 tracking-tight">
                        {alumni.city}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-heading text-[13px] text-[#1A2540] leading-tight line-clamp-1">
                        {alumni.name} ({alumni.breed})
                      </div>
                      <div className="font-body text-[10px] text-[#1A2540]/70 mt-1 font-medium">
                        Adopted {alumni.adoptionDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 2: The Permanent Home Ledger (Carrying the 8 Peeled Animal Badges, tilted +3.5deg) */}
            <div className="relative mt-6 md:mt-0 md:absolute md:top-12 md:-right-4 md:w-[88%] bg-[#1A2540] rounded-3xl p-5 sm:p-6 shadow-2xl border-[2px] border-[#1A2540] transform md:rotate-3 transition-transform duration-300">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A2540]/40">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f3c9d5]/40 inline-block" />
                  <span className="font-body text-[10px] text-[#f2e9db]/70 tracking-wider">
                    Verified Adopter Family Registry
                  </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#f2e9db]/40" />
              </div>

              {/* 8 Peeled Animal Badges Carried on the Board */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {ADOPTED_ALUMNI.map((alumni, index) => {
                  const isCrimson = alumni.colorway === "crimson";
                  const placement = lidPlacements[index];

                  return (
                    <div
                      key={`alumni-badge-${alumni.number}`}
                      style={{ transform: `rotate(${placement.rotate})` }}
                      className={`rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-[#1A2540] shadow-md transition-transform hover:scale-105 duration-200 cursor-default flex flex-col justify-between min-h-[96px] sm:min-h-[104px] ${
                        isCrimson
                          ? "bg-[#cc2b3f] text-[#f2e9db]"
                          : "bg-[#f2e9db] text-[#cc2b3f] ring-[2px] ring-[#cc2b3f]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg sm:text-xl leading-none">
                          {alumni.number}
                        </span>
                        <AnimalLineIcon species={alumni.species} className="w-5 h-5 shrink-0" />
                      </div>

                      <div className="mt-2">
                        <div className="font-heading text-[13px] leading-tight line-clamp-1">
                          {alumni.name}
                        </div>
                        <div
                          className={`font-body text-[9.5px] mt-0.5 line-clamp-1 ${
                            isCrimson ? "text-[#f2e9db]/70" : "text-[#cc2b3f]/75"
                          }`}
                        >
                          Home in {alumni.city}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Conservation Proof Caption */}
          <div className="mt-6 md:mt-10 text-center px-4">
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
