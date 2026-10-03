import Link from "next/link";
import Image from "next/image";

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    user: { name: string | null };
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const excerpt =
    story.content.length > 160
      ? story.content.slice(0, 160).trimEnd() + "…"
      : story.content;

  return (
    <Link
      href={`/stories/${story.id}`}
      className="block border rounded-lg overflow-hidden hover:shadow-md transition bg-white"
    >
      {story.imageUrl && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 whitespace-pre-line">
          {excerpt}
        </p>
        <div className="text-xs text-gray-500">
          {story.user.name || "Anonymous"} ·{" "}
          {new Date(story.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
