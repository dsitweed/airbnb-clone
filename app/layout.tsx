import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { extractRouterConfig } from 'uploadthing/server';

import { uploadRouter } from './api/uploadthing/core';
import Provider from './components/Provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
