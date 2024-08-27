import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'bunch',
  description: 'make bunches',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={libreBaskerville.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
