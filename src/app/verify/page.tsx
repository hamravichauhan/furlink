import Link from "next/link";
import { getVerificationQueue } from "@/actions/sterilization";
import { requireVerifier } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

const ANIMAL_TAGS: Record<string, string> = {
  "Street Dog": "[CANINE]",
  "Feral Cat": "[FELINE]",
  Other: "[COMMUNITY]",
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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Admin Console
          </Link>
          <span className="text-xs text-gray-400">
            Surgical Audit Portal
          </span>
        </div>

        <div className="border-b border-gray-100 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Clinical Audit
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
              Verification Queue
            </h1>
          </div>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            Review sterilization certificates submitted by field rescuers. Verify legitimate proofs or dispute those that need re-examination.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`rounded-3xl p-6 border shadow-xs ${
              pending.length > 0 ? "bg-white border-rose-200" : "bg-white border-gray-200/80"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Awaiting Review
            </div>
            <div className="font-heading font-extrabold text-3xl sm:text-4xl mt-1 text-rose-700">
              {pending.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {pending.length === 0 ? "Nothing to review right now" : "Certificates to verify"}
            </div>
          </div>
          <div
            className={`rounded-3xl p-6 border shadow-xs ${
              disputed.length > 0 ? "bg-white border-amber-300" : "bg-white border-gray-200/80"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Disputed
            </div>
            <div className="font-heading font-extrabold text-3xl sm:text-4xl mt-1 text-[#163829]">
              {disputed.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {disputed.length === 0 ? "No open disputes" : "Needs clinical resolution"}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const active =
              (tab.key === undefined && !statusFilter) ||
              statusFilter === tab.key;
            const href = tab.key ? `/verify?status=${tab.key}` : "/verify";
            return (
              <Link
                key={tab.key ?? "all"}
                href={href}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition shadow-xs ${
                  active
                    ? "bg-[#163829] text-white border-[#163829]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 ${
                    active ? "text-emerald-200" : "text-gray-400"
                  }`}
                >
                  ({tab.count})
                </span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-gray-200/80 bg-white rounded-3xl shadow-xs">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 inline-block mb-3">
              Queue Clear
            </span>
            <p className="font-heading font-bold text-xl text-[#163829]">
              {statusFilter === "DISPUTED"
                ? "No open disputes. All reviews cleared."
                : statusFilter === "PROOF_SUBMITTED"
                  ? "No proofs awaiting review."
                  : "All caught up - nothing to verify."}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/verify/${item.id}`}
                className="block bg-white border border-gray-200/80 rounded-3xl hover:border-emerald-600 shadow-xs transition overflow-hidden"
              >
                <div className="flex">
                  <div
                    className={`w-2 shrink-0 ${
                      item.status === "DISPUTED" ? "bg-rose-500" : "bg-emerald-600"
                    }`}
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-heading font-bold text-[#163829] text-lg">
                            {item.animalType}
                          </span>
                          <span className="text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-full">
                            {item.count} {item.count === 1 ? "animal" : "animals"}
                          </span>
                          {item.status === "DISPUTED" && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-rose-200 text-rose-700 bg-rose-50">
                              Disputed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 break-words line-clamp-1">
                          Sector: {item.location}
                        </p>
                        {item.clinicName && (
                          <p className="text-xs text-gray-500 mt-1">
                            Clinic: {item.clinicName}
                            {item.veterinarianName &&
                              ` · Dr. ${item.veterinarianName}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted by{" "}
                          <span className="font-medium text-gray-700">
                            {item.rescuerName || "a rescuer"}
                          </span>
                          {item.proofSubmittedAt &&
                            ` · ${timeAgo(item.proofSubmittedAt)}`}
                        </p>
                      </div>

                      {item.certificateUrl && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 shadow-xs">
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
                      <div className="mt-4 pt-3 border-t border-rose-100 bg-rose-50/50 -m-6 mt-4 p-4 rounded-b-3xl">
                        <span className="text-xs font-bold text-rose-700">
                          Dispute reason:
                        </span>{" "}
                        <span className="text-xs text-rose-900">
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
    </div>
  );
}
