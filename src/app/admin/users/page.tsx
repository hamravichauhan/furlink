import { listUsersForAdmin } from "@/actions/admin-users";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import UserRoleActions from "./user-role-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, currentUser] = await Promise.all([
    listUsersForAdmin(),
    getOrCreateCurrentUser(),
  ]);

  const currentUserId = currentUser?.id ?? "";

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    verifiers: users.filter((u) => u.role === "VERIFIER").length,
    regular: users.filter((u) => u.role === "USER").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-black text-[#163829]">Guardian User &amp; Role Management</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {counts.total} registered users · {counts.admins} admin{counts.admins === 1 ? "" : "s"} · {counts.verifiers} verifier{counts.verifiers === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-gray-200/80 rounded-3xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3.5">User</th>
                <th className="text-left px-5 py-3.5">Role</th>
                <th className="text-left px-5 py-3.5">Activity Record</th>
                <th className="text-left px-5 py-3.5">Joined Date</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {user.name || "Unnamed user"}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {user.counts.requests} request{user.counts.requests === 1 ? "" : "s"} ·{" "}
                    {user.counts.rescues} rescue{user.counts.rescues === 1 ? "" : "s"}
                    {user.counts.verified > 0 && (
                      <>
                        {" · "}
                        <span className="text-[#163829] font-bold">
                          {user.counts.verified} verified
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {user.id === currentUserId ? (
                      <span className="text-xs font-semibold text-gray-400 italic">
                        Active Session
                      </span>
                    ) : (
                      <UserRoleActions
                        userId={user.id}
                        currentRole={user.role}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Definitions Guide */}
      <div className="border border-gray-200/80 rounded-3xl bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-heading font-black text-lg text-[#163829]">FurLink Role Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <RoleBadge role="USER" />
            <div className="font-heading font-black text-sm text-[#163829]">Regular Guardian</div>
            <div className="text-xs font-body text-gray-600 leading-relaxed">
              Can report sterilization needs, file emergency roadside rescues, adopt animals, and submit recovery stories.
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#D8F3DC]/30 border border-[#bceac2]/60 space-y-2">
            <RoleBadge role="VERIFIER" />
            <div className="font-heading font-black text-sm text-[#163829]">Clinical Verifier</div>
            <div className="text-xs font-body text-gray-600 leading-relaxed">
              Authorized to verify veterinary invoices, review sterilization proof photos, and approve SHA-256 digital certificates.
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
            <RoleBadge role="ADMIN" />
            <div className="font-heading font-black text-sm text-[#163829]">System Administrator</div>
            <div className="text-xs font-body text-gray-600 leading-relaxed">
              Full access. Can assign roles, resolve disputed claims, manage medical fund allocations, and oversee operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: "USER" | "VERIFIER" | "ADMIN" }) {
  const styles = {
    USER: "bg-gray-100 text-gray-700 border-gray-200",
    VERIFIER: "bg-[#D8F3DC] text-[#163829] border-[#bceac2]",
    ADMIN: "bg-rose-50 text-rose-800 border-rose-200",
  };
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${styles[role]}`}
    >
      {role}
    </span>
  );
}
