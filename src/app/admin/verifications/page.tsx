import Link from "next/link";
import { getVerificationQueue } from "@/actions/sterilization";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  await requireAdmin();

  const [sterilizationQueue, rescueQueue] = await Promise.all([
    getVerificationQueue(),
    prisma.rescueReport.findMany({
      where: {
        status: { in: ["PROOF_SUBMITTED", "DISPUTED"] },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        rescuer: { select: { name: true, email: true } },
      },
    }),
  ]);

  const awaitingSterilizations = sterilizationQueue.filter((q) => q.status === "PROOF_SUBMITTED");
  const disputedSterilizations = sterilizationQueue.filter((q) => q.status === "DISPUTED");

  const awaitingRescues = rescueQueue.filter((r) => r.status === "PROOF_SUBMITTED");
  const disputedRescues = rescueQueue.filter((r) => r.status === "DISPUTED");

  const totalAwaiting = awaitingSterilizations.length + awaitingRescues.length;
  const totalDisputed = disputedSterilizations.length + disputedRescues.length;

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <h2 className="font-heading text-2xl font-black text-[#163829]">Verification &amp; Audit Queue</h2>
        <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
          {totalAwaiting} proof{totalAwaiting === 1 ? "" : "s"} awaiting review · {totalDisputed} disputed case{totalDisputed === 1 ? "" : "s"}
        </p>
      </div>

      {/* ─── SECTION 1: Field Rescue Medical Proofs ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-[#163829]">
              Field Rescue Medical Proofs &amp; Invoices
            </h3>
            <p className="font-body text-xs text-gray-500">
              {awaitingRescues.length} awaiting verification · {disputedRescues.length} disputed
            </p>
          </div>
          <Link
            href="/rescues"
            className="text-xs font-body font-semibold text-[#163829] hover:underline"
          >
            View Live Rescues Feed &rarr;
          </Link>
        </div>

        {rescueQueue.length === 0 ? (
          <div className="border border-gray-200/80 rounded-3xl bg-white p-8 text-center text-sm font-body text-gray-500 shadow-xs">
            No pending rescue treatment proofs or disputes. All clear.
          </div>
        ) : (
          <div className="border border-gray-200/80 rounded-3xl bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3.5">Animal</th>
                    <th className="text-left px-5 py-3.5">Location</th>
                    <th className="text-left px-5 py-3.5">Clinic &amp; Vet</th>
                    <th className="text-left px-5 py-3.5">Rescuer</th>
                    <th className="text-left px-5 py-3.5">Expense (₹)</th>
                    <th className="text-left px-5 py-3.5">Status</th>
                    <th className="text-right px-5 py-3.5">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rescueQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.proofImageUrl || item.imageUrl}
                            alt={item.animalType}
                            className="w-11 h-11 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                          />
                          <div>
                            <span className="font-semibold text-[#163829] block capitalize">
                              {item.animalType}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              #{item.id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700 max-w-[160px] truncate">
                        {item.location}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700">
                        <div className="font-medium text-gray-900">{item.clinicName || '—'}</div>
                        <div className="text-[11px] text-gray-400">{item.veterinarianName || 'No Vet Named'}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700">
                        {item.rescuer?.name || item.rescuer?.email || '—'}
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-emerald-800">
                        {item.treatmentCost ? `₹${item.treatmentCost.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        {item.status === 'DISPUTED' ? (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-rose-50 text-rose-800 border-rose-200">
                            Disputed
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-blue-50 text-blue-800 border-blue-200">
                            Awaiting Review
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/rescues/${item.id}`}
                          className="btn-paw-primary px-4 py-1.5 rounded-full text-xs font-semibold inline-block shadow-xs"
                        >
                          Audit Case &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── SECTION 2: Sterilization / TNVR Surgical Certificates ─── */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-[#163829]">
              Sterilization &amp; TNVR Surgical Certificates
            </h3>
            <p className="font-body text-xs text-gray-500">
              {awaitingSterilizations.length} awaiting review · {disputedSterilizations.length} disputed
            </p>
          </div>
          <Link
            href="/verify"
            className="text-xs font-body font-semibold text-[#163829] hover:underline"
          >
            Open Dedicated TNVR Portal &rarr;
          </Link>
        </div>

        {sterilizationQueue.length === 0 ? (
          <div className="border border-gray-200/80 rounded-3xl bg-white p-8 text-center text-sm font-body text-gray-500 shadow-xs">
            No pending surgical sterilization proofs. All clear.
          </div>
        ) : (
          <div className="border border-gray-200/80 rounded-3xl bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3.5">Animal</th>
                    <th className="text-left px-5 py-3.5">Location</th>
                    <th className="text-left px-5 py-3.5">Clinic</th>
                    <th className="text-left px-5 py-3.5">Rescuer</th>
                    <th className="text-left px-5 py-3.5">Status</th>
                    <th className="text-right px-5 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sterilizationQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {item.animalType}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.count} animal{item.count === 1 ? "" : "s"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700 max-w-[200px] truncate">
                        {item.location}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700">
                        {item.clinicName ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-700">
                        {item.rescuerName ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        {item.status === "DISPUTED" ? (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-rose-50 text-rose-800 border-rose-200">
                            Disputed
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-purple-50 text-purple-800 border-purple-200">
                            Awaiting review
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/verify/${item.id}`}
                          className="btn-paw-primary px-4 py-1.5 rounded-full text-xs font-semibold inline-block shadow-xs"
                        >
                          Review &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
