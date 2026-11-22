import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ species?: string; status?: string }>;
}

export default async function AdoptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const speciesFilter = params.species;
  const statusFilter = params.status ?? "AVAILABLE";

  const where: any = {};
  if (speciesFilter && ["Dog", "Cat", "Other"].includes(speciesFilter)) {
    where.species = speciesFilter;
  }
  if (["AVAILABLE", "PENDING", "ADOPTED"].includes(statusFilter)) {
    where.status = statusFilter;
  }

  const [pets, counts] = await Promise.all([
    prisma.pet.findMany({
      where,
      orderBy: { createdAt: "asc" },
    }),
    prisma.pet.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countMap: Record<string, number> = {
    AVAILABLE: 0,
    PENDING: 0,
    ADOPTED: 0,
  };
  for (const row of counts) {
    countMap[row.status] = row._count._all;
  }

  const tabs = [
    { key: "AVAILABLE", label: "Currently Waiting", count: countMap.AVAILABLE },
    { key: "PENDING", label: "Application In Review", count: countMap.PENDING },
    { key: "ADOPTED", label: "Homes Found", count: countMap.ADOPTED },
  ];

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 sm:py-14 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Masthead */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#163829] px-3.5 py-1.5 rounded-full text-xs font-bold font-body mb-3">
              <span className="w-2 h-2 rounded-full bg-[#163829]" />
              <span>FurLink Sanctuary Case Census · Section 01</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-[#163829] tracking-tight font-black">
              Adoptable Rescued Companions
            </h1>
            <p className="font-body text-sm sm:text-base text-[#163829]/75 max-w-xl mt-2 leading-relaxed">
              Every animal is listed with their arrival case record and verified days waiting.
              We prioritize temperament compatibility, complete medical transparency, and lifelong follow-through.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/adoptions/new"
              className="px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[#163829] font-body text-xs font-semibold hover:bg-gray-50 transition"
            >
              List Pet For Adoption
            </Link>
            <Link
              href="/donate"
              className="btn-paw-primary px-6 py-2.5 text-xs font-semibold shadow-xs"
            >
              Sponsor Medical Meals
            </Link>
          </div>
        </div>

        {/* Filtering & Status Strip */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const active = statusFilter === tab.key;
              const href = speciesFilter
                ? `/adoptions?species=${speciesFilter}&status=${tab.key}`
                : `/adoptions?status=${tab.key}`;
              return (
                <Link
                  key={tab.key}
                  href={href}
                  className={`font-body text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition ${
                    active
                      ? "bg-[#163829] text-white shadow-xs"
                      : "border border-gray-200 bg-white text-[#163829]/70 hover:text-[#163829] hover:bg-gray-50"
                  }`}
                >
                  {tab.label} ({tab.count})
                </Link>
              );
            })}
          </div>

          {/* Species Filter Chips */}
          <div className="flex items-center gap-2 font-body text-xs">
            <span className="text-gray-400 font-semibold mr-1">SPECIES:</span>
            <Link
              href={`/adoptions?status=${statusFilter}`}
              className={`px-3 py-1 rounded-full transition font-semibold ${
                !speciesFilter
                  ? "bg-[#D8F3DC] text-[#163829] border border-[#bceac2]"
                  : "border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </Link>
            {["Dog", "Cat", "Other"].map((s) => (
              <Link
                key={s}
                href={`/adoptions?species=${s}&status=${statusFilter}`}
                className={`px-3 py-1 rounded-full transition font-semibold ${
                  speciesFilter === s
                    ? "bg-[#D8F3DC] text-[#163829] border border-[#bceac2]"
                    : "border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
                }`}
              >
                {s}s
              </Link>
            ))}
          </div>
        </div>

        {/* Animals Grid */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-16 text-center shadow-xs space-y-4">
            <h3 className="font-heading text-2xl text-[#163829] font-black">
              No animals matching this filter
            </h3>
            <p className="font-body text-xs text-gray-500 max-w-sm mx-auto">
              Try switching species or status to inspect other companion records.
            </p>
            <Link
              href="/adoptions"
              className="inline-block mt-2 btn-paw-primary px-6 py-2.5 text-xs font-semibold"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const daysWaiting = Math.floor(
                (Date.now() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-[#163829] hover:shadow-md transition-all"
                >
                  <div>
                    {/* Animal Photo with Clean Rounded Border */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 border border-gray-200 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#163829]/90 backdrop-blur-xs text-white font-body text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                        Waiting {daysWaiting} Days
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 text-[#163829] font-body text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 shadow-md">
                        {pet.status}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h3 className="font-heading text-2xl font-black text-[#163829]">
                        {pet.name}
                      </h3>
                      <span className="font-body text-xs text-[#cc2b3f] font-semibold">
                        {pet.breed}
                      </span>
                    </div>

                    <div className="font-body text-xs text-gray-500 mt-0.5">
                      {pet.age} · {pet.gender} · {pet.species}
                    </div>

                    <p className="font-body text-xs text-[#163829]/75 mt-3 line-clamp-3 leading-relaxed border-t border-gray-100 pt-2.5">
                      {pet.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/adoptions/${pet.id}`}
                      className="btn-paw-primary flex-1 py-2.5 text-center text-xs font-semibold shadow-xs"
                    >
                      Adopt {pet.name} &rarr;
                    </Link>
                    <Link
                      href="/donate"
                      className="px-4 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 font-body text-xs font-semibold text-[#163829] transition"
                    >
                      Sponsor
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
