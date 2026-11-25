"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface Props {
  beforeImage?: string;
  afterImage?: string;
  name?: string;
  daysToRecovery?: number;
  quote?: string;
  author?: string;
}

export default function TransformationReveal({
  beforeImage = "/pets/recovery-before.jpg",
  afterImage = "/pets/recovery-after.jpg",
  name = "Bruno",
  daysToRecovery = 45,
  quote = "When we rescued Bruno from the highway bypass, he had a severe hind leg fracture and could not walk. 45 days of clinical casting and nursing later, his cast is off and he smiles with pure joy every morning in his forever home.",
  author = "Pooja & Sameer K., Belagavi",
}: Props) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section id="stories" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 bg-[#F8FAF8]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="font-heading text-xs tracking-widest uppercase text-[#163829] block mb-2 font-bold">
            Real Proof of Care
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#163829] tracking-tight font-black">
            Stories that ended well
          </h2>
          <p className="font-body text-sm sm:text-base text-[#163829]/75 mt-2">
            Drag the slider to witness what happens when acute roadside trauma meets committed medical care and a loving family.
          </p>
        </div>

        {/* Reveal Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Split Comparison Image */}
            <div className="lg:col-span-7">
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize rounded-2xl border border-gray-200 bg-gray-900 shadow-md"
              >
                {/* After Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={afterImage}
                  alt={`${name} happy in home`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#163829] text-white font-body text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                  Day {daysToRecovery}: Healed &amp; Happy in Forever Home
                </div>

                {/* Before Image (Clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beforeImage}
                    alt={`${name} arrival day trauma`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: containerRef.current?.clientWidth || "100%" }}
                  />
                  <div className="absolute top-3 left-3 bg-[#cc2b3f] text-white font-body text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                    Day 01: Trauma Admission &amp; Cast
                  </div>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#163829] border-2 border-white shadow-md flex items-center justify-center font-heading text-xs text-white">
                    ||
                  </div>
                </div>

                {/* Prompt */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#163829]/90 text-white font-body text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full pointer-events-none">
                  Drag slider to inspect transformation
                </div>
              </div>
            </div>

            {/* Right: Adopter Quote & Case Details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="font-heading text-xs uppercase tracking-wider text-[#163829] font-bold flex items-center gap-2">
                  <span>Verified Outcome</span>
                  <span>·</span>
                  <span>{daysToRecovery} Days in Shelter Care</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl text-[#163829] font-black mt-2">
                  The Journey of {name}
                </h3>

                <blockquote className="mt-4 border-l-[3px] border-[#74C69D] pl-4 font-body text-base text-[#163829]/85 italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </blockquote>

                <p className="font-body text-xs text-[#163829]/60 mt-3 font-medium">
                  — {author}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <Link
                  href="/stories"
                  className="px-5 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 font-body text-xs font-bold text-[#163829] transition-colors"
                >
                  Read all recovery cases &rarr;
                </Link>
                <Link
                  href="/donate"
                  className="btn-paw-primary px-5 py-2.5 text-xs font-semibold shadow-xs"
                >
                  Sponsor next rescue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
