import Link from "next/link";

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
      ? story.content.slice(0, 160).trimEnd() + "..."
      : story.content;

  return (
    <Link
      href={`/stories/${story.id}`}
      className="group block bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
    >
      {story.imageUrl && (
        <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-[11px] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Recovery Story
          </div>
          <h3 className="font-heading font-bold text-xl text-[#163829] group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {story.title}
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 font-body text-xs text-gray-400 flex items-center justify-between">
          <span className="font-medium text-gray-600">By {story.user.name || "Community Guardian"}</span>
          <span>{new Date(story.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
    </Link>
  );
}
