import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/sign-in");
  if (!hasRole(user, "ADMIN")) redirect("/sterilization");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        </div>

        <nav className="flex gap-1 mb-8 border-b overflow-x-auto">
          <AdminNavLink href="/admin">Overview</AdminNavLink>
          <AdminNavLink href="/admin/users">Users</AdminNavLink>
          <AdminNavLink href="/admin/verifications">Verifications</AdminNavLink>
        </nav>

        {children}
      </div>
    </div>
  );
}

function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap transition"
    >
      {children}
    </Link>
  );
}
