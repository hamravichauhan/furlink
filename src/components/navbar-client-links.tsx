"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/adoptions", label: "Waiting Row" },
  { href: "/stories", label: "Field Journals" },
  { href: "/rescues", label: "Dispatch Feed" },
  { href: "/sterilization", label: "TNVR Pipeline" },
];

interface Props {
  isVerifier: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
}

export default function NavbarClientLinks({ isVerifier, isAdmin, user }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      <div className="hidden lg:flex items-center gap-5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono-meta transition ${
                active
                  ? "text-[#314CB6] font-bold border-b-[1.5px] border-[#314CB6] pb-0.5"
                  : "text-[#6461A0] hover:text-[#101124]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {isVerifier && (
          <Link
            href="/verify"
            className={`font-mono-meta transition ${
              pathname.startsWith("/verify")
                ? "text-[#0A81D1] font-bold border-b-[1.5px] border-[#0A81D1]"
                : "text-[#6461A0] hover:text-[#101124]"
            }`}
          >
            Review Queue
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/admin"
            className={`font-mono-meta transition ${
              pathname.startsWith("/admin")
                ? "text-[#314CB6] font-bold border-b-[1.5px] border-[#314CB6]"
                : "text-[#B68CB8] hover:text-[#101124]"
            }`}
          >
            Admin Registry
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/donate"
          className="font-mono-meta px-3.5 py-1.5 border-[1.5px] border-[#101124] text-[#101124] hover:bg-[#101124] hover:text-[#EFBDEB] transition"
        >
          Sponsor
        </Link>
        <Link
          href="/adoptions"
          className="font-mono-meta px-4 py-1.5 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] border-[1.5px] border-[#101124] transition font-bold"
        >
          Adopt
        </Link>

        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l-[1.5px] border-[#101124]">
            <Link
              href="/profile"
              className={`font-mono-meta px-2 py-1 transition ${
                pathname === "/profile"
                  ? "text-[#314CB6] font-bold"
                  : "text-[#6461A0] hover:text-[#101124]"
              }`}
            >
              [{user.name?.split(" ")[0] || "Dossier"}]
            </Link>
            <div className="scale-90">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="pl-1">
            <SignInButton mode="modal">
              <button className="font-mono-meta text-[#6461A0] hover:text-[#101124] px-2 py-1">
                Log In
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}
