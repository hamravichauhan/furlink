import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { decrypt, decryptField } from '@/lib/security';
import ProfileEditor from './profile-editor';
import OwnerApplicationActions from './owner-application-actions';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getOrCreateCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [rescues, claimedRescues, rawApplications, sterilizations, stories, rawDonations, rawListedPets] = await Promise.all([
    prisma.rescueReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rescueReport.findMany({
      where: { rescuerId: user.id },
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
    prisma.pet.findMany({
      where: { userId: user.id },
      include: {
        applications: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const applications = rawApplications.map((app) => ({
    ...app,
    phone: decrypt(app.phone),
    address: decrypt(app.address),
  }));

  const myListedPets = rawListedPets.map((pet) => ({
    ...pet,
    applications: pet.applications.map((app) => ({
      ...app,
      phone: decrypt(app.phone),
      address: decrypt(app.address),
    })),
  }));

  const donations = rawDonations.map((d) => ({
    ...d,
    donorEmail: decryptField(d.donorEmail),
  }));

  const totalIncomingInquiries = myListedPets.reduce(
    (acc, pet) => acc + pet.applications.length,
    0
  );

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* User Dossier Card */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#163829] text-white flex items-center justify-center font-heading font-black text-3xl shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <ProfileEditor currentName={user.name} />
                <p className="font-mono text-xs text-gray-500 mt-1 uppercase tracking-wider">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="border border-emerald-200 bg-emerald-50 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                    Role: {user.role}
                  </span>
                  <span className="text-gray-400">
                    Member Since {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {user.role === 'ADMIN' ? (
              <Link
                href="/admin"
                className="font-mono text-xs uppercase tracking-[0.16em] font-bold px-5 py-3 bg-[#163829] text-white rounded-full hover:bg-[#1f4e39] transition-colors self-start sm:self-center shadow-xs"
              >
                Access Admin Console →
              </Link>
            ) : (
              <Link
                href="/api/auth-switch?role=admin&redirect=/admin"
                className="font-mono text-xs uppercase tracking-[0.16em] font-bold px-5 py-3 border border-gray-200 bg-white text-[#163829] rounded-full hover:bg-gray-50 transition-colors self-start sm:self-center shadow-xs"
              >
                Switch to Admin Mode →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-8 pt-6 border-t border-gray-100">
            <StatBlock label="My Listed Pets" value={myListedPets.length} />
            <StatBlock label="Incoming Inquiries" value={totalIncomingInquiries} />
            <StatBlock label="My Applications" value={applications.length} />
            <StatBlock label="Rescues Logged" value={rescues.length} />
            <StatBlock label="Rescues Claimed" value={claimedRescues.length} />
            <StatBlock label="TNVR Requests" value={sterilizations.length} />
          </div>
        </div>

        {/* Incoming Inquiries on My Listed Pets (For Pet Owners / Guardians) */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-800">
                  Owner Guardian Dashboard
                </span>
              </div>
              <h2 className="font-heading uppercase text-2xl sm:text-3xl font-black text-[#163829] mt-0.5">
                Inquiries for My Listed Pets ({totalIncomingInquiries})
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mt-1">
                Direct applications submitted by adopters seeking your animals
              </p>
            </div>
            <Link
              href="/adoptions/new"
              className="font-mono text-xs uppercase tracking-[0.16em] bg-[#163829] text-white hover:bg-[#1f4e39] px-4 py-2 rounded-full font-bold transition-colors self-start sm:self-auto shadow-xs"
            >
              + List Pet for Adoption
            </Link>
          </div>

          {myListedPets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-6">
              <p className="font-heading uppercase text-lg font-black text-[#163829]">
                No pets listed for adoption by your account
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500 mt-1 max-w-md mx-auto">
                Have a foster companion or rescue animal looking for a safe home? List them on our Waiting Wall.
              </p>
              <Link
                href="/adoptions/new"
                className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
              >
                + Register New Pet Listing →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myListedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="border border-gray-200/80 rounded-2xl bg-[#F8FAF8] p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  {/* Pet Summary Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-gray-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/adoptions/${pet.id}`}
                            className="font-heading uppercase text-xl font-black text-[#163829] hover:text-emerald-700 transition-colors"
                          >
                            {pet.name}
                          </Link>
                          <span className="font-mono text-xs text-gray-500 uppercase">
                            · {pet.species} · {pet.gender} · {pet.age}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-gray-500 mt-0.5">
                          <span>Status: </span>
                          <span className="font-bold text-[#163829] uppercase">{pet.status}</span>
                          <span> · </span>
                          <span>{pet.applications.length} inquiry received</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/adoptions/${pet.id}`}
                      className="font-mono text-xs uppercase tracking-wider text-emerald-700 hover:underline font-bold self-start sm:self-auto"
                    >
                      View Public Dossier →
                    </Link>
                  </div>

                  {/* Pet Inquiries List */}
                  {pet.applications.length === 0 ? (
                    <div className="p-4 bg-white border border-gray-200/80 rounded-xl text-center font-mono text-xs text-gray-500 uppercase tracking-wide">
                      No applications received for {pet.name} yet. Potential adopters will appear here as soon as they submit their intake dossier.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pet.applications.map((app) => {
                        const cleanPhone = app.phone.replace(/[^0-9]/g, '');
                        const whatsappMsg = `Hi ${app.fullName}, this is ${user.name || 'the guardian'} regarding your adoption application for ${pet.name} on FurLink. Let us connect to discuss your meet-and-greet visit!`;

                        return (
                          <div
                            key={app.id}
                            className="bg-white border border-gray-200/80 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs"
                          >
                            {/* Applicant Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                              <div>
                                <span className="font-heading uppercase text-lg font-black text-[#163829]">
                                  {app.fullName}
                                </span>
                                <span className="font-mono text-xs text-gray-400 ml-2 uppercase">
                                  · Docket: APP-{app.id.slice(-6).toUpperCase()}
                                </span>
                                <div className="mt-1 inline-block border border-amber-200 bg-amber-50 text-amber-900 font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
                                  Preferred Call Window: {app.preferredCallTime || 'Anytime'}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                                    app.status === 'APPROVED'
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : app.status === 'REJECTED'
                                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </div>
                            </div>

                            {/* Applicant Contact & Answers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
                              <div className="space-y-1">
                                <p>
                                  <span className="font-bold text-gray-500 uppercase">Phone: </span>
                                  <span className="font-bold text-[#163829]">{app.phone}</span>
                                </p>
                                <p>
                                  <span className="font-bold text-gray-500 uppercase">Email: </span>
                                  <span className="text-[#163829]">{app.user.email}</span>
                                </p>
                                <p>
                                  <span className="font-bold text-gray-500 uppercase">Address: </span>
                                  <span className="text-[#163829]">{app.address}</span>
                                </p>
                                <p className="pt-0.5">
                                  <span className="font-mono text-[9px] text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-1.5 py-0.5 rounded-full font-bold uppercase">
                                    AES-256 Encrypted At Rest
                                  </span>
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <span className="font-bold text-gray-500 uppercase">Housing: </span>
                                  <span className="text-[#163829]">{app.housingType || 'Not specified'}</span>
                                </p>
                                <p>
                                  <span className="font-bold text-gray-500 uppercase">Prior Experience: </span>
                                  <span className="text-[#163829]">{app.priorExperience || 'Not specified'}</span>
                                </p>
                                <p className="text-[11px] text-gray-600 line-clamp-2">
                                  <span className="font-bold text-gray-500 uppercase">Note: </span>
                                  {app.reason}
                                </p>
                              </div>
                            </div>

                            {/* Direct Action Bar for Jayesh (Owner) */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${app.phone.replace(/\s+/g, '')}`}
                                  className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-[#163829] text-white hover:bg-[#1f4e39] px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
                                >
                                  Call: {app.phone}
                                </a>
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-emerald-700 text-white hover:bg-emerald-800 px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
                                >
                                  WhatsApp Rina
                                </a>
                              </div>

                              <OwnerApplicationActions
                                applicationId={app.id}
                                currentStatus={app.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rescues I Am Handling (Volunteer Claims) */}
        {claimedRescues.length > 0 && (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="font-heading uppercase text-2xl font-black text-[#163829]">
                  Rescues I Am Handling ({claimedRescues.length})
                </h2>
                <p className="font-mono text-xs uppercase text-gray-500 mt-0.5">
                  Cases you claimed as a volunteer responder
                </p>
              </div>
              <Link
                href="/rescues"
                className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
              >
                Browse Feed &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {claimedRescues.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200/80 rounded-2xl bg-[#F8FAF8] p-4 text-sm gap-3"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-heading uppercase text-lg font-black text-[#163829]">{r.animalType}</span>
                    <span className="font-mono text-[11px] text-gray-500 ml-2 uppercase">
                      Sector: {r.location}
                    </span>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                      {r.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="border border-gray-200 bg-white px-2.5 py-0.5 font-bold text-[#163829] rounded-full">
                      {r.status}
                    </span>
                    <Link
                      href={`/rescues/${r.id}`}
                      className="bg-[#163829] text-white hover:bg-[#1f4e39] px-3.5 py-1.5 rounded-full font-bold uppercase transition-colors shadow-xs"
                    >
                      {r.status === 'IN_PROGRESS' ? 'Submit Proof & Bill →' : 'View Case →'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rescues Section (Reported by Me) */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-heading uppercase text-2xl font-black text-[#163829]">
              My Incident Reports ({rescues.length})
            </h2>
            <Link
              href="/rescues/new"
              className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
            >
              + File Incident Log
            </Link>
          </div>

          {rescues.length === 0 ? (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-400 py-3">
              No field rescue reports recorded by this account.
            </p>
          ) : (
            <div className="space-y-2.5">
              {rescues.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200/80 rounded-2xl bg-[#F8FAF8] p-3.5 text-sm gap-2"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-heading uppercase text-lg font-black text-[#163829]">{r.animalType}</span>
                    <span className="font-mono text-[11px] text-gray-500 ml-2 uppercase">
                      Sector: {r.location}
                    </span>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                      {r.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="border border-gray-200 bg-white px-2.5 py-0.5 font-bold text-[#163829] rounded-full">
                      {r.status}
                    </span>
                    <Link
                      href={`/rescues/${r.id}`}
                      className="border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] px-3 py-1 rounded-full font-bold uppercase transition-colors shadow-xs"
                    >
                      Track Case &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adoption Applications Section */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-heading uppercase text-2xl sm:text-3xl font-black text-[#163829]">
                My Adoption Dossiers ({applications.length})
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mt-1">
                Track status and contact assigned guardians directly
              </p>
            </div>
            <Link
              href="/adoptions"
              className="font-mono text-xs uppercase tracking-[0.16em] bg-[#163829] text-white hover:bg-[#1f4e39] px-4 py-2 rounded-full font-bold transition-colors self-start sm:self-auto shadow-xs"
            >
              Browse Waiting Board →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
              <p className="font-heading uppercase text-xl font-black text-[#163829]">
                No active adoption applications
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500 mt-1">
                Find an animal waiting for a forever home on our waiting board.
              </p>
              <Link
                href="/adoptions"
                className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
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
                    className="border border-gray-200/80 rounded-2xl bg-white p-5 sm:p-6 space-y-4 shadow-xs"
                  >
                    {/* Top Row: Pet & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.pet.imageUrl}
                          alt={app.pet.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-200 bg-gray-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/adoptions/${app.pet.id}`}
                              className="font-heading uppercase text-2xl font-black text-[#163829] hover:text-emerald-700 transition-colors"
                            >
                              {app.pet.name}
                            </Link>
                            <span className="font-mono text-xs text-gray-500 uppercase">
                              · {app.pet.species} · {app.pet.age}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[11px] text-gray-500">
                            <span className="font-bold text-[#163829]">
                              DOCKET: APP-{app.id.slice(-6).toUpperCase()}
                            </span>
                            <span>·</span>
                            <span>Filed {new Date(app.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Guardian / Shelter Details & Applicant's Window */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Assigned Caregiver / Shelter
                        </div>
                        <div className="font-heading uppercase text-lg font-black text-[#163829] mt-0.5">
                          {guardianName}
                        </div>
                        <div className="font-mono text-xs text-gray-600 mt-1 space-y-0.5">
                          <p>Facility: {app.pet.location || 'FurLink Care Center'}</p>
                          <p>Direct Mobile: {guardianPhone}</p>
                          <p>Visiting Hours: {app.pet.visitingHours || 'Mon-Sat 10:00 AM - 6:00 PM'}</p>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-3 md:pt-0">
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Your Stated Availability
                        </div>
                        <div className="mt-1 inline-block border border-gray-200 bg-white font-mono text-xs font-bold px-2.5 py-1 text-[#163829] rounded-md">
                          Window: {app.preferredCallTime || 'Anytime'}
                        </div>
                        <p className="font-mono text-[11px] text-gray-500 mt-2 leading-relaxed">
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
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-[#163829] text-white hover:bg-[#1f4e39] px-4 py-2.5 rounded-full transition-colors shadow-xs"
                      >
                        Call Guardian: {guardianPhone}
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2.5 rounded-full transition-colors shadow-xs"
                      >
                        WhatsApp Guardian
                      </a>
                      <Link
                        href={`/adoptions/${app.pet.id}`}
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider font-bold border border-gray-200 text-[#163829] hover:bg-gray-50 px-4 py-2 rounded-full transition-colors ml-auto shadow-xs"
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
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-heading uppercase text-xl font-black text-[#163829]">
                TNVR Field Requests ({sterilizations.length})
              </h2>
              <Link
                href="/sterilization"
                className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
              >
                + Request
              </Link>
            </div>
            {sterilizations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-400 py-2">
                No TNVR cases registered.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 border-t border-gray-100">
                {sterilizations.map((st) => (
                  <li key={st.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/sterilization/${st.id}`}
                        className="font-heading uppercase text-base font-black text-[#163829] hover:underline"
                      >
                        {st.count} x {st.animalType}
                      </Link>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                        Sector: {st.location}
                      </p>
                    </div>
                    <span className="border border-gray-200 bg-gray-50 font-mono text-[9px] uppercase tracking-[0.14em] font-bold px-2 py-0.5 rounded-full text-[#163829]">
                      {st.status.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Donations */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-heading uppercase text-xl font-black text-[#163829]">
                My Clinical Allocations ({donations.length})
              </h2>
              <Link
                href="/donate"
                className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:underline font-bold"
              >
                Allocate →
              </Link>
            </div>
            {donations.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-400 py-2">
                No direct clinical support records found.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 border-t border-gray-100">
                {donations.map((d) => (
                  <li key={d.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-heading text-lg font-black text-emerald-800">
                        INR {d.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400 ml-2">
                        REF: {d.paymentId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-gray-500 uppercase">
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
    <div className="p-3.5 border border-gray-100 bg-gray-50/70 rounded-2xl text-center shadow-2xs">
      <div className="font-heading font-black text-3xl text-[#163829]">{value}</div>
      <div className="font-mono text-[9.5px] text-gray-500 uppercase tracking-[0.16em] mt-1 font-bold">
        {label}
      </div>
    </div>
  );
}
