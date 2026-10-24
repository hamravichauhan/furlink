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
        <span className="font-mono text-xs uppercase tracking-wide text-[#314CB6] mr-2">
          {error}
        </span>
      )}

      <Link
        href={`/stories/${storyId}/edit`}
        className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold border-[1.5px] border-[#101124] px-3 py-1 hover:bg-[#101124] hover:text-[#FAF8FC] transition-colors"
      >
        Edit Case
      </Link>

      {confirming ? (
        <>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold bg-[#101124] text-white border-[1.5px] border-[#101124] px-3 py-1 disabled:opacity-50 transition-colors"
          >
            {deleting ? "Purging..." : "Confirm Purge"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold border-[1.5px] border-[#101124] bg-white px-3 py-1 hover:bg-[#FAF8FC] transition-colors"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold border-[1.5px] border-[#101124]/40 text-[#101124]/70 px-3 py-1 hover:border-[#101124] hover:text-[#101124] transition-colors"
        >
          Purge Log
        </button>
      )}
    </div>
  );
}
