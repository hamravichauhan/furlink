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
    housingType: "Independent House",
    priorExperience: "Yes, experienced with dogs/cats",
  });

  if (petStatus !== "AVAILABLE") {
    return (
      <div className="p-4 bg-[#FAF8FC] border-[1.5px] border-[#101124] text-[#6461A0] font-mono-meta text-[10px]">
        CASE STATUS: PLACEMENT PENDING OR COMPLETED. INQUIRIES CLOSED.
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 bg-[#FAF8FC] border-[1.5px] border-[#314CB6] text-center space-y-2">
        <div className="font-mono-meta text-[10px] text-[#314CB6] font-bold">
          APPLICATION LOGGED // REF #{petId.slice(-6).toUpperCase()}
        </div>
        <div className="font-display text-2xl text-[#101124]">
          THANK YOU FOR STEPPING FORWARD FOR {petName}.
        </div>
        <p className="font-sans text-xs text-[#6461A0] leading-relaxed">
          Our shelter coordinator will review your housing details and reach out within 24 to 48 hours
          for an initial home inspection and visit scheduling.
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setErrorMsg("Please provide your name and contact phone.");
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
      const fd = new FormData();
      fd.append("petId", petId);
      fd.append("fullName", formData.fullName.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("address", formData.address.trim());
      fd.append("reason", `${formData.reason.trim()} [Housing: ${formData.housingType} · Experience: ${formData.priorExperience}]`);

      await submitAdoptionApplication(fd);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log application record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8FC] border-[1.5px] border-[#101124] p-5 space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b-[1.5px] border-[#101124] pb-2.5">
        <span className="font-mono-meta text-[9.5px] text-[#314CB6] font-bold">
          STAGE {step} OF 2 // {step === 1 ? "APPLICANT DOSSIER" : "HOUSING ENVIRONMENT"}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-1 ${step >= 1 ? "bg-[#314CB6]" : "bg-[#B68CB8]"}`} />
          <span className={`w-5 h-1 ${step >= 2 ? "bg-[#314CB6]" : "bg-[#B68CB8]"}`} />
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 font-mono-meta text-[10px] text-[#0A81D1] bg-white border-[1.5px] border-[#0A81D1]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label className="block font-mono-meta text-[10px] text-[#6461A0] mb-1">
                Full Legal Name
              </label>
              <input
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Anita Kamat"
                className="w-full border-[1.5px] border-[#101124] bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#314CB6]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-[10px] text-[#6461A0] mb-1">
                Direct Contact Phone
              </label>
              <input
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98451 22334"
                className="w-full border-[1.5px] border-[#101124] bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#314CB6]"
              />
              <p className="font-mono-meta text-[8.5px] text-[#6461A0] mt-1">
                STRICTLY FOR ADOPTION SCHEDULING.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] border-[1.5px] border-[#101124] font-mono-meta text-xs font-bold transition"
            >
              Continue to Housing Assessment →
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="block font-mono-meta text-[10px] text-[#6461A0] mb-1">
                Residential Address & City
              </label>
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Apt No., Area, City, Pin code"
                className="w-full border-[1.5px] border-[#101124] bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#314CB6]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-[10px] text-[#6461A0] mb-1">
                Type of Home
              </label>
              <select
                name="housingType"
                value={formData.housingType}
                onChange={handleChange}
                className="w-full border-[1.5px] border-[#101124] bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#314CB6]"
              >
                <option value="Independent House">Independent House with Boundary Wall</option>
                <option value="Apartment">Apartment (Rented / Owned)</option>
                <option value="Farm / Acreage">Farm / Open Compound</option>
              </select>
            </div>

            <div>
              <label className="block font-mono-meta text-[10px] text-[#6461A0] mb-1">
                Why do you feel {petName} is a good match?
              </label>
              <textarea
                name="reason"
                required
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Tell us about daily hours alone, family members, or previous animal companions..."
                className="w-full border-[1.5px] border-[#101124] bg-white p-2.5 text-sm font-sans focus:outline-none focus:border-[#314CB6]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 border-[1.5px] border-[#101124] bg-white text-[#101124] font-mono-meta text-[10px] hover:bg-[#FAF8FC]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-[#314CB6] hover:bg-[#101124] text-[#FAF8FC] hover:text-[#EFBDEB] border-[1.5px] border-[#101124] font-mono-meta text-xs font-bold transition disabled:opacity-50"
              >
                {loading ? "Recording Application..." : `Submit for ${petName}`}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
