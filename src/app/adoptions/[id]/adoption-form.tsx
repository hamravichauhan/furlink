"use client";

import { useState } from "react";
import Link from "next/link";
import { submitAdoptionApplication } from "@/actions/adoption";

interface Props {
  petId: string;
  petName: string;
  petStatus: string;
  ownerName?: string | null;
  contactPhone?: string | null;
  location?: string | null;
}

export default function AdoptionForm({
  petId,
  petName,
  petStatus,
  ownerName = "Belagavi Sanctuary Station",
  contactPhone = "+91 94812 00000",
  location = "Tilakwadi Sanctuary Station, Belagavi",
}: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [docketId, setDocketId] = useState("");

  const guardianName = ownerName || "Belagavi Sanctuary Station";
  const guardianPhone = contactPhone || "+91 94812 00000";
  const guardianLocation = location || "Tilakwadi Sanctuary Station, Belagavi";

  // Clean phone number for tel and wa.me links
  const cleanPhoneDigits = guardianPhone.replace(/[^0-9]/g, "");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    preferredCallTime: "Evening (4:00 PM - 8:00 PM)",
    housingType: "Apartment or Independent Flat",
    priorExperience: "Yes, experienced pet parent",
    address: "",
    reason: "",
  });

  if (petStatus !== "AVAILABLE") {
    return (
      <div className="p-5 bg-white/70 border-2 border-[#1A2540]/20 rounded-2xl text-[#1A2540] font-mono text-xs">
        <span className="font-bold text-[#cc2b3f] block mb-1 uppercase tracking-wider">
          Placement In Progress
        </span>
        This case is currently pending finalized placement or medical clearance. Inquiries are temporarily paused.
      </div>
    );
  }

  // POST-SUBMISSION DIRECT CONNECT CENTER
  if (success) {
    const waText = encodeURIComponent(
      `Hello ${guardianName}! I just submitted an adoption application for ${petName} on FurLink (Ref: ${docketId}). My name is ${formData.fullName}. Looking forward to connecting!`
    );

    return (
      <div className="p-6 sm:p-7 bg-white rounded-2xl border-2 border-[#1A2540] text-left space-y-5 shadow-md">
        {/* Header confirmation badge */}
        <div className="flex items-center justify-between border-b-2 border-[#1A2540]/20 pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#cc2b3f]">
            Application Registered
          </span>
          <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-[#1A2540] bg-[#f2e9db]">
            {docketId}
          </span>
        </div>

        <div>
          <h4 className="font-heading text-2xl font-black text-[#1A2540] leading-tight">
            Thank you for stepping forward for {petName}!
          </h4>
          <p className="font-mono text-xs text-[#1A2540]/75 uppercase tracking-wide mt-1.5">
            Your clinical home dossier has been transmitted to {guardianName}.
          </p>
        </div>

        {/* 3-Step What Happens Next Road Map */}
        <div className="bg-[#f2e9db] p-4 rounded-xl border border-[#1A2540]/20 space-y-3 font-mono text-xs">
          <div className="font-bold text-[11px] uppercase tracking-wider text-[#1A2540] border-b border-[#1A2540]/15 pb-1">
            What happens next:
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-[#1A2540] text-[#f2e9db] font-bold text-[10px] flex items-center justify-center shrink-0">
              1
            </span>
            <p className="text-[#1A2540]/85">
              <strong>Review &amp; Screening</strong>: The caregiver reviews your living space and pet routine.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-[#cc2b3f] text-[#f2e9db] font-bold text-[10px] flex items-center justify-center shrink-0">
              2
            </span>
            <p className="text-[#1A2540]/85">
              <strong>Coordinator Phone Call</strong>: You will receive a call on <strong>{formData.phone}</strong> during your window (<strong>{formData.preferredCallTime}</strong>) within 24 to 48 hours.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-[#1A2540] text-[#f2e9db] font-bold text-[10px] flex items-center justify-center shrink-0">
              3
            </span>
            <p className="text-[#1A2540]/85">
              <strong>Meet-and-Greet</strong>: Visit {petName} in person at {guardianLocation} to confirm mutual comfort before finalizing.
            </p>
          </div>
        </div>

        {/* IMMEDIATE DIRECT CONNECT ACTIONS */}
        <div className="border-t-2 border-[#1A2540]/20 pt-4 space-y-2.5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#cc2b3f]">
            Don&apos;t want to wait? Contact the guardian right now:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${cleanPhoneDigits}`}
              className="py-3 px-4 bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs uppercase tracking-wider font-bold rounded-full text-center transition shadow-sm block"
            >
              Call Guardian ({guardianPhone})
            </a>
            <a
              href={`https://wa.me/${cleanPhoneDigits}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-white hover:bg-[#FAF8FC] border-2 border-[#1A2540] text-[#1A2540] font-mono text-xs uppercase tracking-wider font-bold rounded-full text-center transition block"
            >
              WhatsApp Guardian
            </a>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/profile"
              className="font-mono text-xs uppercase tracking-wider text-[#cc2b3f] hover:underline font-bold"
            >
              Track Application Progress in My Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setErrorMsg("Please provide your name and contact phone number.");
        return;
      }
      setErrorMsg("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.address.trim() || !formData.reason.trim()) {
        setErrorMsg("Please complete your address and care questionnaire.");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.set("petId", petId);
      data.set("fullName", formData.fullName);
      data.set("phone", formData.phone);
      data.set("preferredCallTime", formData.preferredCallTime);
      data.set("housingType", formData.housingType);
      data.set("priorExperience", formData.priorExperience);
      data.set("address", formData.address);
      data.set("reason", formData.reason);

      const res = await submitAdoptionApplication(data);
      setDocketId(`APP-${petId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while transmitting your dossier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      {/* Progress pill indicator */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider font-bold text-[#1A2540]/70 pb-1">
        <span>Step {step} of 2</span>
        <span>{step === 1 ? "Contact & Call Window" : "Living Space & Care"}</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-white border-2 border-[#cc2b3f] rounded-xl text-xs font-mono font-bold text-[#cc2b3f]">
          {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-3.5">
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Your Full Legal Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Contact Mobile / WhatsApp Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Preferred Phone Call Window
            </label>
            <select
              name="preferredCallTime"
              value={formData.preferredCallTime}
              onChange={handleChange}
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
              <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
              <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
              <option value="Anytime (10:00 AM - 7:00 PM)">Anytime (10:00 AM - 7:00 PM)</option>
            </select>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[#1A2540]/60 mt-1">
              {guardianName} will phone you during this window.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-wider font-bold py-4 rounded-full transition shadow-sm cursor-pointer mt-2"
          >
            Continue to Home Questionnaire →
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Neighborhood &amp; City Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Tilakwadi 2nd Gate, Belagavi"
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Housing / Living Space
            </label>
            <select
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Apartment or Independent Flat">Apartment or Independent Flat</option>
              <option value="Independent House with Compound">Independent House with Compound</option>
              <option value="Farmhouse or Gated Layout">Farmhouse or Gated Layout</option>
              <option value="Rented Home (Pet-Friendly Landlord)">Rented Home (Pet-Friendly Landlord)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Prior Experience with Pets
            </label>
            <select
              name="priorExperience"
              value={formData.priorExperience}
              onChange={handleChange}
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Yes, experienced pet parent">Yes, experienced pet parent</option>
              <option value="First-time adopting a rescue">First-time adopting a rescue</option>
              <option value="Currently have other friendly pets">Currently have other friendly pets</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Daily Routine &amp; Care Intent for {petName}
            </label>
            <textarea
              name="reason"
              rows={3}
              required
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us who will look after them during the day, daily walk plans, and why your home aligns with them..."
              className="w-full bg-white border-2 border-[#1A2540]/30 rounded-xl p-3 text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f] leading-relaxed"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-full border-2 border-[#1A2540] bg-white text-[#1A2540] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8FC] transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-wider font-bold py-3.5 rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Transmitting Dossier..." : "Submit Adoption Application"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
