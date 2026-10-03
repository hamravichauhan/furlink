import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import StoriesFilter from "@/components/stories-filter";
import StoryCard from "@/components/story-card";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    mine?: string;
    page?: string;
  }>;
}

export default async function StoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort === "oldest" ? "asc" : "desc";
  const mine = params.mine === "true";
  const rawPage = Number(params.page ?? "1");
  const page =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const dbUser = await getOrCreateCurrentUser();

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (mine && dbUser) {
    where.userId = dbUser.id;
  }

  const [total, stories] = await Promise.all([
    prisma.furStory.count({ where }),
    prisma.furStory.findMany({
      where,
      orderBy: { createdAt: sort },
      include: {
        user: { select: { id: true, name: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const buildHref = (opts: { page?: number }) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (sort === "asc") qs.set("sort", "oldest");
    if (mine) qs.set("mine", "true");
    const p = opts.page !== undefined ? opts.page : currentPage;
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return `/stories${str ? `?${str}` : ""}`;
  };

  const isFiltered = !!q || mine;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
            <span>📖</span>
            <span>Community stories</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            FurStories
          </h1>
          <p className="text-gray-600 text-sm mt-1.5 max-w-xl leading-relaxed">
            Heartwarming updates, recovery journeys, and adoption milestones
            from our community.
          </p>
        </div>
        <Link
          href="/stories/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors shadow-sm"
        >
          + Share your story
        </Link>
      </div>

      {/* Filters */}
      <StoriesFilter isSignedIn={!!dbUser} />

      {/* Feed */}
      {stories.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl bg-gray-50/60">
          <div className="text-5xl mb-3">📖</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {isFiltered
              ? "No stories match your filters"
              : "No stories published yet"}
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
            {isFiltered
              ? "Try a different search term or clear your filters."
              : "Be the first to share a recovery journey, adoption update, or rescue milestone."}
          </p>
          <Link
            href="/stories/new"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            + Write a FurStory
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-4 px-1">
            <span className="text-xs text-gray-500">
              {total} {total === 1 ? "story" : "stories"}
              {isFiltered && " matching"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={buildHref}
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (opts: { page: number }) => string;
}) {
  const range: (number | "…")[] = [];
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - window && i <= currentPage + window)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "…") {
      range.push("…");
    }
  }

  return (
    <div className="mt-10 flex items-center justify-between flex-wrap gap-3">
      <div className="text-xs text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
        of <span className="font-semibold text-gray-700">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={buildHref({ page: currentPage - 1 })}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            ← Previous
          </Link>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-300 cursor-not-allowed">
            ← Previous
          </span>
        )}

        <div className="hidden sm:flex items-center gap-1 mx-2">
          {range.map((p, i) =>
            p === "…" ? (
              <span key={`e-${i}`} className="text-xs text-gray-400 px-1.5">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildHref({ page: p })}
                className={`text-xs font-semibold min-w-[32px] text-center px-2 py-1.5 rounded-lg border transition ${
                  p === currentPage
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ),
          )}
        </div>

        {currentPage < totalPages ? (
          <Link
            href={buildHref({ page: currentPage + 1 })}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            Next →
          </Link>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-300 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
