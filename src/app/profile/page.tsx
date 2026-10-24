import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import ProfileEditor from './profile-editor';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getOrCreateCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [rescues, applications, sterilizations, stories, donations] = await Promise.all([
    prisma.rescueReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.adoptionApplication.findMany({
      where: { userId: user.id },
      include: { pet: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sterilizationRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.furStory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* User Dossier Card */}
        <div className="bg-white border-[1.5px] border-[#101124] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 border-[1.5px] border-[#101124] bg-[#314CB6] text-white flex items-center justify-center font-display text-3xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <ProfileEditor currentName={user.name} />
                <p className="font-mono text-xs text-[#101124]/60 mt-1 uppercase tracking-wider">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 text-[#101124] font-bold px-2 py-0.5">
                    Role: {user.role}
                  </span>
                  <span className="text-[#101124]/50">
                    Member Since {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold px-5 py-2.5 bg-[#101124] text-[#FAF8FC] border-[1.5px] border-[#101124] hover:bg-[#314CB6] transition-colors self-start sm:self-center"
              >
                Access Admin Console &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t-[1.5px] border-[#101124]">
            <StatBlock label="Rescues Logged" value={rescues.length} />
            <StatBlock label="Adoption Inquiries" value={applications.length} />
            <StatBlock label="TNVR Requests" value={sterilizations.length} />
            <StatBlock label="Stories Authored" value={stories.length} />
            <StatBlock label="Medical Allocations" value={donations.length} />
          </div>
        </div>

        {/* Rescues Section */}
        <div className="bg-white border-[1.5px] border-[#101124] p-6 space-y-4">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-3">
            <h2 className="font-display uppercase text-2xl text-[#101124]">
              My Incident Reports ({rescues.length})
            </h2>
            <Link
              href="/rescues/new"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline font-bold"
            >
              + File Incident Log
            </Link>
          </div>

          {rescues.length === 0 ? (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#101124]/50 py-3">
              No field rescue reports recorded by this account.
            </p>
          ) : (
            <div className="space-y-2.5">
              {rescues.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 text-sm"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-display uppercase text-base text-[#101124]">{r.animalType}</span>
                    <span className="font-mono text-[11px] text-[#101124]/60 ml-2 uppercase">
                      Sector: {r.location}
                    </span>
                    <p className="font-body text-xs text-[#101124]/80 line-clamp-1 mt-0.5">
                      {r.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="border-[1.5px] border-[#101124] bg-white px-2 py-0.5 font-bold">
                      {r.status}
                    </span>
                    <span className="text-[#101124]/50">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adoption Applications Section */}
        <div className="bg-white border-[1.5px] border-[#101124] p-6 space-y-4">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-3">
            <h2 className="font-display uppercase text-2xl text-[#101124]">
              Adoption Applications ({applications.length})
            </h2>
            <Link
              href="/adoptions"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline font-bold"
            >
              Browse Waiting Wall &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#101124]/50 py-3">
              No active adoption dossiers submitted.
            </p>
          ) : (
            <div className="space-y-2.5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={app.pet.imageUrl}
                      alt={app.pet.name}
                      className="w-12 h-12 object-cover border-[1.5px] border-[#101124] bg-[#FAF8FC]"
                    />
                    <div>
                      <Link
                        href={`/adoptions/${app.pet.id}`}
                        className="font-display uppercase text-lg text-[#101124] hover:text-[#314CB6]"
                      >
                        {app.pet.name} ({app.pet.species})
                      </Link>
                      <p className="font-mono text-[10.5px] uppercase tracking-wide text-[#101124]/60">
                        Contact: {app.fullName} · {app.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="border-[1.5px] border-[#101124] bg-white px-2 py-0.5 font-bold">
                      {app.status}
                    </span>
                    <span className="text-[#101124]/50">
                      {new Date(app.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sterilizations & Donations Dual Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sterilizations */}
          <div className="bg-white border-[1.5px] border-[#101124] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-3">
              <h2 className="font-display uppercase text-xl text-[#101124]">
                TNVR Field Requests ({sterilizations.length})
              </h2>
              <Link
                href="/sterilization"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline font-bold"
              >
                + Request
              </Link>
            </div>
            {sterilizations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#101124]/50 py-2">
                No TNVR cases registered.
              </p>
            ) : (
              <ul className="divide-y border-t border-[#101124]/15 divide-[#101124]/15">
                {sterilizations.map((st) => (
                  <li key={st.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/sterilization/${st.id}`}
                        className="font-display uppercase text-base text-[#101124] hover:underline"
                      >
                        {st.count} x {st.animalType}
                      </Link>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-[#101124]/60">
                        Sector: {st.location}
                      </p>
                    </div>
                    <span className="border-[1.5px] border-[#101124] bg-[#FAF8FC] font-mono text-[9px] uppercase tracking-[0.14em] font-bold px-2 py-0.5">
                      {st.status.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Donations */}
          <div className="bg-white border-[1.5px] border-[#101124] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-3">
              <h2 className="font-display uppercase text-xl text-[#101124]">
                My Clinical Allocations ({donations.length})
              </h2>
              <Link
                href="/donate"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline font-bold"
              >
                Allocate
              </Link>
            </div>
            {donations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#101124]/50 py-2">
                No direct clinical support records found.
              </p>
            ) : (
              <ul className="divide-y border-t border-[#101124]/15 divide-[#101124]/15">
                {donations.map((d) => (
                  <li key={d.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg text-[#314CB6]">
                        INR {d.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#101124]/50 ml-2">
                        REF: {d.paymentId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] text-[#101124]/60 uppercase">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3.5 border-[1.5px] border-[#101124] bg-[#FAF8FC] text-center">
      <div className="font-display text-3xl text-[#101124]">{value}</div>
      <div className="font-mono text-[9.5px] text-[#101124]/60 uppercase tracking-[0.16em] mt-1">
        {label}
      </div>
    </div>
  );
}
