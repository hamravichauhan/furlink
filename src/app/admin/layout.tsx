import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import AdminNavTabs from "./admin-nav-tabs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/sign-in");
  if (!hasRole(user, "ADMIN")) redirect("/");

  return (
    <div className="min-h-screen bg-[#f3c9d5] text-[#1A2540]">
      {/* Top Dedicated Admin Navigation Bar */}
      <div className="border-b-2 border-[#1A2540] bg-[#f2e9db] px-4 sm:px-6 md:px-10 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#cc2b3f] hover:underline"
            >
              <span>←</span>
              <span>Return to Public Website</span>
            </Link>
            <span className="text-[#1A2540]/30 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-[#1A2540]/70 uppercase tracking-tight text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Offline SQLite Sanctuary Database</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="bg-[#1A2540] text-[#f2e9db] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">
                ADMIN
              </span>
              <span className="text-[#1A2540]/80 font-bold truncate max-w-[200px]">
                {user.name || user.email}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-[#1A2540]/20">
              <Link
                href="/adoptions/new"
                className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-2.5 py-1 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-colors"
                title="Register Pet for Adoption"
              >
                + Pet
              </Link>
              <Link
                href="/rescues/new"
                className="border border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-2.5 py-1 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-colors"
                title="File Emergency Rescue"
              >
                + Rescue
              </Link>
              <Link
                href="/stories/new"
                className="border border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-2.5 py-1 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-colors hidden md:inline-block"
                title="Publish Case Story"
              >
                + Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8">
        <div className="mb-6 pb-6 border-b-2 border-[#1A2540] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-[#1A2540]/70">
              <span className="w-2 h-2 rounded-full bg-[#cc2b3f]" />
              <span>FurLink Operations &amp; Sanctuary Management</span>
            </div>
            <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-tight">
              Master Admin Console
            </h1>
          </div>
          <div className="font-mono text-xs text-[#1A2540]/70 uppercase tracking-[0.14em]">
            Clinical Records · Rescues · Adoptions · Surgical Verification
          </div>
        </div>

        {/* Cohesive Nav Tabs */}
        <AdminNavTabs />

        {/* Tab Content */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
