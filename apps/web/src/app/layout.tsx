import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoenix Web Application',
  description: 'Phoenix SaaS platform built with Engineering OS framework',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
