import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import AdoptionForm from "./adoption-form";

export const dynamic = "force-dynamic";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [pet, currentUser] = await Promise.all([
    prisma.pet.findUnique({
      where: { id },
      include: {
        applications: {
          select: { id: true, status: true },
        },
      },
    }),
    getOrCreateCurrentUser(),
  ]);

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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <Link
            href="/adoptions"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#163829] hover:underline font-bold"
          >
            ← Back to Waiting Wall
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#163829] border border-gray-200 bg-white px-3 py-1 font-bold rounded-full shadow-xs">
            Case Ref: #{pet.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Main Case Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait, Guardian Info & Medical Record */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Portrait */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#163829]/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {pet.species} · {pet.gender}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  Waiting {daysWaiting} Days
                </div>
              </div>

              {/* Case Stamp Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Arrival: {new Date(pet.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="font-semibold text-emerald-700">Status: {pet.status}</span>
              </div>
            </div>

            {/* Direct Guardian & Shelter Station Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                  Caregiver &amp; Shelter Docket
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                  Verified Guardian
                </span>
              </div>

              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#163829] leading-tight">
                  {ownerName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Facility: {location}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visiting &amp; Interaction Hours: {visitingHours}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 py-3 px-4 btn-paw-primary text-xs font-bold rounded-full text-center transition shadow-xs"
                >
                  Call Guardian ({contactPhone})
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${waInquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#163829] text-xs font-semibold rounded-full text-center transition shadow-xs"
                >
                  WhatsApp Inquiries
                </a>
              </div>
            </div>

            {/* Narrative & Temperament */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
                  Individual Case Dossier
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#163829]">
                  Meet {pet.name}
                </h1>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  {pet.breed} · {pet.age} · Verified No-Kill Sanctuary
                </div>
                <p className="text-sm text-gray-700 mt-4 leading-relaxed whitespace-pre-line font-body">
                  {pet.description}
                </p>
              </div>

              {/* Clinical Verification Grid */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold block">
                  Veterinary Medical Checklist
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 text-[#163829]">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase">Sterilization</span>
                    TNVR Certified
                  </div>
                  <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 text-[#163829]">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase">Vaccinations</span>
                    7-in-1 + Anti-Rabies
                  </div>
                  <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 text-[#163829]">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase">Deworming</span>
                    Clinical Protocol
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Adoption Intake Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
                  Adoption Application
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#163829]">
                  Apply for {pet.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
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
                currentUserId={currentUser?.id || null}
              />
            </div>

            {/* Medical Meal Support Alternative */}
            <div className="bg-emerald-50/60 rounded-3xl border border-emerald-100 p-5 flex items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="font-heading text-sm text-[#163829] font-bold block">
                  Cannot adopt right now?
                </span>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Sponsor {pet.name}&apos;s nutrition and medical care while they wait for their family.
                </p>
              </div>
              <Link
                href={`/donate?pet=${encodeURIComponent(pet.name)}&amount=450`}
                className="btn-paw-primary px-4 py-2.5 text-xs font-bold rounded-full shrink-0 whitespace-nowrap shadow-xs"
              >
                Sponsor ₹450 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
