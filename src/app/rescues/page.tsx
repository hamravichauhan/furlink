import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  REPORTED: {
    bg: "bg-[#EFBDEB]/30",
    text: "text-[#101124]",
    border: "border-[#101124]",
  },
  IN_PROGRESS: {
    bg: "bg-[#6461A0]/20",
    text: "text-[#101124]",
    border: "border-[#101124]",
  },
  RESCUED: {
    bg: "bg-[#0A81D1]/20",
    text: "text-[#101124]",
    border: "border-[#101124]",
  },
  CLOSED: {
    bg: "bg-white",
    text: "text-[#101124]/60",
    border: "border-[#101124]/30",
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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Masthead */}
        <div className="border-b-[1.5px] border-[#101124] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] font-bold">
              Field Trauma & Rescue Dispatch
            </div>
            <h1 className="font-display uppercase text-4xl sm:text-6xl tracking-tight text-[#101124] mt-4 leading-none">
              Live Field Incidents
            </h1>
            <p className="font-body text-sm sm:text-base text-[#101124]/75 max-w-xl mt-3 leading-relaxed">
              Real-time community distress reports from Belagavi and regional sectors.
              Emergency volunteer response units dispatch based on coordinate accuracy and injury acuity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rescues/new"
              className="font-mono text-[11px] uppercase tracking-[0.18em] font-bold px-6 py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white border-[1.5px] border-[#101124] transition-colors"
            >
              Report Distressed Animal &rarr;
            </Link>
          </div>
        </div>

        {/* Status Counters Strip */}
        <div className="grid grid-cols-3 border-[1.5px] border-[#101124] bg-white divide-x-[1.5px] divide-[#101124]">
          <div className="p-4 sm:p-6 text-center">
            <span className="font-mono text-[10px] text-[#101124]/60 uppercase tracking-[0.18em] block">
              Pending Triage
            </span>
            <span className="font-display uppercase text-3xl sm:text-4xl text-[#314CB6] mt-1 block">
              {open}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-mono text-[10px] text-[#101124]/60 uppercase tracking-[0.18em] block">
              Unit En Route
            </span>
            <span className="font-display uppercase text-3xl sm:text-4xl text-[#6461A0] mt-1 block">
              {inProgress}
            </span>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <span className="font-mono text-[10px] text-[#101124]/60 uppercase tracking-[0.18em] block">
              In Safe Care
            </span>
            <span className="font-display uppercase text-3xl sm:text-4xl text-[#0A81D1] mt-1 block">
              {resolved}
            </span>
          </div>
        </div>

        {/* Case List */}
        {rescues.length === 0 ? (
          <div className="border-[1.5px] border-dashed border-[#101124]/40 p-16 text-center bg-white max-w-xl mx-auto space-y-4">
            <h3 className="font-display uppercase text-2xl text-[#101124]">
              Zero Pending Distress Reports
            </h3>
            <p className="font-body text-xs text-[#101124]/70">
              All active field incidents have been secured by emergency response teams.
            </p>
            <Link
              href="/rescues/new"
              className="inline-block mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] font-bold px-5 py-2.5 bg-[#314CB6] text-white border-[1.5px] border-[#101124]"
            >
              Lodge New Distress Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rescues.map((item) => {
              const badge = STATUS_BADGE[item.status] || {
                bg: "bg-white",
                text: "text-[#101124]",
                border: "border-[#101124]",
              };
              return (
                <article
                  key={item.id}
                  className="border-[1.5px] border-[#101124] bg-white p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-2.5 mb-3.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#101124]">
                        {item.animalType}
                      </span>
                      <span
                        className={`font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] px-2.5 py-0.5 border-[1.5px] ${badge.border} ${badge.bg} ${badge.text}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="relative aspect-[4/3] w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={`Incident involving ${item.animalType}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <div className="font-mono text-[11px] font-bold text-[#101124] uppercase tracking-[0.12em] truncate">
                        Location: {item.location}
                      </div>
                      {item.latitude && item.longitude && (
                        <div className="font-mono text-[10px] text-[#0A81D1] tracking-[0.14em] uppercase">
                          GPS: {item.latitude.toFixed(4)} N, {item.longitude.toFixed(4)} E
                        </div>
                      )}
                      <p className="font-body text-xs text-[#101124]/80 leading-relaxed line-clamp-3 pt-2 border-t border-[#101124]/20">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-[1.5px] border-[#101124] flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#101124]/60">
                    <span>By {item.user.name || "Community Reporter"}</span>
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
