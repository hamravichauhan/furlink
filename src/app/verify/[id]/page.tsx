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
      <div className="bg-[#f3c9d5] text-[#1A2540] min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="font-mono text-xs uppercase tracking-widest text-[#1A2540] font-bold">[RESOLVED]</div>
          <h1 className="font-heading uppercase text-2xl font-black">Audit Concluded</h1>
          <p className="text-xs font-mono uppercase tracking-wider text-[#1A2540]/70">
            This request is no longer in the verification queue.
          </p>
          <Link
            href="/verify"
            className="inline-block bg-[#1A2540] text-[#f2e9db] px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold"
          >
            Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  const isOwnSubmission = request.rescuerId === dbUser?.id;

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/verifications"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#cc2b3f] font-bold hover:underline inline-block"
          >
            ← Admin Verification Queue
          </Link>
          <span className="text-[#1A2540]/30 font-mono text-xs">|</span>
          <Link
            href="/verify"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[#1A2540]/70 font-bold hover:underline inline-block"
          >
            Field Verifier Queue
          </Link>
        </div>

        <div className="bg-[#f2e9db] border-2 border-[#1A2540] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <span className="font-mono text-[10px] text-[#1A2540]/60 font-bold uppercase tracking-widest block mb-1">
                Field Surgical Dossier #{request.id.slice(-6).toUpperCase()}
              </span>
              <h1 className="font-heading uppercase text-2xl sm:text-4xl font-black tracking-tight">{request.location}</h1>
              <p className="font-mono text-xs uppercase tracking-wider text-[#1A2540]/70 mt-1">
                {request.animalType} · Estimated count: {request.count}
              </p>
            </div>
            <span
              className={`font-mono text-[10px] font-bold px-3 py-1 rounded-full border-2 uppercase tracking-wider ${
                request.status === "DISPUTED"
                  ? "bg-white text-[#cc2b3f] border-[#cc2b3f]"
                  : "bg-white text-[#1A2540] border-[#1A2540]"
              }`}
            >
              {request.status === "DISPUTED"
                ? "Disputed"
                : "Awaiting review"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs bg-white rounded-xl p-4 border border-[#1A2540]/20">
            <div>
              <div className="text-[10px] text-[#1A2540]/60 uppercase">Requester</div>
              <div className="font-bold text-[#1A2540]">
                {request.user.name || "Community Member"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#1A2540]/60 uppercase">Rescuer</div>
              <div className="font-bold text-[#1A2540]">
                {request.rescuer?.name || "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#1A2540]/60 uppercase">Submitted</div>
              <div className="font-bold text-[#1A2540]">
                {request.proofSubmittedAt
                  ? new Date(request.proofSubmittedAt).toLocaleString("en-IN")
                  : "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#1A2540]/60 uppercase">Clinic</div>
              <div className="font-bold text-[#1A2540]">{request.clinicName || "—"}</div>
            </div>
            {request.veterinarianName && (
              <div className="sm:col-span-2">
                <div className="text-[10px] text-[#1A2540]/60 uppercase">Attending Veterinarian</div>
                <div className="font-bold text-[#1A2540]">Dr. {request.veterinarianName}</div>
              </div>
            )}
          </div>
        </div>

        {request.status === "DISPUTED" && request.disputeReason && (
          <div className="border-2 border-[#cc2b3f] bg-white rounded-2xl p-5 shadow-sm">
            <div className="font-mono text-xs font-bold text-[#cc2b3f] uppercase tracking-wider mb-1">
              Dispute Registered
              {request.disputedBy?.name &&
                ` · filed by ${request.disputedBy.name}`}
            </div>
            <p className="font-mono text-xs text-[#1A2540] whitespace-pre-line">
              {request.disputeReason}
            </p>
          </div>
        )}

        <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
          <h2 className="font-heading uppercase text-base font-black text-[#1A2540] mb-3">
            Surgical Certificate Proof
          </h2>
          {request.completionCertificateUrl ? (
            <a
              href={request.completionCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full h-[480px] rounded-xl overflow-hidden border-2 border-[#1A2540] bg-white"
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
            <p className="font-mono text-xs uppercase text-[#1A2540]/60">No certificate uploaded.</p>
          )}
        </div>

        <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
          <h2 className="font-heading uppercase text-base font-black text-[#1A2540] mb-3">
            Rescuer Field Observations
          </h2>
          {request.completionNotes ? (
            <p className="font-sans text-sm text-[#1A2540] whitespace-pre-line leading-relaxed">
              {request.completionNotes}
            </p>
          ) : (
            <p className="font-mono text-xs uppercase text-[#1A2540]/60">No notes provided.</p>
          )}
        </div>

        <div className="border-2 border-[#1A2540] rounded-2xl bg-[#f2e9db] p-6 shadow-sm">
          <h2 className="font-heading uppercase text-base font-black text-[#1A2540] mb-3">
            GPS Coordinate Verification
          </h2>
          {request.latitude !== null && request.longitude !== null ? (
            <MiniMap
              latitude={request.latitude}
              longitude={request.longitude}
              label={request.location}
            />
          ) : (
            <p className="font-mono text-xs uppercase text-[#1A2540]/60">No coordinates were provided.</p>
          )}

          {request.completionLatitude !== null &&
            request.completionLongitude !== null && (
              <div className="mt-4 pt-4 border-t-2 border-[#1A2540]/20">
                <h3 className="font-mono text-xs font-bold text-[#1A2540] mb-2 uppercase tracking-wide">
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
          <div className="border-2 border-[#cc2b3f] bg-white rounded-2xl p-4 font-mono text-xs uppercase text-[#cc2b3f] font-bold">
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
