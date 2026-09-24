import { getTools, STAGES, CATEGORIES, INTEGRATIONS } from '@/lib/db/data';
import { HomeDirectory } from '@/components/HomeDirectory';

export const revalidate = 3600; // hourly revalidation fallback

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
