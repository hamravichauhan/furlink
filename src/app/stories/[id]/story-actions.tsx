"use client";

import { useState } from "react";
import { deleteStory } from "@/actions/story";
import Link from "next/link";

export default function StoryActions({ storyId }: { storyId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    const res = await deleteStory(storyId);
    if (res.success) {
      window.location.href = "/stories";
      return;
    }
    setError(res.error);
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-xs text-rose-600 font-medium mr-2">
          {error}
        </span>
      )}

      <Link
        href={`/stories/${storyId}/edit`}
        className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-[#163829] transition-colors shadow-xs"
      >
        Edit Story
      </Link>

      {confirming ? (
        <>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="px-3.5 py-1.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          Delete
        </button>
      )}
    </div>
  );
}
