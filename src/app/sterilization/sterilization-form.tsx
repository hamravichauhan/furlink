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
        <div className="p-3 border-[1.5px] border-[#101124] bg-[#EFBDEB]/20 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#101124]">
          Quota: <strong>{quota.remainingToday}</strong> of <strong>{quota.dailyLimit}</strong> daily dispatches remaining.
        </div>
      ) : (
        <div className="p-3 border-[1.5px] border-[#101124] bg-[#6461A0]/15 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#101124]">
          {quota.reason ?? "Daily submission capacity reached."}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 border-[1.5px] border-[#101124] bg-[#EFBDEB]/30 font-mono text-xs uppercase tracking-[0.12em] text-[#101124]">
          {errorMsg}
        </div>
      )}
      {success && (
        <div className="p-3 border-[1.5px] border-[#101124] bg-[#0A81D1]/20 font-mono text-xs uppercase tracking-[0.12em] text-[#101124]">
          Surgical request indexed. Opening clinical case sheet...
        </div>
      )}

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] mb-1.5 font-bold">
          Animal Species
        </label>
        <select
          name="animalType"
          required
          disabled={disabled}
          defaultValue="Street Dog"
          className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-2.5 font-mono text-xs uppercase tracking-[0.12em] text-[#101124] focus:outline-hidden disabled:bg-[#101124]/5"
        >
          <option value="Street Dog">Canine (Street Dog)</option>
          <option value="Feral Cat">Feline (Feral Cat)</option>
          <option value="Other">Other Community Species</option>
        </select>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] mb-1.5 font-bold">
          Pack Census / Estimated Count
        </label>
        <input
          type="number"
          name="count"
          min={COUNT_MIN}
          max={COUNT_MAX}
          defaultValue={1}
          required
          disabled={disabled}
          className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-2.5 font-mono text-xs text-[#101124] focus:outline-hidden disabled:bg-[#101124]/5"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] mb-1.5 font-bold">
          Sector Landmark & Street Grid
        </label>
        <LocationPicker
          value={location}
          onChange={setLocation}
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] mb-1.5 font-bold">
          Field Observations
        </label>
        <textarea
          name="notes"
          rows={2}
          maxLength={NOTES_MAX}
          disabled={disabled}
          placeholder="e.g. Nursing litter, visible skin condition, docile or frightened..."
          className="w-full border-[1.5px] border-[#101124] bg-[#FAF8FC] p-2.5 font-body text-xs text-[#101124] leading-relaxed focus:outline-hidden disabled:bg-[#101124]/5"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3.5 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[10.5px] uppercase tracking-[0.18em] font-bold border-[1.5px] border-[#101124] transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading
          ? "Logging Surgical Case..."
          : quota.canSubmit
            ? "Submit ABC/TNVR Dispatch"
            : "Submission Unavailable"}
      </button>
    </form>
  );
}
