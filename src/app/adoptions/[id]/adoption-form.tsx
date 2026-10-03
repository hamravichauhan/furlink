//adoption/[id]/adoption-form

"use client";

import { useState } from "react";
import { submitAdoptionApplication } from "@/actions/adoption";

export default function AdoptionForm({
  petId,
  petStatus,
}: {
  petId: string;
  petStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (petStatus !== "AVAILABLE") {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
        This animal is currently pending adoption or has already found a home.
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-sm">
        ✅ Application submitted! The rescue team will contact you soon.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("petId", petId);
      await submitAdoptionApplication(formData);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {errorMsg && (
        <div className="p-2 text-xs text-red-700 bg-red-50 rounded border border-red-200">
          {errorMsg}
        </div>
      )}
      <div>
        <label className="block text-xs font-medium mb-1">Full Name</label>
        <input
          name="fullName"
          required
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Phone Number</label>
        <input
          name="phone"
          required
          className="w-full border rounded-md p-2 text-sm"
          placeholder="+91 98765 43210"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">
          Residential Address
        </label>
        <textarea
          name="address"
          required
          rows={2}
          className="w-full border rounded-md p-2 text-sm"
          placeholder="House/Flat, Street, City"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">
          Why do you want to adopt?
        </label>
        <textarea
          name="reason"
          required
          rows={3}
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Tell us about previous pet experience, family environment..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition text-sm disabled:opacity-50"
      >
        {loading ? "Submitting Application..." : "Submit Application"}
      </button>
    </form>
  );
}
