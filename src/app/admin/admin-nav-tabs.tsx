'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Overview', code: '01', exact: true },
  { href: '/admin/adoptions', label: 'Adoptions & Pets', code: '02' },
  { href: '/admin/rescues', label: 'Field Rescues', code: '03' },
  { href: '/admin/sterilization', label: 'TNVR Sterilization', code: '04' },
  { href: '/admin/verifications', label: 'Verification Queue', code: '05' },
  { href: '/admin/donations', label: 'Medical Donations', code: '06' },
  { href: '/admin/stories', label: 'Recovery Stories', code: '07' },
  { href: '/admin/users', label: 'Guardian Users', code: '08' },
  { href: '/admin/analytics', label: 'Analytics & Impact', code: '09' },
];

export default function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1.5 border-b-2 border-[#1A2540] overflow-x-auto pb-0 scrollbar-none">
      {TABS.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(tab.href + '/');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3.5 py-2.5 transition whitespace-nowrap border-t-2 border-x-2 -mb-[2px] rounded-t-xl font-mono text-[11px] uppercase tracking-[0.14em] cursor-pointer ${
              active
                ? 'border-[#1A2540] bg-[#f2e9db] text-[#1A2540] font-bold border-b-2 border-b-[#f2e9db] shadow-xs'
                : 'border-transparent text-[#1A2540]/60 hover:text-[#1A2540] hover:bg-white/50'
            }`}
          >
            <span
              className={`mr-1.5 font-bold ${
                active ? 'text-[#cc2b3f]' : 'text-[#1A2540]/40'
              }`}
            >
              {tab.code}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
