"use client";

import { useState } from "react";
import { createOfflineTestDonation } from "@/actions/donation";

interface Props {
  className?: string;
}

const TIERS = [
  {
    amount: 450,
    label: "450",
    tangible: "Supplies 9 days of veterinary-grade post-operative recovery meals for one animal.",
    impactItem: "9-Day Nutrition Ration",
  },
  {
    amount: 1200,
    label: "1,200",
    tangible: "Covers essential 7-in-1 multi-spectrum vaccination, anti-rabies vial, and tick prophylaxis.",
    impactItem: "Core Medical Inoculation",
  },
  {
    amount: 2800,
    label: "2,800",
    tangible: "Sponsors complete sterile surgical TNVR procedure, suture packs, and 5-day post-op convalescence.",
    impactItem: "Humane TNVR Surgery",
  },
  {
    amount: 6500,
    label: "6,500",
    tangible: "Funds orthopedic diagnostic x-ray plates, bone-setting splints, and trauma analgesia.",
    impactItem: "Emergency Trauma Splint",
  },
  {
    amount: 12000,
    label: "12,000",
    tangible: "Underwrites an entire calendar month of intensive inpatient recovery, IV fluid therapy, and shelter care.",
    impactItem: "Full Inpatient Underwrite",
  },
];

export default function ImpactDonationBlock({ className = "" }: Props) {
  const [selectedTier, setSelectedTier] = useState<number>(2800);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeAmount = customAmount ? Number(customAmount) : selectedTier;

  const getImpactDescription = (amt: number) => {
    if (amt < 800) {
      return `Provides complete nutritional intake for approximately ${Math.max(1, Math.round(amt / 50))} days.`;
    }
    if (amt < 2000) {
      return "Covers core multi-strain vaccination, wound irrigation, and anti-parasitic treatment protocol.";
    }
    if (amt < 4500) {
      return "Underwrites surgical sterilization (TNVR), sterile disposables, and managed recovery shelter care.";
    }
    if (amt < 8000) {
      return "Funds trauma diagnostics, orthopedic stabilization, and post-injury rehabilitation regimens.";
    }
    return "Covers comprehensive clinical inpatient care, continuous IV electrolyte support, and dedicated recovery staff.";
  };

  const handleDonate = async () => {
    if (!activeAmount || activeAmount < 1) return;
    setLoading(true);
    try {
      const res = await createOfflineTestDonation(activeAmount);
      if (res.success) {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-[#FAF8FC] text-[#101124] border-[1.5px] border-[#101124] p-6 sm:p-10 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Allocation Matrix */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[1.5px] border-[#101124] pb-4">
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-[#314CB6] font-bold">
              Direct Clinical Allocation Engine
            </span>

            {/* Frequency Selector */}
            <div className="inline-flex border-[1.5px] border-[#101124]">
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`font-mono text-[10.5px] uppercase tracking-[0.14em] px-3.5 py-1.5 transition ${
                  frequency === "monthly"
                    ? "bg-[#101124] text-[#FAF8FC]"
                    : "bg-transparent text-[#101124] hover:bg-[#101124]/5"
                }`}
              >
                Sustained Monthly
              </button>
              <button
                type="button"
                onClick={() => setFrequency("once")}
                className={`font-mono text-[10.5px] uppercase tracking-[0.14em] px-3.5 py-1.5 border-l-[1.5px] border-[#101124] transition ${
                  frequency === "once"
                    ? "bg-[#101124] text-[#FAF8FC]"
                    : "bg-transparent text-[#101124] hover:bg-[#101124]/5"
                }`}
              >
                Single Grant
              </button>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#101124]/60 mb-3">
              Select Veterinary Care Tier
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TIERS.map((tier) => (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier.amount);
                    setCustomAmount("");
                  }}
                  className={`p-3.5 border-[1.5px] text-left transition-all ${
                    activeAmount === tier.amount && !customAmount
                      ? "border-[#101124] bg-[#314CB6] text-white"
                      : "border-[#101124]/30 bg-white hover:border-[#101124] text-[#101124]"
                  }`}
                >
                  <div className="font-display uppercase text-2xl tracking-tight leading-none">
                    INR {tier.label}
                  </div>
                  <div
                    className={`font-mono text-[10px] tracking-[0.12em] uppercase mt-2 ${
                      activeAmount === tier.amount && !customAmount
                        ? "text-[#EFBDEB]"
                        : "text-[#6461A0]"
                    }`}
                  >
                    {tier.impactItem}
                  </div>
                </button>
              ))}

              <div className="p-3.5 border-[1.5px] border-[#101124]/30 bg-white flex flex-col justify-center">
                <label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#101124]/60">
                  Custom Value INR
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-transparent font-display text-xl text-[#101124] focus:outline-hidden mt-1 placeholder:text-[#101124]/30"
                />
              </div>
            </div>
          </div>

          {/* Tangible Translation Statement */}
          <div className="border-[1.5px] border-[#101124] bg-white p-5 space-y-2">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#0A81D1] font-bold">
              Accountability Line for INR {activeAmount.toLocaleString("en-IN")}:
            </div>
            <p className="text-sm font-medium text-[#101124] leading-relaxed">
              {customAmount
                ? getImpactDescription(activeAmount)
                : TIERS.find((t) => t.amount === activeAmount)?.tangible}
            </p>
          </div>

          <div className="pt-2">
            {submitted ? (
              <div className="p-4 bg-[#6461A0]/10 border-[1.5px] border-[#6461A0] text-[#101124] text-center">
                <div className="font-display uppercase text-lg tracking-wide">
                  Allocation Voucher Confirmed
                </div>
                <p className="font-mono text-[10.5px] tracking-[0.14em] text-[#101124]/80 mt-1 uppercase">
                  INR {activeAmount.toLocaleString("en-IN")} allocated directly to urgent clinical casework.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDonate}
                disabled={loading}
                className="w-full py-4 bg-[#314CB6] hover:bg-[#0A81D1] text-white font-mono text-[11px] uppercase tracking-[0.18em] font-bold border-[1.5px] border-[#101124] transition-colors cursor-pointer"
              >
                {loading
                  ? "Recording Clinical Allocation..."
                  : `Commit INR ${activeAmount.toLocaleString("en-IN")} ${
                      frequency === "monthly" ? "Every Month" : "Immediately"
                    }`}
              </button>
            )}
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#101124]/50 text-center mt-2.5">
              100% applied to clinical treatment. Zero administrative overhead. 80G compliant.
            </p>
          </div>
        </div>

        {/* Right Column: Inpatient Case Emergency File */}
        <div className="lg:col-span-5 bg-white border-[1.5px] border-[#101124] p-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 border-[1.5px] border-[#101124] px-2.5 py-1 bg-[#EFBDEB]/30 font-mono text-[10px] uppercase tracking-[0.18em] text-[#101124] font-bold">
              <span className="w-2 h-2 bg-[#314CB6] inline-block" />
              Urgent Surgical Docket
            </div>

            <h4 className="font-display uppercase text-2xl tracking-tight text-[#101124] mt-3 leading-tight">
              Case #B-408: Hind-Leg Stainless Bone Fixation
            </h4>

            <p className="text-xs text-[#101124]/75 mt-2.5 leading-relaxed">
              Found by a highway patrol team near Belagavi bypass after a severe vehicular impact.
              Surgical titanium/stainless pins are required to prevent bilateral limb amputation.
            </p>

            <div className="mt-6 space-y-2 border-t-[1.5px] border-[#101124] pt-4">
              <div className="flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#101124]">
                <span>Secured: INR 18,400</span>
                <span className="text-[#314CB6] font-bold">Target: INR 24,000 (76%)</span>
              </div>
              <div className="w-full h-3 border-[1.5px] border-[#101124] bg-[#FAF8FC] p-[1.5px]">
                <div
                  className="h-full bg-[#0A81D1]"
                  style={{ width: "76%" }}
                />
              </div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#101124]/60 text-right uppercase">
                INR 5,600 outstanding before surgery window at 08:00
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setCustomAmount("5600");
                setSelectedTier(5600);
              }}
              className="w-full py-3 border-[1.5px] border-[#101124] bg-transparent hover:bg-[#101124] hover:text-[#FAF8FC] font-mono text-[10.5px] uppercase tracking-[0.16em] font-bold transition-colors cursor-pointer"
            >
              Close Outstanding INR 5,600 Balance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
