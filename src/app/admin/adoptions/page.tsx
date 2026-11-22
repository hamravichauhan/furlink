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
          <h2 className="font-heading text-2xl font-black text-[#163829]">Adoption Management</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {applications.length} application{applications.length === 1 ? '' : 's'} · {pendingApps.length} pending review · {pets.length} pets in catalog
          </p>
        </div>
        <Link
          href="/adoptions/new"
          className="btn-paw-primary px-5 py-2.5 text-xs font-semibold shadow-xs"
        >
          + List New Pet for Adoption
        </Link>
      </div>

      {/* Applications Section */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-base text-[#163829]">
            Adoption Applications ({applications.length})
          </h3>
          <span className="text-xs font-body font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            {pendingApps.length} awaiting decision
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-10 text-center text-sm font-body text-gray-500">
            No adoption applications received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Pet &amp; Caregiver</th>
                  <th className="px-5 py-3.5 text-left">Applicant &amp; Schedule</th>
                  <th className="px-5 py-3.5 text-left">Direct Outreach</th>
                  <th className="px-5 py-3.5 text-left">Housing &amp; Experience</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.petImageUrl}
                          alt={app.petName}
                          className="w-12 h-12 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <Link href={`/adoptions/${app.petId}`} className="font-semibold text-[#163829] hover:underline">
                            {app.petName}
                          </Link>
                          <div className="text-xs text-gray-500">{app.petSpecies}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Guardian: {app.petOwnerName || 'FurLink Care Team'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                      <div className="mt-1.5 inline-block border border-amber-200 bg-amber-50 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Call Window: {app.preferredCallTime || 'Anytime'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-semibold text-gray-800">{app.phone}</div>
                      <div className="text-gray-500 max-w-[170px] truncate text-[11px]">
                        {app.address}
                      </div>
                      <div className="mt-1">
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          AES-256 Protected
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={`tel:${app.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center text-xs font-semibold bg-[#163829] text-white hover:bg-[#0D2818] px-3 py-1 rounded-full transition-colors"
                        >
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${app.fullName}, this is FurLink regarding your adoption application for ${app.petName}. Let us coordinate your interview and visit!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 rounded-full transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 max-w-[210px]">
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold text-gray-400 text-[11px]">Housing: </span>
                          <span className="text-gray-800 font-medium">{app.housingType || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400 text-[11px]">Exp: </span>
                          <span className="text-gray-800 font-medium">{app.priorExperience || 'Not specified'}</span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed text-[11px] text-gray-500 mt-1" title={app.reason}>
                          {app.reason}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
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
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-base text-[#163829]">
            Pet Catalog Registry ({pets.length})
          </h3>
          <Link
            href="/adoptions/new"
            className="text-xs font-body font-semibold text-[#163829] hover:underline"
          >
            + Add pet &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">Pet</th>
                <th className="px-5 py-3.5 text-left">Details</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-left">Applications</th>
                <th className="px-5 py-3.5 text-left">Listed Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pets.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-11 h-11 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                      />
                      <div className="font-semibold text-gray-900">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {p.species} · {p.gender} · {p.age} {p.breed ? `· ${p.breed}` : ''}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      p.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : p.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-700">
                    {p._count.applications} applicant{p._count.applications === 1 ? '' : 's'}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/adoptions/${p.id}`}
                      className="text-xs font-body font-semibold text-[#163829] hover:underline"
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
