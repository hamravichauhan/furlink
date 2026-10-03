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
        className="text-xs border rounded-md px-3 py-1.5 hover:bg-gray-50"
      >
        Change role
      </button>
    );
  }

  return (
    <div className="inline-block text-left relative">
      <div className="border rounded-md bg-white shadow-lg p-1 min-w-[160px] absolute right-0 z-10">
        {error && (
          <div className="text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded mb-1">
            {error}
          </div>
        )}

        {(["USER", "VERIFIER", "ADMIN"] as const).map((role) => (
          <button
            key={role}
            onClick={() => handleChange(role)}
            disabled={loading || role === currentRole}
            className={`block w-full text-left text-xs px-3 py-2 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed ${
              role === currentRole ? "bg-gray-50 font-medium" : ""
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
          className="block w-full text-left text-xs px-3 py-2 rounded hover:bg-gray-50 text-gray-500 border-t mt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
