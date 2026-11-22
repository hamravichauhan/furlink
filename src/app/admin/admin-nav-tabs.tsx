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
  { href: '/admin/stories', label: 'FurStories', code: '07' },
  { href: '/admin/users', label: 'Guardian Users', code: '08' },
  { href: '/admin/analytics', label: 'Analytics & Impact', code: '09' },
];

export default function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs overflow-x-auto scrollbar-none">
      <nav className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/');

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3.5 py-2 rounded-xl font-body text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                active
                  ? 'bg-[#163829] text-white shadow-xs'
                  : 'text-[#163829]/70 hover:text-[#163829] hover:bg-[#F8FAF8]'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  active
                    ? 'bg-[#D8F3DC] text-[#163829]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.code}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
