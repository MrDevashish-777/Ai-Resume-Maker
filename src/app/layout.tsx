import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Resume Intelligence System',
  description: 'Create, analyze, and optimize resumes using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
