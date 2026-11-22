import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

const ANIMAL_TAG: Record<string, string> = {
  "Street Dog": "CANINE",
  "Feral Cat": "FELINE",
  Other: "COMMUNITY",
};

const STATUS_STYLE: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  PENDING: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-400",
    label: "Awaiting Dispatch",
  },
  SCHEDULED: {
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-400",
    label: "Scheduled",
  },
  PROOF_SUBMITTED: {
    bg: "bg-purple-100",
    text: "text-purple-900",
    border: "border-purple-400",
    label: "Clinical Review",
  },
  VERIFIED: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-400",
    label: "Verified ABC",
  },
  COMPLETED: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-400",
    label: "Completed",
  },
  DISPUTED: {
    bg: "bg-rose-100",
    text: "text-[#cc2b3f]",
    border: "border-[#cc2b3f]",
    label: "Audit Hold",
  },
  CANCELLED: {
    bg: "bg-gray-50",
    text: "text-gray-400",
    border: "border-gray-200",
    label: "Cancelled",
  },
};

const ALL_STATUSES = [
  "PENDING",
  "SCHEDULED",
  "PROOF_SUBMITTED",
  "VERIFIED",
  "DISPUTED",
  "CANCELLED",
] as const;

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return formatDate(date);
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function SterilizationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status;
  const rawPage = Number(params.page ?? "1");
  const page =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const where =
    statusFilter && ALL_STATUSES.includes(statusFilter as any)
      ? { status: statusFilter as any }
      : {};

  const [total, requests, dbUser, counts] = await Promise.all([
    prisma.sterilizationRequest.count({ where }),
    prisma.sterilizationRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
        rescuer: { select: { id: true, name: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    getOrCreateCurrentUser(),
    prisma.sterilizationRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const countMap: Record<string, number> = {
    ALL: 0,
    PENDING: 0,
    SCHEDULED: 0,
    PROOF_SUBMITTED: 0,
    VERIFIED: 0,
    DISPUTED: 0,
    CANCELLED: 0,
  };
  for (const row of counts) {
    countMap[row.status] = row._count._all;
    countMap.ALL += row._count._all;
  }
  countMap.VERIFIED =
    (countMap.VERIFIED ?? 0) +
    (counts.find((c) => c.status === "COMPLETED")?._count._all ?? 0);

  const tabs = [
    { key: "ALL", label: "All Cases", count: countMap.ALL },
    { key: "PENDING", label: "Awaiting Dispatch", count: countMap.PENDING },
    { key: "SCHEDULED", label: "Scheduled", count: countMap.SCHEDULED },
    {
      key: "PROOF_SUBMITTED",
      label: "Clinical Review",
      count: countMap.PROOF_SUBMITTED,
    },
    { key: "VERIFIED", label: "Verified ABC", count: countMap.VERIFIED },
  ] as const;

  const buildHref = (opts: { status?: string; page?: number }) => {
    const qs = new URLSearchParams();
    const s = opts.status !== undefined ? opts.status : statusFilter;
    const p = opts.page !== undefined ? opts.page : currentPage;
    if (s && s !== "ALL") qs.set("status", s);
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return `/sterilization${str ? `?${str}` : ""}`;
  };

  const isVerifierOrAdmin = hasRole(dbUser, "VERIFIER");

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 sm:py-14 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Modern Masthead */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#163829] px-3.5 py-1.5 rounded-full text-xs font-bold font-body mb-3">
              <span className="w-2 h-2 rounded-full bg-[#163829]" />
              <span>Humane Animal Birth Control (ABC / TNVR) · Belagavi</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-[#163829] tracking-tight font-black">
              Sterilization &amp; Vaccination
            </h1>
            <p className="font-body text-sm sm:text-base text-[#163829]/75 mt-2 leading-relaxed">
              Systematic street animal birth control registry. Rescuers and municipal clinics coordinate safe capture,
              sterile surgery, anti-rabies vaccination, ear-notch marking, and territory release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isVerifierOrAdmin && (
              <Link
                href="/verify"
                className="bg-white hover:bg-gray-50 text-[#163829] border border-gray-200 px-5 py-3 rounded-full font-body text-xs font-semibold transition-colors"
              >
                Verify Clinical Proofs &rarr;
              </Link>
            )}
            <Link
              href="/sterilization/new"
              className="btn-paw-primary px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs"
            >
              + Lodge Field TNVR Request &rarr;
            </Link>
          </div>
        </div>

        {/* Program Impact Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-3xl border border-gray-200/80 divide-x divide-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Awaiting Dispatch
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-amber-700 font-black mt-1 block">
              {countMap.PENDING}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Scheduled Surgery
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-blue-700 font-black mt-1 block">
              {countMap.SCHEDULED}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Clinical Review
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-purple-700 font-black mt-1 block">
              {countMap.PROOF_SUBMITTED}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Verified Sterilized
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-emerald-700 font-black mt-1 block">
              {countMap.VERIFIED}
            </span>
          </div>
        </div>

        {/* Community Audit Alert if Disputed */}
        {countMap.DISPUTED > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-body text-xs text-[#cc2b3f] font-semibold flex items-center justify-between">
            <span>
              [Community Audit Alert] {countMap.DISPUTED} sterilization record{countMap.DISPUTED > 1 ? "s are" : " is"} currently under dispute re-investigation.
            </span>
            <Link
              href="/sterilization?status=DISPUTED"
              className="underline hover:text-[#163829] ml-4 shrink-0 font-bold"
            >
              View Disputed Cases &rarr;
            </Link>
          </div>
        )}

        {/* 3-Step Protocol Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <span className="font-body text-xs font-bold text-[#cc2b3f] uppercase tracking-wider block">
              Step 01 &middot; Field Intake
            </span>
            <h3 className="font-heading text-lg text-[#163829] font-black">
              Citizen Sector Reporting
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#163829]/75 leading-relaxed">
              Identify unnotched dogs or community cat packs. Pinpoint street landmarks and pack census for dispatch.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <span className="font-body text-xs font-bold text-[#cc2b3f] uppercase tracking-wider block">
              Step 02 &middot; Clinical Transport
            </span>
            <h3 className="font-heading text-lg text-[#163829] font-black">
              Sterile Neuter &amp; Rabies Shot
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#163829]/75 leading-relaxed">
              Field rescuers safely secure animals, transport them to certified municipal vet clinics, and oversee surgery.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <span className="font-body text-xs font-bold text-[#cc2b3f] uppercase tracking-wider block">
              Step 03 &middot; Ear-Notch &amp; Return
            </span>
            <h3 className="font-heading text-lg text-[#163829] font-black">
              Territory Safe Release
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#163829]/75 leading-relaxed">
              Clinic uploads surgical certificates. Animals are marked with the universal left ear-tip notch and returned to their home street.
            </p>
          </div>
        </div>

        {/* Surgical Pipeline Registry */}
        <section className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl text-[#163829] font-black">
                Surgical Pipeline Registry
              </h2>
              <p className="font-body text-xs text-gray-500 mt-0.5">
                Live municipal tracking of stray animal birth control procedures.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {total} {total === 1 ? "Record" : "Records"}
              </span>
              <Link
                href="/sterilization/new"
                className="btn-paw-primary px-4 py-1.5 text-xs font-bold rounded-full sm:hidden"
              >
                + New Request
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const isActive =
                (tab.key === "ALL" && !statusFilter) ||
                statusFilter === tab.key;
              const href = buildHref({
                status: tab.key === "ALL" ? undefined : tab.key,
                page: 1,
              });
              return (
                <Link
                  key={tab.key}
                  href={href}
                  className={`font-body text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#163829] text-white shadow-xs"
                      : "bg-white text-[#163829]/75 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab.label} ({tab.count})
                </Link>
              );
            })}
          </div>

          {/* Case Cards Grid */}
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-16 text-center shadow-xs space-y-4 max-w-xl mx-auto">
              <h3 className="font-heading text-2xl text-[#163829] font-black">
                Zero Records for Active Filter
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#163829]/70 leading-relaxed">
                There are no active sterilization cases matching this status filter. You can select another tab or lodge a new community report.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                {statusFilter && (
                  <Link
                    href="/sterilization"
                    className="px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[#163829] font-body text-xs font-semibold hover:bg-gray-50"
                  >
                    View All Cases
                  </Link>
                )}
                <Link
                  href="/sterilization/new"
                  className="btn-paw-primary px-5 py-2.5 text-xs font-semibold"
                >
                  Lodge Field Request &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((item) => {
                const style = STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
                const speciesTag = ANIMAL_TAG[item.animalType] ?? "COMMUNITY";
                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-[#163829] hover:shadow-md transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Bar: Species & Status */}
                      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs font-bold text-[#163829] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full">
                            {speciesTag}
                          </span>
                          <span className="font-body text-xs font-semibold text-[#163829]/70">
                            {item.count === 1 ? "1 Animal" : `Pack of ${item.count}`}
                          </span>
                        </div>

                        <span
                          className={`font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.border} ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </span>
                      </div>

                      {/* Location & Details */}
                      <div>
                        <div className="flex items-start gap-1.5">
                          <svg
                            className="w-4 h-4 text-[#cc2b3f] shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <h3 className="font-heading text-base sm:text-lg text-[#163829] font-black group-hover:text-[#cc2b3f] transition-colors leading-snug line-clamp-2">
                            {item.location}
                          </h3>
                        </div>

                        {item.notes && (
                          <p className="mt-2.5 font-body text-xs text-[#163829]/75 line-clamp-2 bg-[#F8FAF8] p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Operational Status Pill */}
                      <div className="font-body text-[11px] text-[#163829]/70 bg-[#F8FAF8] p-2 rounded-xl border border-gray-100">
                        {item.status === "PENDING" && (
                          <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse block" />
                            <span>Open for rescuer dispatch</span>
                          </div>
                        )}

                        {item.status === "SCHEDULED" && (
                          <div>
                            <span className="font-semibold text-blue-950">
                              Assigned: {item.rescuer?.name || "Field Rescuer"}
                            </span>
                            {item.scheduledAt && (
                              <span className="block text-gray-500 text-[10.5px] mt-0.5">
                                Scheduled: {formatDate(item.scheduledAt)}
                              </span>
                            )}
                          </div>
                        )}

                        {item.status === "PROOF_SUBMITTED" && (
                          <div className="text-purple-950 font-semibold">
                            <span>Clinical proof submitted &middot; Awaiting signoff</span>
                          </div>
                        )}

                        {(item.status === "VERIFIED" || item.status === "COMPLETED") && (
                          <div className="text-emerald-900 font-semibold">
                            <span>Surgery verified &amp; anti-rabies recorded</span>
                          </div>
                        )}

                        {item.status === "DISPUTED" && (
                          <div className="text-[#cc2b3f] font-semibold">
                            <span>Clinical audit under community dispute</span>
                          </div>
                        )}

                        {item.status === "CANCELLED" && (
                          <div className="text-gray-400">
                            <span>Dispatch cancelled</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-body text-gray-500">
                      <div>
                        <span>By {item.user.name || "Citizen"}</span>
                        <span className="mx-1">&middot;</span>
                        <span>{timeAgo(item.createdAt)}</span>
                      </div>

                      <Link
                        href={`/sterilization/${item.id}`}
                        className="font-heading text-xs font-bold text-[#163829] group-hover:underline inline-flex items-center gap-1"
                      >
                        Inspect &rarr;
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 flex items-center justify-between font-body text-xs font-semibold shadow-xs">
              <Link
                href={buildHref({ page: currentPage - 1 })}
                className={`px-4 py-2 rounded-full border border-gray-200 bg-white text-[#163829] ${
                  currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
                }`}
              >
                &larr; Previous Page
              </Link>
              <span className="text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Link
                href={buildHref({ page: currentPage + 1 })}
                className={`px-4 py-2 rounded-full border border-gray-200 bg-white text-[#163829] ${
                  currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
                }`}
              >
                Next Page &rarr;
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
