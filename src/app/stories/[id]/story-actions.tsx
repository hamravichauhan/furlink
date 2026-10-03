"use client";

import { useState } from "react";
import { deleteStory } from "@/actions/story";

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
      {error && <span className="text-xs text-red-600 mr-2">{error}</span>}

      <a
        href={`/stories/${storyId}/edit`}
        className="text-sm border rounded-md px-3 py-1.5 hover:bg-gray-50"
      >
        Edit
      </a>

      {confirming ? (
        <>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Confirm delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="text-sm border rounded-md px-3 py-1.5 hover:bg-gray-50"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="text-sm border border-red-200 text-red-600 rounded-md px-3 py-1.5 hover:bg-red-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}
