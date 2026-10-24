"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b-[1.5px] border-[#101124] pb-6 flex items-center justify-between">
          <Link
            href="/stories"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline underline-offset-4"
          >
            &larr; Back to Case Archive
          </Link>
          <span className="border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] font-bold">
            Field Recovery Entry
          </span>
        </div>

        <div>
          <h1 className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-[#101124] leading-none">
            Document Recovery Record
          </h1>
          <p className="font-body text-sm text-[#101124]/75 mt-3 leading-relaxed">
            Record the journey from acute trauma or stray condition into clinical stabilization, foster, or adoptive custody.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 font-mono text-xs uppercase tracking-[0.12em] text-[#101124]">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border-[1.5px] border-[#101124] p-6 sm:p-8 space-y-6"
        >
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
              Case / Story Headline
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Case #B-209: Bruno's Orthopedic Recovery and Adoption"
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
              Clinical Narrative & Outcome
            </label>
            <textarea
              name="content"
              rows={8}
              required
              placeholder="Detail the day of discovery, veterinary interventions administered, weeks spent in recovery, and present living situation..."
              className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-body text-sm text-[#101124] leading-relaxed focus:outline-hidden focus:border-[#314CB6]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[11px] uppercase tracking-[0.18em] font-bold border-[1.5px] border-[#101124] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Recording Case File..." : "Register Recovery Dossier"}
          </button>
        </form>
      </div>
    </div>
  );
}
