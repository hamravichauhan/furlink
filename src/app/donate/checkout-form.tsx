"use client";

import { useEffect, useState } from "react";
import { createDonationOrder } from "@/actions/donation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TIERS = [500, 1000, 2500, 5000];

export default function CheckoutForm() {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () =>
      setErrorMsg("Failed to load payment gateway. Check your connection.");
    document.body.appendChild(s);
  }, []);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handlePay = async () => {
    setErrorMsg("");
    if (!scriptReady) {
      setErrorMsg("Payment gateway still loading, please wait a moment.");
      return;
    }
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

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "FurLink",
      description: "Support animal rescue & sterilization",
      order_id: order.orderId,
      theme: { color: "#059669" },
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

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Make a Donation</h2>

      {errorMsg && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">
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
            className={`border rounded-md py-2 text-sm font-medium transition ${
              amount === t && !customAmount
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            ₹{t}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Or enter a custom amount (₹)
        </label>
        <input
          type="number"
          min={1}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="e.g. 750"
          className="w-full border rounded-md p-2 text-sm"
        />
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !scriptReady}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50 text-sm"
      >
        {loading
          ? "Processing..."
          : !scriptReady
            ? "Loading gateway..."
            : `Donate ₹${effectiveAmount || 0}`}
      </button>

      <p className="text-xs text-gray-500 mt-3">
        Payments are processed securely by Razorpay. FurLink never stores your
        card details.
      </p>
    </div>
  );
}
