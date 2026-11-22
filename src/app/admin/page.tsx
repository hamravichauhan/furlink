import Link from "next/link";
import { getAdminOverviewStats } from "@/actions/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  if (!stats) {
    return (
      <div className="border border-gray-200 rounded-3xl bg-white p-8 text-center">
        <p className="text-sm font-body text-[#163829]/70">
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
    <div className="space-y-8">
      {/* Urgent Action Alert Card */}
      {attention > 0 && (
        <div className="border border-rose-200 bg-rose-50/80 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc2b3f] animate-ping" />
            <span className="font-heading font-black text-lg sm:text-xl text-rose-950">
              {attention} item{attention === 1 ? "" : "s"} require urgent administrative action
            </span>
          </div>
          <ul className="text-xs sm:text-sm font-body text-rose-900 mt-3 space-y-2">
            {stats.sterilization.proofSubmitted > 0 && (
              <li>
                <Link
                  href="/admin/verifications"
                  className="hover:underline font-semibold text-[#cc2b3f] inline-flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>
                    {stats.sterilization.proofSubmitted} TNVR proof
                    {stats.sterilization.proofSubmitted === 1 ? "" : "s"} awaiting verification
                  </span>
                </Link>
              </li>
            )}
            {stats.sterilization.disputed > 0 && (
              <li>
                <Link
                  href="/admin/verifications"
                  className="hover:underline font-semibold text-[#cc2b3f] inline-flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>
                    {stats.sterilization.disputed} disputed TNVR proof
                    {stats.sterilization.disputed === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            )}
            {stats.rescues.open > 0 && (
              <li>
                <Link
                  href="/admin/rescues"
                  className="hover:underline font-semibold text-[#163829] inline-flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>
                    {stats.rescues.open} open emergency field rescue
                    {stats.rescues.open === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            )}
            {stats.adoptions.pendingApplications > 0 && (
              <li>
                <Link
                  href="/admin/adoptions"
                  className="hover:underline font-semibold text-[#163829] inline-flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>
                    {stats.adoptions.pendingApplications} pending adoption dossier
                    {stats.adoptions.pendingApplications === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* 4 Metric Tiles in FurLink Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricTile
          label="Guardians"
          value={stats.users.total}
          sub={`${stats.users.admins} admin · ${stats.users.verifiers} verifier`}
          href="/admin/users"
          badgeBg="bg-[#D8F3DC]"
          badgeColor="text-[#163829]"
        />
        <MetricTile
          label="Sterilizations"
          value={stats.sterilization.total}
          sub={`${stats.sterilization.verified} verified · ${stats.sterilization.pending + stats.sterilization.scheduled} active`}
          href="/admin/sterilization"
          badgeBg="bg-[#E8F5E9]"
          badgeColor="text-[#1B5E20]"
        />
        <MetricTile
          label="Field Rescues"
          value={stats.rescues.total}
          sub={`${stats.rescues.open} open · ${stats.rescues.inProgress} active`}
          href="/admin/rescues"
          badgeBg="bg-rose-100"
          badgeColor="text-[#cc2b3f]"
        />
        <MetricTile
          label="Medical Donations"
          value={`₹${stats.donations.total.toLocaleString("en-IN")}`}
          sub={`${stats.donations.count} transaction${stats.donations.count === 1 ? "" : "s"}`}
          href="/admin/donations"
          badgeBg="bg-[#ECEEFD]"
          badgeColor="text-[#4F5BD5]"
        />
      </div>

      {/* Two Operations Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sterilization Pipeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg sm:text-xl font-black text-[#163829]">
              Sterilization Pipeline Status
            </h2>
            <Link
              href="/admin/sterilization"
              className="font-body text-xs text-[#163829]/70 hover:text-[#163829] font-semibold"
            >
              View All &rarr;
            </Link>
          </div>
          <StatusList
            items={[
              {
                label: "Pending (awaiting rescuer)",
                value: stats.sterilization.pending,
                color: "text-[#163829]",
              },
              {
                label: "Scheduled with clinic",
                value: stats.sterilization.scheduled,
                color: "text-blue-700 font-semibold",
              },
              {
                label: "Proof submitted (pending review)",
                value: stats.sterilization.proofSubmitted,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Verified & settled",
                value: stats.sterilization.verified,
                color: "text-emerald-700 font-bold",
              },
              {
                label: "Disputed",
                value: stats.sterilization.disputed,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Cancelled",
                value: stats.sterilization.cancelled,
                color: "text-gray-400",
              },
            ]}
          />
        </div>

        {/* Sanctuary Operations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg sm:text-xl font-black text-[#163829]">
              Sanctuary Operations Census
            </h2>
            <Link
              href="/admin/adoptions"
              className="font-body text-xs text-[#163829]/70 hover:text-[#163829] font-semibold"
            >
              Manage &rarr;
            </Link>
          </div>
          <StatusList
            items={[
              {
                label: "Pets on registry",
                value: stats.adoptions.pets,
                color: "text-[#163829] font-semibold",
              },
              {
                label: "Animals waiting for adoption",
                value: stats.adoptions.available,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Adoption applications logged",
                value: stats.adoptions.applications,
                color: "text-[#163829]",
              },
              {
                label: "Pending application review",
                value: stats.adoptions.pendingApplications,
                color: "text-[#cc2b3f] font-bold",
              },
              {
                label: "Emergency rescues reported",
                value: stats.rescues.total,
                color: "text-[#163829]",
              },
              {
                label: "Rescues resolved safely",
                value: stats.rescues.resolved,
                color: "text-emerald-700 font-bold",
              },
            ]}
          />
        </div>
      </div>

      {/* Quick Management Portals Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
        <h2 className="font-heading text-lg sm:text-xl font-black text-[#163829] mb-4">
          Quick Management Portals
        </h2>
        <div className="flex flex-wrap gap-2.5 font-body text-xs font-semibold">
          <Link
            href="/admin/analytics"
            className="btn-paw-primary px-5 py-2.5 shadow-xs"
          >
            Analytics &amp; Impact
          </Link>
          <Link
            href="/admin/rescues"
            className="bg-[#D8F3DC] text-[#163829] hover:bg-[#bceac2] px-5 py-2.5 rounded-full transition"
          >
            Manage Rescues
          </Link>
          <Link
            href="/admin/adoptions"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-5 py-2.5 rounded-full transition"
          >
            Review Adoptions
          </Link>
          <Link
            href="/admin/sterilization"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-5 py-2.5 rounded-full transition"
          >
            Sterilization Pipeline
          </Link>
          <Link
            href="/admin/donations"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-5 py-2.5 rounded-full transition"
          >
            Donation Records
          </Link>
          <Link
            href="/admin/stories"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-5 py-2.5 rounded-full transition"
          >
            Moderate FurStories
          </Link>
          <Link
            href="/admin/users"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-5 py-2.5 rounded-full transition"
          >
            User Roles
          </Link>
          <Link
            href="/admin/verifications"
            className="bg-[#cc2b3f] hover:bg-[#b02234] text-white px-5 py-2.5 rounded-full transition shadow-xs"
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
  badgeBg,
  badgeColor,
}: {
  label: string;
  value: number | string;
  sub: string;
  href: string;
  badgeBg: string;
  badgeColor: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-3xl p-6 border border-gray-200/80 hover:border-[#163829] hover:shadow-md transition-all block shadow-xs group"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badgeBg} ${badgeColor}`}
        >
          {label}
        </span>
        <span className="text-gray-300 group-hover:text-[#163829] transition-colors text-xs">
          &rarr;
        </span>
      </div>
      <div className="font-heading font-black text-3xl sm:text-4xl text-[#163829]">
        {value}
      </div>
      <div className="text-xs font-body text-[#163829]/60 mt-1.5">
        {sub}
      </div>
    </Link>
  );
}

function StatusList({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <ul className="space-y-3 font-body text-xs sm:text-sm">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center justify-between border-b border-gray-100 pb-2"
        >
          <span className="text-[#163829]/75">{item.label}</span>
          <span className={`font-semibold ${item.color}`}>
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
