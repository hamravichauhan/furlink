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
    RESCUED: 0,
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
          <h2 className="text-xl font-semibold text-gray-900">Rescue Cases Management</h2>
          <p className="text-sm text-gray-500">
            {total} total cases reported · {countMap.REPORTED} open · {countMap.IN_PROGRESS} in progress
          </p>
        </div>
        <Link
          href="/rescues/new"
          className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
        >
          + File New Rescue Report
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        <FilterTab href="/admin/rescues" active={!statusFilter} label="All" count={total} />
        <FilterTab href="/admin/rescues?status=REPORTED" active={statusFilter === 'REPORTED'} label="Reported (Open)" count={countMap.REPORTED} />
        <FilterTab href="/admin/rescues?status=IN_PROGRESS" active={statusFilter === 'IN_PROGRESS'} label="In Progress" count={countMap.IN_PROGRESS} />
        <FilterTab href="/admin/rescues?status=RESCUED" active={statusFilter === 'RESCUED'} label="Rescued" count={countMap.RESCUED} />
        <FilterTab href="/admin/rescues?status=CLOSED" active={statusFilter === 'CLOSED'} label="Closed" count={countMap.CLOSED} />
      </div>

      {/* Rescues Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {rescues.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No rescue reports found for this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Animal</th>
                  <th className="px-4 py-3 text-left">Location & Coordinates</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Reported By</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rescues.map((rescue) => (
                  <tr key={rescue.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rescue.imageUrl}
                          alt={rescue.animalType}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 capitalize">{rescue.animalType}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(rescue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[200px]">
                      <div className="font-medium truncate font-mono">Location: {rescue.location}</div>
                      {rescue.latitude && rescue.longitude && (
                        <div className="text-gray-400 mt-0.5">
                          GPS: {rescue.latitude.toFixed(4)}, {rescue.longitude.toFixed(4)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[260px]">
                      <p className="line-clamp-2 leading-relaxed" title={rescue.description}>
                        {rescue.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <div className="font-medium text-gray-900">{rescue.user.name || 'Anonymous'}</div>
                      <div className="text-gray-400 truncate max-w-[140px]">{rescue.user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                        rescue.status === 'REPORTED'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : rescue.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : rescue.status === 'RESCUED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {rescue.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RescueStatusActions
                        rescueId={rescue.id}
                        currentStatus={rescue.status}
                      />
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
