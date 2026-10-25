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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[#1A2540]/20 pb-4">
          <Link
            href="/rescues"
            className="font-body text-xs font-semibold text-[#1A2540]/70 hover:text-[#cc2b3f] transition-colors"
          >
            &larr; Back to Incident Feed
          </Link>
          <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold">
            Emergency Dispatch Intake
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            Report Animal in Distress
          </h1>
          <p className="font-body text-sm text-[#1A2540]/80 mt-2 leading-relaxed">
            Provide precise visual and street coordinate data. Our rescue ambulances prepare bandages, splints,
            and carriers based on your report.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-[#cc2b3f] rounded-2xl font-body text-xs text-[#cc2b3f] font-semibold">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-5"
        >
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Animal Classification
            </label>
            <select
              name="animalType"
              required
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Dog">Canine (Indie / Dog)</option>
              <option value="Cat">Feline (Cat)</option>
              <option value="Cattle">Bovine (Cattle / Cow)</option>
              <option value="Bird">Avian (Bird)</option>
              <option value="Other">Other Community Animal</option>
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Triage Urgency Level
            </label>
            <select
              name="urgency"
              defaultValue="STANDARD"
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="STANDARD">Standard Distress (Mange, limping, trapped, community volunteer can handle)</option>
              <option value="CRITICAL">Critical Emergency (Hit-and-run, fracture, severe bleeding, urgent ambulance)</option>
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Incident Location &amp; Landmarks
            </label>
            <input
              name="location"
              placeholder="e.g. Near Tilakwadi 3rd Railway Gate, opposite tea stall, Belagavi"
              required
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
            <div className="mt-2.5 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="font-body text-xs font-bold border border-[#1A2540] bg-white hover:bg-[#FAF8FC] text-[#1A2540] py-1.5 px-3.5 rounded-full transition disabled:opacity-50 cursor-pointer"
              >
                {locating ? "Acquiring GPS Signal..." : "Lock Current GPS Coordinates"}
              </button>
              {coords && (
                <span className="font-body text-xs text-[#cc2b3f] font-bold">
                  Lock: {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Incident Photographic Record
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <p className="font-body text-[11px] text-[#1A2540]/60 mt-1">
              Photographs allow our clinic staff to prepare bandages and saline before ambulance departure.
            </p>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Injury Details &amp; Observations
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe observable fractures, bleeding, responsiveness, or whether the animal is frightened or aggressive..."
              required
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] leading-relaxed focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-enroll-pill w-full py-3.5 text-center text-xs tracking-wider font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "TRANSMITTING TO AMBULANCE..." : "TRANSMIT EMERGENCY REPORT"}
          </button>
        </form>
      </div>
    </div>
  );
}
