import { prisma } from "@/lib/prisma";
import ImpactDonationBlock from "@/components/impact-donation-block";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DonatePage() {
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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Masthead */}
        <div className="border-b-[1.5px] border-[#101124] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] font-bold">
              Direct Clinical Emergency Fund
            </div>
            <h1 className="font-display uppercase text-4xl sm:text-6xl tracking-tight text-[#101124] mt-4 leading-none">
              Where Your Rupee Goes
            </h1>
            <p className="font-body text-sm sm:text-base text-[#101124]/75 max-w-xl mt-3 leading-relaxed">
              We operate without executive salaries, administrative retainers, or agency overhead.
              Every rupee is translated directly into surgical sterile sets, antibiotics, and daily
              nourishment for recovering animals.
            </p>
          </div>

          <div className="flex items-center gap-6 border-[1.5px] border-[#101124] bg-white p-4">
            <div>
              <div className="font-mono text-[10px] text-[#101124]/60 uppercase tracking-[0.18em]">
                Direct Mobilized
              </div>
              <div className="font-display uppercase text-2xl sm:text-3xl text-[#101124] mt-0.5">
                INR {raised.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="border-l-[1.5px] border-[#101124] pl-6">
              <div className="font-mono text-[10px] text-[#101124]/60 uppercase tracking-[0.18em]">
                Casework Sponsors
              </div>
              <div className="font-display uppercase text-2xl sm:text-3xl text-[#314CB6] mt-0.5">
                {donorCount}
              </div>
            </div>
          </div>
        </div>

        {/* The Concrete Impact Allocation Engine */}
        <ImpactDonationBlock />

        {/* Transparency Ledger */}
        <div className="border-[1.5px] border-[#101124] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[1.5px] border-[#101124] pb-4">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#6461A0] font-bold">
                Clinical Transparency Ledger
              </span>
              <h2 className="font-display uppercase text-2xl text-[#101124] tracking-tight mt-1">
                Recent Direct Dispatches
              </h2>
            </div>
            <Link
              href="/admin/donations"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline underline-offset-4"
            >
              Examine Full Public Ledger &rarr;
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-[#101124]/60 border border-dashed border-[#101124]/30">
              No recent ledger entries today. Allocate the first clinical ration.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((d) => (
                <div
                  key={d.id}
                  className="border-[1.5px] border-[#101124] bg-[#FAF8FC] p-4 flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#101124] uppercase tracking-[0.12em]">
                      Clinical Patron
                    </span>
                    <span className="font-display text-xl text-[#314CB6]">
                      INR {d.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#101124]/60 mt-3 pt-2 border-t border-[#101124]/20 flex justify-between">
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
