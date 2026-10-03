import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import NavbarClientLinks from "./navbar-client-links";

export default async function Navbar() {
  const user = await getOrCreateCurrentUser();

  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-emerald-600"
      >
        🐾 FurLink
      </Link>

      <NavbarClientLinks
        isVerifier={hasRole(user, "VERIFIER")}
        isAdmin={hasRole(user, "ADMIN")}
      />
    </header>
  );
}
