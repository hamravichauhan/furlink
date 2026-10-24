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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b-[1.5px] border-[#101124] pb-6 flex items-center justify-between">
          <Link
            href={`/stories/${story.id}`}
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline underline-offset-4"
          >
            &larr; Return to Case File
          </Link>
          <span className="border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] font-bold">
            Amendment Docket
          </span>
        </div>

        <div>
          <h1 className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-[#101124] leading-none">
            Amend Recovery Log
          </h1>
          <p className="font-body text-sm text-[#101124]/75 mt-3 leading-relaxed">
            Amend observations or add supplementary clinical photography. Updates take immediate effect in public index.
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
