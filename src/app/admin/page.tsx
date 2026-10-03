import Link from "next/link";
import { getAdminOverviewStats } from "@/actions/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  if (!stats) {
    return (
      <div className="border rounded-lg bg-white p-6">
        <p className="text-sm text-gray-600">
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
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
          <div className="font-semibold text-amber-900">
            {attention} item{attention === 1 ? "" : "s"} need
            {attention === 1 ? "s" : ""} attention
          </div>
          <ul className="text-sm text-amber-800 mt-2 space-y-1">
            {stats.sterilization.proofSubmitted > 0 && (
              <li>
                <Link href="/verify" className="hover:underline">
                  → {stats.sterilization.proofSubmitted} proof
                  {stats.sterilization.proofSubmitted === 1 ? "" : "s"} awaiting
                  verification
                </Link>
              </li>
            )}
            {stats.sterilization.disputed > 0 && (
              <li>
                <Link
                  href="/verify?status=DISPUTED"
                  className="hover:underline"
                >
                  → {stats.sterilization.disputed} disputed proof
                  {stats.sterilization.disputed === 1 ? "" : "s"}
                </Link>
              </li>
            )}
            {stats.rescues.open > 0 && (
              <li>
                <Link href="/rescues" className="hover:underline">
                  → {stats.rescues.open} open rescue
                  {stats.rescues.open === 1 ? "" : "s"}
                </Link>
              </li>
            )}
            {stats.adoptions.pendingApplications > 0 && (
              <li>
                <Link href="/admin/adoptions" className="hover:underline">
                  → {stats.adoptions.pendingApplications} pending adoption
                  application
                  {stats.adoptions.pendingApplications === 1 ? "" : "s"}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Users"
          value={stats.users.total}
          sub={`${stats.users.admins} admin · ${stats.users.verifiers} verifier · ${stats.users.regular} user`}
          href="/admin/users"
          tone="blue"
        />
        <MetricTile
          label="Sterilizations"
          value={stats.sterilization.total}
          sub={`${stats.sterilization.verified} verified · ${stats.sterilization.pending + stats.sterilization.scheduled} active`}
          href="/sterilization"
          tone="emerald"
        />
        <MetricTile
          label="Rescues"
          value={stats.rescues.total}
          sub={`${stats.rescues.open} open · ${stats.rescues.inProgress} in progress`}
          href="/rescues"
          tone="amber"
        />
        <MetricTile
          label="Donations"
          value={`₹${stats.donations.total.toLocaleString("en-IN")}`}
          sub={`${stats.donations.count} donation${stats.donations.count === 1 ? "" : "s"}`}
          href="/donate"
          tone="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg bg-white p-5">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-600">
            Sterilization pipeline
          </h2>
          <StatusList
            items={[
              {
                label: "Pending (awaiting rescuer)",
                value: stats.sterilization.pending,
                color: "text-amber-700",
              },
              {
                label: "Scheduled",
                value: stats.sterilization.scheduled,
                color: "text-blue-700",
              },
              {
                label: "Proof submitted",
                value: stats.sterilization.proofSubmitted,
                color: "text-purple-700",
              },
              {
                label: "Verified",
                value: stats.sterilization.verified,
                color: "text-emerald-700",
              },
              {
                label: "Disputed",
                value: stats.sterilization.disputed,
                color: "text-rose-700",
              },
              {
                label: "Cancelled",
                value: stats.sterilization.cancelled,
                color: "text-gray-500",
              },
            ]}
          />
        </div>

        <div className="border rounded-lg bg-white p-5">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-600">
            Operations
          </h2>
          <StatusList
            items={[
              {
                label: "Pets listed",
                value: stats.adoptions.pets,
                color: "text-gray-800",
              },
              {
                label: "Pets available",
                value: stats.adoptions.available,
                color: "text-emerald-700",
              },
              {
                label: "Adoption applications",
                value: stats.adoptions.applications,
                color: "text-gray-800",
              },
              {
                label: "Pending application review",
                value: stats.adoptions.pendingApplications,
                color: "text-amber-700",
              },
              {
                label: "Rescues reported",
                value: stats.rescues.total,
                color: "text-gray-800",
              },
              {
                label: "Rescues resolved",
                value: stats.rescues.resolved,
                color: "text-emerald-700",
              },
            ]}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="font-semibold mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Manage user roles
          </Link>
          <Link
            href="/verify"
            className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Verification queue
          </Link>
          <Link
            href="/sterilization"
            className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Sterilization feed
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
  tone,
}: {
  label: string;
  value: number | string;
  sub: string;
  href: string;
  tone: "blue" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
    amber: "bg-amber-50 border-amber-200",
    rose: "bg-rose-50 border-rose-200",
  };
  return (
    <Link
      href={href}
      className={`border rounded-lg p-5 hover:shadow-md transition block ${tones[tone]}`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-gray-600">
        {label}
      </div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </Link>
  );
}

function StatusList({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">{item.label}</span>
          <span className={`text-sm font-semibold ${item.color}`}>
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
