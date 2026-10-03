import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  REPORTED: "bg-amber-100 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  RESCUED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
};

const isUrl = (u: string) => /^https?:\/\/.+/i.test(u);

export default async function RescuesFeedPage() {
  const rescues = await prisma.rescueReport.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const open = rescues.filter((r) => r.status === "REPORTED").length;
  const inProgress = rescues.filter((r) => r.status === "IN_PROGRESS").length;
  const resolved = rescues.filter(
    (r) => r.status === "RESCUED" || r.status === "CLOSED",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              🆘 Live rescue feed
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Animals that need help
            </h1>
            <p className="mt-1 text-gray-600 text-sm max-w-xl">
              Real-time reports from the community. Every case is a chance to
              make a difference — share, volunteer, or sponsor a rescue.
            </p>
          </div>
          <Link
            href="/rescues/new"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-rose-600/20 transition"
          >
            🆘 Report animal
          </Link>
        </div>

        {/* Status summary */}
        {rescues.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl">
            <SummaryPill label="Reported" value={open} tone="amber" />
            <SummaryPill label="In progress" value={inProgress} tone="blue" />
            <SummaryPill label="Resolved" value={resolved} tone="emerald" />
          </div>
        )}

        {rescues.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl bg-white/60">
            <div className="text-5xl mb-3">🐾</div>
            <h2 className="text-lg font-semibold mb-1">
              No active rescue cases
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              When a community member reports an animal in distress, it will
              appear here. Help us keep the feed accurate by reporting what you
              see.
            </p>
            <Link
              href="/rescues/new"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition"
            >
              File the first report →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rescues.map((item) => (
              <article
                key={item.id}
                className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  {isUrl(item.imageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.animalType}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <span className="text-5xl mb-1">🐾</span>
                      <span className="text-[10px]">No photo</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider backdrop-blur bg-white/90 ${
                      STATUS_STYLES[item.status] ?? "bg-gray-100"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold capitalize text-gray-900">
                      {item.animalType}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                      <span>📍</span>
                      <span className="truncate">{item.location}</span>
                    </p>
                    <p className="mt-3 text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t text-xs text-gray-400 flex justify-between items-center">
                    <span>
                      {item.user.name ? `By ${item.user.name}` : "Anonymous"}
                    </span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "blue" | "emerald";
}) {
  const tones = {
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] font-medium opacity-80">{label}</div>
    </div>
  );
}
