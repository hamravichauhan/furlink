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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-gray-600">
            {counts.total} users · {counts.admins} admin
            {counts.admins === 1 ? "" : "s"} · {counts.verifiers} verifier
            {counts.verifiers === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Activity
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Joined
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {user.name || "Unnamed user"}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {user.counts.requests} request
                    {user.counts.requests === 1 ? "" : "s"} ·{" "}
                    {user.counts.rescues} rescue
                    {user.counts.rescues === 1 ? "" : "s"}
                    {user.counts.verified > 0 && (
                      <>
                        {" · "}
                        <span className="text-emerald-700 font-medium">
                          {user.counts.verified} verified
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.id === currentUserId ? (
                      <span className="text-xs text-gray-400 italic">
                        That&apos;s you
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

      <div className="border rounded-lg bg-white p-6 text-sm text-gray-700 space-y-3">
        <h3 className="font-semibold">Role definitions</h3>
        <div className="flex items-start gap-3">
          <RoleBadge role="USER" />
          <div>
            <div className="font-medium">Regular user</div>
            <div className="text-xs text-gray-500">
              Can report sterilization needs, accept requests as a rescuer, and
              submit proof of work. Cannot verify others.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RoleBadge role="VERIFIER" />
          <div>
            <div className="font-medium">Verifier</div>
            <div className="text-xs text-gray-500">
              Everything a regular user can do, plus the ability to verify or
              dispute sterilization proofs submitted by rescuers.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RoleBadge role="ADMIN" />
          <div>
            <div className="font-medium">Admin</div>
            <div className="text-xs text-gray-500">
              Full access. Can promote users, resolve disputes, and manage the
              platform.
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
    VERIFIER: "bg-blue-100 text-blue-800 border-blue-200",
    ADMIN: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${styles[role]}`}
    >
      {role}
    </span>
  );
}
