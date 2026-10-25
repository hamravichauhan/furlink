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
        <h2 className="text-xl font-semibold">Verification &amp; Audit Queue</h2>
        <p className="text-sm text-gray-600">
          {totalAwaiting} proof{totalAwaiting === 1 ? "" : "s"} awaiting review · {totalDisputed} disputed case{totalDisputed === 1 ? "" : "s"}
        </p>
      </div>

      {/* ─── SECTION 1: Field Rescue Medical Proofs ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Field Rescue Medical Proofs &amp; Invoices
            </h3>
            <p className="text-xs text-gray-500">
              {awaitingRescues.length} awaiting verification · {disputedRescues.length} disputed
            </p>
          </div>
          <Link
            href="/rescues"
            className="font-mono text-xs text-[#cc2b3f] hover:underline font-bold"
          >
            View Live Rescues Feed &rarr;
          </Link>
        </div>

        {rescueQueue.length === 0 ? (
          <div className="border rounded-xl bg-white p-6 text-center text-sm text-gray-500">
            No pending rescue treatment proofs or disputes. All clear.
          </div>
        ) : (
          <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Animal</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Clinic &amp; Vet</th>
                    <th className="text-left px-4 py-3">Rescuer</th>
                    <th className="text-left px-4 py-3">Expense (₹)</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rescueQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.proofImageUrl || item.imageUrl}
                            alt={item.animalType}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-gray-900 block capitalize">
                              {item.animalType}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              #{item.id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 max-w-[160px] truncate">
                        {item.location}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        <div className="font-medium text-gray-900">{item.clinicName || '—'}</div>
                        <div className="text-[10px] text-gray-400">{item.veterinarianName || 'No Vet Named'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {item.rescuer?.name || item.rescuer?.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-emerald-800">
                        {item.treatmentCost ? `₹${item.treatmentCost.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {item.status === 'DISPUTED' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-100 text-rose-800 border-rose-300 uppercase tracking-wider font-bold">
                            Disputed
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-indigo-100 text-indigo-800 border-indigo-200 uppercase tracking-wider">
                            Awaiting Review
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/rescues/${item.id}`}
                          className="font-mono text-xs font-bold uppercase tracking-wider border border-[#1A2540] rounded-full px-3.5 py-1.5 bg-white hover:bg-[#f2e9db] inline-block shadow-xs"
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
            <h3 className="text-base font-semibold text-gray-900">
              Sterilization &amp; TNVR Surgical Certificates
            </h3>
            <p className="text-xs text-gray-500">
              {awaitingSterilizations.length} awaiting review · {disputedSterilizations.length} disputed
            </p>
          </div>
          <Link
            href="/verify"
            className="font-mono text-xs text-[#cc2b3f] hover:underline font-bold"
          >
            Open Dedicated TNVR Portal &rarr;
          </Link>
        </div>

        {sterilizationQueue.length === 0 ? (
          <div className="border rounded-xl bg-white p-6 text-center text-sm text-gray-500">
            No pending surgical sterilization proofs. All clear.
          </div>
        ) : (
          <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Animal</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Clinic</th>
                    <th className="text-left px-4 py-3">Rescuer</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sterilizationQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {item.animalType}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.count} animal{item.count === 1 ? "" : "s"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">
                        {item.location}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.clinicName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.rescuerName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {item.status === "DISPUTED" ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-100 text-rose-800 border-rose-200 uppercase tracking-wider">
                            Disputed
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-purple-100 text-purple-800 border-purple-200 uppercase tracking-wider">
                            Awaiting review
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/verify/${item.id}`}
                          className="font-mono text-xs font-bold uppercase tracking-wider border border-[#1A2540] rounded-full px-3.5 py-1.5 bg-white hover:bg-[#f2e9db] inline-block"
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
