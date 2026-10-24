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
    <div className="bg-[#F8FAFC] text-slate-900 min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-8 text-center space-y-6 shadow-soft">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
          Donation Received
        </span>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
          Thank you for saving lives today.
        </h1>

        {donation ? (
          <div className="border-t border-b border-slate-100 py-4 space-y-1">
            <div className="text-3xl font-extrabold text-emerald-600 font-heading">
              ₹{donation.amount.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Receipt Reference: {donation.paymentId.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-400">
              Allocated directly to the Belagavi Emergency Care Center
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Your generous contribution has been logged to the public healthcare ledger.
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/adoptions"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full shadow-xs transition text-center"
          >
            Meet Waiting Animals
          </Link>
          <Link
            href="/donate"
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition text-center"
          >
            Back to Fund
          </Link>
        </div>
      </div>
    </div>
  );
}
