"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ShelterStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 480);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto bg-[#163829] text-white rounded-full p-2.5 sm:p-3 border border-white/20 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5 pl-3 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#74C69D] animate-pulse shrink-0" />
        <div className="min-w-0">
          <span className="font-heading text-xs sm:text-sm text-white truncate block font-bold">
            Pancho is waiting · Ready for adoption
          </span>
          <span className="font-body text-[10px] text-white/70 hidden sm:block">
            No-kill sanctuary · Medically certified
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href="#adoptable-pets"
          className="bg-[#8A95EB] hover:bg-[#7985DE] text-white px-4 sm:px-5 py-2 text-xs font-semibold rounded-full shadow-xs whitespace-nowrap transition"
        >
          Meet Pets
        </a>
        <Link
          href="/donate"
          className="px-3.5 sm:px-4 py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white text-white hover:text-[#163829] font-body text-xs font-semibold transition-colors whitespace-nowrap hidden xs:inline-block"
        >
          Sponsor Meal
        </Link>
      </div>
    </div>
  );
}
