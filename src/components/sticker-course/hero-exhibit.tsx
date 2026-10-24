import React from "react";
import { MODULES, ModuleIcon } from "./modules-data";

export default function HeroExhibit() {
  // Placement rotations for the 8 peeled stickers on the laptop lid
  const lidPlacements = [
    { rotate: "-4deg", top: "12%", left: "10%" },
    { rotate: "5deg", top: "8%", left: "54%" },
    { rotate: "-2deg", top: "33%", left: "16%" },
    { rotate: "4deg", top: "30%", left: "58%" },
    { rotate: "3deg", top: "54%", left: "8%" },
    { rotate: "-5deg", top: "52%", left: "52%" },
    { rotate: "-3deg", top: "74%", left: "14%" },
    { rotate: "6deg", top: "72%", left: "56%" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Proof Exhibit Physical Container */}
      <div className="relative w-full max-w-[540px] flex flex-col md:block py-4">
        {/* Layer 1: The Completed Sheet (Underneath, tilted -2.5deg) */}
        <div className="relative md:w-[92%] bg-[#f2e9db] rounded-3xl p-5 sm:p-6 shadow-xl border-[1.5px] border-[#1A2540]/30 transform md:-rotate-2 transition-transform duration-300">
          {/* Header on backing paper */}
          <div className="flex items-center justify-between border-b-[1.5px] border-dashed border-[#EF9CC0] pb-3 mb-4">
            <div>
              <span className="font-heading text-xs tracking-wider uppercase text-[#1A2540]">
                Completed Student Sheet #2041
              </span>
              <p className="font-body text-[11px] text-[#1A2540]/60 mt-0.5">
                All 8 kiss-cut adhesive units removed
              </p>
            </div>
            <span className="font-body text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 border border-[#EF9CC0] text-[#cc2b3f] rounded-full">
              Full Completion
            </span>
          </div>

          {/* 2-Column Grid of 8 Empty Dated Wells */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {MODULES.map((mod) => (
              <div
                key={`well-${mod.number}`}
                className="relative rounded-2xl p-3 border-[1.5px] border-dashed border-[#EF9CC0] bg-[#EF9CC0]/8 flex flex-col justify-between min-h-[96px] sm:min-h-[104px]"
              >
                {/* Faint pink silhouette watermark in background */}
                <div className="absolute right-2.5 top-2.5 opacity-20 text-[#EF9CC0] pointer-events-none">
                  <ModuleIcon id={mod.number} className="w-8 h-8" />
                </div>

                <div className="flex items-start justify-between">
                  <span className="font-heading text-xl text-[#EF9CC0] font-black leading-none">
                    {mod.number}
                  </span>
                  <span className="font-body text-[9.5px] text-[#1A2540]/50 tracking-tight">
                    {mod.duration}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="font-heading text-[12px] sm:text-[13px] text-[#1A2540] leading-tight line-clamp-1">
                    {mod.name}
                  </div>
                  <div className="font-body text-[10px] text-[#1A2540]/70 mt-1 font-medium">
                    Peeled {mod.peelDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: The Navy Laptop Lid (Overlapping, tilted +3.5deg) */}
        <div className="relative mt-6 md:mt-0 md:absolute md:top-12 md:-right-4 md:w-[88%] bg-[#1A2540] rounded-3xl p-5 sm:p-6 shadow-2xl border-[2px] border-[#1A2540] transform md:rotate-3 transition-transform duration-300">
          {/* Laptop lid hardware subtle details: camera notch & label */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A2540]/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f3c9d5]/30 inline-block" />
              <span className="font-body text-[10px] text-[#f2e9db]/50 tracking-wider">
                Aluminum Lid · Verified Application
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#f2e9db]/30" />
          </div>

          {/* 8 Peeled Stickers Carried on the Lid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {MODULES.map((mod, index) => {
              const placement = lidPlacements[index];
              const isCrimson = mod.colorway === "crimson";

              return (
                <div
                  key={`lid-sticker-${mod.number}`}
                  style={{ transform: `rotate(${placement.rotate})` }}
                  className={`rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-[#1A2540] shadow-md transition-transform hover:scale-105 duration-200 cursor-default flex flex-col justify-between min-h-[96px] sm:min-h-[104px] ${
                    isCrimson
                      ? "bg-[#cc2b3f] text-[#f2e9db]"
                      : "bg-[#f2e9db] text-[#cc2b3f] ring-[2px] ring-[#cc2b3f]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg sm:text-xl leading-none">
                      {mod.number}
                    </span>
                    <ModuleIcon id={mod.number} className="w-5 h-5 shrink-0" />
                  </div>

                  <div className="mt-2">
                    <div className="font-heading text-[12px] sm:text-[13px] leading-tight line-clamp-1">
                      {mod.name}
                    </div>
                    <div
                      className={`font-body text-[9.5px] mt-1 ${
                        isCrimson ? "text-[#f2e9db]/70" : "text-[#cc2b3f]/70"
                      }`}
                    >
                      {mod.duration}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* The Checkable Conservation Claim Caption */}
      <div className="mt-6 md:mt-10 text-center px-4">
        <p className="font-body text-xs sm:text-sm text-[#1A2540]/80 italic max-w-md mx-auto">
          &ldquo;Every sticker missing from the sheet is on the lid.&rdquo;
        </p>
        <p className="font-body text-[11px] text-[#1A2540]/55 mt-1">
          Exact 1:1 conservation · Count all 8 empty wells and all 8 lid badges
        </p>
      </div>
    </div>
  );
}
