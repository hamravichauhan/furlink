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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Masthead */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Direct Clinical Emergency Fund · Belagavi
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-[#1A2540] tracking-tight">
              Where Your Donation Goes
            </h1>
            <p className="font-body text-sm sm:text-base text-[#1A2540]/80 max-w-xl mt-3 leading-relaxed">
              We operate without executive salaries, administrative retainers, or advertising agencies.
              Every rupee is translated directly into surgical sterile sets, antibiotics, and daily
              nourishment for recovering animals.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white p-5 rounded-2xl border-[1.5px] border-[#1A2540]/25 shadow-sm">
            <div>
              <div className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider">
                Direct Mobilized
              </div>
              <div className="font-heading text-2xl sm:text-3xl text-[#1A2540] mt-0.5">
                ₹{raised.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="border-l-[1.5px] border-[#1A2540]/20 pl-6">
              <div className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold tracking-wider">
                Casework Sponsors
              </div>
              <div className="font-heading text-2xl sm:text-3xl text-[#cc2b3f] mt-0.5">
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
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2540]/20 pb-4">
            <div>
              <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block">
                Clinical Transparency Ledger
              </span>
              <h2 className="font-heading text-2xl text-[#1A2540] mt-1">
                Recent Direct Medical Allocations
              </h2>
            </div>
            <Link
              href="/admin/donations"
              className="font-body text-xs font-semibold text-[#cc2b3f] hover:underline"
            >
              Examine Full Public Ledger &rarr;
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center font-body text-xs text-[#1A2540]/60 bg-white/60 rounded-2xl border border-dashed border-[#1A2540]/30 p-4">
              No recent ledger entries today. Allocate the first clinical recovery meal above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl p-4 border-[1.5px] border-[#1A2540]/20 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-body text-xs font-bold text-[#1A2540]">
                      Compassionate Patron
                    </span>
                    <span className="font-heading text-lg font-bold text-[#cc2b3f]">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="font-body text-[11px] text-[#1A2540]/60 mt-3 pt-2 border-t border-[#1A2540]/15 flex justify-between">
                    <span>{new Date(d.createdAt).toLocaleDateString("en-IN")}</span>
                    <span>{d.paymentId ? "Verified Voucher" : "Direct Medical Credit"}</span>
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
