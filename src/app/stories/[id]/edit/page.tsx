import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import EditStoryForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Edit FurStory</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Update your story. Changes are visible immediately.
      </p>

      <EditStoryForm
        storyId={story.id}
        initialTitle={story.title}
        initialContent={story.content}
        initialImages={initialImages}
      />
    </div>
  );
}
