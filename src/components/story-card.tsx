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
      className="group block border-[1.5px] border-[#101124] bg-white p-5 transition-transform hover:-translate-y-0.5"
    >
      {story.imageUrl && (
        <div className="relative aspect-[16/10] w-full bg-[#FAF8FC] border-[1.5px] border-[#101124] overflow-hidden mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </div>
      )}
      <div>
        <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#314CB6] border border-[#314CB6] px-2 py-0.5 inline-block mb-2 font-bold">
          Field Recovery Dossier
        </div>
        <h3 className="font-display uppercase text-xl text-[#101124] line-clamp-2 leading-snug group-hover:text-[#314CB6] transition-colors">
          {story.title}
        </h3>
        <p className="font-body text-xs text-[#101124]/75 mt-2.5 line-clamp-3 leading-relaxed border-t border-[#101124]/15 pt-2">
          {excerpt}
        </p>
        <div className="mt-4 pt-2.5 border-t-[1.5px] border-[#101124] font-mono text-[10px] tracking-[0.14em] uppercase text-[#101124]/60 flex justify-between">
          <span>By {story.user.name || "Field Guardian"}</span>
          <span>{new Date(story.createdAt).toLocaleDateString("en-IN")}</span>
        </div>
      </div>
    </Link>
  );
}
