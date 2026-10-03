//adoption/new/page

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPetListing } from "@/actions/adoption";
import ImageUpload from "@/components/image-upload";

export default function NewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      if (imageUrl) formData.set("imageUrl", imageUrl);

      const res: any = await createPetListing(formData);

      if (res && res.success === false) {
        setErrorMsg(res.error ?? "Failed to list pet.");
        setLoading(false);
        return;
      }

      router.push("/adoptions");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to list pet");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white">
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            🐾 New listing
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            List an animal for adoption
          </h1>
          <p className="mt-2 text-gray-600 text-sm max-w-md mx-auto">
            Give a rescued pet a chance at a loving home. Fill in the details
            below and they&apos;ll appear in the adoption catalog.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-2xl border shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Pet name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Bella"
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Species
              </label>
              <select
                name="species"
                required
                defaultValue="Dog"
                className="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                <option value="Dog">🐕 Dog</option>
                <option value="Cat">🐈 Cat</option>
                <option value="Other">🐾 Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Breed{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="breed"
                placeholder="e.g. Indie / Mixed"
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Age</label>
              <input
                name="age"
                required
                placeholder="e.g. 6 months, 2 years"
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 border rounded-lg text-sm transition peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 hover:bg-gray-50 peer-checked:hover:bg-emerald-700">
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
                <div className="text-center py-2.5 border rounded-lg text-sm transition peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 hover:bg-gray-50 peer-checked:hover:bg-emerald-700">
                  Female
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Photo</label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] text-gray-500 mt-1">
              A clear, well-lit photo gets 3× more adoption inquiries.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Health &amp; personality
            </label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="e.g. Vaccinated, dewormed, friendly with other pets, calm temperament, loves belly rubs..."
              className="w-full border rounded-lg p-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 text-sm shadow-lg shadow-emerald-600/20"
          >
            {loading ? "Publishing listing…" : "🐾 Publish pet profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
