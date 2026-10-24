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
      { title: { contains: q } },
      { content: { contains: q } },
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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Field Documentation Archive · Belagavi
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-[#1A2540] tracking-tight">
              Stories That Ended Well
            </h1>
            <p className="font-body text-sm sm:text-base text-[#1A2540]/80 max-w-xl mt-2 leading-relaxed">
              Documented community accounts of acute roadside rescue, weeks of intensive clinical rehabilitation,
              and permanent adoptive bonds.
            </p>
          </div>
          <Link
            href="/stories/new"
            className="btn-enroll-pill px-6 py-3 text-xs font-bold shadow-sm whitespace-nowrap"
          >
            SHARE RECOVERY STORY &rarr;
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#f2e9db] rounded-2xl p-4 border-[1.5px] border-[#1A2540]/20">
          <StoriesFilter isSignedIn={!!dbUser} />
        </div>

        {/* Feed */}
        {stories.length === 0 ? (
          <div className="bg-[#f2e9db] rounded-3xl border-[1.5px] border-dashed border-[#1A2540]/30 p-16 text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-heading text-2xl text-[#1A2540]">
              {isFiltered
                ? "No case files match your search criteria."
                : "No recovery stories published in this sector yet."}
            </h3>
            <p className="font-body text-xs text-[#1A2540]/70">
              {isFiltered
                ? "Try clearing your search terms."
                : "Share the journey of an animal whose transformation you witnessed."}
            </p>
            <Link
              href="/stories/new"
              className="inline-block mt-2 btn-enroll-pill px-5 py-2.5 text-xs font-bold"
            >
              Document Initial Case
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={{
                  id: story.id,
                  title: story.title,
                  content: story.content,
                  imageUrl: story.imageUrl || (story.images[0]?.url ?? null),
                  createdAt: story.createdAt,
                  user: story.user,
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-[#f2e9db] rounded-2xl p-4 border-[1.5px] border-[#1A2540]/20 flex items-center justify-between font-body text-xs font-bold">
            <Link
              href={buildHref({ page: currentPage - 1 })}
              className={`px-4 py-2 rounded-full border border-[#1A2540] bg-white text-[#1A2540] ${
                currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[#FAF8FC]"
              }`}
            >
              &larr; Previous Page
            </Link>
            <span className="text-[#1A2540]/70">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={buildHref({ page: currentPage + 1 })}
              className={`px-4 py-2 rounded-full border border-[#1A2540] bg-white text-[#1A2540] ${
                currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-[#FAF8FC]"
              }`}
            >
              Next Page &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
