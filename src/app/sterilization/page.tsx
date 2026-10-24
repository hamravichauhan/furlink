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
    bg: "bg-[#EFBDEB]/30",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "Awaiting Dispatch",
  },
  SCHEDULED: {
    bg: "bg-[#314CB6]/20",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "Scheduled",
  },
  PROOF_SUBMITTED: {
    bg: "bg-[#6461A0]/25",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "In Review",
  },
  VERIFIED: {
    bg: "bg-[#0A81D1]/25",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "Verified ABC",
  },
  COMPLETED: {
    bg: "bg-[#0A81D1]/25",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "Completed",
  },
  DISPUTED: {
    bg: "bg-[#EFBDEB]/60",
    text: "text-[#101124]",
    border: "border-[#101124]",
    label: "Audit Hold",
  },
  CANCELLED: {
    bg: "bg-white",
    text: "text-[#101124]/50",
    border: "border-[#101124]/30",
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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-[1.5px] border-[#101124] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] font-bold">
              Humane Animal Birth Control (ABC / TNVR)
            </div>
            <h1 className="font-display uppercase text-4xl sm:text-6xl tracking-tight text-[#101124] mt-4 leading-none">
              Sterilization &amp; Vaccination
            </h1>
            <p className="font-body text-sm sm:text-base text-[#101124]/75 max-w-xl mt-3 leading-relaxed">
              Systematic street animal birth control registry. Rescuers and civic centers coordinate safe capture,
              sterile surgery, anti-rabies vaccination, ear-notch marking, and territory release.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Request Form */}
          <aside className="lg:col-span-1">
            <div className="bg-white border-[1.5px] border-[#101124] lg:sticky lg:top-8">
              <div className="px-5 pt-5 pb-4 border-b-[1.5px] border-[#101124]">
                <h2 className="font-display uppercase text-2xl text-[#101124]">
                  Lodge Field Request
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#101124]/60 mt-1">
                  Report unsterilized packs in your municipal sector.
                </p>
              </div>
              <div className="p-5">
                {!dbUser ? (
                  <div className="text-center py-6 space-y-4">
                    <p className="font-body text-xs text-[#101124]/70">
                      Operator authentication required to record surgical dispatch coordinates.
                    </p>
                    <Link
                      href="/sign-in"
                      className="inline-block font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold px-5 py-2.5 bg-[#314CB6] text-white border-[1.5px] border-[#101124]"
                    >
                      Authenticate Session &rarr;
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
                  <div className="font-mono text-xs text-[#101124]/60 py-6 text-center uppercase tracking-wide">
                    Loading dispatch allowance...
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Feed */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-baseline justify-between border-b-[1.5px] border-[#101124] pb-3">
              <h2 className="font-display uppercase text-2xl text-[#101124]">
                Surgical Pipeline Registry
              </h2>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] font-bold">
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
                    className={`font-mono text-[10.5px] uppercase tracking-[0.14em] px-3.5 py-1.5 whitespace-nowrap border-[1.5px] border-[#101124] transition-colors ${
                      isActive
                        ? "bg-[#101124] text-[#FAF8FC] font-bold"
                        : "bg-white text-[#101124] hover:bg-[#FAF8FC]"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 opacity-60">({tab.count})</span>
                  </Link>
                );
              })}
            </div>

            {/* List */}
            {requests.length === 0 ? (
              <div className="text-center py-16 border-[1.5px] border-dashed border-[#101124]/40 bg-white p-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124]/60 block mb-2">
                  No Matching Registry Entries
                </span>
                <p className="font-display uppercase text-xl text-[#101124]">
                  {statusFilter
                    ? "Zero cases found with active filter"
                    : "No cases registered in municipal sector"}
                </p>
                <p className="font-body text-xs text-[#101124]/70 max-w-sm mx-auto mt-2">
                  {statusFilter
                    ? "Select another tab to inspect different stage dockets."
                    : "Lodge a request in the form to register an unsterilized pack."}
                </p>
              </div>
            ) : (
              <div className="bg-white border-[1.5px] border-[#101124] divide-y-[1.5px] divide-[#101124]">
                {requests.map((item) => {
                  const style =
                    STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
                  return (
                    <Link
                      key={item.id}
                      href={`/sterilization/${item.id}`}
                      className="block p-5 hover:bg-[#FAF8FC] transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-12 border-[1.5px] border-[#101124] bg-[#FAF8FC] flex items-center justify-center font-mono text-[10px] uppercase font-bold text-[#101124] shrink-0">
                          {ANIMAL_TAG[item.animalType] ?? "INDIE"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-display uppercase text-lg text-[#101124]">
                                  {item.animalType}
                                </span>
                                <span className="font-mono text-[10.5px] text-[#101124]/60 uppercase tracking-[0.12em]">
                                  / {item.count} {item.count === 1 ? "Subject" : "Subjects"}
                                </span>
                              </div>

                              <p className="font-mono text-xs text-[#101124] mt-1 truncate uppercase tracking-wide">
                                Sector: {item.location}
                              </p>

                              <div className="mt-2 font-mono text-[10px] text-[#101124]/70 uppercase tracking-[0.14em] flex flex-wrap gap-x-3 gap-y-1">
                                {item.status === "SCHEDULED" && item.rescuer && (
                                  <span>
                                    Assigned: {item.rescuer.name || "Field Officer"}
                                    {item.scheduledAt && ` · Target ${formatDate(item.scheduledAt)}`}
                                  </span>
                                )}

                                {item.status === "PROOF_SUBMITTED" && (
                                  <span>
                                    Clinical certificate uploaded {item.proofSubmittedAt ? timeAgo(item.proofSubmittedAt) : ""} · Under Review
                                  </span>
                                )}

                                {(item.status === "VERIFIED" || item.status === "COMPLETED") && (
                                  <span className="text-[#0A81D1] font-bold">
                                    Surgery Verified {formatDate(item.verifiedAt || item.completedAt || item.createdAt)}
                                    {item.rescuer ? ` by ${item.rescuer.name}` : ""}
                                  </span>
                                )}

                                {item.status === "DISPUTED" && (
                                  <span className="text-[#314CB6] font-bold">
                                    Disputed {item.disputedAt ? timeAgo(item.disputedAt) : ""} · Audit Pending
                                  </span>
                                )}

                                {item.status === "CANCELLED" && (
                                  <span>
                                    Withdrawn {item.cancelledAt ? formatDate(item.cancelledAt) : ""}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 border-[1.5px] ${style.border} ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#101124]/15 font-mono text-[10px] tracking-[0.14em] uppercase text-[#101124]/50 flex justify-between">
                            <span>Reporter: {item.user.name || "Community Watch"}</span>
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
              <div className="pt-6 border-t-[1.5px] border-[#101124] flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em]">
                <Link
                  href={buildHref({ page: currentPage - 1 })}
                  className={`px-4 py-2 border-[1.5px] border-[#101124] bg-white text-[#101124] ${
                    currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-[#FAF8FC]"
                  }`}
                >
                  &larr; Previous Page
                </Link>
                <span className="text-[#101124]/60 font-bold">
                  Sheet {currentPage} / {totalPages}
                </span>
                <Link
                  href={buildHref({ page: currentPage + 1 })}
                  className={`px-4 py-2 border-[1.5px] border-[#101124] bg-white text-[#101124] ${
                    currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-[#FAF8FC]"
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
