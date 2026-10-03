"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSterilizationRequest } from "@/actions/sterilization";
import { COUNT_MIN, COUNT_MAX, NOTES_MAX } from "@/lib/sterilization-constants";
import LocationPicker from "@/components/location-picker";

interface QuotaProps {
  remainingToday: number;
  dailyLimit: number;
  canSubmit: boolean;
  reason: string | null;
}

export default function SterilizationForm({ quota }: { quota: QuotaProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState({
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quota.canSubmit) return;

    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("location", location.location);
    if (location.latitude !== null && location.longitude !== null) {
      formData.set("latitude", String(location.latitude));
      formData.set("longitude", String(location.longitude));
    } else {
      formData.delete("latitude");
      formData.delete("longitude");
    }

    const res = await createSterilizationRequest(formData);

    if (res.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setLocation({ location: "", latitude: null, longitude: null });
      router.refresh();
      setLoading(false);
      setTimeout(() => {
        router.push(`/sterilization/${res.requestId}`);
      }, 600);
      return;
    }

    setErrorMsg(res.error);
    setLoading(false);
  };

  const disabled = loading || !quota.canSubmit;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {quota.canSubmit ? (
        <div className="p-2.5 text-xs rounded border bg-emerald-50 border-emerald-200 text-emerald-800">
          You have <strong>{quota.remainingToday}</strong> of{" "}
          <strong>{quota.dailyLimit}</strong> requests left today.
        </div>
      ) : (
        <div className="p-2.5 text-xs rounded border bg-amber-50 border-amber-200 text-amber-900">
          {quota.reason ?? "You cannot submit right now."}
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 text-xs text-red-700 bg-red-50 rounded border border-red-200">
          {errorMsg}
        </div>
      )}
      {success && (
        <div className="p-2.5 text-xs text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
          Request logged! Taking you to the detail page…
        </div>
      )}

      <div>
        <label className="block text-xs font-medium mb-1">Animal Species</label>
        <select
          name="animalType"
          required
          disabled={disabled}
          defaultValue="Street Dog"
          className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
        >
          <option value="Street Dog">Street Dog</option>
          <option value="Feral Cat">Feral Cat</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Estimated Animal Count
        </label>
        <input
          type="number"
          name="count"
          min={COUNT_MIN}
          max={COUNT_MAX}
          defaultValue={1}
          required
          disabled={disabled}
          className="w-full border rounded-md p-2 text-sm disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Precise Area / Landmark
        </label>
        <LocationPicker
          value={location}
          onChange={setLocation}
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Additional Observations (Optional)
        </label>
        <textarea
          name="notes"
          rows={2}
          maxLength={NOTES_MAX}
          disabled={disabled}
          placeholder="e.g., Nursing mother, aggressive pack, visible mange..."
          className="w-full border rounded-md p-2 text-sm disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition text-sm disabled:opacity-50"
      >
        {loading
          ? "Submitting Request…"
          : quota.canSubmit
            ? "Submit Request"
            : "Cannot submit right now"}
      </button>
    </form>
  );
}
