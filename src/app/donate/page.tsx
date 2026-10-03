import { prisma } from "@/lib/prisma";
import CheckoutForm from "./checkout-form";
import { ShieldCheck, Heart, Users, Sparkles, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DonatePage() {
  const [recent, totalRaised, donorCount] = await Promise.all([
    prisma.donation.findMany({
      where: { status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.donation.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.donation.count({ where: { status: "SUCCESS" } }),
  ]);

  const raised = totalRaised._sum.amount ?? 0;
  const avg = donorCount > 0 ? Math.round(raised / donorCount) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-100">
          <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>100% Direct Impact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Support FurLink
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2.5 leading-relaxed">
          Every rupee directly funds emergency rescues, medical care, and
          sterilization drives for animals in need.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: stats + form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              value={`₹${raised.toLocaleString("en-IN")}`}
              label="Total raised"
            />
            <StatCard
              icon={<Users className="w-4 h-4" />}
              value={donorCount}
              label={donorCount === 1 ? "Supporter" : "Supporters"}
            />
            <StatCard
              icon={<Sparkles className="w-4 h-4" />}
              value={`₹${avg.toLocaleString("en-IN")}`}
              label="Average gift"
            />
          </div>

          {/* Checkout */}
          <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm">
            <CheckoutForm />
            <div className="mt-6 pt-5 border-t flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Encrypted 256-bit payment processed securely via Razorpay
              </span>
            </div>
          </div>
        </div>

        {/* Right: recent supporters sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">
                  Recent supporters
                </h2>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {recent.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Be the first to support FurLink. Your name could be here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {recent.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Heart className="w-3.5 h-3.5 fill-emerald-100" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          Anonymous supporter
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {timeAgo(d.createdAt)}
                        </div>
                      </div>

                      <div className="text-xs font-bold text-emerald-800 tabular-nums shrink-0">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {donorCount > 5 && (
                <div className="px-5 py-3 border-t bg-gray-50/60 text-center">
                  <span className="text-[11px] text-gray-500">
                    and {donorCount - 5} more supporter
                    {donorCount - 5 === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </div>

            {/* Trust badge card */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    Transparent by design
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                    Every donation is logged. Every sterilization certificate is
                    verified by a trusted reviewer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border rounded-2xl p-4 sm:p-5 text-center">
      <div className="flex justify-center mb-1 text-emerald-600 sm:hidden">
        {icon}
      </div>
      <div className="text-xl sm:text-3xl font-extrabold text-gray-900 tabular-nums tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
        {label}
      </div>
    </div>
  );
}
