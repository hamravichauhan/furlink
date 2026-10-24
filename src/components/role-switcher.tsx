'use client';

import { useState } from 'react';
import { setDemoRole } from '@/actions/demo-auth';
import { useRouter } from 'next/navigation';

interface Props {
  currentRole: string | null;
  currentEmail?: string | null;
}

export default function RoleSwitcher({ currentRole, currentEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSwitch = async (role: 'ADMIN' | 'VERIFIER' | 'USER' | 'GUEST') => {
    setLoading(true);
    try {
      await setDemoRole(role);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101124] text-[#FAF8FC] font-mono-meta py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#314CB6]">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#EFBDEB]" />
        <span className="text-[#B68CB8]">OPERATOR PERMIT:</span>
        {currentRole ? (
          <span className="text-[#FAF8FC] font-bold">
            {currentRole} [{currentEmail || 'ACTIVE'}]
          </span>
        ) : (
          <span className="text-[#6461A0]">VISITOR (UNAUTHENTICATED)</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[#6461A0] mr-1 hidden sm:inline">SWAP:</span>
        <button
          onClick={() => handleSwitch('ADMIN')}
          disabled={loading || currentRole === 'ADMIN'}
          className={`px-2 py-0.5 border-[1.5px] transition ${
            currentRole === 'ADMIN'
              ? 'bg-[#314CB6] text-[#FAF8FC] border-[#EFBDEB] font-bold'
              : 'border-[#6461A0] text-[#B68CB8] hover:text-[#FAF8FC] hover:border-[#EFBDEB]'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => handleSwitch('VERIFIER')}
          disabled={loading || currentRole === 'VERIFIER'}
          className={`px-2 py-0.5 border-[1.5px] transition ${
            currentRole === 'VERIFIER'
              ? 'bg-[#0A81D1] text-[#FAF8FC] border-[#0A81D1] font-bold'
              : 'border-[#6461A0] text-[#B68CB8] hover:text-[#FAF8FC] hover:border-[#EFBDEB]'
          }`}
        >
          Verifier
        </button>
        <button
          onClick={() => handleSwitch('USER')}
          disabled={loading || currentRole === 'USER'}
          className={`px-2 py-0.5 border-[1.5px] transition ${
            currentRole === 'USER'
              ? 'bg-[#6461A0] text-[#FAF8FC] border-[#6461A0] font-bold'
              : 'border-[#6461A0] text-[#B68CB8] hover:text-[#FAF8FC] hover:border-[#EFBDEB]'
          }`}
        >
          Member
        </button>
        <button
          onClick={() => handleSwitch('GUEST')}
          disabled={loading || !currentRole}
          className="px-2 py-0.5 border-[1.5px] border-[#6461A0] text-[#6461A0] hover:text-[#B68CB8] transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
