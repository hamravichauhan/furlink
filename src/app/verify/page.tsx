import Link from "next/link";
import { getVerificationQueue } from "@/actions/sterilization";
import { requireVerifier } from "@/lib/auth-helpers";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ICONS,
} from "@/lib/sterilization-constants";

export const dynamic = "force-dynamic";

const ANIMAL_ICONS: Record<string, string> = {
  "Street Dog": "🐕",
  "Feral Cat": "🐈",
  Other: "🐾",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function VerifyPage({ searchParams }: PageProps) {
  await requireVerifier();

  const params = await searchParams;
  const statusFilter = params.status;

  const allItems = await getVerificationQueue();

  const filtered = statusFilter
    ? allItems.filter((i) => i.status === statusFilter)
    : allItems;

  const pending = allItems.filter((i) => i.status === "PROOF_SUBMITTED");
  const disputed = allItems.filter((i) => i.status === "DISPUTED");

  const tabs = [
    { key: undefined, label: "All", count: allItems.length },
    { key: "PROOF_SUBMITTED", label: "Awaiting review", count: pending.length },
    { key: "DISPUTED", label: "Disputed", count: disputed.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
            Verifier
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Verification Queue
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Review sterilization certificates submitted by rescuers. Verify
          legitimate proofs or dispute those that need re-examination.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          className={`border rounded-lg p-5 ${
            pending.length > 0 ? "bg-purple-50 border-purple-200" : "bg-white"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-purple-800">
            Awaiting review
          </div>
          <div className="text-3xl font-bold mt-1 text-purple-900">
            {pending.length}
          </div>
          <div className="text-xs text-purple-700 mt-1">
            {pending.length === 0
              ? "Nothing to review right now"
              : "Certificates to verify"}
          </div>
        </div>
        <div
          className={`border rounded-lg p-5 ${
            disputed.length > 0 ? "bg-rose-50 border-rose-200" : "bg-white"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-rose-800">
            Disputed
          </div>
          <div className="text-3xl font-bold mt-1 text-rose-900">
            {disputed.length}
          </div>
          <div className="text-xs text-rose-700 mt-1">
            {disputed.length === 0 ? "No open disputes" : "Needs resolution"}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active =
            (tab.key === undefined && !statusFilter) ||
            statusFilter === tab.key;
          const href = tab.key ? `/verify?status=${tab.key}` : "/verify";
          return (
            <Link
              key={tab.key ?? "all"}
              href={href}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                active
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 ${
                  active ? "text-white/70" : "text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-gray-50">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-gray-600 text-sm font-medium">
            {statusFilter === "DISPUTED"
              ? "No open disputes. Nice work."
              : statusFilter === "PROOF_SUBMITTED"
                ? "No proofs awaiting review."
                : "All caught up — nothing to verify."}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            New submissions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/verify/${item.id}`}
              className="block bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-gray-300 transition overflow-hidden"
            >
              <div className="flex">
                <div
                  className={`w-1 shrink-0 ${
                    item.status === "DISPUTED" ? "bg-rose-400" : "bg-purple-400"
                  }`}
                />
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-lg leading-none">
                          {ANIMAL_ICONS[item.animalType] || "🐾"}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.animalType}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                          {item.count} {item.count === 1 ? "animal" : "animals"}
                        </span>
                        {item.status === "DISPUTED" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-200 uppercase tracking-wider">
                            Disputed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 break-words line-clamp-1">
                        📍 {item.location}
                      </p>
                      {item.clinicName && (
                        <p className="text-xs text-gray-600 mt-1">
                          🏥 {item.clinicName}
                          {item.veterinarianName &&
                            ` · ${item.veterinarianName}`}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted by{" "}
                        <span className="font-medium">
                          {item.rescuerName || "a rescuer"}
                        </span>
                        {item.proofSubmittedAt &&
                          ` · ${timeAgo(item.proofSubmittedAt)}`}
                      </p>
                    </div>

                    {item.certificateUrl && (
                      <div className="w-20 h-20 rounded-md overflow-hidden border bg-gray-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.certificateUrl}
                          alt="Certificate thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {item.status === "DISPUTED" && item.disputeReason && (
                    <div className="mt-3 pt-3 border-t border-rose-100 bg-rose-50 -m-4 mt-4 p-3 rounded-b-xl">
                      <span className="text-xs font-medium text-rose-800">
                        Dispute reason:
                      </span>{" "}
                      <span className="text-xs text-rose-900 italic">
                        &ldquo;{item.disputeReason}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
