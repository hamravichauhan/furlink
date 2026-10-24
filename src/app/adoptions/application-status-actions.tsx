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
        {error && <span className="font-mono text-[10px] text-[#cc2b3f] font-bold">{error}</span>}
        <button
          onClick={() => handle("APPROVED")}
          disabled={loading}
          className="bg-[#1A2540] hover:bg-[#cc2b3f] text-[#f2e9db] font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? "…" : "Approve"}
        </button>
        <button
          onClick={() => handle("REJECTED")}
          disabled={loading}
          className="border border-[#cc2b3f] text-[#cc2b3f] bg-white hover:bg-[#cc2b3f] hover:text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer"
        >
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="font-mono text-[10px] text-[#cc2b3f] font-bold">{error}</span>}
      <button
        onClick={() => handle("PENDING")}
        disabled={loading}
        className="font-mono text-[11px] font-bold uppercase tracking-wider border border-[#1A2540] rounded-full px-3.5 py-1.5 bg-white hover:bg-[#f2e9db] disabled:opacity-50 cursor-pointer"
      >
        {loading ? "…" : "Revert"}
      </button>
    </div>
  );
}
