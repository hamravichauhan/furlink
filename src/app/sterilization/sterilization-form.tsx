"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createSterilizationRequest } from "@/actions/sterilization";
import { COUNT_MIN, COUNT_MAX, NOTES_MAX } from "@/lib/sterilization-constants";
import LocationPicker from "@/components/location-picker";

interface QuotaProps {
  remainingToday: number;
  dailyLimit: number;
  canSubmit: boolean;
  reason: string | null;
}

interface UserProps {
  id: string;
  name: string | null;
  email: string;
}

const SPECIES_OPTIONS = [
  {
    id: "Street Dog",
    label: "Canine",
    sub: "Street Dog / Indie Pack",
    desc: "Municipal sterilization & 7-in-1 anti-rabies vaccination.",
  },
  {
    id: "Feral Cat",
    label: "Feline",
    sub: "Community / Feral Cat",
    desc: "Humane trap-neuter-return (TNR) & left ear-tip notch.",
  },
  {
    id: "Other",
    label: "Other",
    sub: "Community Species",
    desc: "Specialized clinical handling and sector observation.",
  },
];

export default function SterilizationForm({
  quota,
  initialUser,
}: {
  quota?: QuotaProps | null;
  initialUser?: UserProps | null;
}) {
  const router = useRouter();
  const { isSignedIn: clerkSignedIn, user: clerkUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState("Street Dog");
  const [count, setCount] = useState(1);
  const [location, setLocation] = useState({
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const isAuthenticated = Boolean(initialUser || clerkSignedIn);
  const displayName =
    initialUser?.name ||
    clerkUser?.fullName ||
    initialUser?.email ||
    clerkUser?.primaryEmailAddress?.emailAddress ||
    "Community Member";

  const effectiveQuota = quota ?? {
    remainingToday: 3,
    dailyLimit: 3,
    canSubmit: true,
    reason: null,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!location.location || location.location.trim().length < 3) {
      setErrorMsg("Please specify a sector landmark or street location.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("animalType", selectedSpecies);
    formData.set("count", String(count));
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
      router.push(`/sterilization/${res.requestId}`);
      router.refresh();
      // Guarantee transition to the surgical case dossier
      setTimeout(() => {
        window.location.href = `/sterilization/${res.requestId}`;
      }, 150);
      return;
    }

    setErrorMsg(res.error);
    setLoading(false);
  };

  const disabled = loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User / Quota Banner */}
      {isAuthenticated ? (
        <div className="p-4 rounded-2xl border-[1.5px] border-[#1A2540]/20 bg-emerald-50 text-emerald-950 font-body text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold block text-[#1A2540]">
              Logged in as {displayName}
            </span>
            <span className="text-[11px] text-[#1A2540]/70">
              Dispatches linked to your FurLink verification record
            </span>
          </div>
          <span className="font-mono text-xs font-bold bg-emerald-200/70 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-400">
            {effectiveQuota.remainingToday} of {effectiveQuota.dailyLimit} remaining today
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border-[1.5px] border-amber-400 bg-amber-50 text-amber-950 font-body text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold block text-amber-900">
              Notice: Rescuer dispatch requires an active FurLink account
            </span>
            <span className="text-[11px] text-amber-800/80">
              You can prepare the field details below now, but please sign in to complete dispatch.
            </span>
          </div>
          <Link
            href="/sign-in?redirect_url=/sterilization/new"
            className="btn-enroll-pill px-4 py-1.5 text-xs font-bold shrink-0 text-center"
          >
            Sign In &rarr;
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl border-[1.5px] border-[#cc2b3f] bg-rose-100 text-[#cc2b3f] font-body text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{errorMsg}</span>
          {errorMsg.toLowerCase().includes("sign in") && (
            <Link
              href="/sign-in?redirect_url=/sterilization/new"
              className="underline text-xs shrink-0"
            >
              Sign In to FurLink &rarr;
            </Link>
          )}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl border-[1.5px] border-emerald-600 bg-emerald-100 text-emerald-900 font-body text-xs font-bold">
          Surgical request indexed. Opening clinical case sheet...
        </div>
      )}

      {/* Species Selection */}
      <div className="space-y-2">
        <label className="block font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold">
          Select Animal Species
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SPECIES_OPTIONS.map((opt) => {
            const isSelected = selectedSpecies === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedSpecies(opt.id)}
                className={`text-left p-4 rounded-2xl border-[1.5px] transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#cc2b3f] bg-white shadow-md ring-2 ring-[#cc2b3f]/20"
                    : "border-[#1A2540]/20 bg-white/60 hover:bg-white"
                } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading text-sm font-bold text-[#1A2540]">
                    {opt.label}
                  </span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-[#cc2b3f] bg-[#cc2b3f]"
                        : "border-[#1A2540]/30"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    )}
                  </span>
                </div>
                <div className="font-body text-xs font-semibold text-[#1A2540]/80">
                  {opt.sub}
                </div>
                <div className="font-body text-[11px] text-[#1A2540]/60 mt-1 leading-snug">
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pack Census */}
      <div className="space-y-2">
        <label className="block font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold">
          Pack Census / Estimated Count
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border-[1.5px] border-[#1A2540]/25 rounded-2xl bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              disabled={disabled || count <= COUNT_MIN}
              onClick={() => setCount((c) => Math.max(COUNT_MIN, c - 1))}
              className="px-4 py-2.5 font-heading text-lg font-bold text-[#1A2540] hover:bg-[#f2e9db] disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              name="count"
              min={COUNT_MIN}
              max={COUNT_MAX}
              value={count}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setCount(Math.min(COUNT_MAX, Math.max(COUNT_MIN, val)));
                }
              }}
              required
              disabled={disabled}
              className="w-16 text-center font-heading text-base font-bold text-[#1A2540] py-2 border-none focus:outline-hidden"
            />
            <button
              type="button"
              disabled={disabled || count >= COUNT_MAX}
              onClick={() => setCount((c) => Math.min(COUNT_MAX, c + 1))}
              className="px-4 py-2.5 font-heading text-lg font-bold text-[#1A2540] hover:bg-[#f2e9db] disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
          <span className="font-body text-xs text-[#1A2540]/70">
            {count === 1
              ? "Single animal spotted"
              : `Pack of ${count} animals requiring scheduled capture`}
          </span>
        </div>
      </div>

      {/* Location Picker */}
      <div className="space-y-2">
        <label className="block font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold">
          Sector Landmark & Street Grid
        </label>
        <p className="font-body text-xs text-[#1A2540]/70">
          Pinpoint where the animal pack resides so rescuers can plan humane capture crates and vehicle routing.
        </p>
        <div className="bg-white rounded-2xl p-3 border-[1.5px] border-[#1A2540]/25">
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Field Observations */}
      <div className="space-y-2">
        <label className="block font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold">
          Field Observations &amp; Temperament (Optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          maxLength={NOTES_MAX}
          disabled={disabled}
          placeholder="e.g. Docile indie mother with 4 weaned pups; visible mange on rear flank; frequents tea stall behind market..."
          className="w-full rounded-2xl border-[1.5px] border-[#1A2540]/25 bg-white p-3.5 font-body text-xs text-[#1A2540] leading-relaxed focus:outline-hidden focus:border-[#cc2b3f] disabled:bg-[#1A2540]/5"
        />
        <span className="font-body text-[11px] text-[#1A2540]/60 block text-right">
          Up to {NOTES_MAX} characters
        </span>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={disabled}
          className="w-full btn-enroll-pill py-3.5 text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer text-center"
        >
          {loading
            ? success
              ? "Opening Surgical Dossier..."
              : "Logging Surgical Case..."
            : "Submit ABC / TNVR Field Request \u2192"}
        </button>
      </div>
    </form>
  );
}
