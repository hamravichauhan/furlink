import { redirect } from "next/navigation";
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
  if (!hasRole(user, "ADMIN")) redirect("/sterilization");

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-[#101124]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">
        <div className="mb-8 pb-6 border-b-[1.5px] border-[#101124] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border-[1.5px] border-[#101124] bg-[#101124] text-[#FAF8FC] font-mono text-[9.5px] uppercase tracking-[0.18em] px-2.5 py-0.5 font-bold">
                Master Administration
              </span>
              <span className="font-mono text-[10.5px] text-[#101124]/60 uppercase tracking-[0.14em]">
                Operator: {user.name || user.email}
              </span>
            </div>
            <h1 className="font-display uppercase text-3xl sm:text-5xl tracking-tight text-[#101124] leading-tight">
              System Administration
            </h1>
          </div>
          <div className="font-mono text-[10.5px] text-[#101124]/60 uppercase tracking-[0.16em]">
            Clinical Records / Field Logistics / Surgical Audits
          </div>
        </div>

        <AdminNavTabs />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
