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
  beforeImage = "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80",
  afterImage = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
  name = "Chotu",
  daysToRecovery = 114,
  quote = "The day we brought Chotu home, he didn't know what carpet felt like. Now he curls up between us on the sofa every evening like he's always belonged there.",
  author = "Ananya & Rohan K., Bangalore",
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
    <section id="stories" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="font-heading text-xs tracking-widest uppercase text-[#cc2b3f] block mb-2 font-bold">
            Real Proof of Care
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            Stories that ended well
          </h2>
          <p className="font-body text-sm sm:text-base text-[#1A2540]/75 mt-2">
            Drag the slider to witness what happens when acute roadside trauma meets committed medical care and a loving family.
          </p>
        </div>

        {/* Reveal Card */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Split Comparison Image */}
            <div className="lg:col-span-7">
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize rounded-2xl border-[1.5px] border-[#1A2540] bg-[#1A2540] shadow-md"
              >
                {/* After Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={afterImage}
                  alt={`${name} happy in home`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#1A2540] text-[#f2e9db] font-body text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                  Day 114: In Permanent Home
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
                  <div className="absolute top-3 left-3 bg-[#cc2b3f] text-[#f2e9db] font-body text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                    Day 01: Roadside Admission
                  </div>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1A2540] border-2 border-white shadow-md flex items-center justify-center font-heading text-xs text-white">
                    ||
                  </div>
                </div>

                {/* Prompt */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1A2540]/90 text-white font-body text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full pointer-events-none">
                  Drag slider to inspect transformation
                </div>
              </div>
            </div>

            {/* Right: Adopter Quote & Case Details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold flex items-center gap-2">
                  <span>Verified Outcome</span>
                  <span>·</span>
                  <span>{daysToRecovery} Days in Shelter Care</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540] mt-2">
                  The Journey of {name}
                </h3>

                <blockquote className="mt-4 border-l-[3px] border-[#cc2b3f] pl-4 font-body text-base text-[#1A2540]/85 italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </blockquote>

                <p className="font-body text-xs text-[#1A2540]/60 mt-3 font-medium">
                  — {author}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1A2540]/15 flex flex-wrap gap-3">
                <Link
                  href="/stories"
                  className="px-5 py-2.5 rounded-full border border-[#1A2540] bg-white hover:bg-[#FAF8FC] font-body text-xs font-bold text-[#1A2540] transition-colors"
                >
                  Read all recovery cases &rarr;
                </Link>
                <Link
                  href="/donate"
                  className="btn-enroll-pill px-5 py-2.5 text-xs font-bold shadow-xs"
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
