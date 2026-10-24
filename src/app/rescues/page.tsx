import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  REPORTED: {
    bg: "bg-[#cc2b3f]/15",
    text: "text-[#cc2b3f]",
    border: "border-[#cc2b3f]",
  },
  IN_PROGRESS: {
    bg: "bg-white",
    text: "text-[#1A2540]",
    border: "border-[#1A2540]",
  },
  RESCUED: {
    bg: "bg-[#1A2540]",
    text: "text-[#f2e9db]",
    border: "border-[#1A2540]",
  },
  CLOSED: {
    bg: "bg-white",
    text: "text-[#1A2540]/60",
    border: "border-[#1A2540]/25",
  },
};

export default async function RescuesFeedPage() {
  const rescues = await prisma.rescueReport.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const open = rescues.filter((r) => r.status === "REPORTED").length;
  const inProgress = rescues.filter((r) => r.status === "IN_PROGRESS").length;
  const resolved = rescues.filter(
    (r) => r.status === "RESCUED" || r.status === "CLOSED"
  ).length;

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
              Real-time community distress reports. Our 24/7 rescue ambulances dispatch immediately based on GPS coordinates and injury acuity.
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
        <div className="grid grid-cols-3 bg-[#f2e9db] rounded-2xl border-[1.5px] border-[#1A2540]/25 divide-x-[1.5px] divide-[#1A2540]/20 shadow-sm overflow-hidden">
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
              Ambulance En Route
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-[#1A2540] mt-1 block">
              {inProgress}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider block">
              Secured in Clinic
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-[#1A2540] mt-1 block">
              {resolved}
            </span>
          </div>
        </div>

        {/* Case List */}
        {rescues.length === 0 ? (
          <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-dashed border-[#1A2540]/30 p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <h3 className="font-heading text-2xl text-[#1A2540]">
              Zero Pending Distress Reports
            </h3>
            <p className="font-body text-xs text-[#1A2540]/70">
              All active field incidents have been secured by emergency rescue ambulances.
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
              const badge = STATUS_BADGE[item.status] || {
                bg: "bg-white",
                text: "text-[#1A2540]",
                border: "border-[#1A2540]",
              };
              return (
                <article
                  key={item.id}
                  className="bg-[#f2e9db] rounded-3xl p-5 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1A2540]/15 pb-2.5 mb-3.5">
                      <span className="font-heading text-sm text-[#1A2540] uppercase tracking-wider">
                        {item.animalType}
                      </span>
                      <span
                        className={`font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.border} ${badge.bg} ${badge.text}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="relative aspect-[4/3] w-full rounded-2xl border-[1.5px] border-[#1A2540] bg-white overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={`Incident involving ${item.animalType}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <div className="font-body text-xs font-bold text-[#1A2540] truncate">
                        Location: {item.location}
                      </div>
                      {item.latitude && item.longitude && (
                        <div className="font-body text-[11px] text-[#cc2b3f] font-semibold">
                          GPS: {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
                        </div>
                      )}
                      <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed line-clamp-3 pt-2 border-t border-[#1A2540]/15">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A2540]/15 flex items-center justify-between font-body text-[11px] text-[#1A2540]/60">
                    <span>By {item.user.name || "Community Watch"}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
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
