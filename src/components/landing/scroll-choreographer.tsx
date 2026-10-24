"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeroDriftCanvas from "./hero-drift-canvas";
import SeasonContourCanvas from "./season-contour-canvas";

interface AnimalCard {
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

interface Props {
  animals: AnimalCard[];
}

export default function ScrollChoreographer({ animals }: Props) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const manifestoRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const artifactRef = useRef<HTMLDivElement | null>(null);
  const seasonRef = useRef<HTMLDivElement | null>(null);

  // Phase index state (only updates when integer changes)
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);

  useEffect(() => {
    const root = document.documentElement;

    const clamp = (val: number, min: number, max: number) =>
      Math.min(max, Math.max(min, val));

    const computeProgress = (el: HTMLElement | null) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const totalDist = el.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return 0;
      const scrolled = -rect.top;
      return clamp(scrolled / totalDist, 0, 1);
    };

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 1. Hero Stage
          const p1 = computeProgress(heroRef.current);
          root.style.setProperty("--hero-type-y", `${p1 * -90}px`);
          root.style.setProperty("--hero-type-scale", `${1 - p1 * 0.26}`);
          root.style.setProperty("--hero-type-alpha", `${1 - p1 * 1.15}`);

          // 2. Manifesto Stage
          const p2 = computeProgress(manifestoRef.current);
          root.style.setProperty("--manifesto-wipe", `${p2 * 100}%`);
          root.style.setProperty("--manifesto-scale", `${1 + p2 * 0.05}`);

          // 3. Card Rail Stage
          const p3 = computeProgress(railRef.current);
          if (trackRef.current) {
            const overflow = Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 48);
            root.style.setProperty("--overflow-width", `${overflow}px`);
          }
          root.style.setProperty("--rail-progress", `${p3}`);

          // 4. Artifact Stage
          const p4 = computeProgress(artifactRef.current);
          root.style.setProperty("--packet-alpha", `${clamp(p4 * 2.2, 0, 1)}`);
          root.style.setProperty("--packet-enter", `${Math.max(0, 38 * (1 - p4 * 2.5))}px`);
          root.style.setProperty("--packet-scale", `${0.78 + 0.22 * clamp(p4 * 1.8, 0, 1)}`);
          const cutVal = p4 > 0.8 ? (p4 - 0.8) / 0.2 : 0;
          root.style.setProperty("--packet-cut", `${clamp(cutVal, 0, 1)}`);
          root.style.setProperty("--packet-meter", `${p4 * 100}%`);
          root.style.setProperty("--packet-copy-x", `${p4 * -28}px`);

          const newPhase = clamp(Math.floor(p4 * 4), 0, 3);
          setPhaseIndex((prev) => (prev !== newPhase ? newPhase : prev));

          // 5. Season / Lifecycle Stage
          const p5 = computeProgress(seasonRef.current);
          root.style.setProperty("--season-y", `${-4 + p5 * 8}%`);
          root.style.setProperty("--season-scale", `${1.10 - p5 * 0.045}`);
          const newChap = clamp(Math.floor(p5 * 3), 0, 2);
          setChapterIndex((prev) => (prev !== newChap ? newChap : prev));

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    // IntersectionObserver for per-atom word & row stagger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".word-rise, [data-rev]").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* ─────────────────────────────────────────────────────────────
          STAGE 1: POSTER HERO (280svh, Dark Ground #101124)
          Driven by 3 independent CSS variables:
          --hero-type-y (0 to -90px)
          --hero-type-scale (1 to 0.74)
          --hero-type-alpha (1 to 0)
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[280svh] bg-[#101124] text-[#FAF8FC]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none">
          {/* Full-bleed animated particle canvas */}
          <HeroDriftCanvas />

          {/* Top Stage Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono-meta border-b-[1.5px] border-[#314CB6] pb-3 text-[#B68CB8]">
            <span className="text-[#EFBDEB]">ARCHIVE // INTRODUCTORY LOCKUP</span>
            <span>BELAGAVI FIELD CLINIC · 15.8497°N, 74.4977°E</span>
          </div>

          {/* Centered Poster Lockup with independent Y, Scale, Alpha */}
          <div
            className="relative z-10 my-auto text-center will-change-transform space-y-3"
            style={{
              transform: "translateY(var(--hero-type-y)) scale(var(--hero-type-scale))",
              opacity: "var(--hero-type-alpha)",
              transformOrigin: "center center",
            }}
          >
            <div className="font-mono-meta text-[#0A81D1] tracking-[0.25em] text-xs sm:text-sm">
              DOCUMENTARY ANIMAL WELFARE & RESCUE CATALOGUE
            </div>

            <h1
              className="font-display uppercase tracking-tight text-[#FAF8FC] whitespace-nowrap leading-[0.84]"
              style={{
                fontSize: "min(20vw, calc(92vw / (7 * 0.44)))",
              }}
            >
              FURLINK
            </h1>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/adoptions"
                className="font-mono-meta px-8 py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-[#FAF8FC] border-[1.5px] border-[#314CB6] hover:border-[#0A81D1] transition font-bold text-xs"
              >
                Meet Waiting Row
              </Link>
              <Link
                href="/donate"
                className="font-mono-meta px-8 py-3.5 border-[1.5px] border-[#EFBDEB] text-[#EFBDEB] hover:bg-[#EFBDEB] hover:text-[#101124] transition font-bold text-xs"
              >
                Give a Meal
              </Link>
            </div>
          </div>

          {/* Bottom Mono Furniture */}
          <div
            className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-meta border-t-[1.5px] border-[#314CB6] pt-3 text-[#6461A0]"
            style={{ opacity: "var(--hero-type-alpha)" }}
          >
            <div>
              <span className="text-[#EFBDEB] mr-2">STATUS:</span>
              <span>14 RECOVERING RESCUES READY FOR ADOPTION</span>
            </div>
            <div className="text-right">
              <span>SCROLL DOWN TO ADVANCE REGISTRY ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STAGE 2: CLIP-WIPE MANIFESTO (260svh, Cream Ground #FAF8FC)
          Sentence in 34% ink filled from bottom up by
          clip-path: inset(calc(100% - var(--manifesto-wipe)) 0 0)
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={manifestoRef}
        className="relative h-[260svh] bg-[#FAF8FC] text-[#101124]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-12">
          {/* Top Furniture */}
          <div className="flex items-center justify-between font-mono-meta border-b-[1.5px] border-[#101124] pb-3 text-[#6461A0]">
            <span className="text-[#314CB6] font-bold">MANIFESTO 01 // PRINCIPLE OF CARE</span>
            <span>STAGE 02 OF 05</span>
          </div>

          {/* The Clip-Wipe Sentence Box */}
          <div className="my-auto max-w-5xl mx-auto w-full">
            <div
              className="relative select-none will-change-transform"
              style={{
                transform: "scale(var(--manifesto-scale))",
                transformOrigin: "left center",
              }}
            >
              {/* Base sentence in 34% ink (faint Amethyst/Dusty Grape) */}
              <div
                className="font-display uppercase tracking-tight text-[rgba(100,97,160,0.32)] leading-[0.88]"
                style={{ fontSize: "clamp(42px, 7vw, 108px)" }}
              >
                EVERY ANIMAL HAS A NAME BEFORE A NUMBER.
              </div>

              {/* Exact duplicate in full ink (Ocean Twilight #314CB6), wiped from bottom up */}
              <div
                aria-hidden="true"
                className="absolute inset-0 font-display uppercase tracking-tight text-[#101124] leading-[0.88] select-none pointer-events-none"
                style={{
                  fontSize: "clamp(42px, 7vw, 108px)",
                  clipPath: "inset(calc(100% - var(--manifesto-wipe)) 0 0 0)",
                  willChange: "clip-path",
                }}
              >
                EVERY ANIMAL HAS A NAME BEFORE A NUMBER.
              </div>
            </div>

            {/* Supporting Lede */}
            <div className="mt-8 pt-6 border-t-[1.5px] border-[#101124] max-w-2xl">
              <p className="font-sans text-base sm:text-lg text-[#6461A0] leading-relaxed">
                Rescued from roadside trauma, cruelty, and acute abandonment.
                Treated with sterile veterinary precision in our Belagavi clinic,
                and documented as living individuals with rights to patient care.
              </p>
            </div>
          </div>

          {/* Bottom furniture */}
          <div className="flex items-center justify-between font-mono-meta border-t-[1.5px] border-[#101124] pt-3 text-[#6461A0]">
            <span>FOUNDATION DIRECTIVE // NON-COMMERCIAL SANCTUARY</span>
            <span className="text-[#314CB6]">CONTINUE SCROLL TO VIEW WAITING ROW →</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STAGE 3: HORIZONTAL CARD RAIL (340svh, Light Ground)
          Translates sideways by calc(-1 * progress * overflowWidth)
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={railRef}
        className="relative h-[340svh] bg-[#FAF8FC] text-[#101124] border-t-[1.5px] border-[#101124]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-[1.5px] border-[#101124] pb-4">
            <div>
              <span className="font-mono-meta text-[#314CB6] font-bold block mb-1">
                STAGE 03 // HORIZONTAL DOSSIER RAIL
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-[#101124] tracking-tight">
                THE WAITING ROW
              </h2>
            </div>
            <div className="font-mono-meta text-[#6461A0] text-right">
              <span>TRANSLATION TRACK: 6 RESCUE DOSSIERS</span>
              <span className="block text-[9px] text-[#0A81D1]">SCROLL DOWN TO WALK THE RAIL →</span>
            </div>
          </div>

          {/* Horizontal Card Track */}
          <div className="my-auto w-full overflow-hidden py-4">
            <div
              ref={trackRef}
              className="flex gap-6 will-change-transform"
              style={{
                transform: "translateX(calc(-1 * var(--rail-progress) * var(--overflow-width)))",
                width: "max-content",
              }}
            >
              {animals.map((pet, idx) => (
                <div
                  key={pet.id}
                  className="w-[280px] sm:w-[320px] shrink-0 border-ink-15 bg-white p-4 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Top Case Label */}
                    <div className="flex items-center justify-between font-mono-meta text-[9.5px] border-b-[1.5px] border-[#101124] pb-2 mb-3">
                      <span className="text-[#101124] font-bold">{pet.caseNumber}</span>
                      <span className="text-[#0A81D1] font-bold">
                        WAITING {pet.daysWaiting}D
                      </span>
                    </div>

                    {/* Image / Plate */}
                    <div className="relative aspect-[3/4] w-full bg-[#161938] border-[1.5px] border-[#101124] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                      <div className="absolute top-2 left-2 bg-[#101124] text-[#EFBDEB] font-mono-meta text-[9px] px-2 py-0.5 border border-[#314CB6]">
                        {pet.species} // {pet.gender}
                      </div>
                    </div>

                    {/* Pet Name & Bio */}
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-display text-3xl text-[#101124]">
                          {pet.name}
                        </h3>
                        <span className="font-mono-meta text-[#6461A0]">{pet.age}</span>
                      </div>
                      <div className="font-mono-meta text-[#0A81D1] text-[9.5px] mt-0.5">
                        {pet.breed}
                      </div>
                      <p className="font-sans text-xs text-[#6461A0] mt-2 line-clamp-2 border-t-[1.5px] border-[#101124] pt-2 leading-relaxed">
                        {pet.oneLiner}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t-[1.5px] border-[#101124] flex items-center gap-2">
                    <Link
                      href={`/adoptions/${pet.id}`}
                      className="flex-1 py-2 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] font-mono-meta text-[10px] text-center font-bold border-[1.5px] border-[#101124] transition"
                    >
                      Adopt
                    </Link>
                    <Link
                      href="/donate"
                      className="px-3.5 py-2 border-[1.5px] border-[#101124] text-[#101124] hover:bg-[#101124] hover:text-[#EFBDEB] font-mono-meta text-[10px] text-center transition"
                    >
                      Sponsor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rail Progress Meter */}
          <div className="border-t-[1.5px] border-[#101124] pt-4 space-y-2">
            <div className="w-full h-[3px] bg-[rgba(16,17,36,0.12)] relative overflow-hidden">
              <div
                className="h-full bg-[#0A81D1]"
                style={{
                  width: "calc(var(--rail-progress) * 100%)",
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <div className="flex justify-between font-mono-meta text-[#6461A0]">
              <span>[01] RANI</span>
              <span className="text-[#314CB6]">SCRUB STATUS: DYNAMIC RAIL</span>
              <span>[06] LEO</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STAGE 4: THE PRINTED ARTIFACT (420svh, Dark Ground #101124)
          Paper packet/dossier that fades, scales, prints values,
          lights cues cumulatively, and opens a dashed perforation line!
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={artifactRef}
        className="relative h-[420svh] bg-[#101124] text-[#FAF8FC] border-t-[1.5px] border-[#314CB6]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none">
          {/* Header */}
          <div className="flex items-center justify-between font-mono-meta border-b-[1.5px] border-[#314CB6] pb-3 text-[#B68CB8]">
            <span className="text-[#EFBDEB]">STAGE 04 // THE LIVING ARTIFACT</span>
            <span>PHASE {phaseIndex + 1} OF 4 CUMULATIVE REVELATION</span>
          </div>

          {/* Main Stage Grid: Left Copy, Right Printed Packet */}
          <div className="my-auto max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy Column: Slides slightly opposite on scroll */}
            <div
              className="lg:col-span-5 space-y-6 will-change-transform"
              style={{ transform: "translateX(var(--packet-copy-x))" }}
            >
              <div className="font-mono-meta text-[#0A81D1]">
                CLINICAL ADMISSION PROTOCOL
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-[#FAF8FC] tracking-tight leading-[0.88]">
                CASE ARCHIVE: PRINTED UNDER INSPECTION
              </h2>
              <p className="font-sans text-sm text-[#B68CB8] leading-relaxed">
                As an animal arrives from field distress, their record is physically typed,
                verified against veterinary microbiology tests, and filed into the permanent ledger.
              </p>

              {/* 4 Cumulative Cues */}
              <div className="space-y-2 pt-2 border-t-[1.5px] border-[#314CB6]">
                <div
                  className={`font-mono-meta p-2 border-[1.5px] transition-colors ${
                    phaseIndex >= 0
                      ? "border-[#EFBDEB] text-[#EFBDEB] bg-[#161938]"
                      : "border-[#6461A0] text-[#6461A0]"
                  }`}
                >
                  CUE 01: INTAKE & EMERGENCY REGISTRATION
                </div>
                <div
                  className={`font-mono-meta p-2 border-[1.5px] transition-colors ${
                    phaseIndex >= 1
                      ? "border-[#0A81D1] text-[#0A81D1] bg-[#161938]"
                      : "border-[#6461A0] text-[#6461A0]"
                  }`}
                >
                  CUE 02: RABIES TITER & BLOOD TESTING
                </div>
                <div
                  className={`font-mono-meta p-2 border-[1.5px] transition-colors ${
                    phaseIndex >= 2
                      ? "border-[#314CB6] text-[#FAF8FC] bg-[#314CB6]"
                      : "border-[#6461A0] text-[#6461A0]"
                  }`}
                >
                  CUE 03: ORTHOPEDIC & TNVR SURGERY
                </div>
                <div
                  className={`font-mono-meta p-2 border-[1.5px] transition-colors ${
                    phaseIndex >= 3
                      ? "border-[#EFBDEB] text-[#EFBDEB] bg-[#161938]"
                      : "border-[#6461A0] text-[#6461A0]"
                  }`}
                >
                  CUE 04: DISCHARGE & PERFORATION OPENING
                </div>
              </div>
            </div>

            {/* Right Column: Tangible Paper Packet Artifact */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="relative w-full max-w-md aspect-[3/4] bg-[#FFFDF8] text-[#101124] border-ink-15 p-6 flex flex-col justify-between shadow-2xl will-change-transform"
                style={{
                  opacity: "var(--packet-alpha)",
                  transform:
                    "translateY(var(--packet-enter)) scale(var(--packet-scale))",
                  transformOrigin: "center center",
                }}
              >
                {/* Dashed perforation line that opens across artifact at cut point */}
                <div
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-[2px] border-dashed border-[#101124] pointer-events-none z-30 transition-all duration-300"
                  style={{
                    opacity: "var(--packet-cut)",
                    transform:
                      "translateY(calc(-50% + var(--packet-cut) * 12px)) scaleY(calc(1 + var(--packet-cut) * 2))",
                  }}
                >
                  <span className="absolute -top-3 right-4 font-mono-meta text-[8.5px] bg-[#FFFDF8] px-1 text-[#0A81D1]">
                    [TEAR TO DISCHARGE]
                  </span>
                </div>

                {/* Packet Header */}
                <div className="border-b-[1.5px] border-[#101124] pb-3">
                  <div className="font-mono-meta text-[9px] text-[#6461A0] flex justify-between">
                    <span>FURLINK CLINICAL ADMISSION</span>
                    <span className="text-[#0A81D1] font-bold">LOT #2024-B4</span>
                  </div>
                  <h3 className="font-display text-4xl sm:text-5xl tracking-tight text-[#101124] mt-1">
                    BRUNO // DESI INDIE
                  </h3>
                </div>

                {/* Patient Plate */}
                <div className="my-2 aspect-[16/10] bg-[#161938] border-[1.5px] border-[#101124] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                    alt="Bruno clinical photo"
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#FFFDF8] text-[#101124] border border-[#101124] font-mono-meta text-[8px] px-2 py-0.5">
                    RECOVERY VERIFIED: 142 DAYS
                  </div>
                </div>

                {/* Dynamic Medical Values (filled cumulatively by phase index) */}
                <div className="border-t-[1.5px] border-[#101124] pt-3 font-mono-meta text-[10px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#6461A0]">INTAKE CASE:</span>
                    <span className="font-bold text-[#101124]">
                      {phaseIndex >= 0 ? "CASE #0244 [LOGGED]" : "PENDING"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6461A0]">RABIES TITER:</span>
                    <span className="font-bold text-[#0A81D1]">
                      {phaseIndex >= 1 ? "NEGATIVE [CERTIFIED]" : "PENDING LAB"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6461A0]">SURGERY RESULT:</span>
                    <span className="font-bold text-[#314CB6]">
                      {phaseIndex >= 2 ? "HIND FEMUR PINNED & TNVR OK" : "QUEUED"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6461A0]">PLACEMENT WINDOW:</span>
                    <span className="font-bold text-[#101124]">
                      {phaseIndex >= 3 ? "ADOPTION CLEARED NOW" : "REHABILITATING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Status Strip */}
          <div className="flex items-center justify-between font-mono-meta border-t-[1.5px] border-[#314CB6] pt-3 text-[#B68CB8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#0A81D1] animate-ping" />
              <span>LIVE REGISTRY STAMP: {phaseIndex === 3 ? "DISCHARGE APPROVED" : "IN PROGRESS"}</span>
            </div>
            <span>STAGE 05 AHEAD: THE CARE LIFECYCLE →</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STAGE 5: PARALLAX SEASON / LIFECYCLE BAND (300svh, Light Ground)
          22 stacked contour lines drifting on time with parallax,
          and 3 chapters swapping underneath headline
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={seasonRef}
        className="relative h-[300svh] bg-[#FAF8FC] text-[#101124] border-t-[1.5px] border-[#101124]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-12">
          {/* Animated 22 contour waves canvas */}
          <SeasonContourCanvas />

          {/* Top Stage Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono-meta border-b-[1.5px] border-[#101124] pb-3 text-[#6461A0]">
            <span className="text-[#314CB6] font-bold">STAGE 05 // CONTINUOUS CARE BAND</span>
            <span>CHAPTER 0{chapterIndex + 1} OF 03</span>
          </div>

          {/* Center Content: Headline & Swapping Chapters */}
          <div className="relative z-10 my-auto max-w-4xl mx-auto w-full text-center space-y-6">
            <span className="font-mono-meta text-[#0A81D1] tracking-widest block">
              ANNUAL CLINICAL PIPELINE
            </span>

            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-[#101124] tracking-tight">
              THE CARE LIFECYCLE
            </h2>

            {/* 3 Chapters Swapping Underneath Headline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-[1.5px] border-[#101124] text-left">
              <div
                className={`border-ink-15 bg-white p-5 transition-opacity duration-300 ${
                  chapterIndex === 0 ? "opacity-100 shadow-md border-[#314CB6]" : "opacity-30"
                }`}
              >
                <div className="font-mono-meta text-[10px] text-[#314CB6] font-bold mb-2">
                  CHAPTER 01
                </div>
                <h3 className="font-display text-2xl text-[#101124] mb-2">
                  EMERGENCY DISPATCH
                </h3>
                <p className="font-sans text-xs text-[#6461A0] leading-relaxed">
                  24/7 ambulance response across highway routes and street distress calls.
                  Immediate fluid resuscitation and wound stabilization.
                </p>
              </div>

              <div
                className={`border-ink-15 bg-white p-5 transition-opacity duration-300 ${
                  chapterIndex === 1 ? "opacity-100 shadow-md border-[#0A81D1]" : "opacity-30"
                }`}
              >
                <div className="font-mono-meta text-[10px] text-[#0A81D1] font-bold mb-2">
                  CHAPTER 02
                </div>
                <h3 className="font-display text-2xl text-[#101124] mb-2">
                  CLINICAL TNVR HEALING
                </h3>
                <p className="font-sans text-xs text-[#6461A0] leading-relaxed">
                  Humane sterilization surgeries, orthopedic bone fixation, antirabies vaccines,
                  and 14 to 30 days of inpatient nutrition and dressing.
                </p>
              </div>

              <div
                className={`border-ink-15 bg-white p-5 transition-opacity duration-300 ${
                  chapterIndex === 2 ? "opacity-100 shadow-md border-[#6461A0]" : "opacity-30"
                }`}
              >
                <div className="font-mono-meta text-[10px] text-[#6461A0] font-bold mb-2">
                  CHAPTER 03
                </div>
                <h3 className="font-display text-2xl text-[#101124] mb-2">
                  LIFETIME PLACEMENT
                </h3>
                <p className="font-sans text-xs text-[#6461A0] leading-relaxed">
                  Careful home compatibility vetting, adopter education, and permanent
                  medical checkups to ensure the bond lasts for life.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom furniture */}
          <div className="relative z-10 flex items-center justify-between font-mono-meta border-t-[1.5px] border-[#101124] pt-3 text-[#6461A0]">
            <span>END OF PINNED STAGES</span>
            <span className="text-[#314CB6]">ADVANCE TO VETERINARY LEDGER ↓</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          AFTER THE PINS:
          1. RULED VETERINARY & ADOPTION LEDGER (PRICE TABLE)
          2. NATIVE DETAILS FAQ ROWS
          3. DARK LOAM FOOTER (#101124)
      ───────────────────────────────────────────────────────────── */}

      {/* 1. Ruled Price / Allocation Table */}
      <section className="bg-[#FAF8FC] text-[#101124] py-20 px-6 sm:px-12 border-t-[1.5px] border-[#101124]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-[1.5px] border-[#101124] pb-4">
            <div>
              <span className="font-mono-meta text-[#314CB6] font-bold block mb-1">
                TRANSPARENCY SCHEDULE // AUDITED MEDICAL ALLOCATION
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-[#101124]">
                VETERINARY DIRECT COSTS
              </h2>
            </div>
            <p className="font-mono-meta text-[#6461A0] max-w-xs text-right">
              Every rupee is translated directly into medical deliverables without commercial markup.
            </p>
          </div>

          <div className="border-ink-15 bg-white divide-y-[1.5px] divide-[#101124]">
            {[
              {
                code: "TIER 01",
                service: "Clinical Nutrition Pack",
                deliverable: "9 days of high-protein veterinary meals for recovering inpatient",
                amount: "₹450",
              },
              {
                code: "TIER 02",
                service: "Immunization & Parasite Protocol",
                deliverable: "7-in-1 vaccination, anti-rabies, tick treatment, and broad deworming",
                amount: "₹1,200",
              },
              {
                code: "TIER 03",
                service: "Complete TNVR Sterilization",
                deliverable: "Humane surgery, surgical consumables, ear notch ID, and 7-day post-op boarding",
                amount: "₹2,800",
              },
              {
                code: "TIER 04",
                service: "Emergency Trauma & Fracture Fixation",
                deliverable: "Orthopedic x-rays, stainless bone pin placement, casting, and pain management",
                amount: "₹6,500",
              },
              {
                code: "TIER 05",
                service: "Full Critical Care Sponsorship",
                deliverable: "30 days ICU nursing, IV electrolytes, specialized wound care, and adoption preparation",
                amount: "₹12,000",
              },
            ].map((row) => (
              <div
                key={row.code}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[rgba(239,189,235,0.12)] transition"
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono-meta text-[#0A81D1] font-bold shrink-0">
                    {row.code}
                  </span>
                  <div>
                    <h4 className="font-display text-2xl text-[#101124]">
                      {row.service}
                    </h4>
                    <p className="font-sans text-xs text-[#6461A0] mt-0.5">
                      {row.deliverable}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:self-center shrink-0">
                  <span className="font-mono-meta text-lg sm:text-xl font-bold text-[#314CB6]">
                    {row.amount}
                  </span>
                  <Link
                    href="/donate"
                    className="font-mono-meta px-4 py-2 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] border-[1.5px] border-[#101124] transition text-[10px]"
                  >
                    Fund
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Native Details FAQ Rows */}
      <section className="bg-[#FAF8FC] text-[#101124] py-16 px-6 sm:px-12 border-t-[1.5px] border-[#101124]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border-b-[1.5px] border-[#101124] pb-4">
            <span className="font-mono-meta text-[#314CB6] font-bold block mb-1">
              FIELD QUERIES & DISCLOSURES
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#101124]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="border-ink-15 bg-white divide-y-[1.5px] divide-[#101124]">
            {[
              {
                q: "HOW DOES ADOPTION MATCHING WORK AT FURLINK?",
                a: "We assess temperament, routine, and living space before matching. Every animal undergoes medical inspection, behavior profiling with dogs/cats/children, and a 2-day home visit before final placement.",
              },
              {
                q: "ARE RESCUE DOGS AND INDIES HEALTHY FOR HOMES?",
                a: "Indian Pariahs and street dogs possess exceptional genetic resilience, natural immunity, and high loyalty. All FurLink rescues are vaccinated, dewormed, and sterilized prior to adoption.",
              },
              {
                q: "ARE DONATIONS TAX EXEMPT UNDER INDIAN LAW?",
                a: "Yes. All direct animal care contributions are 100% tax-deductible under Section 80G. Official receipts are issued with unique registration certificates.",
              },
              {
                q: "HOW CAN I REPORT A STRAY NEEDING STERILIZATION (TNVR)?",
                a: "You can submit an entry on our TNVR Field Care portal with location and coordinates. Our ambulance collects, sterilizes, ear-notches, and returns the animal safely to their territory.",
              },
            ].map((faq, i) => (
              <details key={i} className="group p-5 sm:p-6 cursor-pointer">
                <summary className="font-mono-meta text-xs sm:text-sm font-bold text-[#101124] flex items-center justify-between select-none">
                  <span>{faq.q}</span>
                  <span className="text-[#314CB6] group-open:rotate-45 transition-transform text-lg ml-4">
                    +
                  </span>
                </summary>
                <p className="font-sans text-xs sm:text-sm text-[#6461A0] mt-3 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dark Loam Footer (#101124) */}
      <footer className="bg-[#101124] text-[#FAF8FC] border-t-[1.5px] border-[#314CB6] py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[1.5px] border-[#314CB6] pb-10">
            <div>
              <span className="font-mono-meta text-[#EFBDEB] block mb-2">
                CATALOGUE REPOSITORY // EDITION 2024
              </span>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#FAF8FC]">
                FURLINK ARCHIVE
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/adoptions"
                className="font-mono-meta px-6 py-3 bg-[#314CB6] hover:bg-[#0A81D1] text-[#FAF8FC] border-[1.5px] border-[#EFBDEB] font-bold transition"
              >
                Adopt an Animal
              </Link>
              <Link
                href="/donate"
                className="font-mono-meta px-6 py-3 border-[1.5px] border-[#EFBDEB] text-[#EFBDEB] hover:bg-[#EFBDEB] hover:text-[#101124] font-bold transition"
              >
                Sponsor Surgery
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-mono-meta text-xs">
            <div>
              <span className="text-[#0A81D1] font-bold block mb-3">CATALOGUE</span>
              <ul className="space-y-2 text-[#B68CB8]">
                <li><Link href="/adoptions" className="hover:text-[#FAF8FC]">The Waiting Row</Link></li>
                <li><Link href="/stories" className="hover:text-[#FAF8FC]">Field Journals</Link></li>
                <li><Link href="/rescues" className="hover:text-[#FAF8FC]">Emergency Dispatch</Link></li>
                <li><Link href="/sterilization" className="hover:text-[#FAF8FC]">TNVR Pipeline</Link></li>
              </ul>
            </div>

            <div>
              <span className="text-[#0A81D1] font-bold block mb-3">CONTRIBUTE</span>
              <ul className="space-y-2 text-[#B68CB8]">
                <li><Link href="/donate" className="hover:text-[#FAF8FC]">Medical Meal Fund</Link></li>
                <li><Link href="/donate" className="hover:text-[#FAF8FC]">Trauma Sponsorship</Link></li>
                <li><Link href="/admin/donations" className="hover:text-[#FAF8FC]">Audited Ledgers</Link></li>
              </ul>
            </div>

            <div>
              <span className="text-[#0A81D1] font-bold block mb-3">SANCTUARY</span>
              <p className="text-[#6461A0] leading-relaxed text-[10px]">
                Belagavi Clinical Base<br />
                Near Tilakwadi 3rd Gate<br />
                Karnataka, India<br />
                Emergency Hotline Active 24/7
              </p>
            </div>

            <div>
              <span className="text-[#0A81D1] font-bold block mb-3">GOVERNANCE</span>
              <p className="text-[#6461A0] leading-relaxed text-[10px]">
                Registered Animal Welfare Trust<br />
                Section 80G Certified<br />
                Zero Commercial Sales<br />
                Every Animal Named Before Numbered
              </p>
            </div>
          </div>

          <div className="pt-6 border-t-[1.5px] border-[#314CB6] flex flex-col sm:flex-row justify-between items-center gap-3 font-mono-meta text-[10px] text-[#6461A0]">
            <span>© 2024 FURLINK ANIMAL WELFARE FOUNDATION. ALL RIGHTS RESERVED.</span>
            <span>WARM PRINT EDITORIAL // SCROLL-CHOREOGRAPHED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
