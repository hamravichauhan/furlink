"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface Props {
  beforeImage: string;
  afterImage: string;
  name: string;
  beforeLabel: string;
  afterLabel: string;
  quote: string;
  author: string;
  daysToRecovery: number;
}

export default function BeforeAfterReveal({
  beforeImage,
  afterImage,
  name,
  beforeLabel,
  afterLabel,
  quote,
  author,
  daysToRecovery,
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
    <div className="bg-white border-[1.5px] border-[#101124] p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Split Image */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize border-[1.5px] border-[#101124] bg-[#101124]"
          >
            {/* After Image (Full background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterImage}
              alt={`${name} clinical convalescence outcome`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-[#101124] text-[#FAF8FC] border border-[#FAF8FC] font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-bold z-10">
              {afterLabel}
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeImage}
                alt={`${name} intake presentation`}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.clientWidth || "100%" }}
              />
              <div className="absolute top-3 left-3 bg-[#314CB6] text-white border border-[#101124] font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-bold z-10">
                {beforeLabel}
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#FAF8FC] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-[#101124] border-[1.5px] border-[#FAF8FC] flex items-center justify-center font-mono text-[10px] font-bold text-white">
                //
              </div>
            </div>

            {/* Prompt */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#101124]/90 text-white font-mono text-[9.5px] uppercase tracking-[0.18em] px-3.5 py-1 border border-white/20 pointer-events-none">
              Scrub Horizontal Divider
            </div>
          </div>
        </div>

        {/* Right: Case Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#314CB6] flex items-center gap-2">
              <span>Verified Medical Recovery</span>
              <span>/</span>
              <span>{daysToRecovery} Days Inpatient Care</span>
            </div>

            <h3 className="font-display uppercase text-3xl sm:text-4xl text-[#101124] tracking-tight mt-2 leading-none">
              The Rehabilitation of {name}
            </h3>

            <blockquote className="mt-4 border-l-[3px] border-[#314CB6] pl-4 font-body text-base text-[#101124]/85 italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </blockquote>

            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#101124]/60 mt-3">
              &mdash; {author}
            </p>
          </div>

          <div className="pt-6 border-t-[1.5px] border-[#101124] flex flex-wrap gap-3">
            <Link
              href="/stories"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold px-5 py-2.5 border-[1.5px] border-[#101124] bg-transparent hover:bg-[#FAF8FC] text-[#101124] transition-colors"
            >
              Examine Full Case &rarr;
            </Link>
            <Link
              href="/donate"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold px-5 py-2.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white border-[1.5px] border-[#101124] transition-colors"
            >
              Sponsor Case Recovery &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
