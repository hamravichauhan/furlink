import { prisma } from "@/lib/prisma";
import DonationImpactEngine from "@/components/pet-shelter/donation-impact-engine";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    pet?: string;
    amount?: string;
    case?: string;
    type?: string;
  }>;
}

export default async function DonatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPet = params.pet || undefined;
  const initialAmount = params.amount ? Number(params.amount) : undefined;
  const initialCase = params.case || undefined;

  const [recent, totalRaised, donorCount] = await Promise.all([
    prisma.donation.findMany({
      where: { status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.donation.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.donation.count({ where: { status: "SUCCESS" } }),
  ]);

  const raised = totalRaised._sum.amount ?? 0;

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Masthead */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Direct Clinical Emergency Fund · Belagavi
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#163829] tracking-tight">
              Where Your Donation Goes
            </h1>
            <p className="font-body text-sm sm:text-base text-gray-600 max-w-xl mt-3 leading-relaxed">
              We operate without executive salaries, administrative retainers, or advertising agencies.
              Every rupee is translated directly into surgical sterile sets, antibiotics, and daily
              nourishment for recovering animals.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div>
              <div className="font-body text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                Direct Mobilized
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#163829] mt-0.5">
                ₹{raised.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="border-l border-gray-200 pl-6">
              <div className="font-body text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                Casework Sponsors
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-700 mt-0.5">
                {donorCount}
              </div>
            </div>
          </div>
        </div>

        {/* The Concrete Impact Allocation Engine with Razorpay & Sponsorship support */}
        <DonationImpactEngine
          initialPet={initialPet}
          initialAmount={initialAmount}
          initialCase={initialCase}
        />

        {/* Transparency Ledger */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Clinical Transparency Ledger
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#163829] mt-1">
                Recent Direct Medical Allocations
              </h2>
            </div>
            <Link
              href="/admin/donations"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Examine Full Public Ledger &rarr;
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center font-body text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4">
              No recent ledger entries today. Allocate the first clinical recovery meal above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((d) => (
                <div
                  key={d.id}
                  className="bg-gray-50/70 rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-body text-xs font-bold text-[#163829]">
                      Compassionate Patron
                    </span>
                    <span className="font-heading font-bold text-lg text-emerald-800">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="font-body text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-200/80 flex justify-between">
                    <span>{new Date(d.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="font-medium text-emerald-700">{d.paymentId ? "Verified Voucher" : "Direct Medical Credit"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
