import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides, getGuideBySlug, getToolsForGuide } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';
import { ToolPublic } from '@/lib/types';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};

  const title = `${guide.title} — GTM Shelf`;
  const description = guide.desc;

  return {
    title,
    description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/guides/${guide.slug}`,
      siteName: 'GTM Shelf',
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const tools = await getToolsForGuide(guide);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.desc,
    author: {
      '@type': 'Organization',
      name: 'GPTify.co',
      url: 'https://gptify.co',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GTM Shelf',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gtmshelf.com/guides/${guide.slug}`,
    },
  };

  return (
    <div className="wrap">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page guide" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{guide.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`badge-pill ${guide.type === 'vs' ? 'success' : ''}`}>
              {guide.type === 'vs' ? 'Head-to-Head Comparison' : 'Buyer Guide'}
            </span>
            {guide.cat && (
              <span style={{ fontSize: '.8125rem', color: 'var(--muted)' }}>
                • {guide.cat}
              </span>
            )}
          </div>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.intro || guide.desc}</p>
        </header>

        {/* BEST-OF GUIDE LAYOUT */}
        {guide.type === 'best' && (
          <div>
            {/* How we chose / Criteria */}
            <div className="how">
              <h2>How we evaluated these tools</h2>
              {guide.crit && (
                <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: '.9375rem' }}>
                  {guide.crit}
                </p>
              )}
              {guide.choose && guide.choose.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '.875rem', fontWeight: 700, margin: '14px 0 6px' }}>
                    Key factors to consider before choosing
                  </h3>
                  <ul>
                    {guide.choose.map((item, idx) => (
                      <li key={idx} style={{ margin: '4px 0' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Shortlisted Tools */}
            <section aria-labelledby="shortlist-heading">
              <h2 id="shortlist-heading" className="sec">
                The Shortlist ({tools.length} {tools.length === 1 ? 'tool' : 'tools'})
              </h2>

              {tools.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', border: '1px dashed var(--line)', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--muted)', margin: 0 }}>
                    No tools currently meet this exact filter criteria.
                  </p>
                  <Link href="/" className="btn btn-ghost" style={{ marginTop: '12px' }}>
                    ← Browse all directory tools
                  </Link>
                </div>
              ) : (
                <ul className="list">
                  {tools.map((tool) => (
                    <li key={tool.id} className="row">
                      <div
                        className="mono"
                        style={{ backgroundColor: `hsl(${hue(tool.name)}, 52%, 40%)` }}
                        aria-hidden="true"
                      >
                        {initial(tool.name)}
                      </div>

                      <div>
                        <h3>
                          <Link href={`/tools/${tool.slug}`} className="open">
                            {tool.name}
                          </Link>
                          <span className="badge">{pricingLabel(tool.pricing_model)}</span>
                        </h3>
                        <p className="tag">{tool.tagline}</p>
                        <div className="chips">
                          <span className="chip">{tool.category_name}</span>
                          <span className="chip st">{setupLabel(tool.setup_effort)} setup</span>
                          {tool.integrations.length > 0 && (
                            <span className="works">Works with {tool.integrations.slice(0, 3).join(', ')}</span>
                          )}
                        </div>
                      </div>

                      <div className="side">
                        <span className="price">{pricingLabel(tool.pricing_model)}</span>
                        <a
                          href={`/out/${tool.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '.8125rem' }}
                        >
                          Visit site ↗
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {/* VS GUIDE LAYOUT */}
        {guide.type === 'vs' && (
          <div>
            {tools.length >= 2 ? (
              <>
                <section aria-labelledby="comparison-heading">
                  <h2 id="comparison-heading" className="sec" style={{ marginTop: '24px' }}>
                    Side-by-Side Comparison
                  </h2>

                  <div className="tablewrap">
                    <table className="cmp">
                      <thead>
                        <tr>
                          <th scope="col"><span className="sr">Detail</span></th>
                          <th scope="col">
                            <Link href={`/tools/${tools[0].slug}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
                              {tools[0].name}
                            </Link>
                          </th>
                          <th scope="col">
                            <Link href={`/tools/${tools[1].slug}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
                              {tools[1].name}
                            </Link>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Tagline</th>
                          <td>{tools[0].tagline}</td>
                          <td>{tools[1].tagline}</td>
                        </tr>
                        <tr>
                          <th scope="row">Category</th>
                          <td>{tools[0].category_name}</td>
                          <td>{tools[1].category_name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Pricing</th>
                          <td>
                            <strong>{pricingLabel(tools[0].pricing_model)}</strong>
                            {tools[0].price_note && (
                              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.8125rem' }}>{tools[0].price_note}</p>
                            )}
                          </td>
                          <td>
                            <strong>{pricingLabel(tools[1].pricing_model)}</strong>
                            {tools[1].price_note && (
                              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.8125rem' }}>{tools[1].price_note}</p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Setup Effort</th>
                          <td>{setupLabel(tools[0].setup_effort)}</td>
                          <td>{setupLabel(tools[1].setup_effort)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Works with</th>
                          <td>{tools[0].integrations.length > 0 ? tools[0].integrations.join(', ') : 'None listed'}</td>
                          <td>{tools[1].integrations.length > 0 ? tools[1].integrations.join(', ') : 'None listed'}</td>
                        </tr>
                        <tr>
                          <th scope="row">Best for</th>
                          <td>{tools[0].best_for || 'General use'}</td>
                          <td>{tools[1].best_for || 'General use'}</td>
                        </tr>
                        <tr>
                          <th scope="row">Website</th>
                          <td>
                            <a
                              href={`/out/${tools[0].slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ padding: '4px 12px', fontSize: '.8125rem' }}
                            >
                              Visit {tools[0].name} ↗
                            </a>
                          </td>
                          <td>
                            <a
                              href={`/out/${tools[1].slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ padding: '4px 12px', fontSize: '.8125rem' }}
                            >
                              Visit {tools[1].name} ↗
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* When to Choose Which */}
                <h2 className="sec">When to choose which</h2>
                <div className="pick2">
                  <div>
                    <h3>{`When to choose ${tools[0].name}`}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '.9375rem', marginBottom: '8px' }}>
                      {tools[0].description}
                    </p>
                    <p style={{ fontSize: '.875rem' }}>
                      <strong>Best match if:</strong> {tools[0].best_for || 'rapid setup and ease of use'}.
                    </p>
                  </div>

                  <div>
                    <h3>{`When to choose ${tools[1].name}`}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '.9375rem', marginBottom: '8px' }}>
                      {tools[1].description}
                    </p>
                    <p style={{ fontSize: '.875rem' }}>
                      <strong>Best match if:</strong> {tools[1].best_for || 'deep customization and scale'}.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '36px', textAlign: 'center', border: '1px dashed var(--line)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--muted)', margin: 0 }}>
                  Comparison data for {guide.a} and {guide.b} is currently being verified.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <section className="guide-cta">
          <strong>Looking for custom AI automations?</strong>
          <p>
            If off-the-shelf tools don&apos;t fit your sales stack, our team at GPTify.co builds bespoke workflow automations and integrations.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
            <Link href="/custom" className="btn btn-primary">
              Request Custom Build
            </Link>
            <Link href="/find" className="btn btn-ghost">
              Try Finder
            </Link>
          </div>
        </section>

        {/* Weekly Newsletter Briefing */}
        <NewsletterSignup placement="guide" />
      </main>

      <Footer />
    </div>
  );
}
