"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SHELTER_ANIMALS, ShelterAnimal, AnimalLineIcon } from "./animals-data";

export default function WaitingBoard() {
  const [selectedAnimal, setSelectedAnimal] = useState<ShelterAnimal | null>(null);

  return (
    <section id="waiting-board" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[#cc2b3f] font-heading text-xs tracking-widest uppercase block mb-2 font-bold">
            Live Sanctuary Census
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            The Waiting Board: eight animals ready for home
          </h2>
          <p className="font-body text-sm sm:text-base text-[#1A2540]/75 mt-3 leading-relaxed">
            Every badge is an individual animal waiting in our clinical sanctuary. Those waiting the longest are listed first.
            Click any badge to inspect their case file, sponsor a medical meal, or begin an adoption.
          </p>
        </div>

        {/* The Waiting Board Cream Sheet Panel */}
        <div className="relative bg-[#f2e9db] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border-[1.5px] border-[#1A2540]/25">
          {/* Sheet Header Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[1.5px] border-[#1A2540]/20 pb-4 mb-8 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#cc2b3f] inline-block animate-pulse" />
              <span className="font-heading text-xs sm:text-sm uppercase tracking-wider text-[#1A2540] font-bold">
                Belagavi Sanctuary Station · Live Census · No-Kill Verified
              </span>
            </div>
            <div className="flex items-center gap-4 font-body text-xs text-[#1A2540]/65 font-medium">
              <span>8 Active Badges</span>
              <span>·</span>
              <span>Sorted by days waiting</span>
              <span>·</span>
              <span>All medically cleared</span>
            </div>
          </div>

          {/* 4x2 Grid (2-up on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SHELTER_ANIMALS.map((animal, index) => {
              const isFirst = index === 0;
              const isCrimson = animal.colorway === "crimson";

              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  className="group relative cursor-pointer"
                >
                  {/* Kiss-Cut Die Line Contour */}
                  <div className="relative p-1.5 sm:p-2 rounded-[24px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] transition-all duration-200 group-hover:border-[#cc2b3f]">
                    {/* Chunky Rounded Animal Badge WITH REAL VISIBLE PET PHOTO */}
                    <div
                      className={`relative w-full rounded-2xl p-3 sm:p-4 border-[1.5px] border-[#1A2540] flex flex-col justify-between shadow-sm transition-transform duration-200 group-hover:-translate-y-1 ${
                        isCrimson
                          ? "bg-[#cc2b3f] text-[#f2e9db]"
                          : "bg-[#f2e9db] text-[#cc2b3f] ring-[2px] ring-[#cc2b3f]"
                      }`}
                      style={
                        isFirst
                          ? {
                              clipPath:
                                "polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)",
                            }
                          : undefined
                      }
                    >
                      {/* Numeral, Days Counter & Line Icon */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-heading text-2xl sm:text-3xl font-black leading-none tracking-tight block">
                            {animal.number}
                          </span>
                          <span
                            className={`font-body text-[9.5px] sm:text-[10px] uppercase font-bold tracking-wider mt-1 block px-2 py-0.5 rounded-full ${
                              isCrimson ? "bg-white/20 text-[#f2e9db]" : "bg-[#cc2b3f]/15 text-[#cc2b3f]"
                            }`}
                          >
                            Waiting {animal.daysWaiting} days
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg border border-current/25 shrink-0 bg-white/10">
                          <AnimalLineIcon species={animal.species} className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Prominent Pet Photo Portrait */}
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-[1.5px] border-[#1A2540] my-2.5 bg-slate-900 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={animal.imageUrl}
                          alt={animal.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-1.5 left-1.5 bg-[#1A2540]/80 backdrop-blur-xs text-[#f2e9db] font-body text-[8.5px] font-bold px-2 py-0.5 rounded-md">
                          {animal.gender} · {animal.age}
                        </div>
                      </div>

                      {/* Animal Name, Breed & Personality Snippet */}
                      <div>
                        <div className="font-heading text-base sm:text-lg font-bold leading-tight">
                          {animal.name}
                        </div>
                        <div
                          className={`font-body text-[11px] mt-0.5 font-medium ${
                            isCrimson ? "text-[#f2e9db]/75" : "text-[#cc2b3f]/80"
                          }`}
                        >
                          {animal.breed}
                        </div>
                        <p
                          className={`font-body text-[10px] sm:text-[10.5px] mt-1.5 line-clamp-2 leading-relaxed ${
                            isCrimson ? "text-[#f2e9db]/85" : "text-[#1A2540]/80"
                          }`}
                        >
                          &ldquo;{animal.oneLiner}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* ANIMAL 01 (RANI) LIFTED CORNER: Folded triangle & Hatched peel shadow */}
                    {isFirst && (
                      <>
                        <div
                          className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-8 h-8 rounded-br-2xl bg-hatch-pattern pointer-events-none"
                          style={{
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        />

                        <div
                          className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-8 h-8 pointer-events-none shadow-md"
                          style={{
                            background: "linear-gradient(135deg, #f2e9db 50%, #cc2b3f 50%)",
                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                            transform: "rotate(180deg)",
                            filter: "drop-shadow(-2px -2px 3px rgba(26, 37, 64, 0.25))",
                          }}
                        />

                        <div className="absolute -bottom-3 -right-2 bg-[#1A2540] text-[#f2e9db] font-body text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-[#f2e9db] pointer-events-none">
                          Urgent foster
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sub-label */}
                  <div className="mt-2 text-center">
                    <span className="font-body text-[11px] text-[#1A2540]/70 group-hover:text-[#cc2b3f] transition-colors font-medium">
                      Inspect {animal.name}&apos;s case &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Board Footer Action */}
          <div className="mt-10 pt-6 border-t-[1.5px] border-[#1A2540]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-body text-xs text-[#1A2540]/70 text-center sm:text-left">
              Every animal is vaccinated, sterilized (TNVR), dewormed, and microchipped prior to home placement.
            </div>
            <Link
              href="/adoptions"
              className="btn-enroll-pill px-6 py-2.5 text-xs tracking-wider"
            >
              VIEW ALL WAITING CASES
            </Link>
          </div>
        </div>

        {/* Modal: Animal Dossier Inspection */}
        {selectedAnimal && (
          <div
            className="fixed inset-0 z-50 bg-[#1A2540]/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedAnimal(null)}
          >
            <div
              className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 max-w-xl w-full border-[2px] border-[#1A2540] shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b-[1.5px] border-[#1A2540]/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#cc2b3f] text-[#f2e9db] flex items-center justify-center font-heading text-2xl font-bold shrink-0">
                    {selectedAnimal.number}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-[#1A2540] leading-tight font-black">
                      {selectedAnimal.name}
                    </h3>
                    <div className="font-body text-xs text-[#cc2b3f] font-semibold mt-0.5">
                      {selectedAnimal.breed} · {selectedAnimal.age} · {selectedAnimal.gender}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAnimal(null)}
                  className="w-8 h-8 rounded-full border border-[#1A2540]/30 text-[#1A2540] flex items-center justify-center font-heading text-sm hover:bg-[#1A2540] hover:text-[#f2e9db] transition-colors cursor-pointer"
                >
                  X
                </button>
              </div>

              {/* Photo & Days Badge */}
              <div className="relative aspect-[16/10] w-full rounded-2xl border-[1.5px] border-[#1A2540] overflow-hidden mb-4 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A2540] text-[#f2e9db] font-body text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Waiting {selectedAnimal.daysWaiting} Days
                </div>
                <div className="absolute top-3 right-3 bg-[#f2e9db] text-[#cc2b3f] font-body text-xs font-bold px-3 py-1 rounded-full border border-[#cc2b3f] shadow-md">
                  {selectedAnimal.caseRef}
                </div>
              </div>

              {/* Honest Story Line */}
              <p className="font-body text-sm text-[#1A2540] leading-relaxed mb-4 italic">
                &ldquo;{selectedAnimal.oneLiner}&rdquo;
              </p>

              {/* Clinical Medical Status */}
              <div className="bg-white/70 p-3.5 rounded-2xl border border-[#1A2540]/15 mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold block mb-1">
                  Clinical &amp; Health Record
                </span>
                <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed">
                  {selectedAnimal.medicalStatus}
                </p>
              </div>

              {/* Personality & Environment */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/70 p-3 rounded-xl border border-[#1A2540]/15">
                  <span className="font-heading text-[11px] uppercase tracking-wider text-[#1A2540] font-bold block mb-1">
                    Temperament
                  </span>
                  <ul className="space-y-1 font-body text-[11px] text-[#1A2540]/75">
                    {selectedAnimal.personality.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/70 p-3 rounded-xl border border-[#1A2540]/15">
                  <span className="font-heading text-[11px] uppercase tracking-wider text-[#1A2540] font-bold block mb-1">
                    Recommended Home
                  </span>
                  <ul className="space-y-1 font-body text-[11px] text-[#1A2540]/75">
                    {selectedAnimal.goodWith.map((g, i) => (
                      <li key={i}>• {g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dual Actions in Modal */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/adoptions"
                  onClick={() => setSelectedAnimal(null)}
                  className="flex-1 btn-enroll-pill py-3 text-center text-xs tracking-wider"
                >
                  START ADOPTION FOR {selectedAnimal.name.toUpperCase()}
                </Link>
                <Link
                  href={`/donate?pet=${encodeURIComponent(selectedAnimal.name)}&amount=450`}
                  onClick={() => setSelectedAnimal(null)}
                  className="px-5 py-3 rounded-full border border-[#1A2540] font-body text-xs font-bold hover:bg-white text-center transition-colors"
                >
                  SPONSOR MEALS (₹450)
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
