import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { hasRole } from "@/lib/auth-helpers";
import {
  STATUS_COLORS,
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

  const canAccept = isSignedIn && !isRequester && request.status === "PENDING";

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/sterilization"
        className="text-sm text-gray-500 hover:underline mb-6 inline-block"
      >
        ← Back to requests
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{request.location}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {request.animalType} · Estimated count: {request.count}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wider ${
            STATUS_COLORS[request.status] || "bg-gray-100"
          }`}
        >
          {STATUS_ICONS[request.status]}{" "}
          {STATUS_LABELS[request.status] || request.status}
        </span>
      </div>

      {request.notes && (
        <div className="bg-gray-50 border rounded-md p-4 mb-6">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Requester observations
          </div>
          <p className="text-sm text-gray-800 italic">
            &ldquo;{request.notes}&rdquo;
          </p>
        </div>
      )}

      {request.latitude !== null && request.longitude !== null && (
        <div className="border rounded-lg bg-white p-4 mb-6">
          <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Location on map
          </div>
          <MiniMap
            latitude={request.latitude}
            longitude={request.longitude}
            label={request.location}
          />
          <p className="text-xs text-gray-500 mt-2">
            📍 {request.latitude.toFixed(4)}°N, {request.longitude.toFixed(4)}°E
          </p>
        </div>
      )}

      {stepIndex !== -1 && (
        <div className="border rounded-lg bg-white p-6 mb-6">
          <div className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
            Progress
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
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                        done
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[10px] whitespace-nowrap ${
                        done ? "text-emerald-700 font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        i < stepIndex ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certificate + verification block */}
      {(request.completionCertificateUrl ||
        request.status === "VERIFIED" ||
        request.status === "PROOF_SUBMITTED" ||
        request.status === "DISPUTED") && (
        <div className="border rounded-lg bg-white p-5 mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Certificate
            </div>
            {request.status === "VERIFIED" && request.verifiedBy && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                ✅ Verified by {request.verifiedBy.name ?? "a verifier"}
                {request.verifiedAt
                  ? ` · ${new Date(request.verifiedAt).toLocaleDateString()}`
                  : ""}
              </span>
            )}
            {request.status === "PROOF_SUBMITTED" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                🕐 Awaiting verification
              </span>
            )}
            {request.status === "DISPUTED" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-rose-100 text-rose-800 border-rose-200">
                ⚠️ Disputed
              </span>
            )}
          </div>

          {request.completionCertificateUrl && (
            <a
              href={request.completionCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full h-72 rounded-md overflow-hidden border bg-gray-50 mb-3"
            >
              <Image
                src={request.completionCertificateUrl}
                alt="Sterilization certificate"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </a>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {request.clinicName && (
              <div>
                <dt className="text-xs text-gray-500">Clinic / ABC center</dt>
                <dd className="text-gray-900">{request.clinicName}</dd>
              </div>
            )}
            {request.veterinarianName && (
              <div>
                <dt className="text-xs text-gray-500">Veterinarian</dt>
                <dd className="text-gray-900">{request.veterinarianName}</dd>
              </div>
            )}
            {request.proofSubmittedAt && (
              <div>
                <dt className="text-xs text-gray-500">Submitted</dt>
                <dd className="text-gray-900">
                  {new Date(request.proofSubmittedAt).toLocaleString()}
                </dd>
              </div>
            )}
            {request.verifiedAt && (
              <div>
                <dt className="text-xs text-gray-500">Verified</dt>
                <dd className="text-gray-900">
                  {new Date(request.verifiedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>

          {request.completionNotes && (
            <div className="mt-4 pt-3 border-t">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Rescuer notes
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {request.completionNotes}
              </p>
            </div>
          )}

          {request.verificationNote && (
            <div className="mt-4 pt-3 border-t">
              <div className="text-xs font-medium text-emerald-700 mb-1">
                Verifier note
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {request.verificationNote}
              </p>
            </div>
          )}

          {request.disputeReason && (
            <div className="mt-4 pt-3 border-t">
              <div className="text-xs font-medium text-rose-700 mb-1">
                Dispute reason
                {request.disputedBy?.name && ` · ${request.disputedBy.name}`}
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {request.disputeReason}
              </p>
            </div>
          )}
        </div>
      )}

      {request.status === "CANCELLED" && (
        <div className="border border-rose-200 bg-rose-50 rounded-lg p-4 mb-6">
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-1">
            Cancelled
          </div>
          <p className="text-sm text-rose-900">
            {request.cancelledAt
              ? `This request was cancelled on ${new Date(
                  request.cancelledAt,
                ).toLocaleDateString()}.`
              : "This request was cancelled."}
          </p>
          {request.cancellationNote && (
            <p className="text-xs text-rose-700 mt-2 italic">
              &ldquo;{request.cancellationNote}&rdquo;
            </p>
          )}
        </div>
      )}

      <div className="border rounded-lg bg-white p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Timeline
        </h2>
        <ol className="space-y-4">
          <TimelineItem
            label="Requested"
            who={request.user.name || "Community Member"}
            when={request.createdAt}
            color="amber"
          />

          {request.rescuer && (
            <TimelineItem
              label="Accepted by rescuer"
              who={request.rescuer.name || "Rescuer"}
              when={request.updatedAt}
              color="blue"
              extra={
                request.scheduledAt
                  ? `Planned for ${new Date(
                      request.scheduledAt,
                    ).toLocaleDateString()}`
                  : undefined
              }
            />
          )}

          {request.proofSubmittedAt && (
            <TimelineItem
              label="Proof submitted"
              who={request.rescuer?.name || "Rescuer"}
              when={request.proofSubmittedAt}
              color="rose"
            />
          )}

          {request.verifiedAt && request.verifiedBy && (
            <TimelineItem
              label="Verified"
              who={request.verifiedBy.name || "Verifier"}
              when={request.verifiedAt}
              color="emerald"
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
        <div className="border rounded-lg bg-gray-50 p-4 text-sm text-gray-600 text-center">
          <Link href="/sign-in" className="text-emerald-600 hover:underline">
            Sign in
          </Link>{" "}
          to interact with this request.
        </div>
      )}
    </div>
  );
}

function TimelineItem({
  label,
  who,
  when,
  color,
  extra,
}: {
  label: string;
  who: string;
  when: Date;
  color: "amber" | "blue" | "emerald" | "rose";
  extra?: string;
}) {
  const colorMap = {
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  } as const;

  return (
    <li className="flex gap-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${colorMap[color]}`} />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">
          {who} · {new Date(when).toLocaleString()}
        </div>
        {extra && (
          <div className="text-xs text-gray-500 mt-1 italic">{extra}</div>
        )}
      </div>
    </li>
  );
}
