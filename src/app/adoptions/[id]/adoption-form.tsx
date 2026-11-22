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
      <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl text-[#163829] font-mono text-xs">
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
      <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gray-200/80 text-left space-y-5 shadow-xs">
        {/* Header confirmation badge */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Application Registered
          </span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
            {docketId}
          </span>
        </div>

        <div>
          <h4 className="font-heading text-2xl font-bold text-[#163829] leading-tight">
            Thank you for stepping forward for {petName}!
          </h4>
          <p className="text-xs text-gray-500 mt-1.5">
            Your clinical home dossier has been transmitted to {guardianName}.
          </p>
        </div>

        {/* 3-Step What Happens Next Road Map */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3 text-xs">
          <div className="font-bold text-[11px] uppercase tracking-wider text-gray-700 border-b border-gray-200 pb-1">
            What happens next:
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-[#163829] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              1
            </span>
            <p className="text-gray-600">
              <strong className="text-gray-900">Review &amp; Screening</strong>: The caregiver reviews your living space and pet routine.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              2
            </span>
            <p className="text-gray-600">
              <strong className="text-gray-900">Coordinator Phone Call</strong>: You will receive a call on <strong>{formData.phone}</strong> during your window (<strong>{formData.preferredCallTime}</strong>) within 24 to 48 hours.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-5 h-5 rounded-full bg-[#163829] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              3
            </span>
            <p className="text-gray-600">
              <strong className="text-gray-900">Meet-and-Greet</strong>: Visit {petName} in person at {guardianLocation} to confirm mutual comfort before finalizing.
            </p>
          </div>
        </div>

        {/* IMMEDIATE DIRECT CONNECT ACTIONS */}
        <div className="border-t border-gray-100 pt-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Don&apos;t want to wait? Contact the guardian right now:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${cleanPhoneDigits}`}
              className="py-3 px-4 btn-paw-primary text-xs font-bold rounded-full text-center transition shadow-xs block"
            >
              Call Guardian ({guardianPhone})
            </a>
            <a
              href={`https://wa.me/${cleanPhoneDigits}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#163829] text-xs font-semibold rounded-full text-center transition shadow-xs block"
            >
              WhatsApp Guardian
            </a>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/profile"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
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
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pb-1">
        <span>Step {step} of 2</span>
        <span>{step === 1 ? "Contact & Call Window" : "Living Space & Care"}</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-medium text-rose-700">
          {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Your Full Legal Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Contact Mobile / WhatsApp Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Preferred Phone Call Window
            </label>
            <select
              name="preferredCallTime"
              value={formData.preferredCallTime}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
              <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
              <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
              <option value="Anytime (10:00 AM - 7:00 PM)">Anytime (10:00 AM - 7:00 PM)</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {guardianName} will phone you during this window.
            </p>
          </div>

          <button
            type="submit"
            className="w-full btn-paw-primary text-xs font-bold py-4 rounded-full transition shadow-xs cursor-pointer mt-2"
          >
            Continue to Home Questionnaire →
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Neighborhood &amp; City Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Tilakwadi 2nd Gate, Belagavi"
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Housing / Living Space
            </label>
            <select
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="Apartment or Independent Flat">Apartment or Independent Flat</option>
              <option value="Independent House with Compound">Independent House with Compound</option>
              <option value="Farmhouse or Gated Layout">Farmhouse or Gated Layout</option>
              <option value="Rented Home (Pet-Friendly Landlord)">Rented Home (Pet-Friendly Landlord)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Prior Experience with Pets
            </label>
            <select
              name="priorExperience"
              value={formData.priorExperience}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="Yes, experienced pet parent">Yes, experienced pet parent</option>
              <option value="First-time adopting a rescue">First-time adopting a rescue</option>
              <option value="Currently have other friendly pets">Currently have other friendly pets</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Daily Routine &amp; Care Intent for {petName}
            </label>
            <textarea
              name="reason"
              rows={3}
              required
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us who will look after them during the day, daily walk plans, and why your home aligns with them..."
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs leading-relaxed"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-paw-primary text-xs font-bold py-3.5 rounded-full transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? "Transmitting Dossier..." : "Submit Adoption Application"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
