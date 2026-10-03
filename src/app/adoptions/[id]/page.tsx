//adoption/[id]/page

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdoptionForm from "./adoption-form";

export const dynamic = "force-dynamic";

const isUrl = (u: string) => /^https?:\/\/.+/i.test(u);

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  ADOPTED: "bg-gray-100 text-gray-700 border-gray-200",
};

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/adoptions"
          className="text-sm text-gray-500 hover:underline mb-6 inline-block"
        >
          ← Back to catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: pet info */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="relative aspect-square w-full bg-gray-100">
              {isUrl(pet.imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <span className="text-6xl">🐾</span>
                </div>
              )}
              <span
                className={`absolute top-4 right-4 text-[10px] font-semibold px-3 py-1 rounded-full border uppercase tracking-wider backdrop-blur bg-white/90 ${
                  STATUS_STYLES[pet.status] ?? "bg-gray-100"
                }`}
              >
                {pet.status}
              </span>
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>

              <div className="flex flex-wrap gap-2 mt-3">
                <Tag>{pet.species}</Tag>
                <Tag tone="blue">{pet.gender}</Tag>
                <Tag tone="gray">{pet.age}</Tag>
                {pet.breed && <Tag tone="amber">{pet.breed}</Tag>}
              </div>

              <p className="text-gray-700 text-sm mt-5 leading-relaxed whitespace-pre-line">
                {pet.description}
              </p>
            </div>
          </div>

          {/* Right: adoption form */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            {pet.status === "ADOPTED" ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-xl font-bold text-gray-900">
                  {pet.name} has been adopted!
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Thanks to everyone who cared. Browse other friends still
                  looking for a home.
                </p>
                <Link
                  href="/adoptions"
                  className="inline-block mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
                >
                  Meet other pets →
                </Link>
              </div>
            ) : pet.status === "PENDING" ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">⏳</div>
                <h2 className="text-xl font-bold text-gray-900">
                  Application under review
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Someone has applied to adopt {pet.name}. If it doesn&apos;t
                  work out, the listing will reopen.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">
                  Interested in adopting {pet.name}?
                </h2>
                <p className="text-xs text-gray-500 mt-1 mb-5">
                  Fill out the form below. Our animal care team reviews every
                  application and will reach out to schedule a meet-and-greet.
                </p>
                <AdoptionForm petId={pet.id} petStatus={pet.status} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "blue" | "gray" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
    amber: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
