import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { requireVerifier } from "@/lib/auth-helpers";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import MiniMap from "@/app/sterilization/[id]/mini-map";
import VerifyActions from "./verify-actions";

export const dynamic = "force-dynamic";

export default async function VerifyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVerifier();
  const { id } = await params;
  const dbUser = await getOrCreateCurrentUser();

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      rescuer: { select: { id: true, name: true, email: true } },
      verifiedBy: { select: { name: true } },
      disputedBy: { select: { name: true } },
    },
  });

  if (!request) notFound();

  if (request.status !== "PROOF_SUBMITTED" && request.status !== "DISPUTED") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-moss font-semibold mb-3">[RESOLVED]</div>
        <h1 className="text-xl font-bold mb-2">Already handled</h1>
        <p className="text-sm text-gray-600 mb-6">
          This request is no longer in the verification queue.
        </p>
        <Link
          href="/verify"
          className="inline-block bg-gray-900 text-white px-4 py-2 rounded-md text-sm"
        >
          Back to queue
        </Link>
      </div>
    );
  }

  const isOwnSubmission = request.rescuerId === dbUser?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/verify"
        className="text-sm text-gray-500 hover:underline mb-6 inline-block"
      >
        ← Back to queue
      </Link>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h1 className="text-2xl font-bold">{request.location}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {request.animalType} · Estimated count: {request.count}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wider ${
              request.status === "DISPUTED"
                ? "bg-rose-100 text-rose-800 border-rose-200"
                : "bg-purple-100 text-purple-800 border-purple-200"
            }`}
          >
            {request.status === "DISPUTED"
              ? "Disputed"
              : "Awaiting review"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-4">
          <div>
            <div className="text-xs text-gray-500">Requester</div>
            <div className="text-gray-900">
              {request.user.name || "Community Member"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Rescuer</div>
            <div className="text-gray-900">
              {request.rescuer?.name || "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Submitted</div>
            <div className="text-gray-900">
              {request.proofSubmittedAt
                ? new Date(request.proofSubmittedAt).toLocaleString()
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Clinic</div>
            <div className="text-gray-900">{request.clinicName || "—"}</div>
          </div>
          {request.veterinarianName && (
            <div>
              <div className="text-xs text-gray-500">Veterinarian</div>
              <div className="text-gray-900">{request.veterinarianName}</div>
            </div>
          )}
        </div>
      </div>

      {request.status === "DISPUTED" && request.disputeReason && (
        <div className="border border-rose-200 bg-rose-50 rounded-lg p-4 mb-6">
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-1">
            Dispute
            {request.disputedBy?.name &&
              ` · filed by ${request.disputedBy.name}`}
          </div>
          <p className="text-sm text-rose-900 whitespace-pre-line">
            {request.disputeReason}
          </p>
        </div>
      )}

      <div className="border rounded-lg bg-white p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Certificate
        </h2>
        {request.completionCertificateUrl ? (
          <a
            href={request.completionCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-[480px] rounded-md overflow-hidden border bg-gray-50"
          >
            <Image
              src={request.completionCertificateUrl}
              alt="Sterilization certificate"
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-contain"
            />
          </a>
        ) : (
          <p className="text-sm text-gray-500">No certificate uploaded.</p>
        )}
      </div>

      <div className="border rounded-lg bg-white p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Rescuer notes
        </h2>
        {request.completionNotes ? (
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {request.completionNotes}
          </p>
        ) : (
          <p className="text-sm text-gray-500">No notes provided.</p>
        )}
      </div>

      <div className="border rounded-lg bg-white p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Reported location
        </h2>
        {request.latitude !== null && request.longitude !== null ? (
          <MiniMap
            latitude={request.latitude}
            longitude={request.longitude}
            label={request.location}
          />
        ) : (
          <p className="text-sm text-gray-500">No coordinates were provided.</p>
        )}

        {request.completionLatitude !== null &&
          request.completionLongitude !== null && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Completion location
              </h3>
              <MiniMap
                latitude={request.completionLatitude}
                longitude={request.completionLongitude}
                label="Where the work was done"
              />
            </div>
          )}
      </div>

      {isOwnSubmission ? (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 text-sm text-amber-900">
          You cannot verify your own submission. Another verifier will handle
          it.
        </div>
      ) : (
        <VerifyActions
          requestId={request.id}
          isDisputed={request.status === "DISPUTED"}
        />
      )}
    </div>
  );
}
