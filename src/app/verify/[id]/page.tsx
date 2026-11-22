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
      <div className="bg-[#F8FAF8] text-[#163829] min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-gray-200/80 rounded-3xl p-8 text-center space-y-4 shadow-xs">
          <div className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 inline-block">Audit Concluded</div>
          <h1 className="font-heading text-2xl font-bold text-[#163829]">Audit Concluded</h1>
          <p className="text-xs text-gray-500">
            This request is no longer in the verification queue.
          </p>
          <Link
            href="/verify"
            className="inline-block btn-paw-primary px-5 py-2.5 rounded-full text-xs font-bold"
          >
            Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  const isOwnSubmission = request.rescuerId === dbUser?.id;

  return (
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/verifications"
            className="text-xs text-emerald-700 font-semibold hover:underline inline-block"
          >
            ← Admin Verification Queue
          </Link>
          <span className="text-gray-300 text-xs">|</span>
          <Link
            href="/verify"
            className="text-xs text-gray-500 font-semibold hover:underline inline-block"
          >
            Field Verifier Queue
          </Link>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Field Surgical Dossier #{request.id.slice(-6).toUpperCase()}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#163829] tracking-tight">{request.location}</h1>
              <p className="text-xs text-gray-500 mt-1">
                {request.animalType} · Estimated count: {request.count}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${
                request.status === "DISPUTED"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              {request.status === "DISPUTED"
                ? "Disputed"
                : "Awaiting review"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/70 rounded-2xl p-4 border border-gray-100">
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Requester</div>
              <div className="font-bold text-[#163829]">
                {request.user.name || "Community Member"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Rescuer</div>
              <div className="font-bold text-[#163829]">
                {request.rescuer?.name || "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Submitted</div>
              <div className="font-bold text-[#163829]">
                {request.proofSubmittedAt
                  ? new Date(request.proofSubmittedAt).toLocaleString("en-IN")
                  : "—"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Clinic</div>
              <div className="font-bold text-[#163829]">{request.clinicName || "—"}</div>
            </div>
            {request.veterinarianName && (
              <div className="sm:col-span-2">
                <div className="text-[11px] text-gray-400 uppercase font-semibold">Attending Veterinarian</div>
                <div className="font-bold text-[#163829]">Dr. {request.veterinarianName}</div>
              </div>
            )}
          </div>
        </div>

        {request.status === "DISPUTED" && request.disputeReason && (
          <div className="border border-rose-200 bg-rose-50 rounded-3xl p-5 shadow-xs">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              Dispute Registered
              {request.disputedBy?.name &&
                ` · filed by ${request.disputedBy.name}`}
            </div>
            <p className="text-xs text-rose-900 whitespace-pre-line leading-relaxed">
              {request.disputeReason}
            </p>
          </div>
        )}

        <div className="border border-gray-200/80 rounded-3xl bg-white p-6 shadow-xs">
          <h2 className="font-heading text-base font-bold text-[#163829] mb-3">
            Surgical Certificate Proof
          </h2>
          {request.completionCertificateUrl ? (
            <a
              href={request.completionCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full h-[480px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs"
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
            <p className="text-xs text-gray-400">No certificate uploaded.</p>
          )}
        </div>

        <div className="border border-gray-200/80 rounded-3xl bg-white p-6 shadow-xs">
          <h2 className="font-heading text-base font-bold text-[#163829] mb-3">
            Rescuer Field Observations
          </h2>
          {request.completionNotes ? (
            <p className="font-body text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {request.completionNotes}
            </p>
          ) : (
            <p className="text-xs text-gray-400">No notes provided.</p>
          )}
        </div>

        <div className="border border-gray-200/80 rounded-3xl bg-white p-6 shadow-xs">
          <h2 className="font-heading text-base font-bold text-[#163829] mb-3">
            GPS Coordinate Verification
          </h2>
          {request.latitude !== null && request.longitude !== null ? (
            <MiniMap
              latitude={request.latitude}
              longitude={request.longitude}
              label={request.location}
            />
          ) : (
            <p className="text-xs text-gray-400">No coordinates were provided.</p>
          )}

          {request.completionLatitude !== null &&
            request.completionLongitude !== null && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#163829] mb-2 uppercase tracking-wide">
                  Clinical Completion Location
                </h3>
                <MiniMap
                  latitude={request.completionLatitude}
                  longitude={request.completionLongitude}
                  label="Where surgery was concluded"
                />
              </div>
            )}
        </div>

        {isOwnSubmission ? (
          <div className="border border-rose-200 bg-rose-50 rounded-2xl p-4 text-xs text-rose-700 font-semibold">
            You cannot verify your own submission. Another registered verifier will audit it.
          </div>
        ) : (
          <VerifyActions
            requestId={request.id}
            isDisputed={request.status === "DISPUTED"}
          />
        )}
      </div>
    </div>
  );
}
