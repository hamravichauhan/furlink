import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { SterilizationStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminSterilizationPage({ searchParams }: PageProps) {
  await requireAdmin();

  const params = await searchParams;
  const statusFilter = params.status as SterilizationStatus | undefined;

  const where = statusFilter ? { status: statusFilter } : {};

  const [requests, counts] = await Promise.all([
    prisma.sterilizationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        rescuer: { select: { id: true, name: true, email: true } },
        verifiedBy: { select: { id: true, name: true } },
      },
    }),
    prisma.sterilizationRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) {
    countMap[c.status] = c._count._all;
  }

  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#163829]">Sterilization Management (TNVR)</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {total} total requests · {countMap.PENDING ?? 0} pending rescuer · {countMap.PROOF_SUBMITTED ?? 0} proof in review · {countMap.VERIFIED ?? 0} verified
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/verify"
            className="btn-paw-primary px-5 py-2.5 text-xs font-semibold shadow-xs"
          >
            Open Verification Queue →
          </Link>
          <Link
            href="/sterilization"
            className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-4 py-2.5 rounded-full text-xs font-semibold transition"
          >
            Public Feed
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <FilterTab href="/admin/sterilization" active={!statusFilter} label="All" count={total} />
        <FilterTab href="/admin/sterilization?status=PENDING" active={statusFilter === 'PENDING'} label="Pending" count={countMap.PENDING ?? 0} />
        <FilterTab href="/admin/sterilization?status=SCHEDULED" active={statusFilter === 'SCHEDULED'} label="Scheduled" count={countMap.SCHEDULED ?? 0} />
        <FilterTab href="/admin/sterilization?status=PROOF_SUBMITTED" active={statusFilter === 'PROOF_SUBMITTED'} label="Proof Submitted" count={countMap.PROOF_SUBMITTED ?? 0} />
        <FilterTab href="/admin/sterilization?status=VERIFIED" active={statusFilter === 'VERIFIED'} label="Verified" count={countMap.VERIFIED ?? 0} />
        <FilterTab href="/admin/sterilization?status=DISPUTED" active={statusFilter === 'DISPUTED'} label="Disputed" count={countMap.DISPUTED ?? 0} />
        <FilterTab href="/admin/sterilization?status=CANCELLED" active={statusFilter === 'CANCELLED'} label="Cancelled" count={countMap.CANCELLED ?? 0} />
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        {requests.length === 0 ? (
          <div className="p-10 text-center text-sm font-body text-gray-500">
            No sterilization requests found for this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Animal &amp; Location</th>
                  <th className="px-5 py-3.5 text-left">Citizen Reporter</th>
                  <th className="px-5 py-3.5 text-left">Assigned Rescuer</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Ear Notch &amp; Clinic</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200 text-xs font-mono">
                          {st.count}x
                        </div>
                        <div>
                          <Link href={`/sterilization/${st.id}`} className="font-semibold text-[#163829] hover:underline">
                            {st.animalType}
                          </Link>
                          <div className="text-xs text-gray-500 max-w-[200px] truncate">{st.location}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Logged: {new Date(st.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-semibold text-gray-900">{st.user.name || 'Citizen'}</div>
                      <div className="text-gray-500">{st.user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {st.rescuer ? (
                        <div>
                          <div className="font-semibold text-emerald-800">{st.rescuer.name || 'Rescuer'}</div>
                          <div className="text-gray-500">{st.rescuer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        st.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : st.status === 'SCHEDULED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : st.status === 'PROOF_SUBMITTED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : st.status === 'DISPUTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-800">
                        {st.count} Animals ({st.animalType})
                      </div>
                      <div className="text-gray-500">{st.clinicName || 'Clinic pending'}</div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {st.status === 'PROOF_SUBMITTED' && (
                          <Link
                            href={`/verify/${st.id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition"
                          >
                            Verify Proof
                          </Link>
                        )}
                        <Link
                          href={`/sterilization/${st.id}`}
                          className="text-xs font-body font-semibold text-[#163829] hover:underline"
                        >
                          Details →
                        </Link>
                      </div>
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

function FilterTab({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
        active
          ? 'bg-[#163829] text-white shadow-xs'
          : 'bg-white border border-gray-200 text-[#163829]/70 hover:bg-[#F8FAF8]'
      }`}
    >
      {label} ({count})
    </Link>
  );
}
