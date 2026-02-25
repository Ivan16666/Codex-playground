import type { Metadata } from 'next';
import Link from 'next/link';

import { Sidebar } from '@/components/Sidebar';

import './globals.css';

export const metadata: Metadata = {
  title: 'Orders Playground',
  description: 'In-memory order management with admin and customer flows.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <div className="contentWrap">
            <header className="topBar">
              <Link href="/" className="homeLink">
                Orders Playground
              </Link>
            </header>
            <main className="content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
