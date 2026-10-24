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
      <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
        <h2 className="font-heading uppercase text-base font-black text-[#1A2540] mb-3">
          Verifier Audit Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {!isDisputed && (
            <button
              onClick={() => setMode("verify")}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition shadow-sm cursor-pointer"
            >
              Verify this Proof
            </button>
          )}
          {isDisputed && (
            <button
              onClick={() => setMode("resolve")}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition shadow-sm cursor-pointer"
            >
              Resolve Dispute
            </button>
          )}
          {!isDisputed && (
            <button
              onClick={() => setMode("dispute")}
              className="border-2 border-[#cc2b3f] text-[#cc2b3f] bg-white hover:bg-[#cc2b3f] hover:text-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition cursor-pointer"
            >
              File Dispute
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
      {error && (
        <div className="p-3 mb-4 font-mono text-xs text-[#cc2b3f] bg-white border-2 border-[#cc2b3f] rounded-xl font-bold">
          {error}
        </div>
      )}

      {mode === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <h3 className="font-heading uppercase text-lg font-black text-[#1A2540]">Verify Sterilization Proof</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 mt-1">
              Confirm that the veterinary certificate and clinical photographs meet protocol standards.
            </p>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Verification Audit Note (optional)
            </label>
            <textarea
              name="verificationNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="e.g. Verified with clinic registry record #ABC-4902. Surgical sutures clean."
              className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540]"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Confirm & Sign Verification"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border-2 border-[#1A2540] bg-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8FC]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "dispute" && (
        <form onSubmit={handleDispute} className="space-y-4">
          <div>
            <h3 className="font-heading uppercase text-lg font-black text-[#cc2b3f]">File a Dispute</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 mt-1">
              Flag an irregularity. The request will move to DISPUTED status for clinical review.
            </p>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Reason (required, min 10 chars)
            </label>
            <textarea
              name="disputeReason"
              rows={4}
              required
              minLength={10}
              maxLength={DISPUTE_REASON_MAX}
              placeholder="e.g., Certificate registration stamp does not match accredited veterinary partner."
              className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540]"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
            >
              {loading ? "Filing…" : "Commit Dispute Docket"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border-2 border-[#1A2540] bg-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8FC]"
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
            <h3 className="font-heading uppercase text-lg font-black text-[#1A2540]">Resolve Dispute</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 mt-1">
              Approve the proof (mark verified) or reject it (send back to the rescuer for re-submission).
            </p>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1">
              Resolution Note (optional)
            </label>
            <textarea
              name="resolutionNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="Explain your decision for the audit trail."
              className="w-full border-2 border-[#1A2540]/30 rounded-xl bg-white p-3 text-sm text-[#1A2540]"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
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
              className="bg-[#cc2b3f] hover:bg-[#b02435] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
            >
              Reject — Send Back
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border-2 border-[#1A2540] bg-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8FC]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
