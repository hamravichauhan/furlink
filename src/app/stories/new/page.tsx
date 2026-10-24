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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b-2 border-[#1A2540] pb-5 flex items-center justify-between">
          <Link
            href="/stories"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] font-bold hover:underline underline-offset-4"
          >
            ← Back to Case Archive
          </Link>
          <span className="border-2 border-[#1A2540] bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540] font-bold">
            Field Recovery Entry
          </span>
        </div>

        <div>
          <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-none">
            Document Recovery Record
          </h1>
          <p className="font-mono text-xs text-[#1A2540]/75 uppercase tracking-wider mt-3">
            Record the journey from roadside trauma into clinical stabilization, foster, or adoptive custody.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 border-2 border-[#cc2b3f] bg-white font-mono text-xs uppercase tracking-[0.12em] text-[#cc2b3f] font-bold">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#1A2540] mb-2 font-bold">
              Case / Story Headline
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Case #B-209: Bruno's Orthopedic Recovery and Adoption"
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
              Clinical Narrative & Outcome
            </label>
            <textarea
              name="content"
              rows={8}
              required
              placeholder="Detail the day of discovery, veterinary interventions administered, weeks spent in recovery, and present living situation..."
              className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540] leading-relaxed focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-[0.18em] font-bold rounded-full transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Recording Case File..." : "Register Recovery Dossier"}
          </button>
        </form>
      </div>
    </div>
  );
}
