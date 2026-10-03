"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRescueReport } from "@/actions/rescue";
import ImageUpload from "@/components/image-upload";

export default function NewRescuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [locating, setLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setErrorMsg(
          "Unable to retrieve your location. Please grant permission and try again.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      if (coords) {
        formData.set("latitude", coords.lat.toString());
        formData.set("longitude", coords.lng.toString());
      }
      if (imageUrl) formData.set("imageUrl", imageUrl);

      const res: any = await createRescueReport(formData);

      // Support both return shapes: { success: boolean } or throwing
      if (res && res.success === false) {
        setErrorMsg(res.error ?? "Failed to submit report.");
        setLoading(false);
        return;
      }

      router.push("/rescues");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            🆘 New rescue report
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Report an animal in need
          </h1>
          <p className="mt-2 text-gray-600 text-sm max-w-md mx-auto">
            Clear photos and accurate location help nearby rescuers reach the
            animal faster. Every minute matters.
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
          {/* Species */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              What kind of animal?
            </label>
            <select
              name="animalType"
              required
              className="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              <option value="Dog">🐕 Dog</option>
              <option value="Cat">🐈 Cat</option>
              <option value="Cattle">🐄 Cattle / Cow</option>
              <option value="Bird">🐦 Bird</option>
              <option value="Other">🐾 Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Where did you see them?
            </label>
            <input
              name="location"
              placeholder="e.g., Near City Market bus stop, Panaji"
              required
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded-lg border transition disabled:opacity-60"
              >
                {locating ? "📍 Locating…" : "📍 Attach exact GPS location"}
              </button>
              {coords && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  ✓ {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Photo of the animal
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] text-gray-500 mt-1">
              A clear photo helps rescuers assess the situation before arriving.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              What&apos;s happening?
            </label>
            <textarea
              name="description"
              rows={5}
              placeholder="Describe the animal's condition, injuries, behaviour, or immediate risk. For example: 'Limping, visible wound on right leg, friendly but scared.'"
              required
              className="w-full border rounded-lg p-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 text-sm shadow-lg shadow-rose-600/20"
          >
            {loading ? "Submitting report…" : "🆘 Submit rescue request"}
          </button>

          <p className="text-[11px] text-gray-500 text-center">
            By submitting, your report appears on the public rescue feed and
            alerts nearby volunteers.
          </p>
        </form>
      </div>
    </div>
  );
}
