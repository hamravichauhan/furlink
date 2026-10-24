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
      className="bg-white border-[1.5px] border-[#101124] p-6 sm:p-8 space-y-6"
    >
      {errorMsg && (
        <div className="p-4 border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 font-mono text-xs uppercase tracking-[0.12em] text-[#101124]">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
          Case Title
        </label>
        <input
          name="title"
          required
          defaultValue={initialTitle}
          className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-body text-sm text-[#101124] focus:outline-hidden focus:border-[#314CB6]"
        />
      </div>

      <div>
        <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
          Photographic Plates
        </label>
        <MultiImageUpload value={images} onChange={setImages} />
      </div>

      <div>
        <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
          Narrative Observations
        </label>
        <textarea
          name="content"
          rows={8}
          required
          defaultValue={initialContent}
          className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-body text-sm text-[#101124] leading-relaxed focus:outline-hidden focus:border-[#314CB6]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[11px] uppercase tracking-[0.18em] font-bold border-[1.5px] border-[#101124] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving Amendments..." : "Commit Amendments"}
        </button>
        <Link
          href={`/stories/${storyId}`}
          className="py-3.5 px-6 border-[1.5px] border-[#101124] bg-white hover:bg-[#FAF8FC] text-center font-mono text-[11px] uppercase tracking-[0.18em] font-bold text-[#101124] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
