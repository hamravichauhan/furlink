"use client";

import { useState } from "react";
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
      className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
    >
      {errorMsg && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded border border-red-200">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Story Title</label>
        <input
          name="title"
          required
          defaultValue={initialTitle}
          className="w-full border rounded-md p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Photos</label>
        <MultiImageUpload value={images} onChange={setImages} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Your Story</label>
        <textarea
          name="content"
          rows={8}
          required
          defaultValue={initialContent}
          className="w-full border rounded-md p-2 text-sm leading-relaxed"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50 text-sm"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <a
          href={`/stories/${storyId}`}
          className="flex-1 border rounded-md py-2 text-center text-sm hover:bg-gray-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
