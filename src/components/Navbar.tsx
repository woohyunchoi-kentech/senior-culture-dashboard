'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '대시보드' },
  { href: '/data-entry', label: '데이터 입력' },
  { href: '/data-import', label: 'CSV/통계 입력' },
  { href: '/descriptive', label: '기술통계' },
  { href: '/correlation', label: '상관분석' },
  { href: '/regression', label: '회귀분석' },
  { href: '/mediation', label: '매개효과' },
  { href: '/paper', label: '논문' },
  { href: '/data-manage', label: '데이터 관리' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold whitespace-nowrap">
            시니어 문화소비 연구
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
