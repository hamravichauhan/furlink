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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b-2 border-[#1A2540] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border-2 border-[#1A2540] bg-[#1A2540] text-[#f2e9db] font-mono text-[9.5px] uppercase tracking-[0.18em] px-2.5 py-0.5 font-bold">
                Clinical Audit
              </span>
            </div>
            <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-none">
              Verification Queue
            </h1>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 max-w-sm">
            Review sterilization certificates submitted by field rescuers. Verify legitimate proofs or dispute those that need re-examination.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-2xl p-5 ${
              pending.length > 0 ? "bg-white border-[#cc2b3f]" : "bg-[#f2e9db] border-[#1A2540]"
            }`}
          >
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A2540]/70">
              Awaiting Review
            </div>
            <div className="font-heading font-black text-4xl mt-1 text-[#cc2b3f]">
              {pending.length}
            </div>
            <div className="text-xs font-mono uppercase text-[#1A2540]/70 mt-1">
              {pending.length === 0 ? "Nothing to review right now" : "Certificates to verify"}
            </div>
          </div>
          <div
            className={`border-2 rounded-2xl p-5 ${
              disputed.length > 0 ? "bg-white border-[#cc2b3f]" : "bg-[#f2e9db] border-[#1A2540]"
            }`}
          >
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A2540]/70">
              Disputed
            </div>
            <div className="font-heading font-black text-4xl mt-1 text-[#1A2540]">
              {disputed.length}
            </div>
            <div className="text-xs font-mono uppercase text-[#1A2540]/70 mt-1">
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
                className={`font-mono text-xs uppercase tracking-[0.14em] font-bold px-4 py-2 rounded-full border-2 transition ${
                  active
                    ? "bg-[#1A2540] text-[#f2e9db] border-[#1A2540]"
                    : "bg-white text-[#1A2540] border-[#1A2540] hover:bg-[#f2e9db]"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 ${
                    active ? "text-[#f2e9db]/70" : "text-[#1A2540]/60"
                  }`}
                >
                  ({tab.count})
                </span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl shadow-sm">
            <span className="font-mono text-xs uppercase tracking-[0.18em] font-bold text-[#cc2b3f] border-2 border-[#cc2b3f] bg-white px-3 py-1 inline-block mb-3">
              Queue Clear
            </span>
            <p className="font-heading font-black text-xl text-[#1A2540]">
              {statusFilter === "DISPUTED"
                ? "No open disputes. All reviews cleared."
                : statusFilter === "PROOF_SUBMITTED"
                  ? "No proofs awaiting review."
                  : "All caught up - nothing to verify."}
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-[#1A2540]/60 mt-2">
              New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/verify/${item.id}`}
                className="block bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl hover:border-[#cc2b3f] shadow-sm transition overflow-hidden"
              >
                <div className="flex">
                  <div
                    className={`w-2 shrink-0 ${
                      item.status === "DISPUTED" ? "bg-[#cc2b3f]" : "bg-[#1A2540]"
                    }`}
                  />
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] text-[#1A2540]/60 font-mono font-bold">
                            {ANIMAL_TAGS[item.animalType] || "[CASE]"}
                          </span>
                          <span className="font-heading font-black text-[#1A2540] text-lg uppercase">
                            {item.animalType}
                          </span>
                          <span className="text-xs font-mono uppercase bg-white text-[#1A2540] border border-[#1A2540] px-2.5 py-0.5 rounded-full font-bold">
                            {item.count} {item.count === 1 ? "animal" : "animals"}
                          </span>
                          {item.status === "DISPUTED" && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#cc2b3f] text-[#cc2b3f] bg-white uppercase tracking-wider">
                              Disputed
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#1A2540] break-words line-clamp-1 uppercase tracking-wide">
                          Sector: {item.location}
                        </p>
                        {item.clinicName && (
                          <p className="text-xs font-mono text-[#1A2540]/80 mt-1 uppercase">
                            Clinic: {item.clinicName}
                            {item.veterinarianName &&
                              ` · Dr. ${item.veterinarianName}`}
                          </p>
                        )}
                        <p className="text-xs font-mono text-[#1A2540]/60 mt-2 uppercase">
                          Submitted by{" "}
                          <span className="font-bold text-[#1A2540]">
                            {item.rescuerName || "a rescuer"}
                          </span>
                          {item.proofSubmittedAt &&
                            ` · ${timeAgo(item.proofSubmittedAt)}`}
                        </p>
                      </div>

                      {item.certificateUrl && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#1A2540] bg-white shrink-0">
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
                      <div className="mt-4 pt-3 border-t-2 border-[#cc2b3f]/20 bg-white -m-5 mt-4 p-3 rounded-b-xl">
                        <span className="text-xs font-mono font-bold text-[#cc2b3f] uppercase">
                          Dispute reason:
                        </span>{" "}
                        <span className="text-xs font-mono text-[#1A2540]">
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
