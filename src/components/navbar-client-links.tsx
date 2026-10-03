"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/rescues", label: "Report Rescue" },
  { href: "/adoptions", label: "Adopt" },
  { href: "/sterilization", label: "Sterilization" },
  { href: "/donate", label: "Donate" },
  { href: "/stories", label: "FurStories" },
];

interface Props {
  isVerifier: boolean;
  isAdmin: boolean;
}

export default function NavbarClientLinks({ isVerifier, isAdmin }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition ${
              active ? "text-emerald-600" : "hover:text-emerald-600"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      {isVerifier && (
        <Link
          href="/verify"
          className={`transition font-semibold ${
            pathname.startsWith("/verify")
              ? "text-blue-600"
              : "text-blue-600/80 hover:text-blue-600"
          }`}
        >
          🔍 Verify
        </Link>
      )}

      {isAdmin && (
        <Link
          href="/admin"
          className={`transition font-semibold ${
            pathname.startsWith("/admin")
              ? "text-red-600"
              : "text-red-600/80 hover:text-red-600"
          }`}
        >
          ⚙️ Admin
        </Link>
      )}

      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
            Sign In
          </button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </nav>
  );
}
