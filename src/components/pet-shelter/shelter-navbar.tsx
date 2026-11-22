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
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            className="w-8 h-8 text-[#163829]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm12 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 3c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span className="font-heading text-2xl font-black text-[#163829] tracking-tight">
            pawpals
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-body text-sm text-[#163829]/80 font-medium">
          <Link href="/adoptions" className="hover:text-[#163829] transition-colors">
            Adopt
          </Link>
          <Link href="#care-guides" className="hover:text-[#163829] transition-colors">
            Pet Care
          </Link>
          <Link href="/sterilization" className="hover:text-[#163829] transition-colors">
            Services
          </Link>
          <Link href="/stories" className="hover:text-[#163829] transition-colors">
            About us
          </Link>
          <Link href="/rescues" className="hover:text-[#163829] transition-colors">
            Contact
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
            href="/adoptions"
            className="hidden sm:inline-block bg-[#8A95EB] hover:bg-[#7985DE] text-white font-body text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-xs"
          >
            Start Your Adoption
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
        <div className="md:hidden border-t border-[#E5E9E5] bg-[#F8FAF8] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/adoptions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Adopt
          </Link>
          <Link
            href="#care-guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Pet Care
          </Link>
          <Link
            href="/sterilization"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Services
          </Link>
          <Link
            href="/stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            About us
          </Link>
          <Link
            href="/rescues"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#163829]"
          >
            Admin Panel
          </Link>
          <div className="pt-2">
            <Link
              href="/adoptions"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#8A95EB] text-white font-body text-sm font-semibold py-3 rounded-full"
            >
              Start Your Adoption
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
