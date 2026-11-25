import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AdminNavTabs from "./admin-nav-tabs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateCurrentUser();

  // If not logged in, redirect to sign-in with return URL
  if (!user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // If logged in with an account, require ADMIN role
  if (!hasRole(user, "ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#163829]">
      {/* Top Dedicated Admin Navigation Bar */}
      <div className="border-b border-[#E5E9E5] bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-8 py-3 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-body font-semibold text-[#163829]/75 hover:text-[#163829] transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-[#F8FAF8] border border-gray-200 flex items-center justify-center text-[10px]">
                ←
              </span>
              <span>Back to Public Website</span>
            </Link>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-2 text-[#163829]/65 font-body text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#74C69D] inline-block animate-pulse" />
              <span>Sanctuary SQLite Database · Belagavi</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2 bg-[#D8F3DC] px-3 py-1 rounded-full border border-[#bceac2]">
              <span className="bg-[#163829] text-white font-body font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                ADMIN
              </span>
              <span className="text-[#163829] font-body font-semibold truncate max-w-[200px]">
                {user.name || user.email}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
              <Link
                href="/adoptions/new"
                className="bg-[#163829] hover:bg-[#0D2818] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                title="Register Pet for Adoption"
              >
                + Pet
              </Link>
              <Link
                href="/rescues/new"
                className="bg-[#cc2b3f] hover:bg-[#b02234] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                title="File Emergency Rescue"
              >
                + Rescue
              </Link>
              <Link
                href="/stories/new"
                className="bg-white border border-gray-200 hover:bg-gray-50 text-[#163829] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors hidden md:inline-block"
                title="Publish Case Story"
              >
                + Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#163829] px-3 py-1 rounded-full text-xs font-bold font-body mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#163829]" />
              <span>FurLink Operations &amp; Sanctuary Management</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#163829] leading-tight">
              Master Admin Console
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
              Clinical records, rescue dispatches, adoption verification, and surgical TNVR audits.
            </p>
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
