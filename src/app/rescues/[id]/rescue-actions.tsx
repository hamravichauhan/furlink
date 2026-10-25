'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  claimRescueReport,
  releaseRescueReport,
  submitRescueProof,
  verifyRescueProof,
  disputeRescueReport,
  resolveRescueDispute,
} from '@/actions/rescue';
import ImageUpload from '@/components/image-upload';
import { RescueStatus } from '@prisma/client';

interface Props {
  rescueId: string;
  status: RescueStatus;
  currentUserId: string | null;
  requesterId: string;
  rescuerId: string | null;
  isAdmin: boolean;
  isVerifier: boolean;
  disputeReason?: string | null;
}

export default function RescueActions({
  rescueId,
  status,
  currentUserId,
  requesterId,
  rescuerId,
  isAdmin,
  isVerifier,
  disputeReason,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mode, setMode] = useState<
    'idle' | 'claim' | 'submit_proof' | 'verify' | 'dispute' | 'resolve_dispute'
  >('idle');

  // Form states for Proof submission
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [treatmentBillUrl, setTreatmentBillUrl] = useState('');

  const isRescuer = Boolean(currentUserId && rescuerId === currentUserId);
  const isRequester = Boolean(currentUserId && requesterId === currentUserId);
  const canVerify = isAdmin || isVerifier;

  const resetForm = () => {
    setMode('idle');
    setErrorMsg('');
  };

  // 1. Claim Rescue
  const handleClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData(e.currentTarget);
      const notes = (fd.get('rescuerNotes') as string) || '';
      const res = await claimRescueReport(rescueId, notes);
      if (res.success) {
        setSuccessMsg('You have successfully claimed this rescue case.');
        setMode('idle');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to claim rescue.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Release Rescue
  const handleRelease = async () => {
    if (!confirm('Are you sure you want to release this rescue so another volunteer can take it?')) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await releaseRescueReport(rescueId);
      if (res.success) {
        setSuccessMsg('Case released back to community dispatch feed.');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to release case.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Medical Proof
  const handleSubmitProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!proofImageUrl) {
      setErrorMsg('Please upload a post-treatment photo of the animal.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('proofImageUrl', proofImageUrl);
      if (treatmentBillUrl) {
        fd.set('treatmentBillUrl', treatmentBillUrl);
      }

      const res = await submitRescueProof(rescueId, fd);
      if (res.success) {
        setSuccessMsg('Medical proof and clinic receipt submitted. Awaiting Admin verification.');
        setMode('idle');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to submit proof.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Proof (Admin)
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData(e.currentTarget);
      const res = await verifyRescueProof(rescueId, fd);
      if (res.success) {
        setSuccessMsg('Proof verified and case closed successfully.');
        setMode('idle');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to verify proof.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Dispute Case (Citizen / Community)
  const handleDispute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData(e.currentTarget);
      const res = await disputeRescueReport(rescueId, fd);
      if (res.success) {
        setSuccessMsg('Dispute filed. The administration board will re-audit this case.');
        setMode('idle');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to dispute case.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Resolve Dispute (Admin)
  const handleResolveDispute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData(e.currentTarget);
      const res = await resolveRescueDispute(rescueId, fd);
      if (res.success) {
        setSuccessMsg('Dispute resolved.');
        setMode('idle');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to resolve dispute.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-[#cc2b3f] text-[#cc2b3f] rounded-2xl text-xs font-bold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-600 text-emerald-800 rounded-2xl text-xs font-bold">
          {successMsg}
        </div>
      )}

      {/* Disputed Alert Banner */}
      {status === 'DISPUTED' && (
        <div className="p-5 bg-rose-50 border-2 border-[#cc2b3f] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#cc2b3f]">
              [AUDIT ALERT: RESCUE UNDER DISPUTE]
            </span>
          </div>
          <p className="font-body text-xs text-[#1A2540] leading-relaxed">
            <strong>Community Flag:</strong> {disputeReason || 'A community member reported concerns regarding the validity of this rescue or clinic bill.'}
          </p>
        </div>
      )}

      {/* Action Controls Bar */}
      {mode === 'idle' && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Claim Button: Available when status is REPORTED */}
          {status === 'REPORTED' && (
            <button
              onClick={() => setMode('claim')}
              className="btn-enroll-pill px-6 py-3 text-xs font-bold tracking-wider shadow-sm cursor-pointer"
            >
              I WILL HANDLE THIS RESCUE &rarr;
            </button>
          )}

          {/* Submit Proof Button: Available when IN_PROGRESS and user is rescuer (or admin) */}
          {status === 'IN_PROGRESS' && (isRescuer || isAdmin) && (
            <>
              <button
                onClick={() => setMode('submit_proof')}
                className="btn-enroll-pill px-6 py-3 text-xs font-bold tracking-wider shadow-sm cursor-pointer"
              >
                SUBMIT TREATMENT PROOF &amp; BILL &rarr;
              </button>
              <button
                onClick={handleRelease}
                disabled={loading}
                className="font-mono text-xs font-bold uppercase border border-[#1A2540]/30 hover:border-[#cc2b3f] hover:text-[#cc2b3f] px-4 py-2.5 rounded-full transition cursor-pointer"
              >
                Release Case
              </button>
            </>
          )}

          {/* Admin Verification: Available when PROOF_SUBMITTED and user is Admin/Verifier */}
          {status === 'PROOF_SUBMITTED' && canVerify && (
            <button
              onClick={() => setMode('verify')}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-sm cursor-pointer"
            >
              Verify Clinic Proof &amp; Close Case &rarr;
            </button>
          )}

          {/* Citizen Dispute Button: Available when PROOF_SUBMITTED, RESCUED, or CLOSED */}
          {(status === 'PROOF_SUBMITTED' || status === 'RESCUED' || status === 'CLOSED') &&
            currentUserId &&
            !isRescuer && (
              <button
                onClick={() => setMode('dispute')}
                className="font-mono text-xs font-bold uppercase border border-[#cc2b3f] text-[#cc2b3f] hover:bg-[#cc2b3f] hover:text-white px-4 py-2.5 rounded-full transition cursor-pointer"
              >
                Report Concern / Dispute Rescue
              </button>
            )}

          {/* Admin Dispute Resolution: Available when DISPUTED and user is Admin */}
          {status === 'DISPUTED' && isAdmin && (
            <button
              onClick={() => setMode('resolve_dispute')}
              className="bg-[#cc2b3f] hover:bg-[#b02435] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-sm cursor-pointer"
            >
              Admin Audit: Resolve Dispute &rarr;
            </button>
          )}
        </div>
      )}

      {/* ─── Mode: Claim Form ─── */}
      {mode === 'claim' && (
        <form
          onSubmit={handleClaim}
          className="bg-white rounded-2xl p-6 border-[1.5px] border-[#1A2540]/25 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-heading text-lg text-[#1A2540]">Claim Rescue Case</h4>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            By claiming this case, you agree to secure the animal and transport it to a veterinary clinic for treatment.
          </p>
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Estimated Plan / Arrival Notes (Optional)
            </label>
            <input
              name="rescuerNotes"
              placeholder="e.g. En route on scooter with crate, estimated arrival in 20 minutes"
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-enroll-pill px-6 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? 'CONFIRMING CLAIM...' : 'CONFIRM & CLAIM RESCUE'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs px-4 py-2 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Mode: Submit Medical Proof & Bill ─── */}
      {mode === 'submit_proof' && (
        <form
          onSubmit={handleSubmitProof}
          className="bg-white rounded-2xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#cc2b3f] block">
                Verification Proof Intake
              </span>
              <h4 className="font-heading text-xl text-[#1A2540]">
                Submit Veterinary Treatment &amp; Bill
              </h4>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          {/* Photo of animal after treatment */}
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Post-Treatment Animal Photograph (Required)
            </label>
            <ImageUpload
              value={proofImageUrl}
              onChange={(url) => setProofImageUrl(url)}
              onRemove={() => setProofImageUrl('')}
            />
            <p className="font-body text-[11px] text-gray-500 mt-1">
              Show treated wounds, bandages, or animal safe in clinic.
            </p>
          </div>

          {/* Clinic Bill / Invoice receipt */}
          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Veterinary Clinic Bill / Invoice Receipt (Recommended)
            </label>
            <ImageUpload
              value={treatmentBillUrl}
              onChange={(url) => setTreatmentBillUrl(url)}
              onRemove={() => setTreatmentBillUrl('')}
            />
            <p className="font-body text-[11px] text-gray-500 mt-1">
              Upload invoice photo or receipt for reimbursement / transparency audit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
                Clinic / Hospital Name (Required)
              </label>
              <input
                name="clinicName"
                placeholder="e.g. Belagavi Pet Care Hospital, Tilakwadi"
                required
                className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
                Treating Veterinarian
              </label>
              <input
                name="veterinarianName"
                placeholder="e.g. Dr. Rajesh Kulkarni (B.V.Sc)"
                className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Total Medical / Treatment Cost in INR (₹)
            </label>
            <input
              type="number"
              name="treatmentCost"
              placeholder="e.g. 1200"
              step="0.01"
              min="0"
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Treatment &amp; Medication Summary (Required)
            </label>
            <textarea
              name="completionNotes"
              rows={3}
              required
              minLength={5}
              placeholder="Detail medications administered, splints applied, vaccines given, and follow-up care instructions..."
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-enroll-pill px-6 py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? 'SUBMITTING PROOF...' : 'SUBMIT PROOF FOR VERIFICATION'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs px-5 py-2.5 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Mode: Admin Verify Proof ─── */}
      {mode === 'verify' && (
        <form
          onSubmit={handleVerify}
          className="bg-white rounded-2xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#cc2b3f] block">
                Official Verification Console
              </span>
              <h4 className="font-heading text-xl text-[#1A2540]">
                Verify Medical Proof &amp; Determine Outcome
              </h4>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Post-Rescue Animal Disposition / Outcome
            </label>
            <select
              name="outcome"
              defaultValue="TERRITORIAL_RELEASE"
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            >
              <option value="TERRITORIAL_RELEASE">
                Territorial Release (Healed and returned to original street territory)
              </option>
              <option value="SANCTUARY">
                Sanctuary / Permanent Medical Care (Admitted to Belagavi Sanctuary)
              </option>
              <option value="MOVE_TO_ADOPTION">
                Transfer to Adoption (Ready for loving home placement)
              </option>
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Official Verification Notes (Optional)
            </label>
            <textarea
              name="verificationNote"
              rows={3}
              placeholder="e.g. Cross-verified with Belagavi Pet Care log #482. Treatment bills certified authentic."
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'APPROVE & CLOSE CASE'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs px-5 py-2.5 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Mode: Dispute / Report as Fake ─── */}
      {mode === 'dispute' && (
        <form
          onSubmit={handleDispute}
          className="bg-rose-50/50 rounded-2xl p-6 sm:p-8 border-[1.5px] border-[#cc2b3f] shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#cc2b3f]/20 pb-3">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#cc2b3f] block">
                Citizen Watchdog Alert
              </span>
              <h4 className="font-heading text-xl text-[#1A2540]">
                Report Concern / Dispute Rescue Validity
              </h4>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed">
            If you believe this rescue was not performed, the submitted bills or photos are fraudulent, or the animal was left untreated on the street, report your observations below. The administration audit committee will review and re-dispatch inspectors.
          </p>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Dispute Grievance / Reason (Minimum 10 characters)
            </label>
            <textarea
              name="disputeReason"
              rows={4}
              required
              minLength={10}
              placeholder="e.g. I live right opposite this location. The injured dog was never taken by this rescuer, or the clinic receipt is dated last year..."
              className="w-full bg-white border border-[#cc2b3f]/30 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#cc2b3f] hover:bg-[#b02435] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'FILING DISPUTE...' : 'SUBMIT DISPUTE TO AUDIT BOARD'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs px-5 py-2.5 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Mode: Resolve Dispute (Admin) ─── */}
      {mode === 'resolve_dispute' && (
        <form
          onSubmit={handleResolveDispute}
          className="bg-white rounded-2xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-heading text-xl text-[#1A2540]">
              Resolve Community Dispute
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Audit Resolution Decision
            </label>
            <select
              name="action"
              defaultValue="confirm_rescued"
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            >
              <option value="confirm_rescued">
                Reaffirm Genuine (Dispute investigated and cleared; rescue stands verified)
              </option>
              <option value="reopen">
                Reopen Case (Dispute upheld; reset to open so genuine rescuer / ambulance takes it)
              </option>
              <option value="close_fraud">
                Confirm Fraudulent (Flag proof as invalid, penalize rescuer, close ticket)
              </option>
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-[#1A2540] mb-1">
              Resolution Audit Notes
            </label>
            <textarea
              name="resolutionNote"
              rows={3}
              placeholder="Document the verification findings and reason for this audit determination..."
              className="w-full bg-[#f2e9db]/30 border border-[#1A2540]/25 rounded-xl p-2.5 text-xs text-[#1A2540]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'APPLYING DECISION...' : 'APPLY AUDIT DECISION'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs px-5 py-2.5 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
