import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  ADOPTED: "bg-gray-100 text-gray-700 border-gray-200",
};

const isUrl = (u: string) => /^https?:\/\/.+/i.test(u);

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
      orderBy: { createdAt: "desc" },
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
    { key: "AVAILABLE", label: "Available", count: countMap.AVAILABLE },
    { key: "PENDING", label: "Under review", count: countMap.PENDING },
    { key: "ADOPTED", label: "Adopted", count: countMap.ADOPTED },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              🐾 Adoption catalog
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Meet your new best friend
            </h1>
            <p className="mt-2 text-gray-600 text-sm max-w-xl">
              Every pet here has been rescued, vetted, and is waiting for a
              loving home. Apply directly from their profile.
            </p>
          </div>
          <Link
            href="/adoptions/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-emerald-600/20 transition"
          >
            + List a pet for adoption
          </Link>
        </div>

        {/* Species filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterChip
            href={`/adoptions?status=${statusFilter}`}
            active={!speciesFilter}
          >
            All species
          </FilterChip>
          {["Dog", "Cat", "Other"].map((s) => (
            <FilterChip
              key={s}
              href={`/adoptions?species=${s}&status=${statusFilter}`}
              active={speciesFilter === s}
            >
              {s === "Dog" ? "🐕" : s === "Cat" ? "🐈" : "🐾"} {s}
            </FilterChip>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 border-b">
          {tabs.map((tab) => {
            const active = statusFilter === tab.key;
            const href = speciesFilter
              ? `/adoptions?species=${speciesFilter}&status=${tab.key}`
              : `/adoptions?status=${tab.key}`;
            return (
              <Link
                key={tab.key}
                href={href}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition ${
                  active
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-xs ${
                    active ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {pets.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl bg-white/60">
            <div className="text-5xl mb-3">🐾</div>
            <h2 className="text-lg font-semibold mb-1">
              {statusFilter === "AVAILABLE"
                ? "No pets available right now"
                : statusFilter === "PENDING"
                  ? "No pending applications"
                  : "No adopted pets yet"}
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {statusFilter === "AVAILABLE"
                ? "When a rescuer lists a pet, it will appear here. Check back soon."
                : "Nothing to show in this view."}
            </p>
            <Link
              href="/adoptions/new"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition"
            >
              + List a pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/adoptions/${pet.id}`}
                className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  {isUrl(pet.imageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="text-5xl">🐾</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider backdrop-blur bg-white/90 ${
                      STATUS_STYLES[pet.status] ?? "bg-gray-100"
                    }`}
                  >
                    {pet.status}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {pet.name}
                      </h3>
                      <span className="text-xs text-gray-500 shrink-0">
                        {pet.species}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {pet.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {pet.age}
                      </span>
                      {pet.breed && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 truncate max-w-[120px]">
                          {pet.breed}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {pet.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t text-xs font-medium text-emerald-700 group-hover:underline">
                    {pet.status === "AVAILABLE"
                      ? "Meet " + pet.name + " →"
                      : pet.status === "PENDING"
                        ? "View details →"
                        : "See " + pet.name + "'s story →"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-xs px-3 py-1.5 rounded-full border transition ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
