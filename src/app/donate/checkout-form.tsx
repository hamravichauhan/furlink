"use client";

import { useEffect, useState } from "react";
import { createDonationOrder, createOfflineTestDonation } from "@/actions/donation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TIERS = [450, 1200, 2800, 6500];

export default function CheckoutForm() {
  const [amount, setAmount] = useState<number>(1200);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [, setScriptReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () => {
      // Don't crash if offline, allow offline simulation
      setScriptReady(false);
    };
    document.body.appendChild(s);
  }, []);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handlePay = async () => {
    setErrorMsg("");
    if (!Number.isFinite(effectiveAmount) || effectiveAmount < 1) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.set("amount", String(effectiveAmount));

    const order = await createDonationOrder(fd);

    if (!order.success) {
      setErrorMsg(order.error);
      setLoading(false);
      return;
    }

    if (!window.Razorpay) {
      setErrorMsg("Razorpay SDK not loaded. You can use 'Simulate Test Donation' below.");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "FurLink Animal Sanctuary",
      description: "Direct Medical & Surgical Care Ledger",
      order_id: order.orderId,
      theme: { color: "#cc2b3f" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        // Verify server-side via the route handler.
        const res = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const data = await res.json();

        if (data.success) {
          window.location.href = `/donate/success?id=${data.donationId}`;
        } else {
          setErrorMsg(data.error || "Payment verification failed.");
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          setErrorMsg("Payment cancelled.");
        },
      },
    });

    rzp.on("payment.failed", (resp: any) => {
      setErrorMsg(resp?.error?.description || "Payment failed. Please retry.");
      setLoading(false);
    });

    rzp.open();
  };

  const handleDemoPay = async () => {
    setErrorMsg("");
    if (!Number.isFinite(effectiveAmount) || effectiveAmount < 1) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      const res = await createOfflineTestDonation(effectiveAmount);
      if (res.success) {
        window.location.href = `/donate/success?id=${res.donationId}`;
      } else {
        setErrorMsg(res.error || "Failed to process test donation.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Error creating test donation.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading uppercase text-xl font-black text-[#1A2540]">Direct Care Allocation</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-[#cc2b3f] border border-[#cc2b3f] bg-white px-2 py-0.5">
          Tax Deductible 80G
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 text-xs font-mono text-[#cc2b3f] bg-white border-2 border-[#cc2b3f] rounded-xl font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setAmount(t);
              setCustomAmount("");
            }}
            className={`border-2 rounded-xl py-3 font-mono text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
              amount === t && !customAmount
                ? "bg-[#cc2b3f] text-[#f2e9db] border-[#cc2b3f]"
                : "bg-white text-[#1A2540] border-[#1A2540] hover:bg-[#FAF8FC]"
            }`}
          >
            ₹{t.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1.5">
          Or Enter Custom Amount (₹)
        </label>
        <input
          type="number"
          min={1}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="e.g. 3500"
          className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 font-mono text-sm text-[#1A2540] focus:outline-hidden focus:border-[#cc2b3f]"
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] font-mono text-xs uppercase tracking-[0.18em] font-bold py-4 rounded-full transition disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {loading ? "Processing…" : `Allocate ₹${(effectiveAmount || 0).toLocaleString("en-IN")} via Razorpay`}
        </button>

        <button
          type="button"
          onClick={handleDemoPay}
          disabled={loading}
          className="w-full bg-white hover:bg-[#FAF8FC] text-[#1A2540] py-3.5 rounded-full transition disabled:opacity-50 font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#1A2540] cursor-pointer"
        >
          Simulate Test Donation (Offline / Local Mode)
        </button>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wider text-[#1A2540]/60 mt-4 text-center">
        Transactions encrypted via Razorpay PCI-DSS. Test mode is fully enabled for local offline verification.
      </p>
    </div>
  );
}
