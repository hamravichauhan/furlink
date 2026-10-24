"use client";

import { useState } from "react";
import { submitAdoptionApplication } from "@/actions/adoption";

export default function AdoptionForm({
  petId,
  petName,
  petStatus,
}: {
  petId: string;
  petName: string;
  petStatus: string;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    reason: "",
    housingType: "Apartment or Independent Flat",
    priorExperience: "Yes, experienced pet parent",
  });

  if (petStatus !== "AVAILABLE") {
    return (
      <div className="p-4 bg-white/60 border border-[#1A2540]/20 rounded-2xl text-[#1A2540]/70 font-body text-xs">
        Case Status: Placement pending or completed. Inquiries currently paused.
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 bg-white rounded-2xl border-[1.5px] border-[#cc2b3f] text-center space-y-3">
        <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block">
          Application Received · Ref #{petId.slice(-6).toUpperCase()}
        </span>
        <h4 className="font-heading text-xl text-[#1A2540]">
          Thank you for stepping forward for {petName}.
        </h4>
        <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed">
          Our shelter coordinator will review your housing details and reach out within 24 to 48 hours for an initial conversation.
        </p>
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
        setErrorMsg("Please provide your name and phone number.");
        return;
      }
      setErrorMsg("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.address.trim() || !formData.reason.trim()) {
        setErrorMsg("Please complete all residential and care questions.");
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
      data.set("address", formData.address);
      data.set(
        "reason",
        `[Housing: ${formData.housingType} | Experience: ${formData.priorExperience}]\n${formData.reason}`
      );

      await submitAdoptionApplication(data);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-[#cc2b3f] rounded-xl text-xs font-semibold text-[#cc2b3f]">
          {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-3.5">
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Your Full Legal Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Contact Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Housing / Living Space Type
            </label>
            <select
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Apartment or Independent Flat">Apartment or Independent Flat</option>
              <option value="Independent House with Compound">Independent House with Compound</option>
              <option value="Farmhouse or Gated Layout">Farmhouse or Gated Layout</option>
              <option value="Rented Home (Landlord Allowed)">Rented Home (Landlord Allowed)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-enroll-pill w-full py-3 text-xs tracking-wider font-bold shadow-md cursor-pointer mt-2"
          >
            CONTINUE TO HOME QUESTIONS &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Neighborhood &amp; City Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Tilakwadi, Belagavi"
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Prior Experience with Pets
            </label>
            <select
              name="priorExperience"
              value={formData.priorExperience}
              onChange={handleChange}
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
            >
              <option value="Yes, experienced pet parent">Yes, experienced pet parent</option>
              <option value="First-time adopting a rescue">First-time adopting a rescue</option>
              <option value="Currently have other friendly pets">Currently have other friendly pets</option>
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Why do you want to adopt {petName}?
            </label>
            <textarea
              name="reason"
              rows={3}
              required
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us about daily exercise plans, family routine, and who will look after them..."
              className="w-full bg-white border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f] leading-relaxed"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-full border border-[#1A2540]/40 font-body text-xs font-bold hover:bg-white transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-enroll-pill flex-1 py-3 text-xs tracking-wider font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "SUBMITTING DOSSIER..." : "TRANSMIT ADOPTION APPLICATION"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
