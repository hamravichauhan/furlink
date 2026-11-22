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
      className={`inline-flex items-center gap-2 bg-[#163829] text-white rounded-full border border-emerald-900/40 text-[10px] font-sans shadow-xs ${
        compact ? 'px-2.5 py-1' : 'px-3 py-1'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span className="text-white/70 uppercase tracking-wider font-semibold">
        Role:
      </span>
      <span className="font-bold text-white">
        {activeRole}
      </span>

      <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-white/20">
        {(['USER', 'VERIFIER', 'ADMIN'] as const).map((r) => (
          <button
            key={r}
            type="button"
            disabled={loading}
            onClick={() => handleSwitch(r)}
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition cursor-pointer ${
              activeRole === r
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
