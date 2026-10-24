"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 pointer-events-none ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#101124] text-[#FAF8FC] border-t-[1.5px] border-[#314CB6] px-5 py-3 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#0A81D1] animate-pulse" />
            <span className="font-mono-meta text-[#EFBDEB]">
              CATALOGUE REGISTRY: 14 INDIVIDUALS CURRENTLY WAITING
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="font-mono-meta px-4 py-2 border-[1.5px] border-[#EFBDEB] text-[#EFBDEB] hover:bg-[#EFBDEB] hover:text-[#101124] transition font-bold"
            >
              Give a Meal
            </Link>
            <Link
              href="/adoptions"
              className="font-mono-meta px-5 py-2 bg-[#314CB6] hover:bg-[#0A81D1] text-[#FAF8FC] border-[1.5px] border-[#314CB6] hover:border-[#0A81D1] transition font-bold"
            >
              Adopt a Rescue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
