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
      <div className="border rounded-lg bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Verifier actions
        </h2>
        <div className="flex flex-wrap gap-2">
          {!isDisputed && (
            <button
              onClick={() => setMode("verify")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Verify this proof
            </button>
          )}
          {isDisputed && (
            <button
              onClick={() => setMode("resolve")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Resolve dispute
            </button>
          )}
          {!isDisputed && (
            <button
              onClick={() => setMode("dispute")}
              className="border border-amber-300 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-md text-sm"
            >
              File dispute
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white p-5">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {mode === "resolve" && (
        <form
          onSubmit={(e) => handleResolve(e, "approve")}
          className="space-y-4"
        >
          <div>
            <h3 className="font-semibold text-sm">Resolve dispute</h3>
            <p className="text-xs text-gray-600 mt-1">
              Approve the proof (mark verified) or reject it (send back to the
              rescuer for re-submission).
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Resolution note (optional)
            </label>
            <textarea
              name="resolutionNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="Explain your decision for the audit trail."
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Confirm verification"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "dispute" && (
        <form onSubmit={handleDispute} className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm">File a dispute</h3>
            <p className="text-xs text-gray-600 mt-1">
              Flag a concern. The request will move to DISPUTED state and be
              re-examined. Be specific so the rescuer can respond.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Reason (required, min 10 chars)
            </label>
            <textarea
              name="disputeReason"
              rows={5}
              required
              minLength={10}
              maxLength={DISPUTE_REASON_MAX}
              placeholder="e.g., Certificate number doesn't appear in the clinic's public registry. Unable to confirm authenticity."
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Filing…" : "File dispute"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
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
            <h3 className="font-semibold text-sm">Resolve dispute</h3>
            <p className="text-xs text-gray-600 mt-1">
              Approve the proof (mark verified) or reject it (send back to the
              rescuer for re-submission).
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Resolution note (optional)
            </label>
            <textarea
              name="resolutionNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="Explain your decision for the audit trail."
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form)
                  handleResolve({ preventDefault: () => {} } as any, "approve");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Processing…" : "Approve — mark verified"}
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
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              Reject — send back
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
