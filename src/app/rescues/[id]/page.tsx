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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <Link
            href="/rescues"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to Incidents
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-400">
              Case #{rescue.id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Masthead Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${meta.border} ${meta.bg} ${meta.text}`}
                >
                  {meta.label}
                </span>
                {rescue.urgency === 'CRITICAL' && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Critical Emergency
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#163829] tracking-tight">
                {rescue.animalType} Trauma Dispatch · {rescue.location}
              </h1>
            </div>
            <div className="text-left sm:text-right text-xs text-gray-500">
              <div>Filed {new Date(rescue.createdAt).toLocaleDateString('en-IN')}</div>
              <div>By {rescue.user.name || rescue.user.email}</div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
            {meta.desc}
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] gap-2 text-center text-xs">
            {/* Step 1 */}
            <div className="flex-1">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#163829] text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="font-bold text-[#163829] mt-1.5 text-[11px] uppercase">
                Reported
              </div>
              <div className="text-[10px] text-gray-400">
                {rescue.user.name || 'Citizen'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />

            {/* Step 2 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status !== 'REPORTED'
                    ? 'bg-[#163829] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                2
              </div>
              <div className="font-bold text-[#163829] mt-1.5 text-[11px] uppercase">
                Claimed
              </div>
              <div className="text-[10px] text-gray-400">
                {rescue.rescuer?.name || 'Awaiting Rescuer'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />

            {/* Step 3 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status === 'PROOF_SUBMITTED' ||
                  rescue.status === 'RESCUED' ||
                  rescue.status === 'CLOSED'
                    ? 'bg-[#163829] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                3
              </div>
              <div className="font-bold text-[#163829] mt-1.5 text-[11px] uppercase">
                Medical Proof
              </div>
              <div className="text-[10px] text-gray-400">
                {rescue.clinicName || 'Clinic Treatment'}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />

            {/* Step 4 */}
            <div className="flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                  rescue.status === 'RESCUED' || rescue.status === 'CLOSED'
                    ? 'bg-emerald-700 text-white'
                    : rescue.status === 'DISPUTED'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                4
              </div>
              <div className="font-bold text-[#163829] mt-1.5 text-[11px] uppercase">
                {rescue.status === 'DISPUTED' ? 'Disputed' : 'Verified'}
              </div>
              <div className="text-[10px] text-gray-400">
                {rescue.verifiedBy?.name || (rescue.status === 'DISPUTED' ? 'Flagged' : 'Audit Board')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <h3 className="font-heading text-lg font-bold text-[#163829] mb-4">
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
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Before Treatment
                </span>
                <span className="text-xs text-gray-400">
                  By {rescue.user.name || 'Citizen'}
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rescue.imageUrl}
                  alt={`Reported ${rescue.animalType}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-bold text-[#163829]">
                  Location: {rescue.location}
                </div>
                {rescue.latitude && rescue.longitude && (
                  <div className="font-mono text-xs text-emerald-700">
                    GPS: {rescue.latitude.toFixed(4)}°N, {rescue.longitude.toFixed(4)}°E
                  </div>
                )}
                <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                  {rescue.description}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Medical Treatment Proof & Bill */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  After Care &amp; Invoice
                </span>
                <span className="text-xs text-gray-400">
                  {rescue.rescuer ? `By ${rescue.rescuer.name || 'Rescuer'}` : 'Pending Proof'}
                </span>
              </div>

              {rescue.proofImageUrl ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
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
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
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
                          className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-mono px-2 py-0.5 rounded hover:bg-emerald-700"
                        >
                          View Bill &rarr;
                        </a>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-2xl border border-dashed border-gray-200 flex items-center justify-center p-3 text-center text-xs text-gray-400">
                        No bill uploaded
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="text-xs font-bold text-[#163829]">
                      Clinic: {rescue.clinicName}
                    </div>
                    {rescue.veterinarianName && (
                      <div className="text-xs text-gray-600">
                        Veterinarian: {rescue.veterinarianName}
                      </div>
                    )}
                    {rescue.treatmentCost !== null && rescue.treatmentCost !== undefined && (
                      <div className="text-xs text-emerald-800 font-bold">
                        Certified Expense: ₹{rescue.treatmentCost.toLocaleString('en-IN')}
                      </div>
                    )}
                    {rescue.completionNotes && (
                      <p className="text-xs text-gray-600 leading-relaxed pt-1">
                        <strong>Clinical Notes:</strong> {rescue.completionNotes}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-2 border border-dashed border-gray-200 rounded-2xl">
                  <span className="text-xs uppercase text-gray-400 font-bold block">
                    Awaiting Medical Proof
                  </span>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Once the rescuer completes clinic treatment, the post-care photo and certified invoice receipt will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification & Audit Details (if verified or resolved) */}
        {(rescue.verifiedAt || rescue.outcome || rescue.verificationNote) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <span className="text-xs uppercase font-bold text-emerald-800 block">
              Official Administration Certification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-gray-100 py-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                  Audited By
                </span>
                <span className="text-xs font-bold text-[#163829]">
                  {rescue.verifiedBy?.name || 'Central Board'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                  Date Certified
                </span>
                <span className="text-xs font-bold text-[#163829]">
                  {rescue.verifiedAt ? new Date(rescue.verifiedAt).toLocaleDateString('en-IN') : 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                  Post-Rescue Disposition
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {rescue.outcome || 'TERRITORIAL_RELEASE'}
                </span>
              </div>
            </div>
            {rescue.verificationNote && (
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Audit Note:</strong> {rescue.verificationNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
