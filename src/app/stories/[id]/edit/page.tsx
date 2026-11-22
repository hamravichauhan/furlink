import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import EditStoryForm from "./edit-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;

  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) redirect("/sign-in");

  const story = await prisma.furStory.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!story) notFound();

  if (story.userId !== dbUser.id && dbUser.role !== "ADMIN") {
    redirect(`/stories/${id}`);
  }

  const initialImages =
    story.images.length > 0
      ? story.images.map((i) => i.url)
      : story.imageUrl
        ? [story.imageUrl]
        : [];

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b border-gray-200/80 pb-4 flex items-center justify-between">
          <Link
            href={`/stories/${story.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Return to Story
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-[11px] font-semibold">
            Edit Mode
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            Update Recovery Story
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-500 mt-2">
            Amend details or update photographs. Changes reflect immediately across FurLink.
          </p>
        </div>

        <EditStoryForm
          storyId={story.id}
          initialTitle={story.title}
          initialContent={story.content}
          initialImages={initialImages}
        />
      </div>
    </div>
  );
}
