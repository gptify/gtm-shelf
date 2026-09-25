import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTools, getToolBySlug, STAGES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return {};

  const works = tool.integrations.length
    ? ` Works with ${tool.integrations.slice(0, 3).join(', ')}.`
    : '';
  const price = pricingLabel(tool.pricing_model);
  const title = `${tool.name}: what it does, pricing, and alternatives`;
  const description = `${tool.tagline}. ${price}.${works}`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${tool.slug}`,
      siteName: 'GTM Shelf',
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  const allTools = await getTools();
  const similarCategory = allTools.filter(
    (t) => t.id !== tool.id && t.category_id === tool.category_id
  );
  const similarStage = allTools.filter(
    (t) =>
      t.id !== tool.id &&
      t.stage_id === tool.stage_id &&
      t.category_id !== tool.category_id
  );
  const similarTools = [...similarCategory, ...similarStage].slice(0, 3);

  const stage = STAGES.find((s) => s.id === tool.stage_id) || STAGES[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Cloud, Web',
    url: tool.website_url,
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: tool.pricing_model === 'free_plan' ? '0' : undefined,
      priceCurrency: 'USD',
      description: pricingLabel(tool.pricing_model),
    },
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
        name: tool.category_name,
        item: `https://gtmshelf.com/category/${tool.category_slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: tool.name,
        item: `https://gtmshelf.com/tools/${tool.slug}`,
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

        <main className="page" style={{ maxWidth: '800px' }}>
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/stage/${stage.slug}`}>{stage.name}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/category/${tool.category_slug}`}>{tool.category_name}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{tool.name}</li>
            </ol>
          </nav>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0 24px' }}>
            <div
              className="mono big"
              style={{ '--h': hue(tool.name) } as React.CSSProperties}
              aria-hidden="true"
            >
              {initial(tool.name)}
            </div>
            <div>
              <h1 style={{ margin: '0 0 6px' }}>{tool.name}</h1>
              <a
                href={`/out/${tool.slug}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="site"
                style={{ fontSize: '1.0625rem' }}
              >
                {tool.domain}
              </a>
            </div>
          </div>

          <p className="dw-tag" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
            {tool.tagline}
          </p>
          <p className="lede" style={{ marginBottom: '32px' }}>
            {tool.description}
          </p>

          <dl className="facts">
            <div>
              <dt>Funnel stage</dt>
              <dd>
                <Link href={`/stage/${stage.slug}`}>
                  {tool.stage_id}. {tool.stage_name}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>
                <Link href={`/category/${tool.category_slug}`}>
                  {tool.category_name}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Pricing</dt>
              <dd>
                {pricingLabel(tool.pricing_model)}
                {tool.price_note && (
                  <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '3px' }}>
                    {tool.price_note}
                  </span>
                )}
              </dd>
            </div>
            {tool.setup_effort && (
              <div>
                <dt>Setup effort</dt>
                <dd>{setupLabel(tool.setup_effort)}</dd>
              </div>
            )}
            <div>
              <dt>Works with</dt>
              <dd>
                {tool.integrations.length
                  ? tool.integrations.join(', ')
                  : 'None listed'}
              </dd>
            </div>
            {tool.best_for && (
              <div>
                <dt>Best for</dt>
                <dd>{tool.best_for}</dd>
              </div>
            )}
          </dl>

          <div className="dw-actions" style={{ marginBlock: '32px' }}>
            <a
              className="btn btn-primary"
              href={`/out/${tool.slug}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Visit {tool.domain}
            </a>
            <Link
              href={`/custom?q=${encodeURIComponent(tool.name)}`}
              className="btn btn-ghost"
            >
              Need a custom integration?
            </Link>
          </div>

          {similarTools.length > 0 && (
            <div style={{ marginTop: '48px', borderTop: '1.5px solid var(--ink)', paddingTop: '24px' }}>
              <h2 style={{ font: '700 1.25rem var(--display)', marginBottom: '16px' }}>
                Similar tools in {tool.category_name}
              </h2>
              <ul className="sim">
                {similarTools.map((st) => (
                  <li key={st.id}>
                    <Link
                      href={`/tools/${st.slug}`}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        width: '100%',
                        textDecoration: 'none',
                        color: 'inherit',
                        borderBottom: '1px solid var(--line)',
                        padding: '12px 0',
                      }}
                    >
                      <span
                        className="mono"
                        style={{ '--h': hue(st.name) } as React.CSSProperties}
                        aria-hidden="true"
                      >
                        {initial(st.name)}
                      </span>
                      <span>
                        <b style={{ display: 'block' }}>{st.name}</b>
                        <span className="t">{st.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
