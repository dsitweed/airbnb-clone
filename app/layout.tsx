import Providers from '@/components/Providers';
import NavBar from '@/components/layout/navbar';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import { extractRouterConfig } from 'uploadthing/server';

import { uploadRouter } from './api/uploadthing/core';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tacohouse',
  description: 'The best place to find your next rest place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <Providers>
          <NavBar />
          <main className="pt-24 pb-16 md:pt-28">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
