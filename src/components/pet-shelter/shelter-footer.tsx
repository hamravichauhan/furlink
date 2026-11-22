import React from "react";
import Link from "next/link";

export default function ShelterFooter() {
  return (
    <footer className="w-full bg-[#163829] text-white py-14 px-4 sm:px-6 md:px-8 border-t border-[#163829]/50">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#74C69D] flex items-center justify-center text-[#163829]">
                <svg
                  className="w-5 h-5 text-[#163829]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm12 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 3c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <span className="font-heading text-2xl font-black text-white tracking-tight">
                FurLink
              </span>
            </div>
            <p className="font-body text-xs text-white/70 mt-1.5">
              Rescue, Adopt &amp; Care · Centralized Animal Welfare Platform · Belagavi, Karnataka
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc2b3f] animate-ping" />
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

        {/* 4 Pillar Columns matching SRS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-2">
          {/* Rescue & Medical Services */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#74C69D]">
              Animal Rescue &amp; TNVR
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-body">
              <li>
                <Link href="/rescues/new" className="hover:text-white transition-colors">
                  Report Emergency Rescue
                </Link>
              </li>
              <li>
                <Link href="/rescues" className="hover:text-white transition-colors">
                  Active Rescue Feed
                </Link>
              </li>
              <li>
                <Link href="/sterilization" className="hover:text-white transition-colors">
                  Sterilization Service (TNVR)
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-white transition-colors">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Adoption & Rehoming */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#74C69D]">
              Adoption &amp; Rehoming
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-body">
              <li>
                <Link href="/adoptions" className="hover:text-white transition-colors">
                  Adoptable Rescued Pets
                </Link>
              </li>
              <li>
                <Link href="/adoptions/new" className="hover:text-white transition-colors">
                  Put Pet Up for Adoption
                </Link>
              </li>
              <li>
                <Link href="#care-guides" className="hover:text-white transition-colors">
                  Pet Care Guides
                </Link>
              </li>
              <li>
                <Link href="#matcher" className="hover:text-white transition-colors">
                  Companion Matchmaker
                </Link>
              </li>
            </ul>
          </div>

          {/* FurStories & Community */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#74C69D]">
              Community &amp; Stories
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-body">
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  FurStories Feed
                </Link>
              </li>
              <li>
                <Link href="/stories/new" className="hover:text-white transition-colors">
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors">
                  Medical Fund Donation
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  My Profile &amp; Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Administration & Transparency */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#74C69D]">
              Administration &amp; Impact
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-body">
              <li>
                <Link href="/admin" className="hover:text-[#74C69D] transition-colors font-semibold">
                  Admin Operations Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-[#74C69D] transition-colors">
                  Sanctuary Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/sterilization" className="hover:text-white transition-colors">
                  Clinical Verifier Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/donations" className="hover:text-white transition-colors">
                  Financial Transparency Ledger
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-white/60">
          <div>
            © 2026 FurLink – Rescue, Adopt &amp; Care. Belagavi, Karnataka.
          </div>
          <div className="flex items-center gap-4">
            <span>Zero Euthanasia No-Kill Charter</span>
            <span>·</span>
            <span>Safe Razorpay Gateways</span>
            <span>·</span>
            <span>MCA Project Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
