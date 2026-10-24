"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import {
  acceptSterilizationRequest,
  submitSterilizationProof,
  verifySterilizationProof,
  disputeSterilizationProof,
  resolveSterilizationDispute,
  cancelSterilizationRequest,
} from "@/actions/sterilization";
import {
  SCHEDULED_NOTES_MAX,
  COMPLETION_NOTES_MIN,
  COMPLETION_NOTES_MAX,
  CANCELLATION_NOTE_MAX,
  CLINIC_NAME_MAX,
  VET_NAME_MAX,
  VERIFICATION_NOTE_MAX,
  DISPUTE_REASON_MAX,
} from "@/lib/sterilization-constants";

type Mode =
  | "idle"
  | "accept"
  | "proof"
  | "verify"
  | "dispute"
  | "resolve"
  | "cancel";

interface Props {
  requestId: string;
  canAccept: boolean;
  canSubmitProof: boolean;
  canVerify: boolean;
  canDispute: boolean;
  canResolve: boolean;
  canCancel: boolean;
  isRescuer: boolean;
  status: string;
}

export default function RequestActions({
  requestId,
  canAccept,
  canSubmitProof,
  canVerify,
  canDispute,
  canResolve,
  canCancel,
  isRescuer,
  status,
}: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setMode("idle");
    setError("");
    setLoading(false);
  };

  const run = async (
    fn: (
      id: string,
      fd: FormData,
    ) => Promise<{ success: boolean; error?: string }>,
    form: HTMLFormElement,
  ) => {
    setLoading(true);
    setError("");
    const fd = new FormData(form);
    const res = await fn(requestId, fd);
    if (res.success) {
      router.refresh();
      reset();
    } else {
      setError(res.error ?? "Something went wrong.");
      setLoading(false);
    }
  };

  if (mode === "idle") {
    const hasAnyAction =
      canAccept ||
      canSubmitProof ||
      canVerify ||
      canDispute ||
      canResolve ||
      canCancel;

    if (!hasAnyAction) return null;

    return (
      <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
        <h2 className="font-heading uppercase text-base font-black text-[#1A2540] mb-3">
          Field Operational Actions
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {canAccept && (
            <ActionButton
              color="blue"
              onClick={() => setMode("accept")}
              label="I'll handle this"
            />
          )}
          {canSubmitProof && (
            <ActionButton
              color="purple"
              onClick={() => setMode("proof")}
              label="Submit proof of work"
            />
          )}
          {canVerify && (
            <ActionButton
              color="emerald"
              onClick={() => setMode("verify")}
              label="Verify proof"
            />
          )}
          {canDispute && (
            <ActionButton
              color="amber"
              onClick={() => setMode("dispute")}
              label="Dispute"
            />
          )}
          {canResolve && (
            <ActionButton
              color="emerald"
              onClick={() => setMode("resolve")}
              label="Resolve dispute"
            />
          )}
          {canCancel && (
            <button
              onClick={() => setMode("cancel")}
              className="border-2 border-[#cc2b3f] text-[#cc2b3f] bg-white hover:bg-[#cc2b3f] hover:text-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition cursor-pointer"
            >
              {isRescuer ? "Back out of this request" : "Cancel request"}
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

      {mode === "accept" && (
        <Shell
          title="Accept this request"
          hint="You're committing to sterilize the animals at this location."
          onSubmit={(e) => run(acceptSterilizationRequest, e.currentTarget)}
          loading={loading}
          onCancel={reset}
        >
          <Field label="Planned date (optional)">
            <input
              type="datetime-local"
              name="scheduledAt"
              className="w-full border rounded-md p-2 text-sm"
            />
          </Field>
          <Field label="Plan notes (optional)">
            <textarea
              name="scheduledNotes"
              rows={2}
              maxLength={SCHEDULED_NOTES_MAX}
              placeholder="e.g., Will bring ABC van and vet tech"
              className="w-full border rounded-md p-2 text-sm"
            />
          </Field>
        </Shell>
      )}

      {mode === "proof" && (
        <ProofForm
          onSubmit={(e) => run(submitSterilizationProof, e.currentTarget)}
          onCancel={reset}
          loading={loading}
        />
      )}

      {mode === "verify" && (
        <Shell
          title="Verify this proof"
          hint="Confirm the certificate is legitimate. Your name will be attached to this verification."
          onSubmit={(e) => run(verifySterilizationProof, e.currentTarget)}
          loading={loading}
          onCancel={reset}
        >
          <Field label="Verification note (optional)">
            <textarea
              name="verificationNote"
              rows={3}
              maxLength={VERIFICATION_NOTE_MAX}
              placeholder="e.g., Verified against Panaji ABC Center log #1234"
              className="w-full border rounded-md p-2 text-sm"
            />
          </Field>
        </Shell>
      )}

      {mode === "dispute" && (
        <Shell
          title="Dispute this proof"
          hint="Flag a concern. A verifier will review the dispute."
          onSubmit={(e) => run(disputeSterilizationProof, e.currentTarget)}
          loading={loading}
          onCancel={reset}
        >
          <Field label="Reason for dispute (required)">
            <textarea
              name="disputeReason"
              rows={4}
              required
              minLength={10}
              maxLength={DISPUTE_REASON_MAX}
              placeholder="e.g., Certificate number doesn't match clinic records"
              className="w-full border rounded-md p-2 text-sm"
            />
          </Field>
        </Shell>
      )}

      {mode === "resolve" && (
        <ResolveForm
          onSubmit={(e) => run(resolveSterilizationDispute, e.currentTarget)}
          onCancel={reset}
          loading={loading}
        />
      )}

      {mode === "cancel" && (
        <Shell
          title={isRescuer ? "Back out of this request" : "Cancel this request"}
          hint={
            isRescuer
              ? "The request will reopen so another rescuer can pick it up."
              : "This is permanent. The request will be marked as cancelled."
          }
          onSubmit={(e) => run(cancelSterilizationRequest, e.currentTarget)}
          loading={loading}
          onCancel={reset}
        >
          <Field label="Reason (optional)">
            <textarea
              name="cancellationNote"
              rows={3}
              maxLength={CANCELLATION_NOTE_MAX}
              placeholder="e.g., Could not reach the location"
              className="w-full border rounded-md p-2 text-sm"
            />
          </Field>
        </Shell>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ActionButton({
  color,
  onClick,
  label,
}: {
  color: "blue" | "emerald" | "amber" | "purple";
  onClick: () => void;
  label: string;
}) {
  const isPrimary = color === "blue" || color === "purple" || color === "emerald";
  return (
    <button
      onClick={onClick}
      className={`font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full transition shadow-sm cursor-pointer ${
        isPrimary
          ? "bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db]"
          : "border-2 border-[#cc2b3f] bg-white text-[#cc2b3f] hover:bg-[#cc2b3f] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A2540] mb-1.5">{label}</label>
      {children}
      {hint && <p className="font-mono text-[10px] text-[#1A2540]/60 mt-1 uppercase tracking-tight">{hint}</p>}
    </div>
  );
}

function Shell({
  title,
  hint,
  onSubmit,
  loading,
  onCancel,
  children,
  submitLabel,
}: {
  title: string;
  hint: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  onCancel: () => void;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-heading uppercase text-lg font-black text-[#1A2540]">{title}</h3>
        <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 mt-1">{hint}</p>
      </div>
      {children}
      <div className="flex gap-2.5 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? "Processing…" : (submitLabel ?? "Confirm")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border-2 border-[#1A2540] bg-white px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8FC] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProofForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [certUrl, setCertUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm">Submit proof of work</h3>
        <p className="text-xs text-gray-600 mt-1">
          Upload the sterilization certificate from the clinic. A verifier will
          review it before the request is marked complete.
        </p>
      </div>

      <Field label="Certificate image (required)">
        {certUrl ? (
          <div className="space-y-2">
            <div className="relative w-full h-56 rounded-md overflow-hidden border bg-gray-50">
              <Image
                src={certUrl}
                alt="Certificate"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setCertUrl("")}
              className="text-xs text-red-600 hover:underline"
            >
              Remove and choose another
            </button>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              multiple: false,
              maxFiles: 1,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "pdf"],
            }}
            onSuccess={(result: any) => {
              const url = result?.info?.secure_url;
              if (typeof url === "string") {
                setCertUrl(url);
                setUploadError("");
              }
            }}
            onError={() => {
              setUploadError("Upload failed. Please try again.");
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full border-2 border-dashed rounded-md py-8 text-sm text-gray-500 hover:bg-gray-50"
              >
                + Upload certificate (image or PDF)
              </button>
            )}
          </CldUploadWidget>
        )}
        <input type="hidden" name="certificateUrl" value={certUrl} />
        {uploadError && (
          <p className="text-xs text-red-600 mt-1">{uploadError}</p>
        )}
      </Field>

      <Field label="Clinic / ABC center name (required)">
        <input
          name="clinicName"
          required
          maxLength={CLINIC_NAME_MAX}
          placeholder="e.g., Panaji Municipal ABC Center"
          className="w-full border rounded-md p-2 text-sm"
        />
      </Field>

      <Field label="Veterinarian name (optional)">
        <input
          name="veterinarianName"
          maxLength={VET_NAME_MAX}
          placeholder="e.g., Dr. Mehta"
          className="w-full border rounded-md p-2 text-sm"
        />
      </Field>

      <Field
        label="Completion notes (required)"
        hint={`Minimum ${COMPLETION_NOTES_MIN} characters. Describe what was done.`}
      >
        <textarea
          name="completionNotes"
          rows={5}
          required
          minLength={COMPLETION_NOTES_MIN}
          maxLength={COMPLETION_NOTES_MAX}
          placeholder="e.g., 3 dogs sterilized and vaccinated at Panaji ABC Center on Nov 7. Certificate number ABC-2026-0421. All animals released back at the same location."
          className="w-full border rounded-md p-2 text-sm"
        />
      </Field>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !certUrl}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit for verification"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
      {!certUrl && (
        <p className="text-xs text-gray-500">
          Upload a certificate to enable submission.
        </p>
      )}
    </form>
  );
}

function ResolveForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [action, setAction] = useState<"approve" | "reject">("approve");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm">Resolve this dispute</h3>
        <p className="text-xs text-gray-600 mt-1">
          You can accept the proof (mark verified) or reject it (send back to
          the rescuer for re-submission).
        </p>
      </div>

      <Field label="Decision">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAction("approve")}
            className={`flex-1 px-4 py-2 rounded-md text-sm border transition ${
              action === "approve"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Approve — mark verified
          </button>
          <button
            type="button"
            onClick={() => setAction("reject")}
            className={`flex-1 px-4 py-2 rounded-md text-sm border transition ${
              action === "reject"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Reject — send back
          </button>
        </div>
      </Field>
      <input type="hidden" name="action" value={action} />

      <Field label="Resolution note (optional)">
        <textarea
          name="resolutionNote"
          rows={3}
          maxLength={VERIFICATION_NOTE_MAX}
          placeholder="Explain your decision."
          className="w-full border rounded-md p-2 text-sm"
        />
      </Field>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 ${
            action === "approve"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {loading ? "Processing…" : "Confirm resolution"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
