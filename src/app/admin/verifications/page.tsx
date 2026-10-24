import Link from "next/link";
import { getVerificationQueue } from "@/actions/sterilization";
import { requireAdmin } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  await requireAdmin();

  const queue = await getVerificationQueue();
  const awaiting = queue.filter((q) => q.status === "PROOF_SUBMITTED");
  const disputed = queue.filter((q) => q.status === "DISPUTED");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Verification overview</h2>
        <p className="text-sm text-gray-600">
          {awaiting.length} proof{awaiting.length === 1 ? "" : "s"} awaiting
          review · {disputed.length} disputed
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="border rounded-lg bg-white p-10 text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-[#1A2540] font-bold mb-3">[QUEUE ALL CLEAR]</div>
          <p className="text-sm font-medium text-gray-700">
            All caught up — nothing in the queue.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Verifiers will handle submissions as they come in. As an admin you
            can also verify directly.
          </p>
          <Link
            href="/verify"
            className="inline-block mt-4 bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-sm"
          >
            Open verifier queue
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Animal
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Clinic
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Rescuer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {queue.map((item) => (
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
                        Review
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
  );
}
