'use client';

import { useState, useEffect } from 'react';
import { setDemoRole, getActiveRoleInfo } from '@/actions/demo-auth';
import { useRouter } from 'next/navigation';

interface Props {
  currentRole?: string | null;
  currentEmail?: string | null;
  compact?: boolean;
}

export default function RoleSwitcher({ currentRole = null, compact = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string>(currentRole || 'USER');
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    getActiveRoleInfo().then((info) => {
      if (isMounted && info.role) {
        setActiveRole(info.role);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSwitch = async (role: 'ADMIN' | 'VERIFIER' | 'USER' | 'GUEST') => {
    setLoading(true);
    setActiveRole(role === 'GUEST' ? 'USER' : role);
    try {
      await setDemoRole(role);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 bg-[#1A2540] text-[#f2e9db] rounded-full border border-[#1A2540] text-[10px] font-body ${
        compact ? 'px-2.5 py-1' : 'px-3 py-1'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#cc2b3f]" />
      <span className="text-[#f2e9db]/60 uppercase tracking-wider font-semibold">
        Role:
      </span>
      <span className="font-bold text-[#f2e9db]">
        {activeRole}
      </span>

      <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-[#f2e9db]/20">
        {(['USER', 'VERIFIER', 'ADMIN'] as const).map((r) => (
          <button
            key={r}
            type="button"
            disabled={loading}
            onClick={() => handleSwitch(r)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
              activeRole === r
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
