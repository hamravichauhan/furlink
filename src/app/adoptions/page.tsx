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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b-[1.5px] border-[#101124] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-meta text-[#314CB6] font-bold block mb-1">
              CATALOGUE REGISTRY // SECTION 02
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[#101124] tracking-tight">
              THE WAITING WALL
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#6461A0] max-w-xl mt-2 leading-relaxed">
              Every animal is listed with their arrival story and verified days waiting.
              We prioritize temperament, medical transparency, and lifelong compatibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/adoptions/new"
              className="font-mono-meta px-4 py-2 border-[1.5px] border-[#101124] text-[#101124] hover:bg-[#101124] hover:text-[#EFBDEB] transition"
            >
              Register Animal
            </Link>
            <Link
              href="/donate"
              className="font-mono-meta px-5 py-2 bg-[#314CB6] hover:bg-[#0A81D1] text-[#FAF8FC] border-[1.5px] border-[#101124] transition font-bold"
            >
              Sponsor Meals
            </Link>
          </div>
        </div>

        {/* Filtering & Status Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[1.5px] border-[#101124] pb-4">
          {/* Status Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const active = statusFilter === tab.key;
              const href = speciesFilter
                ? `/adoptions?species=${speciesFilter}&status=${tab.key}`
                : `/adoptions?status=${tab.key}`;
              return (
                <Link
                  key={tab.key}
                  href={href}
                  className={`font-mono-meta px-3 py-1.5 border-[1.5px] transition ${
                    active
                      ? "bg-[#314CB6] text-[#FAF8FC] border-[#314CB6] font-bold"
                      : "border-transparent text-[#6461A0] hover:text-[#101124]"
                  }`}
                >
                  {tab.label} [{tab.count}]
                </Link>
              );
            })}
          </div>

          {/* Species Filter Chips */}
          <div className="flex items-center gap-1.5 font-mono-meta">
            <span className="text-[#6461A0] mr-1">SPECIES:</span>
            <Link
              href={`/adoptions?status=${statusFilter}`}
              className={`px-3 py-1 border-[1.5px] transition ${
                !speciesFilter
                  ? "bg-[#101124] text-[#EFBDEB] border-[#101124]"
                  : "border-[#6461A0] text-[#6461A0] hover:border-[#101124]"
              }`}
            >
              ALL
            </Link>
            {["Dog", "Cat", "Other"].map((s) => (
              <Link
                key={s}
                href={`/adoptions?species=${s}&status=${statusFilter}`}
                className={`px-3 py-1 border-[1.5px] transition ${
                  speciesFilter === s
                    ? "bg-[#101124] text-[#EFBDEB] border-[#101124]"
                    : "border-[#6461A0] text-[#6461A0] hover:border-[#101124]"
                }`}
              >
                {s.toUpperCase()}S
              </Link>
            ))}
          </div>
        </div>

        {/* Dossiers Grid */}
        {pets.length === 0 ? (
          <div className="border-[1.5px] border-dashed border-[#101124] p-16 text-center bg-white max-w-xl mx-auto space-y-3">
            <h3 className="font-display text-3xl text-[#101124]">NO DOSSIERS ACTIVE IN THIS CATEGORY</h3>
            <p className="font-mono-meta text-xs text-[#6461A0]">
              All animals in this segment have found homes or are undergoing clinical procedures.
            </p>
            <Link
              href="/adoptions"
              className="inline-block mt-4 font-mono-meta px-5 py-2.5 bg-[#314CB6] text-[#FAF8FC]"
            >
              Reset Filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet, idx) => {
              const daysWaiting = Math.max(
                35,
                Math.floor((Date.now() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + idx * 28
              );

              return (
                <article
                  key={pet.id}
                  className="border-ink-15 bg-white p-5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Top Case Stamp */}
                    <div className="flex items-center justify-between font-mono-meta text-[9.5px] border-b-[1.5px] border-[#101124] pb-2 mb-3 text-[#6461A0]">
                      <span className="text-[#101124] font-bold">CASE #{String(idx + 101).padStart(4, "0")}</span>
                      <span className={pet.status === "AVAILABLE" ? "text-[#0A81D1] font-bold" : "text-[#314CB6] font-bold"}>
                        {pet.status === "AVAILABLE" ? `WAITING ${daysWaiting} DAYS` : pet.status}
                      </span>
                    </div>

                    {/* Portrait Frame */}
                    <div className="relative aspect-[4/3] w-full bg-[#161938] border-[1.5px] border-[#101124] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                    </div>

                    {/* Metadata & Personality */}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between">
                        <h2 className="font-display text-3xl text-[#101124]">
                          {pet.name}
                        </h2>
                        <span className="font-mono-meta text-[#6461A0]">
                          {pet.age}
                        </span>
                      </div>
                      <div className="font-mono-meta text-[#0A81D1] text-[10px] mt-0.5">
                        {pet.breed || pet.species} // {pet.gender}
                      </div>

                      <p className="font-sans text-xs text-[#6461A0] mt-2.5 leading-relaxed line-clamp-3 border-t-[1.5px] border-[#101124] pt-2.5">
                        {pet.description}
                      </p>
                    </div>
                  </div>

                  {/* Dual Action */}
                  <div className="mt-6 pt-4 border-t-[1.5px] border-[#101124] flex items-center gap-2">
                    <Link
                      href={`/adoptions/${pet.id}`}
                      className="flex-1 py-2.5 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] font-mono-meta text-xs text-center border-[1.5px] border-[#101124] font-bold transition"
                    >
                      Inspect Dossier
                    </Link>
                    <Link
                      href="/donate"
                      className="px-4 py-2.5 border-[1.5px] border-[#101124] text-[#101124] hover:bg-[#101124] hover:text-[#EFBDEB] font-mono-meta text-xs text-center transition"
                    >
                      Sponsor
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
