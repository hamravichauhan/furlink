import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { getSterilizationQuota } from "@/actions/sterilization";
import SterilizationForm from "./sterilization-form";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

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
    text: "text-amber-800",
    border: "border-amber-300",
    label: "Awaiting Dispatch",
  },
  SCHEDULED: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    label: "Scheduled",
  },
  PROOF_SUBMITTED: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
    label: "In Review",
  },
  VERIFIED: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
    label: "Verified ABC",
  },
  COMPLETED: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
    label: "Completed",
  },
  DISPUTED: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    border: "border-rose-300",
    label: "Audit Hold",
  },
  CANCELLED: {
    bg: "bg-white",
    text: "text-[#1A2540]/50",
    border: "border-[#1A2540]/30",
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
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

  const [total, requests, dbUser, quota, counts] = await Promise.all([
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
    getSterilizationQuota(),
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

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Humane Animal Birth Control (ABC / TNVR) · Belagavi
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-[#1A2540] tracking-tight">
              Sterilization &amp; Vaccination
            </h1>
            <p className="font-body text-sm sm:text-base text-[#1A2540]/80 max-w-xl mt-2 leading-relaxed">
              Systematic street animal birth control registry. Rescuers and municipal clinics coordinate safe capture,
              sterile surgery, anti-rabies vaccination, ear-notch marking, and territory release.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Request Form */}
          <aside className="lg:col-span-1">
            <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-[#1A2540]/25 shadow-xl lg:sticky lg:top-8 overflow-hidden">
              <div className="p-6 border-b border-[#1A2540]/15">
                <h2 className="font-heading text-2xl text-[#1A2540]">
                  Lodge Field Request
                </h2>
                <p className="font-body text-xs text-[#1A2540]/70 mt-1">
                  Report unsterilized packs in your municipal sector.
                </p>
              </div>
              <div className="p-6">
                {!dbUser ? (
                  <div className="text-center py-6 space-y-3">
                    <p className="font-body text-xs text-[#1A2540]/70">
                      Sign in to submit an emergency sterilization dispatch request.
                    </p>
                    <Link
                      href="/sign-in"
                      className="inline-block btn-enroll-pill px-5 py-2.5 text-xs font-bold"
                    >
                      Sign In &rarr;
                    </Link>
                  </div>
                ) : quota ? (
                  <SterilizationForm
                    quota={{
                      remainingToday: quota.remainingToday,
                      dailyLimit: quota.dailyLimit,
                      canSubmit: quota.canSubmit,
                      reason: quota.reason,
                    }}
                  />
                ) : (
                  <div className="font-body text-xs text-[#1A2540]/60 py-6 text-center">
                    Loading dispatch capacity...
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Feed */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-[#f2e9db] rounded-2xl p-4 sm:p-5 border-[1.5px] border-[#1A2540]/25 shadow-sm flex items-center justify-between">
              <h2 className="font-heading text-xl sm:text-2xl text-[#1A2540]">
                Surgical Pipeline Registry
              </h2>
              <span className="font-body text-xs font-bold text-[#cc2b3f]">
                {total} {total === 1 ? "Record" : "Records"}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
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
                    className={`font-body text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border-[1.5px] transition-colors ${
                      isActive
                        ? "bg-[#cc2b3f] text-[#f2e9db] border-[#cc2b3f] font-bold"
                        : "bg-[#f2e9db] text-[#1A2540]/80 border-[#1A2540]/25 hover:bg-white"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </Link>
                );
              })}
            </div>

            {/* List */}
            {requests.length === 0 ? (
              <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-dashed border-[#1A2540]/30 p-16 text-center shadow-sm space-y-2">
                <h3 className="font-heading text-xl text-[#1A2540]">
                  No records with active filter
                </h3>
                <p className="font-body text-xs text-[#1A2540]/70">
                  Select another filter tab or lodge a new community report.
                </p>
              </div>
            ) : (
              <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-[#1A2540]/25 divide-y border-[#1A2540]/15 shadow-md overflow-hidden">
                {requests.map((item) => {
                  const style =
                    STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
                  return (
                    <Link
                      key={item.id}
                      href={`/sterilization/${item.id}`}
                      className="block p-5 hover:bg-white/60 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-12 rounded-xl border border-[#1A2540]/25 bg-white flex items-center justify-center font-heading text-xs uppercase font-bold text-[#1A2540] shrink-0">
                          {ANIMAL_TAG[item.animalType] ?? "INDIE"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-heading text-lg text-[#1A2540]">
                                  {item.animalType}
                                </span>
                                <span className="font-body text-xs text-[#1A2540]/60">
                                  / {item.count} {item.count === 1 ? "Animal" : "Animals"}
                                </span>
                              </div>

                              <p className="font-body text-xs text-[#1A2540] mt-1 truncate">
                                Sector: {item.location}
                              </p>

                              <div className="mt-2 font-body text-[11px] text-[#1A2540]/70 flex flex-wrap gap-x-3 gap-y-1">
                                {item.status === "SCHEDULED" && item.rescuer && (
                                  <span>
                                    Assigned: {item.rescuer.name || "Rescuer"}
                                    {item.scheduledAt && ` · Target ${formatDate(item.scheduledAt)}`}
                                  </span>
                                )}

                                {item.status === "PROOF_SUBMITTED" && (
                                  <span>
                                    Proof uploaded {item.proofSubmittedAt ? timeAgo(item.proofSubmittedAt) : ""} · In Review
                                  </span>
                                )}

                                {(item.status === "VERIFIED" || item.status === "COMPLETED") && (
                                  <span className="text-emerald-800 font-semibold">
                                    Surgery Verified {formatDate(item.verifiedAt || item.completedAt || item.createdAt)}
                                    {item.rescuer ? ` by ${item.rescuer.name}` : ""}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style.border} ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#1A2540]/10 font-body text-[11px] text-[#1A2540]/60 flex justify-between">
                            <span>Reporter: {item.user.name || "Community Member"}</span>
                            <span>{timeAgo(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-[#f2e9db] rounded-2xl p-4 border-[1.5px] border-[#1A2540]/25 flex items-center justify-between font-body text-xs font-bold">
                <Link
                  href={buildHref({ page: currentPage - 1 })}
                  className={`px-4 py-2 rounded-full border border-[#1A2540] bg-white text-[#1A2540] ${
                    currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[#FAF8FC]"
                  }`}
                >
                  &larr; Previous Page
                </Link>
                <span className="text-[#1A2540]/70">
                  Page {currentPage} of {totalPages}
                </span>
                <Link
                  href={buildHref({ page: currentPage + 1 })}
                  className={`px-4 py-2 rounded-full border border-[#1A2540] bg-white text-[#1A2540] ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-[#FAF8FC]"
                  }`}
                >
                  Next Page &rarr;
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
