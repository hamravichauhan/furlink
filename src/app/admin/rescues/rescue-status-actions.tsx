'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateRescueStatus, deleteRescueReport } from '@/actions/rescue';
import { RescueStatus } from '@prisma/client';

interface Props {
  rescueId: string;
  currentStatus: RescueStatus;
}

export default function RescueStatusActions({ rescueId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as RescueStatus;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const res = await updateRescueStatus(rescueId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this rescue report?')) return;
    setLoading(true);
    try {
      const res = await deleteRescueReport(rescueId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className="font-mono text-xs uppercase border border-[#1A2540] rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#cc2b3f]"
      >
        <option value="REPORTED">REPORTED</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="RESCUED">RESCUED</option>
        <option value="CLOSED">CLOSED</option>
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="font-mono text-xs uppercase text-[#cc2b3f] hover:underline px-1 py-0.5 font-bold cursor-pointer"
        title="Delete"
      >
        Delete
      </button>
    </div>
  );
}
