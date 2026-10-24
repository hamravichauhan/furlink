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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-10 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-4">
          <Link
            href="/adoptions"
            className="font-mono-meta text-[#6461A0] hover:text-[#101124] underline underline-offset-4"
          >
            ← BACK TO WAITING ROW
          </Link>
          <span className="font-mono-meta text-[#314CB6]">
            RECORD LOT // {pet.id.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Main Case Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Portrait, Medical & Personality Dossier */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Portrait */}
            <div className="border-ink-15 bg-white overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-[#161938]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
                <div className="absolute top-3 left-3 bg-[#101124] text-[#EFBDEB] font-mono-meta px-3 py-1 border border-[#314CB6]">
                  {pet.species} // {pet.gender}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#0A81D1] text-[#FFFFFF] font-mono-meta px-3.5 py-1 border border-[#101124] font-bold">
                  WAITING {daysWaiting} DAYS
                </div>
              </div>

              {/* Case Stamp Footer */}
              <div className="p-4 bg-[#FAF8FC] border-t-[1.5px] border-[#101124] flex items-center justify-between font-mono-meta text-[#6461A0]">
                <span>ARRIVAL: {new Date(pet.createdAt).toLocaleDateString()}</span>
                <span>FACILITY: BELAGAVI CLINICAL SANCTUARY</span>
              </div>
            </div>

            {/* Animal Narrative */}
            <div className="bg-white border-ink-15 p-6 space-y-3 shadow-xs">
              <span className="font-mono-meta text-[#314CB6] font-bold block">
                OBSERVER REPORT
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-[#101124]">
                {pet.name}
              </h1>
              <div className="font-mono-meta text-[#0A81D1]">
                {pet.breed || "INDIE BREED"} // ESTIMATED AGE: {pet.age}
              </div>

              <div className="font-sans text-sm text-[#101124] leading-relaxed border-t-[1.5px] border-[#101124] pt-3 whitespace-pre-line">
                {pet.description}
              </div>
            </div>

            {/* Medical Assessment */}
            <div className="bg-white border-ink-15 p-6 space-y-4 shadow-xs">
              <span className="font-mono-meta text-[#0A81D1] font-bold block">
                VETERINARY MEDICAL DOSSIER
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 border-[1.5px] border-[#101124] bg-[#FAF8FC]">
                  <span className="font-mono-meta text-[9px] text-[#6461A0] block">STERILIZATION</span>
                  <span className="font-mono-meta text-xs font-bold text-[#101124] mt-1 block">COMPLETED</span>
                </div>
                <div className="p-3 border-[1.5px] border-[#101124] bg-[#FAF8FC]">
                  <span className="font-mono-meta text-[9px] text-[#6461A0] block">RABIES / ARV</span>
                  <span className="font-mono-meta text-xs font-bold text-[#0A81D1] mt-1 block">VERIFIED OK</span>
                </div>
                <div className="p-3 border-[1.5px] border-[#101124] bg-[#FAF8FC]">
                  <span className="font-mono-meta text-[9px] text-[#6461A0] block">PARASITE PROTOCOL</span>
                  <span className="font-mono-meta text-xs font-bold text-[#101124] mt-1 block">DEWORMED</span>
                </div>
                <div className="p-3 border-[1.5px] border-[#101124] bg-[#FAF8FC]">
                  <span className="font-mono-meta text-[9px] text-[#6461A0] block">MOBILITY</span>
                  <span className="font-mono-meta text-xs font-bold text-[#101124] mt-1 block">SOUND</span>
                </div>
              </div>
            </div>

            {/* Compatibility Matrix */}
            <div className="bg-white border-ink-15 p-6 space-y-3 shadow-xs">
              <span className="font-mono-meta text-[#6461A0] font-bold block">
                COMPATIBILITY PROFILE (FIELD TESTED)
              </span>
              <div className="divide-y-[1.5px] divide-[#101124] font-mono-meta text-[10px] pt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#6461A0]">WITH CHILDREN:</span>
                  <span className="font-bold text-[#101124]">GENTLE & TOLERANT UNDER SUPERVISION</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#6461A0]">WITH OTHER DOGS:</span>
                  <span className="font-bold text-[#101124]">NON-CONFRONTATIONAL PACK MEMBER</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#6461A0]">WITH DOMESTIC CATS:</span>
                  <span className="font-bold text-[#101124]">CALM OBSERVER; NO PREDATORY FIXATION</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#6461A0]">ALONE TIME:</span>
                  <span className="font-bold text-[#101124]">SETTLES COMFORTABLY FOR 4 TO 6 HOURS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Guided Application Form & Secondary Support */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Primary Action Box */}
              <div className="bg-white border-ink-15 p-6 sm:p-7 shadow-lg">
                <span className="font-mono-meta text-[#314CB6] font-bold block mb-1">
                  PLACEMENT PROTOCOL
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-[#101124]">
                  ADOPT {pet.name}
                </h3>
                <p className="font-sans text-xs text-[#6461A0] mt-1 mb-6 leading-relaxed">
                  Submit an initial inquiry. Our shelter counselor reviews your living space and coordinates a guided meet-and-greet.
                </p>

                <AdoptionForm petId={pet.id} petName={pet.name} petStatus={pet.status} />
              </div>

              {/* Secondary Support Action */}
              <div className="bg-[#101124] text-[#FAF8FC] border-[1.5px] border-[#314CB6] p-6 space-y-3 shadow-md">
                <span className="font-mono-meta text-[#EFBDEB] block">
                  CANNOT ADOPT RIGHT NOW?
                </span>
                <div className="font-display text-2xl text-[#FAF8FC]">
                  SPONSOR {pet.name}&apos;S MEDICAL MEALS
                </div>
                <p className="font-sans text-xs text-[#B68CB8] leading-relaxed">
                  ₹500 covers 10 days of prescription food and preventive medical dressing while {pet.name} waits for a permanent family.
                </p>
                <Link
                  href="/donate"
                  className="inline-block w-full py-2.5 bg-[#314CB6] hover:bg-[#0A81D1] text-[#FAF8FC] font-mono-meta text-xs text-center border-[1.5px] border-[#EFBDEB] font-bold transition"
                >
                  Give ₹500 for {pet.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
