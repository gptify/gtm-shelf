import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
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
  title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
  description:
    '50 vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/png/gtm-shelf-apple-touch-icon-180.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gtmshelf.com'),
  openGraph: {
    title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
    description:
      '50 vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
    url: 'https://gtmshelf.com/',
    siteName: 'GTM Shelf',
    images: [
      {
        url: 'https://gtmshelf.com/og-image.png',
        width: 1200,
        height: 627,
        alt: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
    description:
      '50 vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
    images: ['https://gtmshelf.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.tagged-events.js"
          />
        )}
      </head>
      <body>
        <a href="#main-content" className="sr">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
