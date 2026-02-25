import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codex Playground',
  description: 'Starter Next.js 14 TypeScript app for Codex Playground'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
