import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createDigitalReceiptFingerprint } from "@/lib/security";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const donation = id
    ? await prisma.donation.findUnique({ where: { id } })
    : null;

  const receiptFingerprint = donation
    ? createDigitalReceiptFingerprint({
        id: donation.id,
        amount: donation.amount,
        paymentId: donation.paymentId,
        orderId: donation.orderId,
        createdAt: donation.createdAt,
      })
    : null;

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-[85vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xs relative overflow-hidden">
        {/* Official badge */}
        <div className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-800 px-3.5 py-1 text-xs font-semibold rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Official Clinical Care Receipt
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            Thank you for saving lives today.
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            FurLink Zero Euthanasia Medical Fund · Direct Trauma Ledger
          </p>
        </div>

        {donation ? (
          <div className="border-t border-b border-gray-100 py-6 space-y-3 bg-gray-50/60 -mx-8 px-8 sm:-mx-10 sm:px-10">
            <div className="text-4xl sm:text-5xl font-extrabold text-[#163829] font-heading">
              ₹{donation.amount.toLocaleString("en-IN")}
            </div>
            {donation.targetName && (
              <div className="inline-block text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full">
                Sponsorship Earmarked: {donation.targetName}
              </div>
            )}
            <div className="text-xs text-gray-600 font-mono font-medium">
              Transaction ID: {donation.paymentId.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">
              Donor: {donation.donorName || "Generous Supporter"} · Allocated to Belagavi Trauma &amp; TNVR Center
            </div>
            {receiptFingerprint && (
              <div className="pt-3 border-t border-gray-200 text-left">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                  <span>Cryptographic Receipt Seal</span>
                  <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">HMAC-SHA256 Signed</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] bg-white p-2.5 rounded-xl break-all select-all text-gray-700 border border-gray-200">
                  {receiptFingerprint}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  Immutable tamper-proof audit fingerprint generated for 80G tax deductions.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-b border-gray-100 py-4 text-xs text-gray-500">
            Your generous contribution has been securely logged to the public healthcare ledger.
          </div>
        )}

        <p className="text-xs text-gray-600 leading-relaxed">
          100% of your donation purchases sterile surgical disposables, antibiotics, and post-op nutrition for animals currently in acute triage.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/adoptions"
            className="flex-1 py-3.5 btn-paw-primary text-xs font-bold rounded-full transition text-center shadow-xs"
          >
            Meet Waiting Animals
          </Link>
          <Link
            href="/donate"
            className="flex-1 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-[#163829] text-xs font-semibold rounded-full transition text-center shadow-xs"
          >
            Back to Fund
          </Link>
        </div>
      </div>
    </div>
  );
}
