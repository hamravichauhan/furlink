"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  verifySterilizationProof,
  disputeSterilizationProof,
  resolveSterilizationDispute,
} from "@/actions/sterilization";
import {
  VERIFICATION_NOTE_MAX,
  DISPUTE_REASON_MAX,
} from "@/lib/sterilization-constants";

type Mode = "idle" | "verify" | "dispute" | "resolve";

interface Props {
  requestId: string;
  isDisputed: boolean;
}

export default function VerifyActions({ requestId, isDisputed }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setMode("idle");
    setError("");
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await verifySterilizationProof(requestId, fd);
    if (res.success) {
      router.push("/verify");
      router.refresh();
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleDispute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await disputeSterilizationProof(requestId, fd);
    if (res.success) {
      router.push("/verify");
      router.refresh();
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleResolve = async (
    e: React.FormEvent<HTMLFormElement>,
    action: "approve" | "reject",
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("action", action);
    const res = await resolveSterilizationDispute(requestId, fd);
    if (res.success) {
      router.push("/verify");
      router.refresh();
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  if (mode === "idle") {
    return (
      <div className="border border-gray-200/80 rounded-3xl bg-white p-6 shadow-xs">
        <h2 className="font-heading text-base font-bold text-[#163829] mb-3">
          Verifier Audit Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {!isDisputed && (
            <button
              onClick={() => setMode("verify")}
              className="btn-paw-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-xs cursor-pointer"
            >
              Verify this Proof
            </button>
          )}
          {isDisputed && (
            <button
              onClick={() => setMode("resolve")}
              className="btn-paw-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-xs cursor-pointer"
            >
              Resolve Dispute
            </button>
          )}
          {!isDisputed && (
            <button
              onClick={() => setMode("dispute")}
              className="border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 px-5 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              File Dispute
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200/80 rounded-3xl bg-white p-6 shadow-xs">
      {error && (
        <div className="p-3 mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {mode === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#163829]">Verify Sterilization Proof</h3>
            <p className="text-xs text-gray-500 mt-1">
              Confirm that the veterinary certificate and clinical photographs meet protocol standards.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Verification Audit Note (optional)
            </label>
            <textarea
              name="verificationNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="e.g. Verified with clinic registry record #ABC-4902. Surgical sutures clean."
              className="w-full border border-gray-200 rounded-2xl bg-white p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="btn-paw-primary px-5 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {loading ? "Verifying…" : "Confirm & Sign Verification"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50 cursor-pointer shadow-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "dispute" && (
        <form onSubmit={handleDispute} className="space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-rose-700">File a Dispute</h3>
            <p className="text-xs text-gray-500 mt-1">
              Flag an irregularity. The request will move to DISPUTED status for clinical review.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Reason (required, min 10 chars)
            </label>
            <textarea
              name="disputeReason"
              rows={4}
              required
              minLength={10}
              maxLength={DISPUTE_REASON_MAX}
              placeholder="e.g., Certificate registration stamp does not match accredited veterinary partner."
              className="w-full border border-gray-200 rounded-2xl bg-white p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {loading ? "Filing…" : "Commit Dispute Docket"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50 cursor-pointer shadow-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "resolve" && (
        <form
          onSubmit={(e) => handleResolve(e, "approve")}
          className="space-y-4"
        >
          <div>
            <h3 className="font-heading text-lg font-bold text-[#163829]">Resolve Dispute</h3>
            <p className="text-xs text-gray-500 mt-1">
              Approve the proof (mark verified) or reject it (send back to the rescuer for re-submission).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Resolution Note (optional)
            </label>
            <textarea
              name="resolutionNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="Explain your decision for the audit trail."
              className="w-full border border-gray-200 rounded-2xl bg-white p-3 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="btn-paw-primary px-5 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {loading ? "Processing…" : "Approve — Mark Verified"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={(e) => {
                const form = e.currentTarget.form;
                if (form)
                  handleResolve(
                    { preventDefault: () => {}, currentTarget: form } as any,
                    "reject",
                  );
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              Reject — Send Back
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50 cursor-pointer shadow-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
