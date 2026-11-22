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
      className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
    >
      {errorMsg && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          Story Headline
        </label>
        <input
          name="title"
          required
          defaultValue={initialTitle}
          className="w-full border border-gray-200 rounded-2xl bg-white p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          Photographic Evidence
        </label>
        <MultiImageUpload value={images} onChange={setImages} />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          Story & Observations
        </label>
        <textarea
          name="content"
          rows={8}
          required
          defaultValue={initialContent}
          className="w-full border border-gray-200 rounded-2xl bg-white p-3.5 text-sm text-[#163829] leading-relaxed focus:outline-emerald-600 shadow-xs"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 btn-paw-primary text-xs font-bold rounded-full transition disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {loading ? "Saving Changes..." : "Save Story Changes"}
        </button>
        <Link
          href={`/stories/${storyId}`}
          className="py-4 px-6 border border-gray-200 bg-white hover:bg-gray-50 text-center text-xs font-bold text-[#163829] rounded-full transition shadow-xs"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
