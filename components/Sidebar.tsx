'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Admin' },
  { href: '/customer', label: 'Customer' }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">Orders Playground</div>
      <nav>
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={`navLink ${active ? 'active' : ''}`}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
