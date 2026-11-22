import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import {
  STATUS_LABELS,
  STATUS_ICONS,
  PROGRESS_STEPS,
  getStepIndex,
} from "@/lib/sterilization-constants";
import RequestActions from "./request-actions";
import MiniMap from "./mini-map";

export const dynamic = "force-dynamic";

export default async function SterilizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      rescuer: { select: { id: true, name: true, email: true } },
      verifiedBy: { select: { id: true, name: true } },
      disputedBy: { select: { id: true, name: true } },
    },
  });

  if (!request) notFound();

  const dbUser = await getOrCreateCurrentUser();

  const isRequester = dbUser?.id === request.userId;
  const isRescuer = dbUser?.id === request.rescuerId;
  const isSignedIn = !!dbUser;
  const isVerifier = hasRole(dbUser, "VERIFIER");
  const isAdmin = dbUser?.role === "ADMIN";

  const canAccept =
    isSignedIn &&
    (!isRequester || isAdmin) &&
    request.status === "PENDING";

  const canSubmitProof =
    isSignedIn && isRescuer && request.status === "SCHEDULED";

  const canVerify =
    isSignedIn &&
    isVerifier &&
    request.status === "PROOF_SUBMITTED" &&
    !isRescuer;

  const canDispute =
    isSignedIn &&
    (request.status === "PROOF_SUBMITTED" || request.status === "VERIFIED") &&
    !isRescuer;

  const canResolve = isSignedIn && isVerifier && request.status === "DISPUTED";

  const canCancel =
    isSignedIn &&
    (isRequester || isRescuer || isAdmin) &&
    (request.status === "PENDING" || request.status === "SCHEDULED");

  const stepIndex = getStepIndex(request.status);

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-gray-200/80 pb-4 flex items-center justify-between">
          <Link
            href="/sterilization"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            ← Back to TNVR Registry
          </Link>
          <span className="font-mono text-xs text-gray-400">
            Case #{request.id.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Surgical Dossier
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-[#163829] leading-tight">
              {request.location}
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Classification: {request.animalType} · Census: {request.count} {request.count === 1 ? "Subject" : "Subjects"}
            </p>
          </div>
          <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[#163829] shadow-xs">
            {STATUS_LABELS[request.status] || request.status}
          </span>
        </div>

        {request.notes && (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">
              Field Intake Observations
            </div>
            <p className="font-body text-sm text-gray-700 italic leading-relaxed">
              &ldquo;{request.notes}&rdquo;
            </p>
          </div>
        )}

        {request.latitude !== null && request.longitude !== null && (
          <div className="border border-gray-200/80 bg-white rounded-3xl p-5 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-bold">
              Grid Cartography
            </div>
            <MiniMap
              latitude={request.latitude}
              longitude={request.longitude}
              label={request.location}
            />
            <p className="text-xs text-emerald-700 mt-3 font-medium">
              GPS Position: {request.latitude.toFixed(4)}°N, {request.longitude.toFixed(4)}°E
            </p>
          </div>
        )}

        {stepIndex !== -1 && (
          <div className="border border-gray-200/80 bg-white rounded-3xl p-6 shadow-xs overflow-x-auto">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-5 font-bold">
              Clinical Step Progression
            </div>
            <div className="flex items-center min-w-[500px]">
              {PROGRESS_STEPS.map((step, i) => {
                const done = i <= stepIndex;
                const isLast = i === PROGRESS_STEPS.length - 1;
                return (
                  <div
                    key={step.key}
                    className={`flex items-center ${isLast ? "" : "flex-1"}`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          done
                            ? "bg-[#163829] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      <span
                        className={`text-[11px] whitespace-nowrap font-medium ${
                          done ? "text-[#163829]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-3 ${
                          i < stepIndex ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificate + Verification Plate */}
        {(request.completionCertificateUrl ||
          request.status === "VERIFIED" ||
          request.status === "PROOF_SUBMITTED" ||
          request.status === "DISPUTED") && (
          <div className="border border-gray-200/80 bg-white rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
              <div className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                Veterinary Surgical Certificate
              </div>
              {request.status === "VERIFIED" && request.verifiedBy && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                  Audited by {request.verifiedBy.name ?? "Clinical Verifier"}
                  {request.verifiedAt
                    ? ` · ${new Date(request.verifiedAt).toLocaleDateString("en-IN")}`
                    : ""}
                </span>
              )}
              {request.status === "PROOF_SUBMITTED" && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                  Awaiting Verifier Seal
                </span>
              )}
              {request.status === "DISPUTED" && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700">
                  Audit Hold Active
                </span>
              )}
            </div>

            {request.completionCertificateUrl && (
              <a
                href={request.completionCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-80 border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden shadow-xs"
              >
                <Image
                  src={request.completionCertificateUrl}
                  alt="Veterinary surgical certificate"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </a>
            )}

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-gray-100 pt-4">
              {request.clinicName && (
                <div>
                  <dt className="text-gray-400">Clinic / ABC Facility</dt>
                  <dd className="font-semibold text-[#163829] mt-0.5">{request.clinicName}</dd>
                </div>
              )}
              {request.veterinarianName && (
                <div>
                  <dt className="text-gray-400">Operating Surgeon</dt>
                  <dd className="font-semibold text-[#163829] mt-0.5">{request.veterinarianName}</dd>
                </div>
              )}
              {request.proofSubmittedAt && (
                <div>
                  <dt className="text-gray-400">Lodged Timestamp</dt>
                  <dd className="text-[#163829] mt-0.5">
                    {new Date(request.proofSubmittedAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
              {request.verifiedAt && (
                <div>
                  <dt className="text-gray-400">Audit Timestamp</dt>
                  <dd className="text-[#163829] mt-0.5">
                    {new Date(request.verifiedAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
            </dl>

            {request.completionNotes && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">
                  Rescuer / Handler Observations
                </div>
                <p className="font-body text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                  {request.completionNotes}
                </p>
              </div>
            )}

            {request.verificationNote && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">
                  Verifier Remarks
                </div>
                <p className="font-body text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                  {request.verificationNote}
                </p>
              </div>
            )}

            {request.disputeReason && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-rose-700 mb-1 font-bold">
                  Audit Exception Note
                  {request.disputedBy?.name && ` · ${request.disputedBy.name}`}
                </div>
                <p className="font-body text-xs text-rose-800 whitespace-pre-line leading-relaxed">
                  {request.disputeReason}
                </p>
              </div>
            )}
          </div>
        )}

        {request.status === "CANCELLED" && (
          <div className="border border-gray-200/80 bg-white rounded-3xl p-5 shadow-xs">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              Case Withdrawn / Cancelled
            </div>
            <p className="font-body text-xs text-gray-500">
              {request.cancelledAt
                ? `Docket cancelled on ${new Date(request.cancelledAt).toLocaleDateString("en-IN")}.`
                : "This docket has been cancelled."}
            </p>
            {request.cancellationNote && (
              <p className="font-body text-xs text-gray-500 mt-2 italic">
                &ldquo;{request.cancellationNote}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="border border-gray-200/80 bg-white rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-lg font-bold text-[#163829] border-b border-gray-100 pb-3">
            Case Chronology Log
          </h2>
          <ol className="space-y-4 pt-2">
            <TimelineRow
              label="Intake Registered"
              who={request.user.name || "Community Member"}
              when={request.createdAt}
            />

            {request.rescuer && (
              <TimelineRow
                label="Dispatch Unit Assigned"
                who={request.rescuer.name || "Field Officer"}
                when={request.updatedAt}
                extra={
                  request.scheduledAt
                    ? `Planned execution for ${new Date(
                        request.scheduledAt,
                      ).toLocaleDateString("en-IN")}`
                    : undefined
                }
              />
            )}

            {request.proofSubmittedAt && (
              <TimelineRow
                label="Clinical Certification Filed"
                who={request.rescuer?.name || "Field Officer"}
                when={request.proofSubmittedAt}
              />
            )}

            {request.verifiedAt && request.verifiedBy && (
              <TimelineRow
                label="Audit Verification Approved"
                who={request.verifiedBy.name || "Clinical Auditor"}
                when={request.verifiedAt}
              />
            )}
          </ol>
        </div>

        <RequestActions
          requestId={request.id}
          canAccept={canAccept}
          canSubmitProof={canSubmitProof}
          canVerify={canVerify}
          canDispute={canDispute}
          canResolve={canResolve}
          canCancel={canCancel}
          isRescuer={!!isRescuer}
          status={request.status}
        />

        {!isSignedIn && (
          <div className="border border-gray-200/80 bg-white rounded-3xl p-5 text-xs text-center text-gray-500 shadow-xs">
            <Link href="/sign-in" className="text-emerald-700 hover:underline font-semibold">
              Sign In
            </Link>{" "}
            with authorized credentials to interact with this docket.
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineRow({
  label,
  who,
  when,
  extra,
}: {
  label: string;
  who: string;
  when: Date;
  extra?: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-bold text-[#163829]">
          {label}
        </div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          {who} · {new Date(when).toLocaleString("en-IN")}
        </div>
        {extra && (
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            {extra}
          </div>
        )}
      </div>
    </li>
  );
}
