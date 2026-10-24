import React from "react";
import Link from "next/link";

export default function ShelterFooter() {
  return (
    <footer className="w-full bg-[#f2e9db] text-[#1A2540] border-t-[1.5px] border-[#1A2540]/25 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1A2540]/20">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#cc2b3f] border-[1.5px] border-[#1A2540] inline-block shrink-0" />
              <span className="font-heading text-xl text-[#1A2540] tracking-tight">
                FurLink Animal Welfare Alliance
              </span>
            </div>
            <p className="font-body text-xs text-[#1A2540]/65 mt-1">
              Registered 501(c)(3) &amp; Section 80G Non-Profit Sanctuary · Belagavi, Karnataka
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#1A2540]/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc2b3f] animate-ping" />
            <div>
              <div className="font-heading text-[11px] uppercase tracking-wider text-[#cc2b3f] font-bold">
                24/7 Roadside Trauma Dispatch
              </div>
              <div className="font-body text-xs font-bold text-[#1A2540]">
                +91 94812 00000
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-body text-xs text-[#1A2540]/70">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/adoptions" className="hover:text-[#cc2b3f] transition-colors">
              Waiting Wall
            </Link>
            <Link href="/donate" className="hover:text-[#cc2b3f] transition-colors">
              Direct Medical Fund
            </Link>
            <Link href="/rescues" className="hover:text-[#cc2b3f] transition-colors">
              Emergency Dispatch Feed
            </Link>
            <Link href="/stories" className="hover:text-[#cc2b3f] transition-colors">
              Recovery Stories
            </Link>
            <Link href="/sterilization" className="hover:text-[#cc2b3f] transition-colors">
              Humane TNVR Registry
            </Link>
          </div>

          <div>
            © 2026 FurLink Sanctuary · Every animal has a name before a number.
          </div>
        </div>
      </div>
    </footer>
  );
}
