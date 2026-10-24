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
    <div className="min-h-screen bg-[#f3c9d5] text-[#1A2540] py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="border-b-2 border-[#1A2540] pb-5 flex items-center justify-between">
          <Link
            href="/adoptions"
            className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline underline-offset-4"
          >
            ← Back to Waiting Wall
          </Link>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1A2540] border-2 border-[#1A2540] bg-white px-3 py-1">
            Clinical Registry
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A2540] leading-none">
            Register Animal for Adoption
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-[#1A2540]/70 mt-2">
            Record medical background and personality traits to find an aligned permanent home.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs font-mono text-[#cc2b3f] bg-white border-2 border-[#cc2b3f] font-bold">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#f2e9db] p-6 sm:p-8 border-2 border-[#1A2540] rounded-2xl shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
                Animal Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Bruno"
                className="w-full border-2 border-[#1A2540]/30 bg-white rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
                Species
              </label>
              <select
                name="species"
                required
                defaultValue="Dog"
                className="w-full border-2 border-[#1A2540]/30 bg-white rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
                <option value="Other">Other Species</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
                Breed <span className="text-[#1A2540]/50 font-normal">(optional)</span>
              </label>
              <input
                name="breed"
                placeholder="e.g. Indie / Mixed"
                className="w-full border-2 border-[#1A2540]/30 bg-white rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
                Age
              </label>
              <input
                name="age"
                required
                placeholder="e.g. 6 months, 2 years"
                className="w-full border-2 border-[#1A2540]/30 bg-white rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 border-2 border-[#1A2540] bg-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition peer-checked:bg-[#cc2b3f] peer-checked:text-white peer-checked:border-[#cc2b3f] hover:bg-[#FAF8FC]">
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
                <div className="text-center py-2.5 border-2 border-[#1A2540] bg-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition peer-checked:bg-[#cc2b3f] peer-checked:text-white peer-checked:border-[#cc2b3f] hover:bg-[#FAF8FC]">
                  Female
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
              Photographic Record
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] font-mono text-[#1A2540]/60 mt-1.5">
              A clear, direct photograph increases adoption inquiries substantially.
            </p>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A2540] mb-1.5">
              Health &amp; Personality Dossier
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="e.g. Fully vaccinated, dewormed, friendly with children, calm indoor temperament, walks well on leash..."
              className="w-full border-2 border-[#1A2540]/30 bg-white rounded-xl p-3 text-sm leading-relaxed text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-[0.18em] py-4 rounded-full transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Publishing Case File…" : "Publish Pet to Waiting Wall"}
          </button>
        </form>
      </div>
    </div>
  );
}
