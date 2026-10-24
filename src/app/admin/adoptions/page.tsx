import Link from 'next/link';
import { listApplicationsForAdmin } from '@/actions/admin-adoptions';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import ApplicationStatusActions from '@/app/adoptions/application-status-actions';

export const dynamic = 'force-dynamic';

export default async function AdminAdoptionsPage() {
  await requireAdmin();

  const [applications, pets] = await Promise.all([
    listApplicationsForAdmin(),
    prisma.pet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    }),
  ]);

  const pendingApps = applications.filter((a) => a.status === 'PENDING');
  const approvedApps = applications.filter((a) => a.status === 'APPROVED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Adoption Management</h2>
          <p className="text-sm text-gray-500">
            {applications.length} application{applications.length === 1 ? '' : 's'} · {pendingApps.length} pending review · {pets.length} pets in catalog
          </p>
        </div>
        <Link
          href="/adoptions/new"
          className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
        >
          + List New Pet for Adoption
        </Link>
      </div>

      {/* Applications Section */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-800">
            Adoption Applications ({applications.length})
          </h3>
          <span className="text-xs text-amber-700 font-medium">
            {pendingApps.length} awaiting decision
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No adoption applications received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Pet & Caregiver</th>
                  <th className="px-4 py-3 text-left">Applicant & Schedule</th>
                  <th className="px-4 py-3 text-left">Direct Outreach</th>
                  <th className="px-4 py-3 text-left">Housing & Experience</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.petImageUrl}
                          alt={app.petName}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <Link href={`/adoptions/${app.petId}`} className="font-semibold text-gray-900 hover:underline">
                            {app.petName}
                          </Link>
                          <div className="text-xs text-gray-500">{app.petSpecies}</div>
                          <div className="font-mono text-[10px] text-gray-400 uppercase mt-0.5">
                            Guardian: {app.petOwnerName || 'FurLink Care Team'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                      <div className="mt-1 inline-block border border-amber-300 bg-amber-50 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        Call Window: {app.preferredCallTime || 'Anytime'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-mono font-medium text-gray-800">{app.phone}</div>
                      <div className="text-gray-500 max-w-[170px] truncate text-[11px]">
                        {app.address}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={`tel:${app.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center font-mono text-[10.5px] uppercase tracking-wider font-bold bg-[#1A2540] text-[#f2e9db] hover:bg-[#cc2b3f] px-2.5 py-1 rounded transition-colors"
                        >
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${app.fullName}, this is FurLink regarding your adoption application for ${app.petName}. Let us coordinate your interview and visit!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center font-mono text-[10.5px] uppercase tracking-wider font-bold bg-emerald-700 text-white hover:bg-emerald-800 px-2.5 py-1 rounded transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[210px]">
                      <div className="space-y-1">
                        <div>
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-400">Housing: </span>
                          <span className="text-gray-800">{app.housingType || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-400">Exp: </span>
                          <span className="text-gray-800">{app.priorExperience || 'Not specified'}</span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed text-[11px] text-gray-500 mt-1" title={app.reason}>
                          {app.reason}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ApplicationStatusActions
                        applicationId={app.id}
                        currentStatus={app.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pet Catalog Management */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-800">
            Pet Catalog ({pets.length})
          </h3>
          <Link href="/adoptions/new" className="text-xs font-mono font-bold uppercase tracking-wider text-[#cc2b3f] hover:underline">
            + Add pet
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Pet</th>
                <th className="px-4 py-3 text-left">Details</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Applications</th>
                <th className="px-4 py-3 text-left">Listed Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pets.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="font-semibold text-gray-900">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {p.species} · {p.gender} · {p.age} {p.breed ? `· ${p.breed}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                      p.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : p.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {p._count.applications} applicant{p._count.applications === 1 ? '' : 's'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/adoptions/${p.id}`}
                      className="text-xs font-mono font-bold uppercase tracking-wider text-[#cc2b3f] hover:underline"
                    >
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
