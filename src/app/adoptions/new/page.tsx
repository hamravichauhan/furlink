"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPetListing } from "@/actions/adoption";
import ImageUpload from "@/components/image-upload";

export default function NewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData(e.currentTarget);
      if (!imageUrl) {
        setErrorMsg("Please upload a photo of the pet");
        setLoading(false);
        return;
      }
      fd.set("imageUrl", imageUrl);

      await createPetListing(fd);
      router.push("/adoptions");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to list pet");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-12 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="border-b border-slate-200/80 pb-6 flex items-center justify-between">
          <Link
            href="/adoptions"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4"
          >
            ← Back to Waiting Wall
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Pet Registration
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Register Animal for Adoption
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Record medical background and personality notes to find them an aligned permanent home.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Animal Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Bruno"
                className="w-full border border-slate-200 bg-slate-50/60 rounded-xl p-3 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Species
              </label>
              <select
                name="species"
                required
                defaultValue="Dog"
                className="w-full border border-slate-200 bg-slate-50/60 rounded-xl p-3 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
                <option value="Other">Other Species</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Breed <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                name="breed"
                placeholder="e.g. Indie / Mixed"
                className="w-full border border-slate-200 bg-slate-50/60 rounded-xl p-3 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age</label>
              <input
                name="age"
                required
                placeholder="e.g. 6 months, 2 years"
                className="w-full border border-slate-200 bg-slate-50/60 rounded-xl p-3 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 border border-slate-200 rounded-xl text-xs font-semibold transition peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 hover:bg-slate-50">
                  Male
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 border border-slate-200 rounded-xl text-xs font-semibold transition peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 hover:bg-slate-50">
                  Female
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Photo</label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] text-slate-400 mt-1.5">
              A well-lit, direct photograph increases adoption inquiries substantially.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Health &amp; Personality
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="e.g. Vaccinated, dewormed, friendly with children, calm indoor temperament, walks well on leash..."
              className="w-full border border-slate-200 bg-slate-50/60 rounded-xl p-3 text-sm leading-relaxed text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider py-4 rounded-full transition disabled:opacity-50 shadow-soft cursor-pointer"
          >
            {loading ? "Publishing Case…" : "Publish Pet to Waiting Wall"}
          </button>
        </form>
      </div>
    </div>
  );
}
