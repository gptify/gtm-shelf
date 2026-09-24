import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, CATEGORIES, getCategoryBySlug, getToolsByCategoryId } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { hue, initial, pricingLabel } from '@/lib/utils';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  const tools = await getToolsByCategoryId(category.id);
  const title = `Best AI tools for ${category.phrase}`;
  const description = `${tools.length} AI tools for ${category.phrase}, compared by pricing, setup effort, and integrations.`;

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 155),
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/category/${category.slug}`,
      siteName: 'GTM Shelf',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const stage = STAGES.find((s) => s.id === category.stage_id) || STAGES[0];
  const tools = await getToolsByCategoryId(category.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best AI tools for ${category.phrase}`,
    itemListElement: tools.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.name,
      url: `https://gtmshelf.com/tools/${t.slug}`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://gtmshelf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: stage.name,
        item: `https://gtmshelf.com/stage/${stage.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://gtmshelf.com/category/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="wrap" id="main-content">
        <Header />

        <main className="page">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &gt;{' '}
            <Link href={`/stage/${stage.slug}`}>{stage.name}</Link> &gt;{' '}
            <span>{category.name}</span>
          </nav>

          <h1 style={{ margin: '0 0 12px' }}>{`Best AI tools for ${category.phrase}`}</h1>
          <p className="lede">
            Part of the <Link href={`/stage/${stage.slug}`}>{stage.name}</Link> funnel stage. {tools.length} curated tools evaluated on pricing, integrations, and setup speed.
          </p>

          <div style={{ borderTop: '1.5px solid var(--ink)', paddingTop: '16px', marginTop: '24px' }}>
            <ul className="list">
              {tools.map((tool) => (
                <li key={tool.id} className="row">
                  <div
                    className="mono"
                    style={{ '--h': hue(tool.name) } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    {initial(tool.name)}
                  </div>
                  <div className="main">
                    <h3>
                      <Link href={`/tools/${tool.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {tool.name}
                      </Link>
                      {tool.featured && <span className="badge">Featured</span>}
                    </h3>
                    <p className="tag">{tool.tagline}</p>
                    <div className="chips">
                      <span className="chip st">{tool.stage_name}</span>
                      <span className="chip">{tool.category_name}</span>
                      {tool.integrations.length > 0 && (
                        <span className="works">
                          Works with {tool.integrations.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="side">
                    <span className="price">{pricingLabel(tool.pricing_model)}</span>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.875rem', padding: '6px 14px' }}
                    >
                      Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
