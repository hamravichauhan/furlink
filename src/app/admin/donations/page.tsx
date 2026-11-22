import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import { decryptField, createDigitalReceiptFingerprint } from '@/lib/security';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage() {
  await requireAdmin();

  const [donations, aggregate] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.donation.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const totalRaised = aggregate._sum.amount ?? 0;
  const count = aggregate._count._all;
  const average = count > 0 ? Math.round(totalRaised / count) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#163829]">Donation Financial Ledger</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {donations.length} total transaction{donations.length === 1 ? '' : 's'} recorded via Razorpay &amp; offline allocations
          </p>
        </div>
        <Link
          href="/donate"
          className="btn-paw-primary px-5 py-2.5 text-xs font-semibold shadow-xs"
        >
          Open Public Donation Page &rarr;
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-xs uppercase font-semibold text-gray-500 font-body">Total Funds Raised</div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#cc2b3f] mt-1.5">₹{totalRaised.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-400 mt-1 font-body">From successful contributions</div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-xs uppercase font-semibold text-gray-500 font-body">Successful Transactions</div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#163829] mt-1.5">{count}</div>
          <div className="text-xs text-gray-400 mt-1 font-body">Verified via Razorpay / Demo</div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-xs uppercase font-semibold text-gray-500 font-body">Average Gift Size</div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#163829] mt-1.5">₹{average.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-400 mt-1 font-body">Per donor transaction</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 bg-gray-50/70 border-b border-gray-100">
          <h3 className="font-heading font-black text-base text-[#163829]">
            All Transaction Records
          </h3>
        </div>

        {donations.length === 0 ? (
          <div className="p-10 text-center text-sm font-body text-gray-500">
            No donation records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Donor</th>
                  <th className="px-5 py-3.5 text-left">Sponsorship Target</th>
                  <th className="px-5 py-3.5 text-left">Amount</th>
                  <th className="px-5 py-3.5 text-left">Payment ID</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-right">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {d.donorName || d.user?.name || 'Anonymous Supporter'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {decryptField(d.donorEmail) || d.user?.email || 'guest checkout'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {d.targetName ? (
                        <span className="font-semibold text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {d.targetName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">General ICU Fund</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-900">{d.paymentId}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{d.orderId}</div>
                      <div
                        className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1 inline-block font-semibold"
                        title="Cryptographically signed HMAC-SHA256 receipt fingerprint"
                      >
                        HMAC:{createDigitalReceiptFingerprint({
                          id: d.id,
                          amount: d.amount,
                          paymentId: d.paymentId,
                          orderId: d.orderId,
                          createdAt: d.createdAt,
                        }).slice(0, 16)}...
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        d.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 text-right">
                      {new Date(d.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
