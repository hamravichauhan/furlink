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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* User Dossier Card */}
        <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 border-2 border-[#1A2540] rounded-2xl bg-[#cc2b3f] text-[#f2e9db] flex items-center justify-center font-heading font-black text-3xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <ProfileEditor currentName={user.name} />
                <p className="font-mono text-xs text-[#1A2540]/60 mt-1 uppercase tracking-wider">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="border-2 border-[#1A2540] bg-white text-[#1A2540] font-bold px-2 py-0.5">
                    Role: {user.role}
                  </span>
                  <span className="text-[#1A2540]/50">
                    Member Since {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="font-mono text-xs uppercase tracking-[0.16em] font-bold px-5 py-3 bg-[#1A2540] text-[#f2e9db] rounded-full hover:bg-[#cc2b3f] transition-colors self-start sm:self-center"
              >
                Access Admin Console →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t-2 border-[#1A2540]/20">
            <StatBlock label="Rescues Logged" value={rescues.length} />
            <StatBlock label="Adoption Inquiries" value={applications.length} />
            <StatBlock label="TNVR Requests" value={sterilizations.length} />
            <StatBlock label="Stories Authored" value={stories.length} />
            <StatBlock label="Medical Allocations" value={donations.length} />
          </div>
        </div>

        {/* Rescues Section */}
        <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b-2 border-[#1A2540]/20 pb-3">
            <h2 className="font-heading uppercase text-2xl font-black text-[#1A2540]">
              My Incident Reports ({rescues.length})
            </h2>
            <Link
              href="/rescues/new"
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline font-bold"
            >
              + File Incident Log
            </Link>
          </div>

          {rescues.length === 0 ? (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/50 py-3">
              No field rescue reports recorded by this account.
            </p>
          ) : (
            <div className="space-y-2.5">
              {rescues.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border-2 border-[#1A2540] rounded-xl bg-white p-3.5 text-sm"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-heading uppercase text-lg font-black text-[#1A2540]">{r.animalType}</span>
                    <span className="font-mono text-[11px] text-[#1A2540]/60 ml-2 uppercase">
                      Sector: {r.location}
                    </span>
                    <p className="text-xs text-[#1A2540]/80 line-clamp-1 mt-0.5">
                      {r.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="border border-[#1A2540] bg-[#f2e9db] px-2 py-0.5 font-bold text-[#1A2540]">
                      {r.status}
                    </span>
                    <span className="text-[#1A2540]/50">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adoption Applications Section */}
        <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1A2540]/20 pb-4">
            <div>
              <h2 className="font-heading uppercase text-2xl sm:text-3xl font-black text-[#1A2540]">
                My Adoption Dossiers ({applications.length})
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/60 mt-1">
                Track status and contact assigned guardians directly
              </p>
            </div>
            <Link
              href="/adoptions"
              className="font-mono text-xs uppercase tracking-[0.16em] bg-[#1A2540] text-[#f2e9db] hover:bg-[#cc2b3f] px-4 py-2 rounded-full font-bold transition-colors self-start sm:self-auto"
            >
              Browse Waiting Board →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 bg-white border-2 border-dashed border-[#1A2540]/30 rounded-xl">
              <p className="font-heading uppercase text-xl font-black text-[#1A2540]">
                No active adoption applications
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/60 mt-1">
                Find an animal waiting for a forever home on our waiting board.
              </p>
              <Link
                href="/adoptions"
                className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline font-bold"
              >
                Meet Animals Looking for Homes →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const guardianPhone = app.pet.contactPhone || '+91 98200 12345';
                const cleanPhone = guardianPhone.replace(/[^0-9]/g, '');
                const guardianName = app.pet.ownerName || 'FurLink Caregiver';
                const whatsappMsg = `Hi ${guardianName}, I submitted adoption application #APP-${app.id.slice(-6).toUpperCase()} for ${app.pet.name} on FurLink. I would love to connect about visiting!`;

                return (
                  <div
                    key={app.id}
                    className="border-2 border-[#1A2540] rounded-xl bg-white p-5 sm:p-6 space-y-4 shadow-sm"
                  >
                    {/* Top Row: Pet & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A2540]/10 pb-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.pet.imageUrl}
                          alt={app.pet.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-[#1A2540] bg-[#f2e9db] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/adoptions/${app.pet.id}`}
                              className="font-heading uppercase text-2xl font-black text-[#1A2540] hover:text-[#cc2b3f] transition-colors"
                            >
                              {app.pet.name}
                            </Link>
                            <span className="font-mono text-xs text-[#1A2540]/60 uppercase">
                              · {app.pet.species} · {app.pet.age}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[11px] text-[#1A2540]/60">
                            <span className="font-bold text-[#1A2540]">
                              DOCKET: APP-{app.id.slice(-6).toUpperCase()}
                            </span>
                            <span>·</span>
                            <span>Filed {new Date(app.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border-2 ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-900'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-900 border-rose-900'
                              : 'bg-amber-100 text-amber-900 border-amber-900'
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Guardian / Shelter Details & Applicant's Window */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f2e9db]/50 border border-[#1A2540]/20 rounded-xl p-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1A2540]/60">
                          Assigned Caregiver / Shelter
                        </div>
                        <div className="font-heading uppercase text-lg font-black text-[#1A2540] mt-0.5">
                          {guardianName}
                        </div>
                        <div className="font-mono text-xs text-[#1A2540]/80 mt-1 space-y-0.5">
                          <p>Facility: {app.pet.location || 'FurLink Care Center'}</p>
                          <p>Direct Mobile: {guardianPhone}</p>
                          <p>Visiting Hours: {app.pet.visitingHours || 'Mon-Sat 10:00 AM - 6:00 PM'}</p>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-[#1A2540]/20 md:pl-4 pt-3 md:pt-0">
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1A2540]/60">
                          Your Stated Availability
                        </div>
                        <div className="mt-1 inline-block border-2 border-[#1A2540] bg-white font-mono text-xs font-bold px-2.5 py-1 text-[#1A2540]">
                          Window: {app.preferredCallTime || 'Anytime'}
                        </div>
                        <p className="font-mono text-[11px] text-[#1A2540]/70 mt-2 leading-relaxed">
                          {app.status === 'APPROVED'
                            ? 'Your application is approved. Please call or WhatsApp the caregiver below to schedule your meet-and-greet.'
                            : app.status === 'REJECTED'
                            ? 'This application has concluded. Feel free to explore other waiting animals.'
                            : 'The guardian will call you during your selected window, or you can reach out to them directly now.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Direct Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`tel:${guardianPhone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-[#1A2540] text-[#f2e9db] hover:bg-[#cc2b3f] px-4 py-2.5 rounded-full transition-colors"
                      >
                        Call Guardian: {guardianPhone}
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2.5 rounded-full transition-colors"
                      >
                        WhatsApp Guardian
                      </a>
                      <Link
                        href={`/adoptions/${app.pet.id}`}
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#1A2540] text-[#1A2540] hover:bg-[#1A2540] hover:text-[#f2e9db] px-4 py-2 rounded-full transition-colors ml-auto"
                      >
                        View Pet Dossier →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sterilizations & Donations Dual Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sterilizations */}
          <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-[#1A2540]/20 pb-3">
              <h2 className="font-heading uppercase text-xl font-black text-[#1A2540]">
                TNVR Field Requests ({sterilizations.length})
              </h2>
              <Link
                href="/sterilization"
                className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline font-bold"
              >
                + Request
              </Link>
            </div>
            {sterilizations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/50 py-2">
                No TNVR cases registered.
              </p>
            ) : (
              <ul className="divide-y-2 divide-[#1A2540]/10 border-t-2 border-[#1A2540]/10">
                {sterilizations.map((st) => (
                  <li key={st.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/sterilization/${st.id}`}
                        className="font-heading uppercase text-base font-black text-[#1A2540] hover:underline"
                      >
                        {st.count} x {st.animalType}
                      </Link>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-[#1A2540]/60">
                        Sector: {st.location}
                      </p>
                    </div>
                    <span className="border border-[#1A2540] bg-white font-mono text-[9px] uppercase tracking-[0.14em] font-bold px-2 py-0.5">
                      {st.status.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Donations */}
          <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-[#1A2540]/20 pb-3">
              <h2 className="font-heading uppercase text-xl font-black text-[#1A2540]">
                My Clinical Allocations ({donations.length})
              </h2>
              <Link
                href="/donate"
                className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline font-bold"
              >
                Allocate →
              </Link>
            </div>
            {donations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/50 py-2">
                No direct clinical support records found.
              </p>
            ) : (
              <ul className="divide-y-2 divide-[#1A2540]/10 border-t-2 border-[#1A2540]/10">
                {donations.map((d) => (
                  <li key={d.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-heading text-lg font-black text-[#cc2b3f]">
                        INR {d.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1A2540]/50 ml-2">
                        REF: {d.paymentId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#1A2540]/60 uppercase">
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
    <div className="p-3.5 border-2 border-[#1A2540] bg-white rounded-xl text-center">
      <div className="font-heading font-black text-3xl text-[#1A2540]">{value}</div>
      <div className="font-mono text-[9.5px] text-[#1A2540]/60 uppercase tracking-[0.16em] mt-1 font-bold">
        {label}
      </div>
    </div>
  );
}
