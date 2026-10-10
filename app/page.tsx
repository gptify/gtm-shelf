import type { Metadata } from 'next';
import { getTools, STAGES, CATEGORIES, INTEGRATIONS } from '@/lib/db/data';
import { HomeDirectory } from '@/components/HomeDirectory';

export const metadata: Metadata = {
  title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
  description:
    'Vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
    description:
      'Vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
    url: 'https://gtmshelf.com/',
    siteName: 'GTM Shelf',
    images: [
      {
        url: 'https://gtmshelf.com/og-image.png?v=2',
        width: 1200,
        height: 627,
        alt: 'GTM Shelf: Vetted AI tools for sales and marketing, sorted by funnel stage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTM Shelf: Discover AI Tools for Sales and Marketing',
    description:
      'Vetted AI tools for sales and marketing, sorted by funnel stage. Build your GTM stack in a few questions.',
    images: ['https://gtmshelf.com/og-image.png?v=2'],
  },
};

export const revalidate = 0; // immediate dynamic rendering

interface PageProps {
  searchParams?: {
    q?: string;
    stage?: string;
    category?: string;
    pricing?: string;
    integrations?: string;
    view?: string;
    sort?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const tools = await getTools();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://gtmshelf.com/#website',
        url: 'https://gtmshelf.com',
        name: 'GTM Shelf',
        description:
          'A curated directory of AI tools built only for sales and marketing.',
        publisher: {
          '@id': 'https://gtmshelf.com/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://gtmshelf.com/#organization',
        name: 'GTM Shelf',
        url: 'https://gtmshelf.com',
        logo: 'https://gtmshelf.com/brand/png/gtm-shelf-icon-512.png',
        parentOrganization: {
          '@type': 'Organization',
          name: 'GPTify.co',
          url: 'https://gptify.co',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeDirectory
        initialTools={tools}
        stages={STAGES}
        categories={CATEGORIES}
        integrations={INTEGRATIONS}
        initialParams={searchParams}
      />
    </>
  );
}
