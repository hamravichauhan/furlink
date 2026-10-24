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
  if (!hasRole(user, "ADMIN")) redirect("/");

  return (
    <div className="min-h-screen bg-[#f3c9d5] text-[#1A2540]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">
        <div className="mb-8 pb-6 border-b-2 border-[#1A2540] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border-2 border-[#1A2540] bg-[#1A2540] text-[#f2e9db] font-mono text-[9.5px] uppercase tracking-[0.18em] px-2.5 py-0.5 font-bold">
                Master Administration
              </span>
              <span className="font-mono text-xs text-[#1A2540]/70 uppercase tracking-[0.14em]">
                Operator: {user.name || user.email}
              </span>
            </div>
            <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-tight">
              System Administration
            </h1>
          </div>
          <div className="font-mono text-xs text-[#1A2540]/70 uppercase tracking-[0.16em]">
            Clinical Records / Field Logistics / Surgical Audits
          </div>
        </div>

        <AdminNavTabs />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
