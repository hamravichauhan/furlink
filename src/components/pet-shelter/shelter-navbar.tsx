"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function ShelterNavbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-[#F8FAF8]/90 backdrop-blur-md border-b border-[#E5E9E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Wordmark Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#163829] flex items-center justify-center text-[#74C69D] shadow-xs group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-[#74C69D]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm12 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 3c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-black text-[#163829] tracking-tight leading-none">
              FurLink
            </span>
            <span className="font-body text-[10px] font-bold text-[#163829]/70 tracking-wider uppercase mt-0.5">
              Rescue · Adopt · Care
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation - SRS 5 Core Modules */}
        <nav className="hidden md:flex items-center gap-7 font-body text-sm text-[#163829]/80 font-medium">
          <Link href="/adoptions" className="hover:text-[#163829] transition-colors">
            Adopt
          </Link>
          <Link href="/rescues" className="hover:text-[#163829] transition-colors">
            Rescue
          </Link>
          <Link href="/sterilization" className="hover:text-[#163829] transition-colors">
            Sterilization
          </Link>
          <Link href="/donate" className="hover:text-[#163829] transition-colors">
            Donate
          </Link>
          <Link href="/stories" className="hover:text-[#163829] transition-colors">
            FurStories
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="font-body text-xs font-semibold text-[#163829] bg-[#D8F3DC] px-2.5 py-1 rounded-full hover:bg-[#b8e8be] transition"
              >
                Admin
              </Link>
              <Link
                href="/profile"
                className="font-body text-xs font-semibold text-[#163829] hidden sm:inline"
              >
                {user?.firstName || "Profile"}
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="font-body text-xs text-[#163829]/70 hover:text-[#163829] px-2 py-1"
              >
                Admin Portal
              </Link>
              <Link
                href="/sign-in"
                className="font-body text-xs text-[#163829] font-medium hover:text-[#163829]/70 px-2 py-1"
              >
                Sign In
              </Link>
            </div>
          )}

          <Link
            href="/rescues/new"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#cc2b3f] hover:bg-[#b02234] text-white font-body text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Report Rescue
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-[#163829] hover:bg-black/5 transition"
          >
            <svg
              className="w-6 h-6"
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E9E5] bg-[#F8FAF8] px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/adoptions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Adopt
          </Link>
          <Link
            href="/rescues"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Animal Rescue Feed
          </Link>
          <Link
            href="/sterilization"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Sterilization (TNVR)
          </Link>
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Donate / Medical Fund
          </Link>
          <Link
            href="/stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            FurStories
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Verify Certificate
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Admin Portal
          </Link>
          <div className="pt-2 space-y-2">
            <Link
              href="/rescues/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#cc2b3f] text-white font-body text-sm font-semibold py-3 rounded-full"
            >
              Report Emergency Rescue
            </Link>
            <Link
              href="/adoptions"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#8A95EB] text-white font-body text-sm font-semibold py-3 rounded-full"
            >
              Browse Adoptable Pets
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
