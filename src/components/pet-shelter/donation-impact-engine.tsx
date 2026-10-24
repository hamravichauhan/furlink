"use client";

import React, { useState } from "react";
import { createOfflineTestDonation } from "@/actions/donation";

const TIERS = [
  {
    amount: 450,
    label: "450",
    tangible: "Supplies 9 days of nourishing recovery meals for one recuperating animal.",
    impactItem: "9 Days of Meals",
  },
  {
    amount: 1200,
    label: "1,200",
    tangible: "Covers essential 7-in-1 multi-spectrum vaccination, anti-rabies vial, and tick prophylaxis.",
    impactItem: "Core Vaccine Pack",
  },
  {
    amount: 2800,
    label: "2,800",
    tangible: "Sponsors a complete sterile surgical TNVR procedure, microchip/tag, and 5-day post-op stay.",
    impactItem: "Full TNVR Surgery",
  },
  {
    amount: 6500,
    label: "6,500",
    tangible: "Funds emergency trauma admission, orthopedic diagnostic x-ray plates, and bone-setting cast.",
    impactItem: "Trauma Bone Splint",
  },
  {
    amount: 12000,
    label: "12,000",
    tangible: "Underwrites an entire calendar month of intensive inpatient nursing, IV fluids, and recovery rehab.",
    impactItem: "Full Month Underwrite",
  },
];

export default function DonationImpactEngine() {
  const [selectedTier, setSelectedTier] = useState<number>(2800);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeAmount = customAmount ? Number(customAmount) : selectedTier;

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const currencyMultiplier = currency === "USD" ? 0.012 : currency === "EUR" ? 0.011 : 1;

  const displayAmount = (amt: number) => {
    const converted = Math.round(amt * currencyMultiplier);
    return `${currencySymbol}${converted.toLocaleString()}`;
  };

  const getImpactDescription = (amtInInr: number) => {
    if (amtInInr < 800) {
      const days = Math.max(1, Math.round(amtInInr / 50));
      return `Feeds Rani or Biscuit with complete veterinary nutrition for approximately ${days} days.`;
    }
    if (amtInInr < 2000) {
      return "Covers full multi-strain vaccination, wound irrigation, and antiparasitic medication for one rescue.";
    }
    if (amtInInr < 4500) {
      return "Underwrites full humane sterilization (TNVR), surgical disposables, and 5-day recovery shelter care.";
    }
    if (amtInInr < 8000) {
      return "Funds orthopedic x-rays, stainless bone-setting pins, and post-impact trauma rehabilitation.";
    }
    return "Covers full ICU trauma care, continuous IV electrolyte therapy, and dedicated inpatient recovery boarding.";
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
    <section id="donate" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="font-heading text-xs tracking-widest uppercase text-[#cc2b3f] block mb-2 font-bold">
            Direct Care Accountability
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            Where your money goes
          </h2>
          <p className="font-body text-sm sm:text-base text-[#1A2540]/75 mt-2">
            Every rupee or dollar translates into concrete veterinary items. No executive salaries, no agency retainers.
          </p>
        </div>

        {/* Donation Block Container */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-10 border-[1.5px] border-[#1A2540]/25 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Picker */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A2540]/20 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold">
                    Direct Care Allocation
                  </span>
                  {/* Currency Selector */}
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="font-body text-[11px] font-semibold bg-white border border-[#1A2540]/30 rounded-full px-2 py-0.5 text-[#1A2540] focus:outline-hidden"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                {/* Frequency Toggle: Monthly Preselected with Gentle Explanation */}
                <div className="inline-flex bg-white/70 p-1 rounded-full border border-[#1A2540]/20">
                  <button
                    type="button"
                    onClick={() => setFrequency("monthly")}
                    className={`font-body text-xs font-semibold px-3.5 py-1 rounded-full transition-colors ${
                      frequency === "monthly"
                        ? "bg-[#cc2b3f] text-[#f2e9db]"
                        : "text-[#1A2540]/70 hover:text-[#1A2540]"
                    }`}
                  >
                    Monthly Care
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency("once")}
                    className={`font-body text-xs font-semibold px-3.5 py-1 rounded-full transition-colors ${
                      frequency === "once"
                        ? "bg-[#cc2b3f] text-[#f2e9db]"
                        : "text-[#1A2540]/70 hover:text-[#1A2540]"
                    }`}
                  >
                    One-Time Gift
                  </button>
                </div>
              </div>

              {frequency === "monthly" && (
                <div className="bg-white/60 p-3 rounded-xl border border-[#1A2540]/15 font-body text-xs text-[#1A2540]/75">
                  Monthly care guarantees that trauma cases admitted tonight have antibiotics and surgical packs waiting at 06:00. Cancel anytime with one tap.
                </div>
              )}

              {/* Tiers Grid */}
              <div>
                <span className="font-heading text-xs uppercase tracking-wider text-[#1A2540]/60 block mb-3 font-bold">
                  Choose a direct medical tier
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tier.amount);
                        setCustomAmount("");
                      }}
                      className={`p-3.5 rounded-2xl border-[1.5px] text-left transition-all ${
                        activeAmount === tier.amount && !customAmount
                          ? "border-[#cc2b3f] bg-[#cc2b3f] text-[#f2e9db] shadow-sm"
                          : "border-[#1A2540]/25 bg-white hover:border-[#1A2540] text-[#1A2540]"
                      }`}
                    >
                      <div className="font-heading text-xl font-bold leading-none">
                        {displayAmount(tier.amount)}
                      </div>
                      <div
                        className={`font-body text-[11px] font-medium mt-1 ${
                          activeAmount === tier.amount && !customAmount
                            ? "text-[#f2e9db]/85"
                            : "text-[#cc2b3f]"
                        }`}
                      >
                        {tier.impactItem}
                      </div>
                    </button>
                  ))}

                  <div className="p-3 rounded-2xl border-[1.5px] border-[#1A2540]/25 bg-white flex flex-col justify-center">
                    <label className="font-body text-[10px] uppercase font-bold text-[#1A2540]/60 tracking-wider">
                      Custom Amount
                    </label>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-heading text-sm text-[#1A2540] font-bold">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        placeholder="5000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-transparent font-heading text-lg font-bold text-[#1A2540] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tangible Translation Statement */}
              <div className="bg-white p-5 rounded-2xl border-[1.5px] border-[#1A2540]/20 space-y-1.5">
                <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold block">
                  Concrete Output of your {displayAmount(activeAmount)} support:
                </span>
                <p className="font-body text-sm text-[#1A2540] leading-relaxed font-medium">
                  {customAmount
                    ? getImpactDescription(activeAmount)
                    : TIERS.find((t) => t.amount === activeAmount)?.tangible}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {submitted ? (
                  <div className="p-4 bg-[#cc2b3f]/15 border border-[#cc2b3f] rounded-2xl text-center">
                    <span className="font-heading text-base font-bold text-[#1A2540] block">
                      Direct Medical Donation Recorded
                    </span>
                    <p className="font-body text-xs text-[#1A2540]/80 mt-1">
                      Thank you for providing {displayAmount(activeAmount)} directly to our recovery wards.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={loading}
                    className="btn-enroll-pill w-full py-4 text-center text-xs sm:text-sm tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading
                      ? "Recording Medical Credit..."
                      : `DONATE ${displayAmount(activeAmount)} ${
                          frequency === "monthly" ? "EVERY MONTH" : "TODAY"
                        }`}
                  </button>
                )}
                <p className="font-body text-[11px] text-[#1A2540]/60 text-center mt-2.5">
                  100% applied to clinical treatment · Tax exempt under Section 80G
                </p>
              </div>
            </div>

            {/* Right: Urgent Surgery Case (Sheru) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border-[1.5px] border-[#1A2540]/25 p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#f3c9d5] border border-[#cc2b3f] px-3 py-1 rounded-full font-heading text-[11px] uppercase tracking-wider text-[#cc2b3f] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#cc2b3f] animate-pulse" />
                  Urgent Inpatient Surgery
                </div>

                <h4 className="font-heading text-xl sm:text-2xl text-[#1A2540] mt-3 leading-tight">
                  Surgery for Sheru: Hind-Leg Bone Fixation
                </h4>

                <p className="font-body text-xs text-[#1A2540]/75 mt-2.5 leading-relaxed">
                  Found by a highway patrol team near Belagavi bypass after a severe hit-and-run.
                  Surgical stainless steel pins are required to save both hind limbs from amputation.
                </p>

                {/* Surgery Progress Bar */}
                <div className="mt-6 space-y-2 border-t border-[#1A2540]/15 pt-4">
                  <div className="flex justify-between font-body text-xs font-semibold text-[#1A2540]">
                    <span>Raised: ₹18,400</span>
                    <span className="text-[#cc2b3f] font-bold">Goal: ₹24,000 (76%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#FAF8FC] border border-[#1A2540]/30 overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full bg-[#cc2b3f] transition-all duration-500"
                      style={{ width: "76%" }}
                    />
                  </div>
                  <p className="font-body text-[11px] text-[#1A2540]/60 text-right">
                    ₹5,600 still needed before surgery tomorrow morning
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1A2540]/15">
                <button
                  type="button"
                  onClick={() => {
                    setCustomAmount("5600");
                    setSelectedTier(5600);
                  }}
                  className="w-full py-3 rounded-full border-[1.5px] border-[#1A2540] bg-[#f2e9db] hover:bg-white font-body text-xs font-bold text-[#1A2540] transition-colors cursor-pointer"
                >
                  Fill Remaining ₹5,600 for Sheru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
