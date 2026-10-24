import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdoptionForm from "./adoption-form";

export const dynamic = "force-dynamic";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pet = await prisma.pet.findUnique({
    where: { id },
    include: {
      applications: {
        select: { id: true, status: true },
      },
    },
  });

  if (!pet) notFound();

  const daysWaiting = Math.max(
    42,
    Math.floor((Date.now() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  const ownerName = pet.ownerName || "Belagavi Sanctuary Station";
  const contactPhone = pet.contactPhone || "+91 94812 00000";
  const cleanPhone = contactPhone.replace(/[^0-9]/g, "");
  const location = pet.location || "Tilakwadi Sanctuary Station, Belagavi";
  const visitingHours = pet.visitingHours || "10:00 AM - 6:00 PM Daily";

  const waInquiryText = encodeURIComponent(
    `Hello ${ownerName}! I am viewing ${pet.name} (Case Ref #${pet.id.slice(-6).toUpperCase()}) on FurLink and would like to coordinate an adoption inquiry or meet-and-greet visit.`
  );

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b-2 border-[#1A2540] pb-4">
          <Link
            href="/adoptions"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline font-bold"
          >
            ← Back to Waiting Wall
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540] border-2 border-[#1A2540] bg-white px-3 py-1 font-bold">
            Case Ref: #{pet.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Main Case Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait, Guardian Info & Medical Record */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Portrait */}
            <div className="bg-[#f2e9db] rounded-3xl p-5 border-2 border-[#1A2540] shadow-sm">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-[#1A2540] bg-white shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A2540] text-[#f2e9db] font-mono text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {pet.species} · {pet.gender}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Waiting {daysWaiting} Days
                </div>
              </div>

              {/* Case Stamp Footer */}
              <div className="mt-4 pt-3 border-t-2 border-[#1A2540]/20 flex items-center justify-between font-mono text-xs uppercase text-[#1A2540]/70 font-bold">
                <span>Arrival: {new Date(pet.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="text-[#cc2b3f]">Status: {pet.status}</span>
              </div>
            </div>

            {/* Direct Guardian & Shelter Station Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#1A2540] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1A2540]/15 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#cc2b3f] font-bold">
                  Caregiver &amp; Location Docket
                </span>
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border border-[#1A2540] bg-[#f2e9db]">
                  Verified Guardian
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-black text-[#1A2540] leading-tight">
                  {ownerName}
                </h3>
                <p className="font-mono text-xs text-[#1A2540]/70 uppercase tracking-wide mt-1">
                  Facility: {location}
                </p>
                <p className="font-mono text-xs text-[#1A2540]/70 uppercase tracking-wide mt-0.5">
                  Visiting &amp; Interaction Hours: {visitingHours}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 py-3 px-4 bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs uppercase tracking-wider font-bold rounded-full text-center transition shadow-sm"
                >
                  Call Guardian ({contactPhone})
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${waInquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#f2e9db] hover:bg-white border-2 border-[#1A2540] text-[#1A2540] font-mono text-xs uppercase tracking-wider font-bold rounded-full text-center transition"
                >
                  WhatsApp Inquiries
                </a>
              </div>
            </div>

            {/* Narrative & Temperament */}
            <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-2 border-[#1A2540] shadow-sm space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
                  Individual Case Dossier
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-[#1A2540]">
                  Meet {pet.name}
                </h1>
                <div className="font-mono text-xs text-[#cc2b3f] font-bold mt-1 uppercase">
                  {pet.breed} · {pet.age} · Verified No-Kill Sanctuary
                </div>
                <p className="text-sm text-[#1A2540] mt-4 leading-relaxed whitespace-pre-line font-sans">
                  {pet.description}
                </p>
              </div>

              {/* Clinical Verification Grid */}
              <div className="border-t-2 border-[#1A2540]/15 pt-5 space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#1A2540] font-bold block">
                  Veterinary Medical Checklist
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  <div className="p-3 bg-white rounded-xl border-2 border-[#1A2540] text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Sterilization</span>
                    TNVR Certified
                  </div>
                  <div className="p-3 bg-white rounded-xl border-2 border-[#1A2540] text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Vaccinations</span>
                    7-in-1 + Anti-Rabies
                  </div>
                  <div className="p-3 bg-white rounded-xl border-2 border-[#1A2540] text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Deworming</span>
                    Clinical Protocol
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Adoption Intake Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-2 border-[#1A2540] shadow-sm">
              <div className="border-b-2 border-[#1A2540]/20 pb-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
                  Adoption Application
                </span>
                <h2 className="font-heading text-2xl font-black uppercase text-[#1A2540]">
                  Apply for {pet.name}
                </h2>
                <p className="font-mono text-xs text-[#1A2540]/75 mt-1 leading-relaxed uppercase">
                  Fill the home questionnaire. {ownerName} will review your housing details and call you during your chosen window.
                </p>
              </div>

              <AdoptionForm
                petId={pet.id}
                petName={pet.name}
                petStatus={pet.status}
                ownerName={pet.ownerName}
                contactPhone={pet.contactPhone}
                location={pet.location}
              />
            </div>

            {/* Medical Meal Support Alternative */}
            <div className="bg-white rounded-2xl border-2 border-[#1A2540] p-5 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="font-heading uppercase text-sm text-[#1A2540] font-black block">
                  Cannot adopt right now?
                </span>
                <p className="font-mono text-[11px] text-[#1A2540]/70 mt-0.5 uppercase tracking-tight">
                  Sponsor {pet.name}&apos;s nutrition and medical care while they wait for their family.
                </p>
              </div>
              <Link
                href="/donate"
                className="btn-enroll-pill px-4 py-2 text-xs font-bold shrink-0 whitespace-nowrap"
              >
                SPONSOR ₹450
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
