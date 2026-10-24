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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-4">
          <Link
            href="/stories"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline underline-offset-4"
          >
            &larr; Back to Case Archive
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124]/60">
            Dossier No. {story.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Title row */}
        <div className="space-y-3">
          <div className="inline-block border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] font-bold">
            Field Recovery Log
          </div>
          <h1 className="font-display uppercase text-4xl sm:text-6xl tracking-tight text-[#101124] leading-tight">
            {story.title}
          </h1>

          <div className="flex items-center justify-between pt-3 border-t-[1.5px] border-[#101124] font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#101124]/60">
            <div>
              <span className="font-bold text-[#101124]">{authorName}</span>
              <span className="mx-2">/</span>
              <span>Logged {formattedDate}</span>
            </div>
            {canEdit && <StoryActions storyId={story.id} />}
          </div>
        </div>

        {/* Primary Photographic Record */}
        {story.imageUrl && (
          <div className="border-[1.5px] border-[#101124] bg-[#101124] overflow-hidden">
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
        <article className="bg-white border-[1.5px] border-[#101124] p-6 sm:p-10 space-y-6">
          <div className="font-body text-base sm:text-lg text-[#101124]/85 leading-relaxed whitespace-pre-line space-y-4">
            {story.content}
          </div>

          {/* Photo Gallery If Multiple Images */}
          {story.images.length > 1 && (
            <div className="mt-10 pt-8 border-t-[1.5px] border-[#101124]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124]/60 block mb-4">
                Clinical Progression Plate ({story.images.length} Evidence Records)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {story.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border-[1.5px] border-[#101124] overflow-hidden bg-[#FAF8FC]"
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
        <div className="p-8 border-[1.5px] border-[#101124] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="font-display uppercase text-2xl text-[#101124]">
              Every Recovery Begins with Immediate Intervention
            </div>
            <p className="font-body text-xs text-[#101124]/70 mt-1">
              Provide permanent sanctuary or underwrite sterile surgical disposables for the next intake.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/adoptions"
              className="px-6 py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold border-[1.5px] border-[#101124] transition-colors text-center"
            >
              Examine Adoptions &rarr;
            </Link>
            <Link
              href="/donate"
              className="px-6 py-3.5 bg-transparent hover:bg-[#FAF8FC] text-[#101124] font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold border-[1.5px] border-[#101124] transition-colors text-center"
            >
              Allocate Ration &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
