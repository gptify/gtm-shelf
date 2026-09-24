import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'GTM Shelf: AI tools for sales and marketing',
  description:
    'A curated directory of AI tools built only for sales and marketing. Browse by funnel stage or answer a few questions to get three picks.',
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/png/gtm-shelf-apple-touch-icon-180.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gtmshelf.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`}>
      <body>
        <a href="#main-content" className="sr">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
