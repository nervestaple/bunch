import './globals.css';

import type { PropsWithChildren } from 'react';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Libre_Baskerville } from 'next/font/google';

import { FirebaseProvider } from '~/components/FirebaseProvider';

const libreBaskerville = Libre_Baskerville({
  weight: ['400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'bunch',
  description: 'make bunches',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={libreBaskerville.className}>
        <FirebaseProvider>{children}</FirebaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
