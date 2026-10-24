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
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto bg-[#1A2540] text-[#f2e9db] rounded-full p-2.5 sm:p-3 border-[1.5px] border-[#cc2b3f] shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5 pl-3 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#cc2b3f] animate-pulse shrink-0" />
        <div className="min-w-0">
          <span className="font-heading text-xs sm:text-sm text-[#f2e9db] truncate block">
            Rani is waiting · 312 days in care
          </span>
          <span className="font-body text-[10px] text-[#f2e9db]/60 hidden sm:block">
            No-kill shelter · Ready for home
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href="#waiting-board"
          className="btn-enroll-pill px-4 sm:px-5 py-2 text-xs font-bold shadow-xs whitespace-nowrap"
        >
          MEET RANI
        </a>
        <Link
          href="/donate"
          className="px-3.5 sm:px-4 py-2 rounded-full border border-[#f2e9db]/50 bg-white/10 hover:bg-white text-[#f2e9db] hover:text-[#1A2540] font-body text-xs font-bold transition-colors whitespace-nowrap hidden xs:inline-block"
        >
          GIVE A MEAL
        </Link>
      </div>
    </div>
  );
}
