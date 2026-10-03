//adoption/application-status-actions

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  setApplicationStatus,
  type ApplicationStatus,
} from "@/actions/admin-adoptions";

interface Props {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export default function ApplicationStatusActions({
  applicationId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (newStatus: ApplicationStatus) => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    setError("");
    const res = await setApplicationStatus(applicationId, newStatus);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  if (currentStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-600">{error}</span>}
        <button
          onClick={() => handle("APPROVED")}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md disabled:opacity-50"
        >
          {loading ? "…" : "✓ Approve"}
        </button>
        <button
          onClick={() => handle("REJECTED")}
          disabled={loading}
          className="border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs px-3 py-1.5 rounded-md disabled:opacity-50"
        >
          ✗ Reject
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        onClick={() => handle("PENDING")}
        disabled={loading}
        className="text-xs border rounded-md px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "…" : "Revert to pending"}
      </button>
    </div>
  );
}
