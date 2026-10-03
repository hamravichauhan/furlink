import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { getSterilizationQuota } from "@/actions/sterilization";
import SterilizationForm from "./sterilization-form";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const ANIMAL_ICON: Record<string, string> = {
  "Street Dog": "🐕",
  "Feral Cat": "🐈",
  Other: "🐾",
};

const STATUS_STYLE: Record<
  string,
  { dot: string; text: string; bg: string; border: string; label: string }
> = {
  PENDING: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Awaiting rescuer",
  },
  SCHEDULED: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Scheduled",
  },
  PROOF_SUBMITTED: {
    dot: "bg-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "In review",
  },
  VERIFIED: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Verified",
  },
  COMPLETED: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Verified",
  },
  DISPUTED: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    label: "Disputed",
  },
  CANCELLED: {
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-50",
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
    { key: "ALL", label: "All", count: countMap.ALL },
    { key: "PENDING", label: "Awaiting rescuer", count: countMap.PENDING },
    { key: "SCHEDULED", label: "Scheduled", count: countMap.SCHEDULED },
    {
      key: "PROOF_SUBMITTED",
      label: "In review",
      count: countMap.PROOF_SUBMITTED,
    },
    { key: "VERIFIED", label: "Verified", count: countMap.VERIFIED },
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Sterilization &amp; Vaccination
        </h1>
        <p className="text-gray-600 text-sm mt-1 max-w-2xl">
          Report unsterilized community animals. Verified rescuers coordinate
          with local ABC centers and upload certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl border shadow-sm lg:sticky lg:top-6">
            <div className="px-5 pt-5 pb-4 border-b">
              <h2 className="font-semibold text-gray-900">
                Request assistance
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Report unsterilized strays in your area.
              </p>
            </div>
            <div className="p-5">
              {!dbUser ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in to submit a request.
                  </p>
                  <Link
                    href="/sign-in"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    Sign in
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
                <div className="text-sm text-gray-500 py-6 text-center">
                  Loading…
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right: feed */}
        <section className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Community drive status
            </h2>
            <span className="text-xs text-gray-400 tabular-nums">
              {total} {total === 1 ? "request" : "requests"}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
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
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap border transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 tabular-nums ${
                      isActive ? "text-emerald-100" : "text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* List */}
          {requests.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-gray-50">
              <div className="text-4xl mb-3">🐾</div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {statusFilter
                  ? "No requests with this status"
                  : "No requests yet"}
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {statusFilter
                  ? "Try a different filter."
                  : "Be the first to report a stray in your neighborhood."}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border shadow-sm divide-y">
                {requests.map((item) => {
                  const style =
                    STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
                  return (
                    <Link
                      key={item.id}
                      href={`/sterilization/${item.id}`}
                      className="block px-5 py-4 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shrink-0">
                          {ANIMAL_ICON[item.animalType] ?? "🐾"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900">
                                  {item.animalType}
                                </span>
                                <span className="text-xs text-gray-500 tabular-nums">
                                  · {item.count}{" "}
                                  {item.count === 1 ? "animal" : "animals"}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                📍 {item.location}
                              </p>

                              <div className="mt-1.5 text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                                {item.status === "SCHEDULED" &&
                                  item.rescuer && (
                                    <>
                                      <span>
                                        Assigned to{" "}
                                        <span className="text-gray-700 font-medium">
                                          {item.rescuer.name || "a rescuer"}
                                        </span>
                                      </span>
                                      {item.scheduledAt && (
                                        <span>
                                          Planned {formatDate(item.scheduledAt)}
                                        </span>
                                      )}
                                    </>
                                  )}

                                {item.status === "PROOF_SUBMITTED" && (
                                  <span>
                                    Proof submitted
                                    {item.proofSubmittedAt && (
                                      <> {timeAgo(item.proofSubmittedAt)}</>
                                    )}{" "}
                                    · awaiting verifier
                                  </span>
                                )}

                                {(item.status === "VERIFIED" ||
                                  item.status === "COMPLETED") && (
                                  <>
                                    <span className="text-emerald-700">
                                      Verified
                                      {item.verifiedAt || item.completedAt ? (
                                        <>
                                          {" "}
                                          {formatDate(
                                            item.verifiedAt ||
                                              item.completedAt!,
                                          )}
                                        </>
                                      ) : null}
                                    </span>
                                    {item.rescuer && (
                                      <span>
                                        · {item.rescuer.name || "rescuer"}
                                      </span>
                                    )}
                                  </>
                                )}

                                {item.status === "DISPUTED" &&
                                  item.disputedAt && (
                                    <span className="text-rose-700">
                                      Disputed {timeAgo(item.disputedAt)} ·
                                      under review
                                    </span>
                                  )}

                                {item.status === "CANCELLED" &&
                                  item.cancelledAt && (
                                    <span>
                                      Cancelled {formatDate(item.cancelledAt)}
                                    </span>
                                  )}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border ${style.bg} ${style.text} ${style.border}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                              />
                              {style.label}
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-gray-400 flex flex-wrap gap-x-3">
                            <span>{item.user.name || "Community Member"}</span>
                            <span>·</span>
                            <span>{timeAgo(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ─── Pagination ─────────────────────────────── */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  buildHref={buildHref}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// ─── Pagination component ────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (opts: { page: number }) => string;
}) {
  const pages: (number | "…")[] = [];

  // Always show first, last, current, and one on either side
  const window = 1;
  const range: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - window && i <= currentPage + window)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "…") {
      range.push("…");
    }
  }
  pages.push(...range);

  return (
    <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
      <div className="text-xs text-gray-500">
        Page <span className="font-medium text-gray-700">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={buildHref({ page: currentPage - 1 })}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            ← Previous
          </Link>
        ) : (
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-300 cursor-not-allowed">
            ← Previous
          </span>
        )}

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1 mx-2">
          {pages.map((p, i) =>
            p === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="text-xs text-gray-400 px-1.5"
              >
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildHref({ page: p })}
                className={`text-xs font-medium min-w-[32px] text-center px-2 py-1.5 rounded-lg border transition ${
                  p === currentPage
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ),
          )}
        </div>

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildHref({ page: currentPage + 1 })}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            Next →
          </Link>
        ) : (
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-300 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
