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

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#1A2540]/20 pb-4">
          <Link
            href="/adoptions"
            className="font-body text-xs font-semibold text-[#1A2540]/70 hover:text-[#cc2b3f] transition-colors"
          >
            &larr; Back to Waiting Wall
          </Link>
          <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold">
            Case Ref: #{pet.id.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Main Case Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait, Medical & Personality Dossier */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Portrait */}
            <div className="bg-[#f2e9db] rounded-3xl p-5 border-[1.5px] border-[#1A2540]/25 shadow-xl">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-[1.5px] border-[#1A2540] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A2540] text-[#f2e9db] font-body text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {pet.species} · {pet.gender}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#cc2b3f] text-[#f2e9db] font-body text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Waiting {daysWaiting} Days
                </div>
              </div>

              {/* Case Stamp Footer */}
              <div className="mt-4 pt-3 border-t border-[#1A2540]/15 flex items-center justify-between font-body text-xs text-[#1A2540]/70">
                <span>Arrival: {new Date(pet.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="font-semibold text-[#cc2b3f]">Status: {pet.status}</span>
              </div>
            </div>

            {/* Narrative & Temperament */}
            <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-6">
              <div>
                <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
                  Individual Profile
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl text-[#1A2540]">
                  Meet {pet.name}
                </h1>
                <div className="font-body text-xs text-[#cc2b3f] font-semibold mt-1">
                  {pet.breed} · {pet.age} · Verified No-Kill Intake
                </div>
                <p className="font-body text-sm text-[#1A2540] mt-4 leading-relaxed whitespace-pre-line">
                  {pet.description}
                </p>
              </div>

              {/* Clinical Verification Grid */}
              <div className="border-t border-[#1A2540]/15 pt-5 space-y-3">
                <span className="font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold block">
                  Veterinary Checklist
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-body text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#1A2540]/15 text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Sterilization</span>
                    TNVR Certified
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#1A2540]/15 text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Vaccinations</span>
                    7-in-1 + Anti-Rabies
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#1A2540]/15 text-[#1A2540]">
                    <span className="font-bold text-[#cc2b3f] block text-[10px] uppercase">Deworming</span>
                    Current Schedule
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Adoption Intake Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl">
              <div className="border-b border-[#1A2540]/20 pb-4 mb-6">
                <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
                  Adoption Protocol
                </span>
                <h2 className="font-heading text-2xl text-[#1A2540]">
                  Adopt {pet.name}
                </h2>
                <p className="font-body text-xs text-[#1A2540]/75 mt-1 leading-relaxed">
                  Submit your home details. Our sanctuary counselor conducts a gentle phone conversation and schedules an in-person match visit.
                </p>
              </div>

              <AdoptionForm
                petId={pet.id}
                petName={pet.name}
                petStatus={pet.status}
              />
            </div>

            {/* Medical Meal Support Alternative */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#1A2540]/25 p-5 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="font-heading text-xs text-[#1A2540] font-bold block">
                  Cannot adopt right now?
                </span>
                <p className="font-body text-[11px] text-[#1A2540]/70 mt-0.5">
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
