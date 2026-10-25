"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOwnerApplicationStatus } from "@/actions/adoption";

interface Props {
  applicationId: string;
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export default function OwnerApplicationActions({
  applicationId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    setError("");

    const res = await updateOwnerApplicationStatus(applicationId, newStatus);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error || "Failed to update inquiry.");
      setLoading(false);
    }
  };

  if (currentStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        {error && (
          <span className="font-mono text-[10px] text-[#cc2b3f] font-bold">
            {error}
          </span>
        )}
        <button
          type="button"
          onClick={() => handle("APPROVED")}
          disabled={loading}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {loading ? "Updating..." : "Accept Adopter"}
        </button>
        <button
          type="button"
          onClick={() => handle("REJECTED")}
          disabled={loading}
          className="border-2 border-[#cc2b3f] text-[#cc2b3f] bg-white hover:bg-[#cc2b3f] hover:text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition disabled:opacity-50 cursor-pointer"
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="font-mono text-[10px] text-[#cc2b3f] font-bold">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={() => handle("PENDING")}
        disabled={loading}
        className="font-mono text-[11px] font-bold uppercase tracking-wider border-2 border-[#1A2540] rounded-full px-3.5 py-1.5 bg-white hover:bg-[#f2e9db] disabled:opacity-50 cursor-pointer text-[#1A2540]"
      >
        {loading ? "Updating..." : "Revert Decision"}
      </button>
    </div>
  );
}
