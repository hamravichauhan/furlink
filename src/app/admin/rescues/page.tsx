import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import RescueStatusActions from './rescue-status-actions';
import { RescueStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminRescuesPage({ searchParams }: PageProps) {
  await requireAdmin();

  const params = await searchParams;
  const statusFilter = params.status as RescueStatus | undefined;

  const where = statusFilter ? { status: statusFilter } : {};

  const [rescues, counts] = await Promise.all([
    prisma.rescueReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        rescuer: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.rescueReport.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  const countMap: Record<string, number> = {
    REPORTED: 0,
    IN_PROGRESS: 0,
    PROOF_SUBMITTED: 0,
    RESCUED: 0,
    DISPUTED: 0,
    CLOSED: 0,
  };
  for (const row of counts) {
    countMap[row.status] = row._count._all;
  }

  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#163829]">Rescue Cases Management</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {total} total cases reported · {countMap.REPORTED} open · {countMap.IN_PROGRESS} claimed · {countMap.PROOF_SUBMITTED} awaiting proof review · {countMap.DISPUTED} disputed
          </p>
        </div>
        <Link
          href="/rescues/new"
          className="bg-[#cc2b3f] hover:bg-[#b02234] text-white font-body text-xs font-semibold px-5 py-2.5 rounded-full transition shadow-xs inline-flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          + File New Rescue Report
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <FilterTab href="/admin/rescues" active={!statusFilter} label="All" count={total} />
        <FilterTab href="/admin/rescues?status=REPORTED" active={statusFilter === 'REPORTED'} label="Reported (Open)" count={countMap.REPORTED} />
        <FilterTab href="/admin/rescues?status=IN_PROGRESS" active={statusFilter === 'IN_PROGRESS'} label="In Progress" count={countMap.IN_PROGRESS} />
        <FilterTab href="/admin/rescues?status=PROOF_SUBMITTED" active={statusFilter === 'PROOF_SUBMITTED'} label="Proof Submitted" count={countMap.PROOF_SUBMITTED} />
        <FilterTab href="/admin/rescues?status=RESCUED" active={statusFilter === 'RESCUED'} label="Rescued" count={countMap.RESCUED} />
        <FilterTab href="/admin/rescues?status=DISPUTED" active={statusFilter === 'DISPUTED'} label="Disputed" count={countMap.DISPUTED} />
        <FilterTab href="/admin/rescues?status=CLOSED" active={statusFilter === 'CLOSED'} label="Closed" count={countMap.CLOSED} />
      </div>

      {/* Rescues Table */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        {rescues.length === 0 ? (
          <div className="p-10 text-center text-sm font-body text-gray-500">
            No rescue reports found for this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Animal</th>
                  <th className="px-5 py-3.5 text-left">Location</th>
                  <th className="px-5 py-3.5 text-left">Reported By</th>
                  <th className="px-5 py-3.5 text-left">Rescuer Handling</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-right">Inspect &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rescues.map((rescue) => (
                  <tr key={rescue.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rescue.imageUrl}
                          alt="Animal"
                          className="w-12 h-12 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <Link href={`/rescues/${rescue.id}`} className="font-semibold text-[#163829] hover:underline">
                            {rescue.animalType}
                          </Link>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {rescue.description}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Reported: {new Date(rescue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-900 max-w-[200px] truncate">
                        {rescue.location}
                      </div>
                      <div className="text-gray-400 text-[10px] mt-0.5">
                        {rescue.latitude ? rescue.latitude.toFixed(4) : 'N/A'}, {rescue.longitude ? rescue.longitude.toFixed(4) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-900">{rescue.user.name || 'Anonymous'}</div>
                      <div className="text-gray-500">{rescue.user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {rescue.rescuer ? (
                        <div>
                          <div className="font-medium text-emerald-800">{rescue.rescuer.name || 'Rescuer'}</div>
                          <div className="text-gray-500">{rescue.rescuer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unclaimed</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        rescue.status === 'RESCUED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : rescue.status === 'IN_PROGRESS'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : rescue.status === 'PROOF_SUBMITTED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : rescue.status === 'DISPUTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {rescue.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/rescues/${rescue.id}`}
                          className="text-xs font-body font-semibold text-[#163829] hover:underline"
                        >
                          View &rarr;
                        </Link>
                        <RescueStatusActions
                          rescueId={rescue.id}
                          currentStatus={rescue.status}
                        />
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
