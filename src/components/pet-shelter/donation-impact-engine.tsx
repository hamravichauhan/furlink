"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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
  const { isSignedIn, user, isLoaded } = useUser();
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

  // Auto-fill donor details from authenticated profile
  useEffect(() => {
    if (user) {
      if (!donorName && user.fullName) {
        setDonorName(user.fullName);
      }
      if (!donorEmail && user.primaryEmailAddress?.emailAddress) {
        setDonorEmail(user.primaryEmailAddress.emailAddress);
      }
    }
  }, [user]);

  const [activeTarget, setActiveTarget] = useState<string | undefined>(initialPet || initialCase);
  const targetName = activeTarget || initialPet || initialCase || undefined;
  const sponsorshipType = targetName?.includes("Sheru") || initialCase
    ? "URGENT_SURGERY"
    : initialPet
    ? "PET_SPONSORSHIP"
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
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="font-body text-xs text-emerald-800/80">
                    100% of your allocated amount will be earmarked for {targetName}&apos;s nutrition and treatment.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTarget(undefined);
                      setCustomAmount("");
                      setSelectedTier(2800);
                    }}
                    className="font-body text-[11px] font-bold text-emerald-700 underline hover:text-emerald-950 cursor-pointer ml-1"
                  >
                    Clear (Switch to General Care)
                  </button>
                </div>
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Interactive Picker */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs uppercase tracking-wider text-emerald-800 font-bold">
                      Direct Care Allocation
                    </span>
                    {/* Currency Selector */}
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="font-body text-[11px] font-semibold bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 text-[#163829] focus:outline-emerald-600"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  {/* Frequency Toggle */}
                  <div className="inline-flex bg-gray-100 p-1 rounded-full border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`font-body text-xs font-semibold px-3.5 py-1 rounded-full transition-colors cursor-pointer ${
                        frequency === "monthly"
                          ? "bg-[#163829] text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Monthly Care
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("once")}
                      className={`font-body text-xs font-semibold px-3.5 py-1 rounded-full transition-colors cursor-pointer ${
                        frequency === "once"
                          ? "bg-[#163829] text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      One-Time Gift
                    </button>
                  </div>
                </div>

                {frequency === "monthly" && (
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 font-body text-xs text-emerald-900">
                    Monthly care guarantees that trauma cases admitted tonight have antibiotics and surgical packs waiting at 06:00. Cancel anytime with one tap.
                  </div>
                )}

                {/* Tiers Grid */}
                <div>
                  <span className="font-heading text-xs uppercase tracking-wider text-gray-400 block mb-3 font-bold">
                    Choose a direct medical tier
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIERS.map((tier) => {
                      const isSelected = activeAmount === tier.amount && !customAmount;
                      return (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier.amount);
                            setCustomAmount("");
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? "border-2 border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-xl font-extrabold text-[#163829] leading-none">
                              {displayAmount(tier.amount)}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            )}
                          </div>
                          <div
                            className={`font-body text-[11px] font-medium mt-1 leading-snug ${
                              isSelected ? "text-emerald-800 font-semibold" : "text-gray-500"
                            }`}
                          >
                            {tier.impactItem}
                          </div>
                        </button>
                      );
                    })}

                    <div
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-center ${
                        customAmount
                          ? "border-2 border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <label
                        className={`font-body text-[10px] uppercase font-bold tracking-wider ${
                          customAmount ? "text-emerald-800" : "text-gray-400"
                        }`}
                      >
                        Custom Amount
                      </label>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`font-heading text-sm font-bold ${
                            customAmount ? "text-[#163829]" : "text-gray-600"
                          }`}
                        >
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          placeholder="5000"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full bg-transparent font-heading text-lg font-bold text-[#163829] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Donor Profile Details for 80G Receipt */}
                <div className="bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
                  <span className="font-heading text-xs uppercase tracking-wider text-[#163829] font-bold block">
                    Donor Receipt Details (For Tax Exemption &amp; Acknowledgement)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl p-2.5 font-body text-xs text-[#163829] focus:outline-emerald-600"
                    />
                    <input
                      type="email"
                      placeholder="Email Address (for receipt)"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl p-2.5 font-body text-xs text-[#163829] focus:outline-emerald-600"
                    />
                  </div>
                </div>

                {/* Tangible Translation Statement */}
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-1.5">
                  <span className="font-heading text-xs uppercase tracking-wider text-emerald-800 font-bold block">
                    Concrete Output of your {displayAmount(activeAmount)} support:
                  </span>
                  <p className="font-body text-sm text-[#163829] leading-relaxed font-medium">
                    {customAmount || targetName
                      ? getImpactDescription(activeAmount)
                      : TIERS.find((t) => t.amount === activeAmount)?.tangible}
                  </p>
                </div>

                {/* Dual Payment Options: Require sign in if guest, or execute if member */}
                {!isSignedIn ? (
                  <div className="space-y-3 pt-2">
                    <Link
                      href={`/sign-in?redirect_url=/donate${initialPet ? `?pet=${encodeURIComponent(initialPet)}` : ''}`}
                      className="btn-paw-primary w-full py-4 text-center text-xs sm:text-sm font-bold tracking-wider rounded-full shadow-xs inline-flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                    >
                      SIGN IN TO SPONSOR &amp; DONATE {displayAmount(activeAmount)} &rarr;
                    </Link>
                    <p className="text-center text-[11px] text-gray-500 font-body">
                      Sign in with your FurLink member account to link your 80G tax receipt and track your sponsorship in your profile ledger.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRazorpayDonate}
                      disabled={loading || demoLoading}
                      className="btn-paw-primary w-full py-4 text-center text-xs sm:text-sm font-bold tracking-wider rounded-full shadow-xs cursor-pointer disabled:opacity-50"
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
                        className="font-mono text-[11px] font-bold uppercase text-gray-500 hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        {demoLoading ? "Processing Test..." : "Or 1-Click Instant Demo Donation (Offline Mode)"}
                      </button>
                      <span className="font-mono text-[10px] text-gray-400">
                        Razorpay Test Mode Active
                      </span>
                    </div>

                    <p className="font-body text-[11px] text-gray-400 text-center">
                      100% applied to clinical treatment · Tax exempt under Section 80G
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Urgent Surgery Case (Sheru) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                {/* Photo Header */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-gray-900 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/pets/sheru.jpg"
                    alt="Sheru recovery surgery"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-rose-600/95 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Urgent Inpatient Surgery
                    </div>
                    <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full">
                      CASE #SHERU-ORTHO
                    </div>
                  </div>

                  {/* Bottom Photo Metadata */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/95 text-[11px] font-body">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="text-emerald-400">🏥</span> Belagavi Vet OT Unit 2
                    </span>
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      76% Funded
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-heading text-xl text-[#163829] font-bold leading-tight">
                      Surgery for Sheru: Hind-Leg Bone Fixation
                    </h4>
                    <p className="font-body text-xs text-gray-600 mt-2 leading-relaxed">
                      Rescued near the Belagavi bypass after high-impact road trauma. Bilateral orthopedic pinning and external fixation are required to prevent limb amputation.
                    </p>
                  </div>

                  {/* Clinical Breakdown Cards */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-2xl bg-[#F8FAF8] border border-gray-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#163829]">
                        <span>🦴</span>
                        <span className="truncate">Orthopedic Pins</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-body mt-0.5 font-medium">
                        ₹12,000 · Bilateral
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#F8FAF8] border border-gray-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#163829]">
                        <span>💉</span>
                        <span className="truncate">OT & Anesthesia</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-body mt-0.5 font-medium">
                        ₹7,500 · 3hr Surgery
                      </div>
                    </div>
                  </div>

                  {/* Surgery Funding Progress */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-baseline font-body text-xs">
                      <span className="font-bold text-[#163829] text-sm">
                        ₹18,400 <span className="text-xs font-normal text-gray-500">raised</span>
                      </span>
                      <span className="text-gray-500 text-xs">
                        Goal: <strong className="text-gray-900 font-bold">₹24,000</strong>
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden p-[1px] border border-gray-200/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500"
                        style={{ width: "76%" }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                        ₹5,600 needed before 08:30 AM surgery
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded">
                        CRITICAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAmount("5600");
                        setSelectedTier(5600);
                        setActiveTarget("Surgery for Sheru: Hind-Leg Bone Fixation");
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl font-heading text-xs uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                        activeAmount === 5600 && targetName?.includes("Sheru")
                          ? "bg-[#163829] text-white ring-2 ring-emerald-500 ring-offset-2 shadow-md"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md active:scale-[0.99]"
                      }`}
                    >
                      {activeAmount === 5600 && targetName?.includes("Sheru") ? (
                        <>
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Sponsoring Sheru (₹5,600 Selected)</span>
                        </>
                      ) : (
                        <>
                          <span>Sponsor Remaining ₹5,600 for Sheru</span>
                          <span className="text-emerald-200 text-sm font-normal">&rarr;</span>
                        </>
                      )}
                    </button>
                    <p className="font-body text-[10px] text-gray-400 text-center mt-2">
                      100% earmarked to Sheru&apos;s surgical file · 80G tax deductible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
