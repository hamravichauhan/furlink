import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const donation = id
    ? await prisma.donation.findUnique({ where: { id } })
    : null;

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-[85vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-sm relative overflow-hidden">
        {/* Kiss-cut corner stamp badge */}
        <div className="inline-block border-2 border-[#cc2b3f] bg-white text-[#cc2b3f] px-3.5 py-1 text-xs font-mono uppercase tracking-[0.18em] font-bold">
          Official Clinical Care Receipt
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A2540] leading-tight">
            Thank you for saving lives today.
          </h1>
          <p className="text-xs text-[#1A2540]/75 font-mono uppercase tracking-wider mt-2">
            FurLink Zero Euthanasia Medical Fund · Direct Trauma Ledger
          </p>
        </div>

        {donation ? (
          <div className="border-t-2 border-b-2 border-[#1A2540]/20 py-5 space-y-2 bg-white/60 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div className="text-4xl sm:text-5xl font-black text-[#cc2b3f] font-heading">
              ₹{donation.amount.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-[#1A2540] font-mono font-bold uppercase tracking-wider">
              Transaction ID: {donation.paymentId.toUpperCase()}
            </div>
            <div className="text-[11px] text-[#1A2540]/70 font-mono">
              Status: Verified · Allocated to Belagavi Trauma & TNVR Center
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-b-2 border-[#1A2540]/20 py-4 text-xs font-mono text-[#1A2540]/70 uppercase">
            Your generous contribution has been securely logged to the public healthcare ledger.
          </div>
        )}

        <p className="text-xs text-[#1A2540]/80 leading-relaxed">
          100% of your donation purchases sterile surgical disposables, antibiotics, and post-op nutrition for animals currently in acute triage.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/adoptions"
            className="flex-1 py-3.5 bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-[0.16em] font-bold rounded-full transition text-center shadow-sm"
          >
            Meet Waiting Animals
          </Link>
          <Link
            href="/donate"
            className="flex-1 py-3.5 bg-white hover:bg-[#FAF8FC] border-2 border-[#1A2540] text-[#1A2540] font-mono text-xs uppercase tracking-[0.16em] font-bold rounded-full transition text-center"
          >
            Back to Fund
          </Link>
        </div>
      </div>
    </div>
  );
}
