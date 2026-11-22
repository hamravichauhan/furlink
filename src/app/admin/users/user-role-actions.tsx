"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, type UserRole } from "@/actions/admin-users";

interface Props {
  userId: string;
  currentRole: UserRole;
}

export default function UserRoleActions({ userId, currentRole }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (newRole: UserRole) => {
    if (newRole === currentRole) {
      setOpen(false);
      return;
    }

    setLoading(true);
    setError("");

    const res = await setUserRole(userId, newRole);

    if (res.success) {
      setOpen(false);
      setLoading(false);
      router.refresh();
      return;
    }

    setError(res.error);
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1 bg-white hover:bg-gray-50 text-[#163829] transition cursor-pointer"
      >
        Change role
      </button>
    );
  }

  return (
    <div className="inline-block text-left relative">
      <div className="border border-gray-200 rounded-2xl bg-white shadow-xl p-1.5 min-w-[170px] absolute right-0 z-20">
        {error && (
          <div className="text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded-xl mb-1">
            {error}
          </div>
        )}

        {(["USER", "VERIFIER", "ADMIN"] as const).map((role) => (
          <button
            key={role}
            onClick={() => handleChange(role)}
            disabled={loading || role === currentRole}
            className={`block w-full text-left text-xs px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed ${
              role === currentRole ? "bg-[#D8F3DC] text-[#163829]" : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            {role === currentRole ? `✓ ${role}` : `Set to ${role}`}
          </button>
        ))}

        <button
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          disabled={loading}
          className="block w-full text-left text-[11px] px-3 py-1.5 rounded-xl text-gray-400 hover:text-gray-600 border-t border-gray-100 mt-1 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
