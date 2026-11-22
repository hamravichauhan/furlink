"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRescueReport } from "@/actions/rescue";
import ImageUpload from "@/components/image-upload";

export default function NewRescuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your current browser.");
      return;
    }
    setLocating(true);
    setErrorMsg("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        setErrorMsg("Unable to retrieve GPS coordinates: " + err.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData(e.currentTarget);
      if (!imageUrl) {
        setErrorMsg("Please upload or provide an incident photograph.");
        setLoading(false);
        return;
      }
      fd.set("imageUrl", imageUrl);
      if (coords) {
        fd.set("latitude", String(coords.lat));
        fd.set("longitude", String(coords.lng));
      }

      const result = await createRescueReport(fd);
      if (!result.success) {
        setErrorMsg(result.error);
        setLoading(false);
        return;
      }
      router.push(`/rescues/${result.rescueId}`);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit emergency dispatch report.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <Link
            href="/rescues"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Incidents
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Emergency Dispatch Intake
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
            Report Animal in Distress
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            Provide precise visual and street coordinate data. Our rescue ambulances prepare bandages, splints,
            and carriers based on your report.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Animal Classification
            </label>
            <select
              name="animalType"
              required
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="Dog">Canine (Indie / Dog)</option>
              <option value="Cat">Feline (Cat)</option>
              <option value="Cattle">Bovine (Cattle / Cow)</option>
              <option value="Bird">Avian (Bird)</option>
              <option value="Other">Other Community Animal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Triage Urgency Level
            </label>
            <select
              name="urgency"
              defaultValue="STANDARD"
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="STANDARD">Standard Distress (Mange, limping, trapped, community volunteer can handle)</option>
              <option value="CRITICAL">Critical Emergency (Hit-and-run, fracture, severe bleeding, urgent ambulance)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Incident Location &amp; Landmarks
            </label>
            <input
              name="location"
              placeholder="e.g. Near Tilakwadi 3rd Railway Gate, opposite tea stall, Belagavi"
              required
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
            <div className="mt-2.5 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-[#163829] py-2 px-4 rounded-full transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {locating ? "Acquiring GPS Signal..." : "Lock Current GPS Coordinates"}
              </button>
              {coords && (
                <span className="text-xs text-emerald-700 font-semibold">
                  ✓ Coordinates locked: {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Incident Photographic Record
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="text-[11px] text-gray-400 mt-1">
              Photographs allow our clinic staff to prepare bandages and saline before ambulance departure.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Injury Details &amp; Observations
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe observable fractures, bleeding, responsiveness, or whether the animal is frightened or aggressive..."
              required
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs text-[#163829] leading-relaxed focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-paw-primary py-4 text-center text-xs tracking-wider font-bold rounded-full shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? "TRANSMITTING TO AMBULANCE..." : "TRANSMIT EMERGENCY REPORT"}
          </button>
        </form>
      </div>
    </div>
  );
}
