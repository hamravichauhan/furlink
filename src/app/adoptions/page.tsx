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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Sanctuary Case Census · Section 01
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-[#1A2540] tracking-tight">
              The Waiting Wall
            </h1>
            <p className="font-body text-sm sm:text-base text-[#1A2540]/80 max-w-xl mt-2 leading-relaxed">
              Every animal is listed with their arrival case record and verified days waiting.
              We prioritize temperament compatibility, complete medical transparency, and lifelong follow-through.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/adoptions/new"
              className="px-5 py-2.5 rounded-full border-[1.5px] border-[#1A2540] bg-white text-[#1A2540] font-body text-xs font-bold hover:bg-[#f2e9db] transition"
            >
              Register Case
            </Link>
            <Link
              href="/donate"
              className="btn-enroll-pill px-6 py-2.5 text-xs font-bold shadow-xs"
            >
              Sponsor Medical Meals
            </Link>
          </div>
        </div>

        {/* Filtering & Status Strip */}
        <div className="bg-[#f2e9db] rounded-2xl p-4 sm:p-5 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  className={`font-body text-xs px-4 py-2 rounded-full border-[1.5px] whitespace-nowrap transition ${
                    active
                      ? "bg-[#cc2b3f] text-[#f2e9db] border-[#cc2b3f] font-bold"
                      : "border-[#1A2540]/20 bg-white/70 text-[#1A2540]/70 hover:text-[#1A2540]"
                  }`}
                >
                  {tab.label} ({tab.count})
                </Link>
              );
            })}
          </div>

          {/* Species Filter Chips */}
          <div className="flex items-center gap-2 font-body text-xs">
            <span className="text-[#1A2540]/60 font-semibold mr-1">SPECIES:</span>
            <Link
              href={`/adoptions?status=${statusFilter}`}
              className={`px-3 py-1 rounded-full border-[1.5px] transition ${
                !speciesFilter
                  ? "bg-[#1A2540] text-[#f2e9db] border-[#1A2540] font-bold"
                  : "border-[#1A2540]/30 bg-white text-[#1A2540]/70 hover:border-[#1A2540]"
              }`}
            >
              All
            </Link>
            {["Dog", "Cat", "Other"].map((s) => (
              <Link
                key={s}
                href={`/adoptions?species=${s}&status=${statusFilter}`}
                className={`px-3 py-1 rounded-full border-[1.5px] transition ${
                  speciesFilter === s
                    ? "bg-[#1A2540] text-[#f2e9db] border-[#1A2540] font-bold"
                    : "border-[#1A2540]/30 bg-white text-[#1A2540]/70 hover:border-[#1A2540]"
                }`}
              >
                {s}s
              </Link>
            ))}
          </div>
        </div>

        {/* Animals Grid */}
        {pets.length === 0 ? (
          <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-[#1A2540]/25 p-16 text-center shadow-lg space-y-4">
            <h3 className="font-heading text-2xl text-[#1A2540]">
              No animals matching this filter
            </h3>
            <p className="font-body text-xs text-[#1A2540]/70 max-w-sm mx-auto">
              Try switching species or status to inspect other companion records.
            </p>
            <Link
              href="/adoptions"
              className="inline-block mt-2 btn-enroll-pill px-6 py-2.5 text-xs font-bold"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, idx) => {
              const daysWaiting = Math.floor(
                (Date.now() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );
              const isCrimson = idx % 2 === 0;

              return (
                <div
                  key={pet.id}
                  className="bg-[#f2e9db] rounded-3xl p-5 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col justify-between group hover:-translate-y-1 transition-transform"
                >
                  <div>
                    {/* Animal Photo with Kiss-Cut Offset Border */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 border-[1.5px] border-[#1A2540] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#1A2540] text-[#f2e9db] font-body text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                        Waiting {daysWaiting} Days
                      </div>
                      <div className="absolute top-3 right-3 bg-[#f2e9db] text-[#cc2b3f] font-body text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#cc2b3f] shadow-md">
                        {pet.status}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h3 className="font-heading text-2xl text-[#1A2540]">
                        {pet.name}
                      </h3>
                      <span className="font-body text-xs text-[#cc2b3f] font-semibold">
                        {pet.breed}
                      </span>
                    </div>

                    <div className="font-body text-xs text-[#1A2540]/60 mt-0.5">
                      {pet.age} · {pet.gender} · {pet.species}
                    </div>

                    <p className="font-body text-xs text-[#1A2540]/80 mt-3 line-clamp-3 leading-relaxed border-t border-[#1A2540]/15 pt-2.5">
                      {pet.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#1A2540]/15 flex items-center justify-between gap-3">
                    <Link
                      href={`/adoptions/${pet.id}`}
                      className="btn-enroll-pill flex-1 py-2.5 text-center text-xs tracking-wider"
                    >
                      ADOPT {pet.name.toUpperCase()}
                    </Link>
                    <Link
                      href="/donate"
                      className="px-4 py-2.5 rounded-full border border-[#1A2540] bg-white hover:bg-[#FAF8FC] font-body text-xs font-bold text-[#1A2540] transition"
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
