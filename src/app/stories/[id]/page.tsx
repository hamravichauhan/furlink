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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b-2 border-[#1A2540] pb-4">
          <Link
            href="/stories"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] font-bold hover:underline underline-offset-4"
          >
            ← Back to Case Archive
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540]/70 font-bold">
            Dossier No. {story.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Title row */}
        <div className="space-y-3">
          <div className="inline-block border-2 border-[#1A2540] bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540] font-bold">
            Field Recovery Log
          </div>
          <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-tight">
            {story.title}
          </h1>

          <div className="flex items-center justify-between pt-3 border-t-2 border-[#1A2540] font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/70">
            <div>
              <span className="font-bold text-[#1A2540]">{authorName}</span>
              <span className="mx-2">/</span>
              <span>Logged {formattedDate}</span>
            </div>
            {canEdit && <StoryActions storyId={story.id} />}
          </div>
        </div>

        {/* Primary Photographic Record */}
        {story.imageUrl && (
          <div className="border-2 border-[#1A2540] rounded-2xl bg-[#1A2540] overflow-hidden shadow-sm">
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
        <article className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="text-base sm:text-lg text-[#1A2540]/90 leading-relaxed whitespace-pre-line space-y-4 font-sans">
            {story.content}
          </div>

          {/* Photo Gallery If Multiple Images */}
          {story.images.length > 1 && (
            <div className="mt-10 pt-8 border-t-2 border-[#1A2540]/20">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#1A2540]/70 font-bold block mb-4">
                Clinical Progression Plate ({story.images.length} Evidence Records)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {story.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border-2 border-[#1A2540] rounded-xl overflow-hidden bg-white"
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
        <div className="p-8 border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="font-heading uppercase text-2xl font-black text-[#1A2540]">
              Every Recovery Begins with Immediate Intervention
            </div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#1A2540]/70 mt-1">
              Provide permanent sanctuary or underwrite sterile surgical disposables for the next intake.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/adoptions"
              className="px-6 py-3.5 bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-[0.16em] font-bold rounded-full transition text-center shadow-sm"
            >
              Meet Waiting Animals →
            </Link>
            <Link
              href="/donate"
              className="px-6 py-3.5 bg-white hover:bg-[#FAF8FC] text-[#1A2540] font-mono text-xs uppercase tracking-[0.16em] font-bold border-2 border-[#1A2540] rounded-full transition text-center"
            >
              Support Medical Fund →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
