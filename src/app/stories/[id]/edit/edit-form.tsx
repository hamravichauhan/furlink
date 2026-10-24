"use client";

import { useState } from "react";
import Link from "next/link";
import { updateStory } from "@/actions/story";
import MultiImageUpload from "@/components/multi-image-upload";

interface Props {
  storyId: string;
  initialTitle: string;
  initialContent: string;
  initialImages: string[];
}

export default function EditStoryForm({
  storyId,
  initialTitle,
  initialContent,
  initialImages,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<string[]>(initialImages);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.set("imageUrls", JSON.stringify(images));

    const res = await updateStory(storyId, formData);

    if (res.success) {
      window.location.href = `/stories/${storyId}`;
      return;
    }

    setErrorMsg(res.error);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
    >
      {errorMsg && (
        <div className="p-4 border-2 border-[#cc2b3f] bg-white font-mono text-xs uppercase tracking-[0.12em] text-[#cc2b3f] font-bold">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#1A2540] mb-2 font-bold">
          Case Title
        </label>
        <input
          name="title"
          required
          defaultValue={initialTitle}
          className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
        />
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#1A2540] mb-2 font-bold">
          Photographic Plates
        </label>
        <MultiImageUpload value={images} onChange={setImages} />
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#1A2540] mb-2 font-bold">
          Narrative Observations
        </label>
        <textarea
          name="content"
          rows={8}
          required
          defaultValue={initialContent}
          className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540] leading-relaxed focus:outline-hidden focus:border-[#cc2b3f]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-[0.18em] font-bold rounded-full transition disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? "Saving Amendments..." : "Commit Amendments"}
        </button>
        <Link
          href={`/stories/${storyId}`}
          className="py-4 px-6 border-2 border-[#1A2540] bg-white hover:bg-[#FAF8FC] text-center font-mono text-xs uppercase tracking-[0.18em] font-bold text-[#1A2540] rounded-full transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
