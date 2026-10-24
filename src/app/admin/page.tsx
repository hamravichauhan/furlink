import Link from "next/link";
import { getAdminOverviewStats } from "@/actions/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  if (!stats) {
    return (
      <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6">
        <p className="text-sm font-mono text-[#1A2540]">
          You don&apos;t have admin access to this page.
        </p>
      </div>
    );
  }

  const attention =
    stats.sterilization.proofSubmitted +
    stats.sterilization.disputed +
    stats.rescues.open +
    stats.adoptions.pendingApplications;

  return (
    <div className="space-y-6">
      {attention > 0 && (
        <div className="border-2 border-[#cc2b3f] bg-white rounded-2xl p-5 shadow-sm">
          <div className="font-heading font-black uppercase tracking-wide text-[#cc2b3f] text-lg">
            {attention} item{attention === 1 ? "" : "s"} require urgent administrative action
          </div>
          <ul className="text-xs font-mono text-[#1A2540] mt-3 space-y-1.5 uppercase tracking-wider">
            {stats.sterilization.proofSubmitted > 0 && (
              <li>
                <Link href="/verify" className="hover:underline font-bold text-[#cc2b3f]">
                  → {stats.sterilization.proofSubmitted} proof
                  {stats.sterilization.proofSubmitted === 1 ? "" : "s"} awaiting verification
                </Link>
              </li>
            )}
            {stats.sterilization.disputed > 0 && (
              <li>
                <Link
                  href="/verify?status=DISPUTED"
                  className="hover:underline font-bold text-[#cc2b3f]"
                >
                  → {stats.sterilization.disputed} disputed proof
                  {stats.sterilization.disputed === 1 ? "" : "s"}
                </Link>
              </li>
            )}
            {stats.rescues.open > 0 && (
              <li>
                <Link href="/admin/rescues" className="hover:underline font-bold text-[#1A2540]">
                  → {stats.rescues.open} open field rescue
                  {stats.rescues.open === 1 ? "" : "s"}
                </Link>
              </li>
            )}
            {stats.adoptions.pendingApplications > 0 && (
              <li>
                <Link href="/admin/adoptions" className="hover:underline font-bold text-[#1A2540]">
                  → {stats.adoptions.pendingApplications} pending adoption dossier
                  {stats.adoptions.pendingApplications === 1 ? "" : "s"}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Guardians"
          value={stats.users.total}
          sub={`${stats.users.admins} admin · ${stats.users.verifiers} verifier`}
          href="/admin/users"
        />
        <MetricTile
          label="Sterilizations"
          value={stats.sterilization.total}
          sub={`${stats.sterilization.verified} verified · ${stats.sterilization.pending + stats.sterilization.scheduled} active`}
          href="/admin/sterilization"
        />
        <MetricTile
          label="Field Rescues"
          value={stats.rescues.total}
          sub={`${stats.rescues.open} open · ${stats.rescues.inProgress} active`}
          href="/admin/rescues"
        />
        <MetricTile
          label="Medical Donations"
          value={`₹${stats.donations.total.toLocaleString("en-IN")}`}
          sub={`${stats.donations.count} transaction${stats.donations.count === 1 ? "" : "s"}`}
          href="/admin/donations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
          <h2 className="font-heading font-black mb-4 text-base uppercase tracking-wider text-[#1A2540]">
            Sterilization Pipeline Status
          </h2>
          <StatusList
            items={[
              {
                label: "Pending (awaiting rescuer)",
                value: stats.sterilization.pending,
                color: "text-[#1A2540]",
              },
              {
                label: "Scheduled with clinic",
                value: stats.sterilization.scheduled,
                color: "text-[#1A2540]",
              },
              {
                label: "Proof submitted (pending review)",
                value: stats.sterilization.proofSubmitted,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Verified & settled",
                value: stats.sterilization.verified,
                color: "text-[#1A2540] font-bold",
              },
              {
                label: "Disputed",
                value: stats.sterilization.disputed,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Cancelled",
                value: stats.sterilization.cancelled,
                color: "text-[#1A2540]/50",
              },
            ]}
          />
        </div>

        <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
          <h2 className="font-heading font-black mb-4 text-base uppercase tracking-wider text-[#1A2540]">
            Sanctuary Operations
          </h2>
          <StatusList
            items={[
              {
                label: "Pets on registry",
                value: stats.adoptions.pets,
                color: "text-[#1A2540]",
              },
              {
                label: "Animals waiting for adoption",
                value: stats.adoptions.available,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Adoption applications logged",
                value: stats.adoptions.applications,
                color: "text-[#1A2540]",
              },
              {
                label: "Pending application review",
                value: stats.adoptions.pendingApplications,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Emergency rescues reported",
                value: stats.rescues.total,
                color: "text-[#1A2540]",
              },
              {
                label: "Rescues resolved safely",
                value: stats.rescues.resolved,
                color: "text-[#1A2540] font-bold",
              },
            ]}
          />
        </div>
      </div>

      <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
        <h2 className="font-heading uppercase text-xl font-black text-[#1A2540] mb-4">
          Quick Management Portals
        </h2>
        <div className="flex flex-wrap gap-2.5 text-xs font-mono font-bold uppercase tracking-wider">
          <Link
            href="/admin/analytics"
            className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] px-4 py-2.5 rounded-full transition shadow-sm"
          >
            Analytics &amp; Metrics
          </Link>
          <Link
            href="/admin/rescues"
            className="bg-[#1A2540] hover:bg-[#2c3d64] text-[#f2e9db] px-4 py-2.5 rounded-full transition shadow-sm"
          >
            Manage Rescues
          </Link>
          <Link
            href="/admin/adoptions"
            className="border-2 border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-4 py-2 rounded-full transition"
          >
            Review Adoptions
          </Link>
          <Link
            href="/admin/sterilization"
            className="border-2 border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-4 py-2 rounded-full transition"
          >
            Sterilization Pipeline
          </Link>
          <Link
            href="/admin/donations"
            className="border-2 border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-4 py-2 rounded-full transition"
          >
            Donation Records
          </Link>
          <Link
            href="/admin/stories"
            className="border-2 border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-4 py-2 rounded-full transition"
          >
            Moderate Stories
          </Link>
          <Link
            href="/admin/users"
            className="border-2 border-[#1A2540] bg-white hover:bg-[#f2e9db] text-[#1A2540] px-4 py-2 rounded-full transition"
          >
            User Roles
          </Link>
          <Link
            href="/verify"
            className="border-2 border-[#cc2b3f] bg-white text-[#cc2b3f] hover:bg-[#cc2b3f] hover:text-white px-4 py-2 rounded-full transition"
          >
            Verification Queue
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: number | string;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border-2 border-[#1A2540] rounded-2xl p-5 bg-[#f2e9db] hover:border-[#cc2b3f] transition block shadow-sm"
    >
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A2540]/70">
        {label}
      </div>
      <div className="font-heading font-black text-3xl sm:text-4xl mt-1 text-[#1A2540]">{value}</div>
      <div className="text-[11px] font-mono text-[#1A2540]/60 mt-1 uppercase tracking-tight">{sub}</div>
    </Link>
  );
}

function StatusList({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <ul className="space-y-2.5 font-mono text-xs uppercase tracking-wide">
      {items.map((item) => (
        <li key={item.label} className="flex items-baseline justify-between border-b border-[#1A2540]/10 pb-1.5">
          <span className="text-[#1A2540]/80">{item.label}</span>
          <span className={`text-sm ${item.color}`}>
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
