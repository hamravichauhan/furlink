"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function ShelterNavbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-[#f3c9d5]/95 backdrop-blur-xs border-b-[1.5px] border-[#1A2540]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-4 h-4 rounded-full bg-[#cc2b3f] border-[1.5px] border-[#1A2540] inline-block shrink-0" />
          <span className="font-heading text-xl sm:text-2xl text-[#1A2540] tracking-tight">
            FurLink
          </span>
          <span className="hidden md:inline-block font-body text-xs text-[#1A2540]/60 ml-2 border-l-[1.5px] border-[#1A2540]/30 pl-2">
            No-Kill Rescue &amp; Adoption
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 font-body text-xs text-[#1A2540] font-medium">
          <Link href="/adoptions" className="hover:text-[#cc2b3f] transition-colors">
            Adoptions
          </Link>
          <Link href="/donate" className="hover:text-[#cc2b3f] transition-colors">
            Medical Fund
          </Link>
          <Link href="/rescues" className="hover:text-[#cc2b3f] transition-colors">
            Emergency Dispatch
          </Link>
          <Link href="/stories" className="hover:text-[#cc2b3f] transition-colors">
            Recovery Stories
          </Link>
          <Link href="/sterilization" className="hover:text-[#cc2b3f] transition-colors">
            ABC / TNVR
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-2.5 pl-2">
              <Link
                href="/profile"
                className="font-body text-xs font-semibold text-[#1A2540] hover:text-[#cc2b3f] hidden sm:inline"
              >
                {user?.firstName || "Profile"}
              </Link>
              <UserButton />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="font-body text-xs text-[#1A2540] font-semibold hover:text-[#cc2b3f] px-2.5 py-1"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/#waiting-board"
            className="btn-enroll-pill px-4 sm:px-5 py-2 text-xs font-bold shadow-sm hidden sm:inline-block"
          >
            ADOPT OR DONATE
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg border border-[#1A2540]/30 hover:bg-white/40 transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#1A2540]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f2e9db] border-b-2 border-[#1A2540] px-4 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-body text-sm font-semibold text-[#1A2540]">
            <Link
              href="/adoptions"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1 border-b border-[#1A2540]/10"
            >
              Adoptions
            </Link>
            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1 border-b border-[#1A2540]/10"
            >
              Medical Fund
            </Link>
            <Link
              href="/rescues"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1 border-b border-[#1A2540]/10"
            >
              Emergency Dispatch
            </Link>
            <Link
              href="/stories"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1 border-b border-[#1A2540]/10"
            >
              Recovery Stories
            </Link>
            <Link
              href="/sterilization"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1 border-b border-[#1A2540]/10"
            >
              ABC / TNVR
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#cc2b3f] py-1"
            >
              My Account / Profile
            </Link>
          </nav>

          <div className="pt-2 border-t border-[#1A2540]/20">
            <Link
              href="/#waiting-board"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-enroll-pill w-full text-center py-2.5 text-xs font-bold shadow-sm block"
            >
              ADOPT OR DONATE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
