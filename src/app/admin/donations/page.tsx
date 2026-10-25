import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';

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
          <h2 className="text-xl font-semibold text-gray-900">Donation Records</h2>
          <p className="text-sm text-gray-500">
            {donations.length} total transaction{donations.length === 1 ? '' : 's'} recorded
          </p>
        </div>
        <Link
          href="/donate"
          className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
        >
          Open Donation Page →
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Total Funds Raised</div>
          <div className="text-2xl font-bold text-[#cc2b3f] mt-1">₹{totalRaised.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-400 mt-0.5">From successful contributions</div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Successful Donations</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{count}</div>
          <div className="text-xs text-gray-400 mt-0.5">Verified via Razorpay / Demo</div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Average Gift</div>
          <div className="text-2xl font-bold text-[#1A2540] mt-1">₹{average.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-400 mt-0.5">Per donor transaction</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-semibold text-sm text-gray-800">
            All Transaction Records
          </h3>
        </div>

        {donations.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No donation records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Donor</th>
                  <th className="px-4 py-3 text-left">Sponsorship Target</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Payment ID</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {d.donorName || d.user?.name || 'Anonymous Supporter'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {d.donorEmail || d.user?.email || 'guest checkout'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {d.targetName ? (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {d.targetName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">General Healthcare</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">
                      <div>{d.paymentId}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">{d.orderId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                        d.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 text-right font-mono">
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
