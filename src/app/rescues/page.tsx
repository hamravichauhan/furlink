import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  REPORTED: {
    bg: "bg-[#cc2b3f]/15",
    text: "text-[#cc2b3f]",
    border: "border-[#cc2b3f]",
    label: "OPEN FOR CLAIM",
  },
  IN_PROGRESS: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-600",
    label: "IN PROGRESS",
  },
  PROOF_SUBMITTED: {
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-600",
    label: "PROOF SUBMITTED",
  },
  RESCUED: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-600",
    label: "VERIFIED RESCUED",
  },
  DISPUTED: {
    bg: "bg-rose-100",
    text: "text-[#cc2b3f]",
    border: "border-[#cc2b3f]",
    label: "DISPUTED AUDIT",
  },
  CLOSED: {
    bg: "bg-white",
    text: "text-[#1A2540]/60",
    border: "border-[#1A2540]/25",
    label: "CLOSED",
  },
};

export default async function RescuesFeedPage() {
  const rescues = await prisma.rescueReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      rescuer: { select: { name: true, email: true } },
    },
  });

  const open = rescues.filter((r) => r.status === "REPORTED").length;
  const inProgress = rescues.filter((r) => r.status === "IN_PROGRESS").length;
  const proofSubmitted = rescues.filter((r) => r.status === "PROOF_SUBMITTED").length;
  const resolved = rescues.filter(
    (r) => r.status === "RESCUED" || r.status === "CLOSED"
  ).length;
  const disputed = rescues.filter((r) => r.status === "DISPUTED").length;

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Masthead */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Field Trauma &amp; Ambulance Dispatch · Belagavi
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-[#1A2540] tracking-tight">
              Live Field Incidents
            </h1>
            <p className="font-body text-sm sm:text-base text-[#1A2540]/80 max-w-xl mt-2 leading-relaxed">
              Real-time community distress reports. Claim an open case to assist the animal, or submit veterinary treatment proof and medical bills for audit verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rescues/new"
              className="btn-enroll-pill px-6 py-3 text-xs font-bold shadow-sm"
            >
              REPORT DISTRESSED ANIMAL &rarr;
            </Link>
          </div>
        </div>

        {/* Status Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#f2e9db] rounded-2xl border-[1.5px] border-[#1A2540]/25 divide-x-[1.5px] divide-[#1A2540]/20 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 text-center">
            <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider block">
              Pending Triage
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-[#cc2b3f] mt-1 block">
              {open}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider block">
              Rescuer Handling
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-amber-800 mt-1 block">
              {inProgress}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider block">
              Proof Review
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-blue-800 mt-1 block">
              {proofSubmitted}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider block">
              Verified / Rescued
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-emerald-800 mt-1 block">
              {resolved}
            </span>
          </div>
        </div>

        {disputed > 0 && (
          <div className="p-4 bg-rose-50 border border-[#cc2b3f] rounded-2xl font-mono text-xs text-[#cc2b3f] font-bold flex items-center justify-between">
            <span>[COMMUNITY AUDIT ALERT] {disputed} rescue case{disputed > 1 ? 's' : ''} currently under citizen dispute investigation.</span>
          </div>
        )}

        {/* Case List */}
        {rescues.length === 0 ? (
          <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-dashed border-[#1A2540]/30 p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <h3 className="font-heading text-2xl text-[#1A2540]">
              Zero Pending Distress Reports
            </h3>
            <p className="font-body text-xs text-[#1A2540]/70">
              All active field incidents have been secured by emergency rescue ambulances and volunteers.
            </p>
            <Link
              href="/rescues/new"
              className="inline-block mt-2 btn-enroll-pill px-5 py-2.5 text-xs font-bold"
            >
              Report an Animal in Distress
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rescues.map((item) => {
              const badge = STATUS_BADGE[item.status] || STATUS_BADGE.REPORTED;
              return (
                <article
                  key={item.id}
                  className="bg-[#f2e9db] rounded-3xl p-5 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1A2540]/15 pb-2.5 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm text-[#1A2540] uppercase tracking-wider">
                          {item.animalType}
                        </span>
                        {item.urgency === 'CRITICAL' && (
                          <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#cc2b3f] text-white">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.border} ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <Link href={`/rescues/${item.id}`} className="block group">
                      <div className="relative aspect-[4/3] w-full rounded-2xl border-[1.5px] border-[#1A2540] bg-white overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={`Incident involving ${item.animalType}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.treatmentBillUrl && (
                          <span className="absolute top-2 right-2 bg-emerald-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            BILL ATTACHED
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="mt-3.5 space-y-2">
                      <div className="font-body text-xs font-bold text-[#1A2540] truncate">
                        Location: {item.location}
                      </div>
                      {item.latitude && item.longitude && (
                        <div className="font-body text-[11px] text-[#cc2b3f] font-semibold">
                          GPS: {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
                        </div>
                      )}
                      <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed line-clamp-2 pt-1 border-t border-[#1A2540]/15">
                        {item.description}
                      </p>

                      {/* Rescuer Attribution Pill */}
                      {item.rescuer && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 font-body text-[11px] text-amber-900 font-medium">
                          Claimed by volunteer: <strong>{item.rescuer.name || 'Rescuer'}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A2540]/15 space-y-3">
                    <div className="flex items-center justify-between font-body text-[11px] text-[#1A2540]/60">
                      <span>By {item.user.name || "Community Watch"}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>

                    <Link
                      href={`/rescues/${item.id}`}
                      className="block text-center w-full btn-enroll-pill py-2.5 text-xs font-bold tracking-wider"
                    >
                      {item.status === 'REPORTED'
                        ? 'I WILL HANDLE THIS &rarr;'
                        : item.status === 'IN_PROGRESS'
                        ? 'VIEW RESCUE PROGRESS &rarr;'
                        : item.status === 'PROOF_SUBMITTED'
                        ? 'REVIEW PROOF & BILL &rarr;'
                        : item.status === 'DISPUTED'
                        ? 'VIEW AUDIT DISPUTE &rarr;'
                        : 'VIEW CERTIFIED CASE &rarr;'}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
