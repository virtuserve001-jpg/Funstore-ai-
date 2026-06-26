import React from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import './globals.css';

export const metadata = {
  title: 'FunStore | Autonomous AI Business Engine',
  description: 'Powered by Next.js, Vercel, Gemini AI, Airtable, and Brevo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
