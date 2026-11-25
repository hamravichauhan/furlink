"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createStory } from "@/actions/story";
import MultiImageUpload from "@/components/multi-image-upload";

export default function NewStoryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<string[]>([]);

  if (isLoaded && !isSignedIn) {
    return (
      <div className="bg-[#F8FAF8] text-[#163829] min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200/80 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center text-xl">
            📖
          </div>
          <h2 className="font-heading text-xl font-bold text-[#163829]">
            Sign in to Publish a FurStory
          </h2>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            Community recovery stories must be submitted by signed-in community members to maintain authentic updates.
          </p>
          <Link
            href="/sign-in?redirect_url=/stories/new"
            className="btn-paw-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold shadow-xs hover:scale-[1.02] transition-transform"
          >
            Sign In to Share &rarr;
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b border-gray-200/80 pb-4 flex items-center justify-between">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Stories
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-[11px] font-semibold">
            Field Recovery Entry
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            Share a Recovery Story
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-500 mt-2">
            Record the journey from roadside rescue into clinical stabilization, foster, or adoptive family.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Story Headline
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Case #B-209: Bruno's Orthopedic Recovery and Adoption"
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
              Story & Clinical Observations
            </label>
            <textarea
              name="content"
              rows={8}
              required
              placeholder="Detail the day of discovery, veterinary interventions administered, weeks spent in recovery, and present living situation..."
              className="w-full border border-gray-200 rounded-2xl bg-white p-3.5 text-sm text-[#163829] leading-relaxed focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-paw-primary text-xs font-bold rounded-full transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? "Recording Story..." : "Publish Recovery Story"}
          </button>
        </form>
      </div>
    </div>
  );
}
