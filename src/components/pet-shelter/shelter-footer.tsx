import React from "react";
import Link from "next/link";

export default function ShelterFooter() {
  return (
    <footer className="w-full bg-[#163829] text-white py-14 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <svg
                className="w-7 h-7 text-[#74C69D]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm12 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 3c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span className="font-heading text-2xl font-black text-white tracking-tight">
                pawpals · FurLink
              </span>
            </div>
            <p className="font-body text-xs text-white/60 mt-1">
              Certified Humane Animal Welfare &amp; No-Kill Sanctuary · Belagavi, Karnataka
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-[#74C69D] animate-ping" />
            <div>
              <div className="font-heading text-[11px] uppercase tracking-wider text-[#74C69D] font-bold">
                24/7 Roadside Animal Dispatch
              </div>
              <div className="font-body text-xs font-bold text-white">
                +91 94812 00000
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-body text-xs text-white/70">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/adoptions" className="hover:text-white transition-colors">
              Adoptable Pets
            </Link>
            <Link href="/donate" className="hover:text-white transition-colors">
              Medical Fund
            </Link>
            <Link href="/rescues" className="hover:text-white transition-colors">
              Emergency Dispatch Feed
            </Link>
            <Link href="/stories" className="hover:text-white transition-colors">
              Recovery Stories
            </Link>
            <Link href="/sterilization" className="hover:text-white transition-colors">
              Humane TNVR Registry
            </Link>
            <Link href="/admin" className="hover:text-[#74C69D] transition-colors font-semibold">
              Admin Portal
            </Link>
          </div>

          <div>
            © 2026 pawpals · FurLink Sanctuary. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
