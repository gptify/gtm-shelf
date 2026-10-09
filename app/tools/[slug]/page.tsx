import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTools, getAllTools, getToolBySlug, STAGES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';
import { getOutboundLinkInfo, STANDARD_AFFILIATE_DISCLOSURE } from '@/lib/affiliates';
import { getUseCasesForTool } from '@/lib/use-cases';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const tools = await getAllTools();
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
  const toolUseCases = getUseCasesForTool(tool.slug);

  const stage = STAGES.find((s) => s.id === tool.stage_id) || STAGES[0];
  const outbound = getOutboundLinkInfo(tool.slug, tool.website_url);

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
                rel={outbound.rel}
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

          {tool.lifecycle_status === 'discontinued' && (
            <div style={{ padding: '16px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', margin: '20px 0', color: '#991b1b', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ Product Discontinued</strong>
              {tool.alternatives_note || 'This product is no longer active and has been shut down. Excluded from active stack recommendations.'}
            </div>
          )}
          {tool.lifecycle_status === 'sunsetting' && (
            <div style={{ padding: '16px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', margin: '20px 0', color: '#92400e', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ Product Sunsetting</strong>
              {tool.alternatives_note || 'This product is in sunset transition. Not recommended for new deployments.'}
            </div>
          )}

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
            {tool.primary_jtbd && (
              <div>
                <dt>Primary Job (JTBD)</dt>
                <dd>{tool.primary_jtbd}</dd>
              </div>
            )}
            {tool.gtm_buckets && tool.gtm_buckets.length > 0 && (
              <div>
                <dt>GTM Buckets</dt>
                <dd>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {tool.gtm_buckets.map((b) => (
                      <span key={b} className="chip">{b}</span>
                    ))}
                  </div>
                </dd>
              </div>
            )}
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
            {tool.min_plan && (
              <div>
                <dt>Minimum Plan</dt>
                <dd>{tool.min_plan}</dd>
              </div>
            )}
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
            {tool.overlapping_tools && tool.overlapping_tools.length > 0 && (
              <div>
                <dt>Overlaps with</dt>
                <dd style={{ textTransform: 'capitalize' }}>
                  {tool.overlapping_tools.join(', ')}
                </dd>
              </div>
            )}
            <div>
              <dt>Verified</dt>
              <dd>{tool.pricing_verified_at || 'October 2026'}</dd>
            </div>
          </dl>

          <div className="dw-actions" style={{ marginBlock: '32px' }}>
            <a
              className="btn btn-primary"
              href={`/out/${tool.slug}`}
              target="_blank"
              rel={outbound.rel}
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
          {outbound.disclosureRequired && (
            <p className="fine" style={{ marginTop: '-20px', marginBottom: '24px', fontSize: '0.8125rem', color: 'var(--muted)' }}>
              {STANDARD_AFFILIATE_DISCLOSURE}
            </p>
          )}

          <div
            style={{
              margin: '32px 0',
              padding: '22px 26px',
              borderRadius: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderLeft: '4px solid var(--brand)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div style={{ font: '700 1.0625rem var(--display)', color: 'var(--ink)', marginBottom: '6px' }}>
              Want to deploy {tool.name} without integration friction?
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Connecting {tool.name} to your proprietary CRM, data enrichment waterfalls, or automated outbound sequences requires reliable architecture. Let GPTify audit your stack and build the integration.
            </p>
            <Link
              href={`/custom?q=${encodeURIComponent(tool.name)}`}
              className="btn btn-ghost"
              style={{ padding: '8px 18px', fontSize: '0.875rem', borderColor: 'var(--brand)', color: 'var(--brand)', fontWeight: 600 }}
            >
              Request Stack Integration Review →
            </Link>
          </div>

          {toolUseCases.length > 0 && (
            <div
              style={{
                marginTop: '40px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--brand)',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Featured In Operational Blueprints
              </div>
              <h2 style={{ font: '700 1.25rem var(--display)', margin: '0 0 14px', color: 'var(--ink)' }}>
                How Top Revenue Teams Deploy {tool.name}
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '12px',
                }}
              >
                {toolUseCases.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/use-cases/${uc.slug}`}
                    style={{
                      display: 'block',
                      padding: '14px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', marginBottom: '4px' }}>
                      {uc.bucket}
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                      {uc.title}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                      {uc.short_summary}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

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

          {/* Contextual Conversion CTA to Build My Stack */}
          <div
            style={{
              marginTop: '48px',
              padding: '24px 28px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--ink)' }}>
                Not sure how {tool.name} fits into your overall stack?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
                Build your complete GTM stack and discover complementary tools configured for your CRM and budget.
              </p>
            </div>
            <Link
              href={`/build-my-stack?existing=${encodeURIComponent(tool.name)}`}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Build My GTM Stack →
            </Link>
          </div>
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
