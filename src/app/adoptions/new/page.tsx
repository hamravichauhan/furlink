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
    <div className="min-h-screen bg-[#F8FAF8] text-[#163829] py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b border-gray-200/80 pb-4 flex items-center justify-between">
          <Link
            href="/adoptions"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Waiting Wall
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-[11px] font-semibold">
            Adoption Registry
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            Register Animal for Adoption
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-500 mt-2">
            Record medical background and personality traits to find an aligned permanent home.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 border border-gray-200/80 rounded-3xl shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Animal Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Bruno"
                className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Species
              </label>
              <select
                name="species"
                required
                defaultValue="Dog"
                className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
                <option value="Other">Other Species</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Breed <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="breed"
                placeholder="e.g. Indie / Mixed"
                className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Age
              </label>
              <input
                name="age"
                required
                placeholder="e.g. 6 months, 2 years"
                className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="text-center py-3 border border-gray-200 bg-white rounded-2xl text-xs font-semibold uppercase tracking-wider transition peer-checked:bg-[#163829] peer-checked:text-white peer-checked:border-[#163829] hover:bg-gray-50 shadow-xs">
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
                <div className="text-center py-3 border border-gray-200 bg-white rounded-2xl text-xs font-semibold uppercase tracking-wider transition peer-checked:bg-[#163829] peer-checked:text-white peer-checked:border-[#163829] hover:bg-gray-50 shadow-xs">
                  Female
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Photographic Record
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] text-gray-400 mt-1.5">
              A clear, direct photograph increases adoption inquiries substantially.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Health &amp; Personality Dossier
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="e.g. Fully vaccinated, dewormed, friendly with children, calm indoor temperament, walks well on leash..."
              className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm leading-relaxed text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          {/* Caregiver & Contact Details */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block">
              Caregiver &amp; Direct Adoption Contact
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Guardian / Shelter Name
                </label>
                <input
                  name="ownerName"
                  required
                  placeholder="e.g. Belagavi Sanctuary Station"
                  defaultValue="Belagavi Sanctuary Station"
                  className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Adoption Contact Mobile
                </label>
                <input
                  name="contactPhone"
                  required
                  placeholder="+91 94812 00000"
                  defaultValue="+91 94812 00000"
                  className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Facility / Foster Location
                </label>
                <input
                  name="location"
                  required
                  placeholder="e.g. Tilakwadi, Belagavi"
                  defaultValue="Tilakwadi, Belagavi"
                  className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Visiting &amp; Interaction Hours
                </label>
                <input
                  name="visitingHours"
                  placeholder="e.g. 10:00 AM - 6:00 PM Daily"
                  defaultValue="10:00 AM - 6:00 PM Daily"
                  className="w-full border border-gray-200 bg-white rounded-2xl p-3.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-paw-primary text-xs font-bold py-4 rounded-full transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? "Publishing Case File…" : "Publish Pet to Waiting Wall"}
          </button>
        </form>
      </div>
    </div>
  );
}
