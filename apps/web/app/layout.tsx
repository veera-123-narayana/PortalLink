import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PortalLink — Drop. Connect. Share.',
  description: 'One Portal. Every Device. Instant Spatial Sharing Ecosystem.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
