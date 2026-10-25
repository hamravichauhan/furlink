import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRescueById } from '@/actions/rescue';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import RescueActions from './rescue-actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_METADATA: Record<
  string,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  REPORTED: {
    label: 'REPORTED / OPEN FOR CLAIM',
    bg: 'bg-rose-100',
    text: 'text-[#cc2b3f]',
    border: 'border-[#cc2b3f]',
    desc: 'Incident logged. Ready for community volunteers or ambulance dispatch.',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS / CLAIMED',
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-600',
    desc: 'A volunteer or paramedic has claimed this case and is en route or at the clinic.',
  },
  PROOF_SUBMITTED: {
    label: 'PROOF SUBMITTED / AWAITING VERIFICATION',
    bg: 'bg-blue-100',
    text: 'text-blue-900',
    border: 'border-blue-600',
    desc: 'Treatment completed and clinic bill uploaded. Awaiting admin verification.',
  },
  RESCUED: {
    label: 'VERIFIED RESCUED',
    bg: 'bg-emerald-100',
    text: 'text-emerald-900',
    border: 'border-emerald-600',
    desc: 'Treatment proof and medical invoice certified by administration.',
  },
  DISPUTED: {
    label: 'UNDER DISPUTE AUDIT',
    bg: 'bg-rose-100',
    text: 'text-[#cc2b3f]',
    border: 'border-[#cc2b3f]',
    desc: 'A citizen or community member flagged concerns regarding this rescue.',
  },
  CLOSED: {
    label: 'CASE CLOSED',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-400',
    desc: 'Case archived and finalized.',
  },
};

export default async function RescueDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [rescue, currentUser] = await Promise.all([
    getRescueById(id),
    getOrCreateCurrentUser(),
  ]);

  if (!rescue) {
    notFound();
  }

  const meta = STATUS_METADATA[rescue.status] || STATUS_METADATA.REPORTED;
  const isAdmin = currentUser?.role === 'ADMIN';
  const isVerifier = currentUser?.role === 'VERIFIER';

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-[#1A2540]/20 pb-4">
          <Link
            href="/rescues"
            className="font-mono text-xs font-bold text-[#1A2540]/80 hover:text-[#cc2b3f] transition flex items-center gap-1"
          >
            &larr; BACK TO FIELD RESCUES FEED
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#1A2540]/60">
              CASE #{rescue.id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Masthead Banner */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${meta.border} ${meta.bg} ${meta.text}`}
                >
                  {meta.label}
                </span>
                {rescue.urgency === 'CRITICAL' && (
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#cc2b3f] bg-[#cc2b3f] text-white">
                    CRITICAL EMERGENCY
                  </span>
                )}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-[#1A2540] tracking-tight">
                {rescue.animalType} Trauma Dispatch · {rescue.location}
              </h1>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-[#1A2540]/70">
              <div>Filed on {new Date(rescue.createdAt).toLocaleDateString('en-IN')}</div>
              <div>By {rescue.user.name || rescue.user.email}</div>
            </div>
          </div>
          <p className="font-body text-xs text-[#1A2540]/80 border-t border-[#1A2540]/15 pt-3">
            {meta.desc}
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#f2e9db] rounded-2xl p-5 border-[1.5px] border-[#1A2540]/25 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] gap-2 text-center font-mono text-xs">
            {/* Step 1 */}
            <div className="flex-1">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1A2540] text-[#f2e9db] flex items-center justify-center font-bold">
                1
              </div>
              <div className="font-bold text-[#1A2540] mt-1.5 text-[11px] uppercase">
                Reported
              </div>
              <div className="text-[10px] text-gray-500">
                {rescue.user.name || 'Citizen'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#1A2540]/30" />

            {/* Step 2 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status !== 'REPORTED'
                    ? 'bg-[#1A2540] text-[#f2e9db]'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <div className="font-bold text-[#1A2540] mt-1.5 text-[11px] uppercase">
                Claimed
              </div>
              <div className="text-[10px] text-gray-500">
                {rescue.rescuer?.name || 'Awaiting Rescuer'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#1A2540]/30" />

            {/* Step 3 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status === 'PROOF_SUBMITTED' ||
                  rescue.status === 'RESCUED' ||
                  rescue.status === 'CLOSED'
                    ? 'bg-[#1A2540] text-[#f2e9db]'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <div className="font-bold text-[#1A2540] mt-1.5 text-[11px] uppercase">
                Medical Proof
              </div>
              <div className="text-[10px] text-gray-500">
                {rescue.clinicName || 'Clinic Treatment'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#1A2540]/30" />

            {/* Step 4 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status === 'RESCUED' || rescue.status === 'CLOSED'
                    ? 'bg-emerald-700 text-white'
                    : rescue.status === 'DISPUTED'
                    ? 'bg-[#cc2b3f] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                4
              </div>
              <div className="font-bold text-[#1A2540] mt-1.5 text-[11px] uppercase">
                {rescue.status === 'DISPUTED' ? 'Disputed' : 'Verified'}
              </div>
              <div className="text-[10px] text-gray-500">
                {rescue.verifiedBy?.name || (rescue.status === 'DISPUTED' ? 'Flagged' : 'Audit Board')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl">
          <h3 className="font-heading text-xl text-[#1A2540] mb-4">
            Case Actions &amp; Lifecycle Controls
          </h3>
          <RescueActions
            rescueId={rescue.id}
            status={rescue.status}
            currentUserId={currentUser?.id || null}
            requesterId={rescue.userId}
            rescuerId={rescue.rescuerId}
            isAdmin={isAdmin}
            isVerifier={isVerifier}
            disputeReason={rescue.disputeReason}
          />
        </div>

        {/* Visual Photographic Evidence Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Distress Report Photo */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A2540]/15 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-[#cc2b3f]">
                  [DISPATCH RECORD] Before Treatment
                </span>
                <span className="font-body text-[11px] text-[#1A2540]/70">
                  By {rescue.user.name || 'Citizen'}
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1A2540]/30 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rescue.imageUrl}
                  alt={`Reported ${rescue.animalType}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="font-body text-xs font-bold text-[#1A2540]">
                  Location: {rescue.location}
                </div>
                {rescue.latitude && rescue.longitude && (
                  <div className="font-mono text-[11px] text-[#cc2b3f]">
                    GPS: {rescue.latitude.toFixed(4)}°N, {rescue.longitude.toFixed(4)}°E
                  </div>
                )}
                <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed border-t border-[#1A2540]/15 pt-2">
                  {rescue.description}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Medical Treatment Proof & Bill */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A2540]/15 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-emerald-800">
                  [CLINIC RECORD] After Care &amp; Invoice
                </span>
                <span className="font-body text-[11px] text-[#1A2540]/70">
                  {rescue.rescuer ? `By ${rescue.rescuer.name || 'Rescuer'}` : 'Pending Proof'}
                </span>
              </div>

              {rescue.proofImageUrl ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#1A2540]/30 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rescue.proofImageUrl}
                        alt="Treated animal"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                        Treated Photo
                      </span>
                    </div>

                    {rescue.treatmentBillUrl ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#1A2540]/30 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rescue.treatmentBillUrl}
                          alt="Veterinary bill"
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={rescue.treatmentBillUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-mono px-2 py-0.5 rounded hover:bg-[#cc2b3f]"
                        >
                          View Bill &rarr;
                        </a>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-2xl border border-dashed border-gray-400 flex items-center justify-center p-3 text-center text-xs text-gray-500">
                        No bill uploaded
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#1A2540]/15">
                    <div className="font-body text-xs font-bold text-[#1A2540]">
                      Clinic: {rescue.clinicName}
                    </div>
                    {rescue.veterinarianName && (
                      <div className="font-body text-xs text-[#1A2540]/80">
                        Veterinarian: {rescue.veterinarianName}
                      </div>
                    )}
                    {rescue.treatmentCost !== null && rescue.treatmentCost !== undefined && (
                      <div className="font-mono text-xs text-emerald-800 font-bold">
                        Certified Expense: ₹{rescue.treatmentCost.toLocaleString('en-IN')}
                      </div>
                    )}
                    {rescue.completionNotes && (
                      <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed pt-1">
                        <strong>Clinical Notes:</strong> {rescue.completionNotes}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-2 border border-dashed border-[#1A2540]/25 rounded-2xl">
                  <span className="font-mono text-xs uppercase text-[#1A2540]/60 font-bold block">
                    [AWAITING MEDICAL PROOF]
                  </span>
                  <p className="font-body text-xs text-[#1A2540]/70 max-w-xs mx-auto">
                    Once the rescuer completes clinic treatment, the post-care photo and certified invoice receipt will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification & Audit Details (if verified or resolved) */}
        {(rescue.verifiedAt || rescue.outcome || rescue.verificationNote) && (
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-3">
            <span className="font-mono text-xs uppercase font-bold text-emerald-800 block">
              Official Administration Certification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-[#1A2540]/15 py-3">
              <div>
                <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold block">
                  Audited By
                </span>
                <span className="font-body text-xs font-bold text-[#1A2540]">
                  {rescue.verifiedBy?.name || 'Central Board'}
                </span>
              </div>
              <div>
                <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold block">
                  Date Certified
                </span>
                <span className="font-body text-xs font-bold text-[#1A2540]">
                  {rescue.verifiedAt ? new Date(rescue.verifiedAt).toLocaleDateString('en-IN') : 'Pending'}
                </span>
              </div>
              <div>
                <span className="font-body text-[10px] text-[#1A2540]/60 uppercase font-bold block">
                  Post-Rescue Disposition
                </span>
                <span className="font-mono text-xs font-bold text-[#cc2b3f]">
                  {rescue.outcome || 'TERRITORIAL_RELEASE'}
                </span>
              </div>
            </div>
            {rescue.verificationNote && (
              <p className="font-body text-xs text-[#1A2540]/80 leading-relaxed">
                <strong>Audit Note:</strong> {rescue.verificationNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
