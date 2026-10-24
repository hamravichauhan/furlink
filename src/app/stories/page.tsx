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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-[1.5px] border-[#101124] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] font-bold">
              Field Documentation Archive
            </div>
            <h1 className="font-display uppercase text-4xl sm:text-6xl tracking-tight text-[#101124] mt-4 leading-none">
              Stories That Ended Well
            </h1>
            <p className="font-body text-sm sm:text-base text-[#101124]/75 max-w-xl mt-3 leading-relaxed">
              Documented community accounts of acute roadside admission, multi-week intensive rehabilitation,
              and permanent adoptive bonds.
            </p>
          </div>
          <Link
            href="/stories/new"
            className="font-mono text-[11px] uppercase tracking-[0.18em] font-bold px-6 py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white border-[1.5px] border-[#101124] transition-colors"
          >
            Lodge Recovery Record &rarr;
          </Link>
        </div>

        {/* Filters */}
        <StoriesFilter isSignedIn={!!dbUser} />

        {/* Feed */}
        {stories.length === 0 ? (
          <div className="text-center py-20 border-[1.5px] border-dashed border-[#101124]/40 bg-white max-w-xl mx-auto space-y-4 p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124]/60 block">
              Archive Index Empty
            </span>
            <h2 className="font-display uppercase text-2xl text-[#101124]">
              {isFiltered
                ? "No case files match your query parameters."
                : "No recovery dossiers filed in this sector yet."}
            </h2>
            <p className="font-body text-xs text-[#101124]/70 max-w-sm mx-auto leading-relaxed">
              {isFiltered
                ? "Reset search criteria to inspect all recorded cases."
                : "Record the clinical or foster journey of an animal in your care."}
            </p>
            <Link
              href="/stories/new"
              className="inline-block mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] font-bold px-5 py-2.5 bg-[#101124] text-[#FAF8FC] border-[1.5px] border-[#101124]"
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
          <div className="pt-8 border-t-[1.5px] border-[#101124] flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em]">
            <Link
              href={buildHref({ page: currentPage - 1 })}
              className={`px-4 py-2 border-[1.5px] border-[#101124] bg-white text-[#101124] ${
                currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-[#FAF8FC]"
              }`}
            >
              &larr; Previous Dossier Sheet
            </Link>
            <span className="text-[#101124]/60 font-bold">
              Index {currentPage} / {totalPages}
            </span>
            <Link
              href={buildHref({ page: currentPage + 1 })}
              className={`px-4 py-2 border-[1.5px] border-[#101124] bg-white text-[#101124] ${
                currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-[#FAF8FC]"
              }`}
            >
              Next Dossier Sheet &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
