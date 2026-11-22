import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  REPORTED: {
    bg: "bg-rose-50",
    text: "text-[#cc2b3f]",
    border: "border-rose-200",
    label: "Open For Claim",
  },
  IN_PROGRESS: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    label: "In Progress",
  },
  PROOF_SUBMITTED: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    label: "Proof Submitted",
  },
  RESCUED: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    label: "Verified Rescued",
  },
  DISPUTED: {
    bg: "bg-rose-50",
    text: "text-[#cc2b3f]",
    border: "border-rose-200",
    label: "Disputed Audit",
  },
  CLOSED: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    label: "Closed",
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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 sm:py-14 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Modern Masthead */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#163829] px-3.5 py-1.5 rounded-full text-xs font-bold font-body mb-3">
              <span className="w-2 h-2 rounded-full bg-[#163829] animate-pulse" />
              <span>Field Trauma &amp; Ambulance Dispatch · Belagavi</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-[#163829] tracking-tight font-black">
              Live Field Rescue Cases
            </h1>
            <p className="font-body text-sm sm:text-base text-[#163829]/75 max-w-xl mt-2 leading-relaxed">
              Real-time community distress reports. Claim an open case to assist the animal, or submit veterinary treatment proof and medical bills for audit verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rescues/new"
              className="bg-[#cc2b3f] hover:bg-[#b02234] text-white font-body text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition shadow-xs inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Report Distressed Animal &rarr;
            </Link>
          </div>
        </div>

        {/* Status Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-3xl border border-gray-200/80 divide-x divide-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Pending Triage
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-[#cc2b3f] font-black mt-1 block">
              {open}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Rescuer Handling
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-amber-700 font-black mt-1 block">
              {inProgress}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Proof Review
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-blue-700 font-black mt-1 block">
              {proofSubmitted}
            </span>
          </div>
          <div className="p-5 sm:p-6 text-center">
            <span className="font-body text-xs text-gray-500 font-semibold uppercase tracking-wider block">
              Verified / Rescued
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-emerald-700 font-black mt-1 block">
              {resolved}
            </span>
          </div>
        </div>

        {disputed > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-body text-xs text-[#cc2b3f] font-semibold flex items-center justify-between">
            <span>[Community Audit Alert] {disputed} rescue case{disputed > 1 ? 's' : ''} currently under citizen dispute investigation.</span>
          </div>
        )}

        {/* Case List */}
        {rescues.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <h3 className="font-heading text-2xl text-[#163829] font-black">
              Zero Pending Distress Reports
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#163829]/70">
              All active field incidents have been secured by emergency rescue ambulances and volunteers.
            </p>
            <Link
              href="/rescues/new"
              className="inline-block mt-2 btn-paw-primary px-6 py-2.5 text-xs font-semibold"
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
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:border-[#163829] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-black text-[#163829]">
                          {item.animalType}
                        </span>
                        {item.urgency === 'CRITICAL' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#cc2b3f] text-white">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-body text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.border} ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <Link href={`/rescues/${item.id}`} className="block group">
                      <div className="relative aspect-[4/3] w-full rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={`Incident involving ${item.animalType}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.treatmentBillUrl && (
                          <span className="absolute top-2 right-2 bg-emerald-800 text-white font-body text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            BILL ATTACHED
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="mt-3.5 space-y-2">
                      <div className="font-body text-xs font-bold text-[#163829] truncate">
                        Location: {item.location}
                      </div>
                      {item.latitude && item.longitude && (
                        <div className="font-body text-[11px] text-[#cc2b3f] font-semibold">
                          GPS: {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
                        </div>
                      )}
                      <p className="font-body text-xs text-[#163829]/75 leading-relaxed line-clamp-2 pt-1 border-t border-gray-100">
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

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between font-body text-[11px] text-gray-500">
                      <span>By {item.user.name || "Community Watch"}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>

                    <Link
                      href={`/rescues/${item.id}`}
                      className="block text-center w-full btn-paw-primary py-2.5 text-xs font-semibold shadow-xs"
                    >
                      {item.status === 'REPORTED'
                        ? 'I Will Handle This →'
                        : item.status === 'IN_PROGRESS'
                        ? 'View Rescue Progress →'
                        : item.status === 'PROOF_SUBMITTED'
                        ? 'Review Proof & Bill →'
                        : item.status === 'DISPUTED'
                        ? 'View Audit Dispute →'
                        : 'View Certified Case →'}
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
