import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import NavbarClientLinks from "./navbar-client-links";
import RoleSwitcher from "./role-switcher";

export default async function Navbar() {
  const user = await getOrCreateCurrentUser();

  return (
    <>
      <RoleSwitcher
        currentRole={user?.role ?? null}
        currentEmail={user?.email ?? null}
      />
      <header className="border-b-[1.5px] border-[#101124] bg-[#FAF8FC] px-6 py-3.5 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="font-display text-2xl sm:text-3xl tracking-tight text-[#101124] group-hover:text-[#314CB6] transition-colors">
              FURLINK
            </span>
            <span className="hidden sm:inline font-mono-meta text-[#6461A0] border-l-[1.5px] border-[#101124] pl-2.5">
              CATALOGUE NO. 24 // HEAL & REHOME
            </span>
          </Link>

          <NavbarClientLinks
            isVerifier={hasRole(user, "VERIFIER")}
            isAdmin={hasRole(user, "ADMIN")}
            user={
              user
                ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                  }
                : null
            }
          />
        </div>
      </header>
    </>
  );
}
