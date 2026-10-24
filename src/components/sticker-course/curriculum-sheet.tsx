"use client";

import React, { useState } from "react";
import { MODULES, CourseModule, ModuleIcon } from "./modules-data";

export default function CurriculumSheet() {
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [peeledState, setPeeledState] = useState<Record<string, boolean>>({});

  const togglePeel = (num: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPeeledState((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <section id="curriculum" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[#cc2b3f] font-heading text-xs tracking-widest uppercase block mb-2 font-bold">
            Physical Object Specification
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            Your sheet: eight modules
          </h2>
          <p className="font-body text-sm sm:text-base text-[#1A2540]/75 mt-3 leading-relaxed">
            A 300gsm cream backing panel containing 8 kiss-cut adhesive modules.
            Peel each badge as you master its lesson and affix it to your workspace lid.
          </p>
        </div>

        {/* The Fresh Kiss-Cut Sheet Product */}
        <div className="relative bg-[#f2e9db] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border-[1.5px] border-[#1A2540]/25">
          {/* Sheet Trim Marks & Production Furniture */}
          <div className="flex items-center justify-between border-b-[1.5px] border-[#1A2540]/20 pb-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#cc2b3f] inline-block" />
              <span className="font-heading text-xs sm:text-sm uppercase tracking-wider text-[#1A2540]">
                Sheet Spec: Standard 240 x 320mm · Matte Vinyl Kiss-Cut
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 font-body text-xs text-[#1A2540]/60">
              <span>8 Badges</span>
              <span>·</span>
              <span>Exact Duration: 9 h 20 m</span>
              <span>·</span>
              <span>Edition of 2026</span>
            </div>
          </div>

          {/* 4x2 Grid (2-up on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MODULES.map((mod, index) => {
              const isPeeled = peeledState[mod.number];
              const isFirst = index === 0;
              const isCrimson = mod.colorway === "crimson";

              return (
                <div
                  key={mod.number}
                  onClick={() => setSelectedModule(mod)}
                  className="group relative cursor-pointer"
                >
                  {/* Outer Kiss-Cut Die-Cut Contour */}
                  <div className="relative p-1.5 sm:p-2 rounded-[22px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] transition-all duration-200 group-hover:border-[#cc2b3f]">
                    {/* Empty Well Beneath (Visible when peeled) */}
                    {isPeeled ? (
                      <div className="w-full aspect-square rounded-2xl p-4 sm:p-5 bg-[#EF9CC0]/10 border-[1.5px] border-dashed border-[#EF9CC0] flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-2xl text-[#EF9CC0] font-black">
                            {mod.number}
                          </span>
                          <span className="font-body text-[10px] text-[#1A2540]/50">
                            Peeled
                          </span>
                        </div>
                        <div>
                          <div className="font-heading text-xs text-[#1A2540] leading-tight">
                            {mod.name}
                          </div>
                          <div className="font-body text-[10px] text-[#cc2b3f] mt-1 font-medium">
                            Completed · {mod.duration}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Chunky Rounded Sticker Badge */
                      <div
                        className={`relative w-full aspect-square rounded-2xl p-4 sm:p-5 border-[1.5px] border-[#1A2540] flex flex-col justify-between shadow-sm transition-transform duration-200 group-hover:-translate-y-1 ${
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
                        {/* Numeral and Line Icon */}
                        <div className="flex items-start justify-between">
                          <span className="font-heading text-3xl sm:text-4xl font-extrabold leading-none tracking-tight">
                            {mod.number}
                          </span>
                          <div className="p-1.5 rounded-lg border border-current/25">
                            <ModuleIcon id={mod.number} className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        </div>

                        {/* Name and Printed Duration */}
                        <div>
                          <div className="font-heading text-sm sm:text-base leading-snug">
                            {mod.name}
                          </div>
                          <div
                            className={`font-body text-xs mt-1.5 font-medium ${
                              isCrimson ? "text-[#f2e9db]/70" : "text-[#cc2b3f]/75"
                            }`}
                          >
                            {mod.duration}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STICKER 01 LIFTED CORNER: Folded triangle & Hatched peel shadow */}
                    {isFirst && !isPeeled && (
                      <>
                        {/* Hatched Peel Shadow under the fold */}
                        <div
                          className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-8 h-8 rounded-br-2xl bg-hatch-pattern pointer-events-none"
                          style={{
                            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                          }}
                        />

                        {/* Folded Flap Triangle */}
                        <div
                          className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-8 h-8 pointer-events-none shadow-md"
                          style={{
                            background: "linear-gradient(135deg, #f2e9db 50%, #cc2b3f 50%)",
                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                            transform: "rotate(180deg)",
                            filter: "drop-shadow(-2px -2px 3px rgba(26, 37, 64, 0.25))",
                          }}
                        />

                        {/* Start Here Callout Badge */}
                        <div className="absolute -bottom-3 -right-2 bg-[#1A2540] text-[#f2e9db] font-body text-[9.5px] font-semibold px-2 py-0.5 rounded-full shadow-md border border-[#f2e9db] pointer-events-none">
                          Peel next
                        </div>
                      </>
                    )}

                    {/* Interactive Peel Button */}
                    <button
                      type="button"
                      onClick={(e) => togglePeel(mod.number, e)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A2540] text-[#f2e9db] text-[9px] font-body font-semibold px-2 py-0.5 rounded-full shadow-sm"
                      title={isPeeled ? "Re-affix sticker to backing" : "Simulate peeling this sticker"}
                    >
                      {isPeeled ? "Re-stick" : "Peel"}
                    </button>
                  </div>

                  {/* Caption underneath badge */}
                  <div className="mt-2 text-center">
                    <span className="font-body text-[11px] text-[#1A2540]/60 group-hover:text-[#cc2b3f] transition-colors">
                      Module {mod.number} &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note inside the sheet */}
          <div className="mt-10 pt-6 border-t-[1.5px] border-[#1A2540]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-body text-xs text-[#1A2540]/70 text-center sm:text-left">
              Click any module to inspect its full curriculum syllabus and video lessons.
            </div>
            <a
              href="#enroll"
              className="btn-enroll-pill px-6 py-2.5 text-xs tracking-wider"
            >
              ENROLL &amp; GET YOUR SHEET
            </a>
          </div>
        </div>

        {/* Modal: Module Details Inspection */}
        {selectedModule && (
          <div
            className="fixed inset-0 z-50 bg-[#1A2540]/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedModule(null)}
          >
            <div
              className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-[2px] border-[#1A2540] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b-[1.5px] border-[#1A2540]/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#cc2b3f] text-[#f2e9db] flex items-center justify-center font-heading text-2xl font-bold">
                    {selectedModule.number}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-[#1A2540] leading-tight">
                      {selectedModule.name}
                    </h3>
                    <div className="font-body text-xs text-[#cc2b3f] font-semibold mt-0.5">
                      {selectedModule.duration} · High-Definition Masterclass
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModule(null)}
                  className="w-8 h-8 rounded-full border border-[#1A2540]/30 text-[#1A2540] flex items-center justify-center font-heading text-sm hover:bg-[#1A2540] hover:text-[#f2e9db] transition-colors"
                >
                  X
                </button>
              </div>

              <p className="font-body text-sm text-[#1A2540]/80 leading-relaxed mb-6">
                {selectedModule.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="font-heading text-xs uppercase tracking-wider text-[#1A2540]">
                  Core Syllabus Topics:
                </div>
                {selectedModule.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 font-body text-xs text-[#1A2540]/85 bg-white/60 p-2.5 rounded-xl border border-[#1A2540]/15"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#cc2b3f] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href="#enroll"
                  onClick={() => setSelectedModule(null)}
                  className="flex-1 btn-enroll-pill py-3 text-center text-xs tracking-wider"
                >
                  ENROLL &amp; GET YOUR SHEET
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedModule(null)}
                  className="px-5 py-3 rounded-full border border-[#1A2540]/40 font-body text-xs font-semibold hover:bg-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
