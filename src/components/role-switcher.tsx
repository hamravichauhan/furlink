'use client';

import { useState } from 'react';
import { setDemoRole } from '@/actions/demo-auth';
import { useRouter } from 'next/navigation';

interface Props {
  currentRole?: string | null;
  currentEmail?: string | null;
}

export default function RoleSwitcher({ currentRole = null, currentEmail }: Props) {
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
    <div className="hidden xl:flex items-center gap-2 bg-[#1A2540] text-[#f2e9db] rounded-full px-3 py-1 border border-[#1A2540] text-[10px] font-body">
      <span className="w-1.5 h-1.5 rounded-full bg-[#cc2b3f]" />
      <span className="text-[#f2e9db]/60 uppercase tracking-wider font-semibold">
        Role:
      </span>
      <span className="font-bold text-[#f2e9db]">
        {currentRole || 'USER'}
      </span>

      <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-[#f2e9db]/20">
        {(['USER', 'VERIFIER', 'ADMIN'] as const).map((r) => (
          <button
            key={r}
            type="button"
            disabled={loading}
            onClick={() => handleSwitch(r)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
              currentRole === r
                ? 'bg-[#cc2b3f] text-[#f2e9db]'
                : 'text-[#f2e9db]/70 hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
