"use client";

import { useState } from "react";
import { createStory } from "@/actions/story";
import MultiImageUpload from "@/components/multi-image-upload";

export default function NewStoryPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.set("imageUrls", JSON.stringify(images));

    const res = await createStory(formData);

    if (res.success) {
      window.location.href = `/stories/${res.storyId}`;
      return;
    }

    setErrorMsg(res.error);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Share a FurStory</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Tell the community about a rescue milestone, pet recovery, or adoption
        experience.
      </p>

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
            placeholder="e.g., Bruno's Recovery: From Street Stray to Family Champion"
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Photos (Optional)
          </label>
          <MultiImageUpload value={images} onChange={setImages} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Story</label>
          <textarea
            name="content"
            rows={8}
            required
            placeholder="Describe what happened, how the animal was cared for, and how they are doing now..."
            className="w-full border rounded-md p-2 text-sm leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50 text-sm"
        >
          {loading ? "Publishing Story…" : "Publish FurStory"}
        </button>
      </form>
    </div>
  );
}
