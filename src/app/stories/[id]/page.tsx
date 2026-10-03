import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import StoryActions from "./story-actions";

export const dynamic = "force-dynamic";

const isUrl = (u: string | null | undefined): u is string =>
  !!u && /^https?:\/\/.+/i.test(u);

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const story = await prisma.furStory.findUnique({
    where: { id },
    include: {
      user: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!story) notFound();

  const dbUser = await getOrCreateCurrentUser();
  const canEdit =
    !!dbUser && (story.userId === dbUser.id || dbUser.role === "ADMIN");

  const gallery = (
    story.images.length > 0
      ? story.images.map((i) => i.url)
      : story.imageUrl
        ? [story.imageUrl]
        : []
  ).filter(isUrl);

  const initial = (story.user.name || "Anonymous").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/stories"
        className="text-sm text-gray-500 hover:text-gray-800 transition inline-flex items-center gap-1 mb-8"
      >
        ← Back to stories
      </Link>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
            <span>📖</span>
            <span>FurStory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {story.title}
          </h1>
        </div>
        {canEdit && <StoryActions storyId={story.id} />}
      </div>

      {/* Author row */}
      <div className="flex items-center gap-3 pb-6 mb-8 border-b">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-800 shrink-0">
          {initial}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {story.user.name || "Anonymous Animal Lover"}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(story.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mb-10 space-y-4">
          <a
            href={gallery[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[0]}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </a>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.slice(1).map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${story.title} photo ${i + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <article className="prose prose-gray max-w-none">
        <p className="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {story.content}
        </p>
      </article>

      {/* Footer CTA */}
      <div className="mt-12 pt-8 border-t">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 text-xl">
            🐾
          </div>
          <div className="flex-1">
            <div className="font-bold text-emerald-900">
              Have a story of your own?
            </div>
            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
              Share a recovery journey, adoption milestone, or rescue update
              with the community.
            </p>
            <Link
              href="/stories/new"
              className="inline-block mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Share your story →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
