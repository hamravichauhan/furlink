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

      await createRescueReport(fd);
      router.push("/rescues");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit emergency dispatch report.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8FC] text-[#101124] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b-[1.5px] border-[#101124] pb-6 flex items-center justify-between">
          <Link
            href="/rescues"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#314CB6] hover:underline underline-offset-4"
          >
            &larr; Back to Incident Feed
          </Link>
          <span className="border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] font-bold">
            Emergency Dispatch Intake
          </span>
        </div>

        <div>
          <h1 className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-[#101124] leading-none">
            Report Animal in Distress
          </h1>
          <p className="font-body text-sm text-[#101124]/75 mt-3 leading-relaxed">
            Provide precise visual and street coordinate data. Our field ambulances prepare clinical equipment,
            splints, and transport carriers based on your intake entry.
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
          {/* Classification */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
              Animal Classification
            </label>
            <select
              name="animalType"
              required
              className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-mono text-xs text-[#101124] uppercase tracking-[0.12em] focus:outline-hidden focus:border-[#314CB6]"
            >
              <option value="Dog">Canine (Indie / Dog)</option>
              <option value="Cat">Feline (Cat)</option>
              <option value="Cattle">Bovine (Cattle / Cow)</option>
              <option value="Bird">Avian (Bird)</option>
              <option value="Other">Other Community Animal</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
              Incident Location & Road Landmarks
            </label>
            <input
              name="location"
              placeholder="e.g. Near Tilakwadi 3rd Railway Gate, opposite tea stall, Belagavi"
              required
              className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-body text-sm text-[#101124] focus:outline-hidden focus:border-[#314CB6]"
            />
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold border-[1.5px] border-[#101124] bg-white hover:bg-[#FAF8FC] text-[#101124] py-2 px-4 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {locating ? "Acquiring GPS Signal..." : "Lock Current GPS Coordinates"}
              </button>
              {coords && (
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#314CB6] font-bold">
                  Lock: {coords.lat.toFixed(4)} N, {coords.lng.toFixed(4)} E
                </span>
              )}
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
              Incident Photographic Record
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#101124]/60 mt-2">
              Visual records determine whether an orthopedic crate or trauma saline pack is required.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124] mb-2 font-bold">
              Injury Presentation & Observations
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Record observable fractures, bleeding, responsiveness, or territorial aggressiveness..."
              required
              className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-3 font-body text-sm text-[#101124] leading-relaxed focus:outline-hidden focus:border-[#314CB6]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[11px] uppercase tracking-[0.18em] font-bold border-[1.5px] border-[#101124] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Dispatching Emergency Log..." : "Transmit Emergency Dispatch Log"}
          </button>
        </form>
      </div>
    </div>
  );
}
