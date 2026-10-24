import React from "react";
import HeroExhibit from "./hero-exhibit";

export default function HeroSection() {
  return (
    <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Crimson Eyebrow (Uppercase rationed) */}
          <div className="inline-block font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold">
            PHYSICAL CURRICULUM · MAILED WORLDWIDE
          </div>

          {/* Two-Line Navy League Spartan Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#1A2540] tracking-tight leading-[0.95]">
            The curriculum you
            <br />
            peel to finish.
          </h1>

          {/* One-Sentence Subline */}
          <p className="font-body text-base sm:text-lg text-[#1A2540]/80 leading-relaxed max-w-xl">
            A masterclass in applied typography and print tooling whose progress is recorded by peeling physical die-cut stickers from your mailed curriculum sheet onto your workspace lid.
          </p>

          {/* Bordered Stat Chip */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border-[1.5px] border-[#1A2540] bg-[#f2e9db] font-body text-xs sm:text-sm font-semibold text-[#1A2540] shadow-xs">
            <span>8 modules</span>
            <span className="text-[#cc2b3f]">•</span>
            <span>9 h 20 m</span>
            <span className="text-[#cc2b3f]">•</span>
            <span>peel as you go</span>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#enroll"
              className="btn-enroll-pill px-8 py-3.5 text-xs sm:text-sm shadow-md"
            >
              ENROLL &amp; GET YOUR SHEET
            </a>
            <span className="font-body text-xs text-[#1A2540]/60">
              Mailed worldwide on heavy 300gsm cream stock
            </span>
          </div>
        </div>

        {/* Right Column: The Proof Exhibit */}
        <div className="lg:col-span-6">
          <HeroExhibit />
        </div>
      </div>
    </section>
  );
}
