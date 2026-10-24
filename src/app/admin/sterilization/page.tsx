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
          <h2 className="text-xl font-semibold text-gray-900">Sterilization Management (TNVR)</h2>
          <p className="text-sm text-gray-500">
            {total} total requests · {countMap.PENDING ?? 0} pending rescuer · {countMap.PROOF_SUBMITTED ?? 0} proof in review · {countMap.VERIFIED ?? 0} verified
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/verify"
            className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
          >
            Open Verification Queue →
          </Link>
          <Link
            href="/sterilization"
            className="border-2 border-[#1A2540] text-[#1A2540] bg-white hover:bg-[#FAF8FC] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition"
          >
            Public Feed
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        <FilterTab href="/admin/sterilization" active={!statusFilter} label="All" count={total} />
        <FilterTab href="/admin/sterilization?status=PENDING" active={statusFilter === 'PENDING'} label="Pending" count={countMap.PENDING ?? 0} />
        <FilterTab href="/admin/sterilization?status=SCHEDULED" active={statusFilter === 'SCHEDULED'} label="Scheduled" count={countMap.SCHEDULED ?? 0} />
        <FilterTab href="/admin/sterilization?status=PROOF_SUBMITTED" active={statusFilter === 'PROOF_SUBMITTED'} label="Proof Submitted" count={countMap.PROOF_SUBMITTED ?? 0} />
        <FilterTab href="/admin/sterilization?status=VERIFIED" active={statusFilter === 'VERIFIED'} label="Verified" count={countMap.VERIFIED ?? 0} />
        <FilterTab href="/admin/sterilization?status=DISPUTED" active={statusFilter === 'DISPUTED'} label="Disputed" count={countMap.DISPUTED ?? 0} />
        <FilterTab href="/admin/sterilization?status=CANCELLED" active={statusFilter === 'CANCELLED'} label="Cancelled" count={countMap.CANCELLED ?? 0} />
      </div>

      {/* Requests Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {requests.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No sterilization requests found for this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Animal & Count</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Requester</th>
                  <th className="px-4 py-3 text-left">Assigned Rescuer</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{st.count} × {st.animalType}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(st.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[200px]">
                      <div className="truncate font-mono">Location: {st.location}</div>
                      {st.clinicName && (
                        <div className="text-emerald-700 mt-0.5 font-medium truncate font-mono">
                          Clinic: {st.clinicName}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="font-medium text-gray-900">{st.user.name || 'Member'}</div>
                      <div className="text-gray-400">{st.user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {st.rescuer ? (
                        <div>
                          <div className="font-medium text-blue-700">{st.rescuer.name || 'Rescuer'}</div>
                          <div className="text-gray-400">{st.rescuer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                        st.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : st.status === 'PROOF_SUBMITTED'
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : st.status === 'DISPUTED'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : st.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {st.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {st.status === 'PROOF_SUBMITTED' && (
                          <Link
                            href={`/verify/${st.id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2.5 py-1 rounded"
                          >
                            Verify Proof
                          </Link>
                        )}
                        <Link
                          href={`/sterilization/${st.id}`}
                          className="text-xs text-gray-600 hover:text-gray-900 border rounded px-2.5 py-1 hover:bg-gray-50"
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
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-white border text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label} <span className="opacity-75">({count})</span>
    </Link>
  );
}
