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
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b-2 border-[#1A2540] pb-4 flex items-center justify-between">
          <Link
            href="/sterilization"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] hover:underline underline-offset-4 font-bold"
          >
            ← Back to Pipeline Registry
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540]/60 font-bold">
            Case Ref: {request.id.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap border-b-2 border-[#1A2540] pb-6">
          <div>
            <div className="inline-block border-2 border-[#1A2540] bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540] font-bold mb-2">
              Surgical Dossier
            </div>
            <h1 className="font-heading uppercase text-3xl sm:text-5xl font-black tracking-tight text-[#1A2540] leading-tight">
              {request.location}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#1A2540]/70 mt-2">
              Classification: {request.animalType} / Census: {request.count} {request.count === 1 ? "Subject" : "Subjects"}
            </p>
          </div>
          <span className="font-mono text-[10.5px] font-bold px-3.5 py-1.5 border-2 border-[#1A2540] uppercase tracking-[0.16em] bg-[#f2e9db] text-[#1A2540]">
            [{STATUS_ICONS[request.status]}] {STATUS_LABELS[request.status] || request.status}
          </span>
        </div>

        {request.notes && (
          <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-5 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540]/60 mb-1.5 font-bold">
              Field Intake Observations
            </div>
            <p className="font-body text-sm text-[#1A2540]/85 italic leading-relaxed">
              &ldquo;{request.notes}&rdquo;
            </p>
          </div>
        )}

        {request.latitude !== null && request.longitude !== null && (
          <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-5 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540]/60 mb-3 font-bold">
              Grid Cartography
            </div>
            <MiniMap
              latitude={request.latitude}
              longitude={request.longitude}
              label={request.location}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#cc2b3f] mt-3 font-bold">
              GPS Position: {request.latitude.toFixed(4)} N, {request.longitude.toFixed(4)} E
            </p>
          </div>
        )}

        {stepIndex !== -1 && (
          <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-6 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A2540]/60 mb-5 font-bold">
              Clinical Step Progression
            </div>
            <div className="flex items-center">
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
                        className={`w-8 h-8 border-2 border-[#1A2540] rounded-lg flex items-center justify-center font-mono text-[11px] font-bold ${
                          done
                            ? "bg-[#cc2b3f] text-[#f2e9db]"
                            : "bg-white text-[#1A2540]/40"
                        }`}
                      >
                        {done ? "OK" : i + 1}
                      </div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.14em] whitespace-nowrap ${
                          done ? "text-[#1A2540] font-bold" : "text-[#1A2540]/40"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-3 ${
                          i < stepIndex ? "bg-[#cc2b3f]" : "bg-[#1A2540]/20"
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
          <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-[#1A2540]/20 pb-3 flex-wrap gap-2">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1A2540]/60 font-bold">
                Veterinary Surgical Certificate
              </div>
              {request.status === "VERIFIED" && request.verifiedBy && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold px-3 py-1 border-2 border-[#1A2540] bg-white text-[#1A2540]">
                  Audited by {request.verifiedBy.name ?? "Clinical Verifier"}
                  {request.verifiedAt
                    ? ` · ${new Date(request.verifiedAt).toLocaleDateString("en-IN")}`
                    : ""}
                </span>
              )}
              {request.status === "PROOF_SUBMITTED" && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold px-3 py-1 border-2 border-[#1A2540] bg-white text-[#cc2b3f]">
                  Awaiting Verifier Seal
                </span>
              )}
              {request.status === "DISPUTED" && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold px-3 py-1 border-2 border-[#cc2b3f] bg-white text-[#cc2b3f]">
                  Audit Hold Active
                </span>
              )}
            </div>

            {request.completionCertificateUrl && (
              <a
                href={request.completionCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-80 border-2 border-[#1A2540] rounded-xl bg-white overflow-hidden"
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

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase tracking-wide border-t-2 border-[#1A2540]/20 pt-4">
              {request.clinicName && (
                <div>
                  <dt className="text-[10px] text-[#1A2540]/50">Clinic / ABC Facility</dt>
                  <dd className="font-bold text-[#1A2540] mt-0.5">{request.clinicName}</dd>
                </div>
              )}
              {request.veterinarianName && (
                <div>
                  <dt className="text-[10px] text-[#1A2540]/50">Operating Surgeon</dt>
                  <dd className="font-bold text-[#1A2540] mt-0.5">{request.veterinarianName}</dd>
                </div>
              )}
              {request.proofSubmittedAt && (
                <div>
                  <dt className="text-[10px] text-[#1A2540]/50">Lodged Timestamp</dt>
                  <dd className="text-[#1A2540] mt-0.5">
                    {new Date(request.proofSubmittedAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
              {request.verifiedAt && (
                <div>
                  <dt className="text-[10px] text-[#1A2540]/50">Audit Timestamp</dt>
                  <dd className="text-[#1A2540] mt-0.5">
                    {new Date(request.verifiedAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
            </dl>

            {request.completionNotes && (
              <div className="mt-4 pt-3 border-t border-[#1A2540]/15">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1A2540]/60 mb-1 font-bold">
                  Rescuer / Handler Observations
                </div>
                <p className="font-body text-xs text-[#1A2540]/85 whitespace-pre-line leading-relaxed">
                  {request.completionNotes}
                </p>
              </div>
            )}

            {request.verificationNote && (
              <div className="mt-4 pt-3 border-t border-[#1A2540]/15">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1A2540] mb-1 font-bold">
                  Verifier Remarks
                </div>
                <p className="font-body text-xs text-[#1A2540]/85 whitespace-pre-line leading-relaxed">
                  {request.verificationNote}
                </p>
              </div>
            )}

            {request.disputeReason && (
              <div className="mt-4 pt-3 border-t border-[#1A2540]/15">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#cc2b3f] mb-1 font-bold">
                  Audit Exception Note
                  {request.disputedBy?.name && ` · ${request.disputedBy.name}`}
                </div>
                <p className="font-body text-xs text-[#1A2540]/85 whitespace-pre-line leading-relaxed">
                  {request.disputeReason}
                </p>
              </div>
            )}
          </div>
        )}

        {request.status === "CANCELLED" && (
          <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-5 shadow-sm">
            <div className="font-mono text-[10.5px] font-bold text-[#cc2b3f] uppercase tracking-[0.16em] mb-1">
              Case Withdrawn / Cancelled
            </div>
            <p className="font-body text-xs text-[#1A2540]/75">
              {request.cancelledAt
                ? `Docket cancelled on ${new Date(request.cancelledAt).toLocaleDateString("en-IN")}.`
                : "This docket has been cancelled."}
            </p>
            {request.cancellationNote && (
              <p className="font-body text-xs text-[#1A2540]/75 mt-2 italic">
                &ldquo;{request.cancellationNote}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-heading uppercase text-lg font-black text-[#1A2540] border-b-2 border-[#1A2540]/20 pb-3">
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
          <div className="border-2 border-[#1A2540] bg-[#f2e9db] rounded-2xl p-5 font-mono text-xs text-center uppercase tracking-wide">
            <Link href="/sign-in" className="text-[#cc2b3f] hover:underline font-bold">
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
      <div className="w-2.5 h-2.5 border-2 border-[#1A2540] bg-[#cc2b3f] mt-1.5 shrink-0 rounded-xs" />
      <div className="flex-1">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A2540]">
          {label}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#1A2540]/60 mt-0.5">
          {who} · {new Date(when).toLocaleString("en-IN")}
        </div>
        {extra && (
          <div className="font-mono text-[10px] text-[#cc2b3f] mt-1 uppercase tracking-wide font-bold">
            {extra}
          </div>
        )}
      </div>
    </li>
  );
}
