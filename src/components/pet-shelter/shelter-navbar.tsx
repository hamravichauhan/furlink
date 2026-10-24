"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import RoleSwitcher from "@/components/role-switcher";

export default function ShelterNavbar() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-[#f3c9d5]/95 backdrop-blur-xs border-b-[1.5px] border-[#1A2540]/20">
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

        {/* Links */}
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
          <RoleSwitcher />

          {isSignedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#1A2540]/20">
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

          <a
            href="#waiting-board"
            className="btn-enroll-pill px-4 sm:px-5 py-2 text-xs font-bold shadow-sm"
          >
            ADOPT OR DONATE
          </a>
        </div>
      </div>
    </header>
  );
}
