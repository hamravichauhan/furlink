"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  createDonationOrder,
  verifyDonationPayment,
  createOfflineTestDonation,
} from "@/actions/donation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

interface Props {
  initialPet?: string;
  initialAmount?: number;
  initialCase?: string;
}

export default function DonationImpactEngine({
  initialPet,
  initialAmount,
  initialCase,
}: Props) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<number>(initialAmount || 2800);
  const [customAmount, setCustomAmount] = useState<string>(
    initialAmount && !TIERS.some((t) => t.amount === initialAmount)
      ? String(initialAmount)
      : ""
  );
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const targetName = initialPet || initialCase || undefined;
  const sponsorshipType = initialPet
    ? "PET_SPONSORSHIP"
    : initialCase
    ? "URGENT_SURGERY"
    : "GENERAL_CARE";

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

  const activeAmount = customAmount ? Number(customAmount) : selectedTier;

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const currencyMultiplier = currency === "USD" ? 0.012 : currency === "EUR" ? 0.011 : 1;

  const displayAmount = (amt: number) => {
    const converted = Math.round(amt * currencyMultiplier);
    return `${currencySymbol}${converted.toLocaleString()}`;
  };

  const getImpactDescription = (amtInInr: number) => {
    if (targetName) {
      return `Directly allocates ₹${amtInInr.toLocaleString(
        "en-IN"
      )} toward ${targetName}'s clinical surgery, prescription medication, and recovery meals.`;
    }
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

  // ─── Real Razorpay Checkout Flow ───
  const handleRazorpayDonate = async () => {
    setErrorMsg("");
    if (!activeAmount || activeAmount < 1) {
      setErrorMsg("Please specify a valid donation amount.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.set("amount", String(activeAmount));
      if (donorName) fd.set("donorName", donorName);
      if (donorEmail) fd.set("donorEmail", donorEmail);
      if (donorPhone) fd.set("donorPhone", donorPhone);
      if (sponsorshipType) fd.set("sponsorshipType", sponsorshipType);
      if (targetName) fd.set("targetName", targetName);

      const order = await createDonationOrder(fd);
      if (!order.success) {
        setErrorMsg(order.error);
        setLoading(false);
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        setErrorMsg(
          "Razorpay SDK is still initializing or blocked by your browser adblocker. You can use 'Instant Demo Mode' below."
        );
        setLoading(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FurLink Animal Sanctuary",
        description: targetName
          ? `Sponsorship for ${targetName}`
          : "Direct Medical & Surgical Care Ledger",
        order_id: order.orderId,
        theme: { color: "#cc2b3f" },
        prefill: {
          name: donorName || "",
          email: donorEmail || "",
          contact: donorPhone || "",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const vRes = await verifyDonationPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              donorName,
              donorEmail,
              sponsorshipType,
              targetName,
            });

            if (vRes.success) {
              router.push(`/donate/success?id=${vRes.donationId}`);
            } else {
              setErrorMsg(vRes.error || "Payment signature verification failed.");
              setLoading(false);
            }
          } catch (err: any) {
            setErrorMsg(err.message || "Failed to record payment verification.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setErrorMsg(resp?.error?.description || "Payment failed or was declined.");
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("[handleRazorpayDonate]", err);
      setErrorMsg(err.message || "Could not launch Razorpay checkout.");
      setLoading(false);
    }
  };

  // ─── 1-Click Demo / Test Mode Fallback ───
  const handleDemoDonate = async () => {
    setErrorMsg("");
    if (!activeAmount || activeAmount < 1) return;
    setDemoLoading(true);
    try {
      const res = await createOfflineTestDonation(activeAmount, {
        donorName: donorName || "Demo Supporter",
        donorEmail: donorEmail || undefined,
        sponsorshipType,
        targetName,
      });
      if (res.success) {
        router.push(`/donate/success?id=${res.donationId}`);
      } else {
        setErrorMsg(res.error || "Failed to record demo contribution.");
        setDemoLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error running test mode.");
      setDemoLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <section id="donate" className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Active Sponsorship Alert Banner */}
          {targetName && (
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  [SPONSORSHIP ACTIVE]
                </span>
                <p className="font-heading text-lg sm:text-xl text-emerald-950 mt-0.5">
                  You are sponsoring medical recovery for: <strong>{targetName}</strong>
                </p>
                <p className="font-body text-xs text-emerald-800/80 mt-1">
                  100% of your allocated amount will be earmarked for {targetName}&apos;s nutrition and treatment.
                </p>
              </div>
              <div className="shrink-0 font-heading text-2xl font-black text-emerald-900 bg-white px-4 py-2 rounded-xl border border-emerald-300">
                ₹{activeAmount.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-[#cc2b3f] text-[#cc2b3f] rounded-2xl font-body text-xs font-bold">
              {errorMsg}
            </div>
          )}

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

                  {/* Frequency Toggle */}
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
                        className={`p-3.5 rounded-2xl border-[1.5px] text-left transition-all cursor-pointer ${
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

                {/* Optional Donor Profile Details for 80G Receipt */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border-[1.5px] border-[#1A2540]/20 space-y-3">
                  <span className="font-heading text-xs uppercase tracking-wider text-[#1A2540] font-bold block">
                    Donor Receipt Details (For Tax Exemption &amp; Acknowledgement)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540]"
                    />
                    <input
                      type="email"
                      placeholder="Email Address (for receipt)"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 font-body text-xs text-[#1A2540]"
                    />
                  </div>
                </div>

                {/* Tangible Translation Statement */}
                <div className="bg-white p-5 rounded-2xl border-[1.5px] border-[#1A2540]/20 space-y-1.5">
                  <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold block">
                    Concrete Output of your {displayAmount(activeAmount)} support:
                  </span>
                  <p className="font-body text-sm text-[#1A2540] leading-relaxed font-medium">
                    {customAmount || targetName
                      ? getImpactDescription(activeAmount)
                      : TIERS.find((t) => t.amount === activeAmount)?.tangible}
                  </p>
                </div>

                {/* Dual Payment Options: Razorpay + Instant Test Fallback */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRazorpayDonate}
                    disabled={loading || demoLoading}
                    className="btn-enroll-pill w-full py-4 text-center text-xs sm:text-sm tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading
                      ? "OPENING RAZORPAY GATEWAY..."
                      : `PAY ${displayAmount(activeAmount)} VIA RAZORPAY →`}
                  </button>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleDemoDonate}
                      disabled={loading || demoLoading}
                      className="font-mono text-[11px] font-bold uppercase text-[#1A2540]/70 hover:text-[#cc2b3f] hover:underline"
                    >
                      {demoLoading ? "Processing Test..." : "Or 1-Click Instant Demo Donation (Offline Mode)"}
                    </button>
                    <span className="font-mono text-[10px] text-gray-500">
                      Razorpay Test Mode Active
                    </span>
                  </div>

                  <p className="font-body text-[11px] text-[#1A2540]/60 text-center">
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
                    Sponsor Remaining ₹5,600 for Sheru
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
