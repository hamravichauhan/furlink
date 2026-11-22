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
        {error && <span className="font-body text-xs text-[#cc2b3f] font-semibold">{error}</span>}
        <button
          onClick={() => handle("APPROVED")}
          disabled={loading}
          className="bg-[#163829] hover:bg-[#0D2818] text-white font-body text-xs font-semibold px-4 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {loading ? "…" : "Approve"}
        </button>
        <button
          onClick={() => handle("REJECTED")}
          disabled={loading}
          className="border border-rose-200 text-[#cc2b3f] bg-rose-50 hover:bg-[#cc2b3f] hover:text-white font-body text-xs font-semibold px-4 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer"
        >
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="font-body text-xs text-[#cc2b3f] font-semibold">{error}</span>}
      <button
        onClick={() => handle("PENDING")}
        disabled={loading}
        className="font-body text-xs font-semibold border border-gray-200 rounded-full px-3.5 py-1 bg-white hover:bg-gray-50 text-[#163829] disabled:opacity-50 cursor-pointer transition"
      >
        {loading ? "…" : "Revert"}
      </button>
    </div>
  );
}
