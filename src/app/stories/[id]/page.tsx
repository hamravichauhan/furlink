import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { notFound } from "next/navigation";
import Link from "next/link";
import StoryActions from "./story-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dbUser = await getOrCreateCurrentUser();

  const story = await prisma.furStory.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!story) notFound();

  const isOwner = dbUser?.id === story.userId;
  const isAdmin = dbUser?.role === "ADMIN";
  const canEdit = isOwner || isAdmin;

  const authorName = story.user.name || "Field Guardian";

  const formattedDate = new Date(story.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Stories
          </Link>
          <span className="font-mono text-[11px] text-gray-400">
            Case #{story.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Title row */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Field Recovery Log
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div>
              <span className="font-medium text-gray-800">By {authorName}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span>Published {formattedDate}</span>
            </div>
            {canEdit && <StoryActions storyId={story.id} />}
          </div>
        </div>

        {/* Primary Photographic Record */}
        {story.imageUrl && (
          <div className="rounded-3xl border border-gray-200/80 bg-white overflow-hidden shadow-xs">
            <div className="relative aspect-[16/10] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Story Body Content */}
        <article className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line space-y-4 font-body">
            {story.content}
          </div>

          {/* Photo Gallery If Multiple Images */}
          {story.images.length > 1 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-4">
                Clinical Progression Gallery ({story.images.length} Evidence Records)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {story.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border border-gray-200 rounded-2xl overflow-hidden bg-gray-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Case progression record plate ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Dual Action Footer */}
        <div className="p-8 border border-gray-200/80 rounded-3xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="font-heading text-xl font-bold text-[#163829]">
              Every Recovery Begins with Immediate Intervention
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-lg leading-relaxed">
              Help provide permanent sanctuary or support medical recovery supplies for the next rescue animal in Belagavi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/adoptions"
              className="btn-paw-primary px-6 py-3 text-xs font-bold rounded-full shadow-xs text-center"
            >
              Meet Waiting Animals →
            </Link>
            <Link
              href="/donate"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#163829] text-xs font-bold border border-gray-200 rounded-full transition text-center shadow-xs"
            >
              Support Medical Fund →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
