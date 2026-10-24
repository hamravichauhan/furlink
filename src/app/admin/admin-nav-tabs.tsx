'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Overview', code: '01', exact: true },
  { href: '/admin/analytics', label: 'Analytics', code: '02' },
  { href: '/admin/rescues', label: 'Rescues', code: '03' },
  { href: '/admin/adoptions', label: 'Adoptions', code: '04' },
  { href: '/admin/sterilization', label: 'Sterilization', code: '05' },
  { href: '/admin/donations', label: 'Donations', code: '06' },
  { href: '/admin/stories', label: 'Stories', code: '07' },
  { href: '/admin/users', label: 'Users', code: '08' },
  { href: '/admin/verifications', label: 'Verification', code: '09' },
];

export default function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1.5 border-b-[1.5px] border-[#101124] overflow-x-auto pb-0">
      {TABS.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(tab.href + '/');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3.5 py-2.5 transition whitespace-nowrap border-t-[1.5px] border-x-[1.5px] -mb-[1.5px] font-mono text-[10.5px] uppercase tracking-[0.14em] ${
              active
                ? 'border-[#101124] bg-white text-[#101124] font-bold border-b-[1.5px] border-b-white'
                : 'border-transparent text-[#101124]/60 hover:text-[#101124] hover:bg-[#FAF8FC]'
            }`}
          >
            <span className="text-[#314CB6] mr-1.5 font-bold">{tab.code}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
