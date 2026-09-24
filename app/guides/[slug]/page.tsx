import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides, getGuideBySlug, getToolsForGuide } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
      name: 'GPTify',
      url: 'https://gtmshelf.com',
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
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-muted)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides" className="hover:text-[var(--color-text)] transition-colors">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-text)] font-medium truncate max-w-xs sm:max-w-md">
              {guide.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10 border-b border-[var(--color-border)] pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                guide.type === 'vs'
                  ? 'bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)]'
                  : 'bg-[var(--color-stage-engage-tint,#e8f0fe)] text-[var(--color-primary)]'
              }`}
            >
              {guide.type === 'vs' ? 'Head-to-Head Comparison' : 'Buyer Guide'}
            </span>
            {guide.cat && (
              <span className="text-xs text-[var(--color-muted)]">
                • {guide.cat}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {guide.title}
          </h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed max-w-3xl">
            {guide.intro || guide.desc}
          </p>
        </header>

        {/* BEST-OF GUIDE LAYOUT */}
        {guide.type === 'best' && (
          <div className="space-y-12">
            {/* How we chose / Criteria */}
            <section className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span>🎯</span> How we evaluated these tools
              </h2>
              {guide.crit && (
                <p className="text-sm text-[var(--color-muted)] mb-4 font-mono">
                  {guide.crit}
                </p>
              )}
              {guide.choose && guide.choose.length > 0 && (
                <div className="space-y-2.5 mt-4">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-muted)]">
                    Key factors to consider before choosing
                  </h3>
                  <ul className="space-y-2">
                    {guide.choose.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm">
                        <span className="text-[var(--color-primary)] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Shortlisted Tools */}
            <section aria-labelledby="shortlist-heading">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 id="shortlist-heading" className="text-2xl font-bold">
                    The Shortlist ({tools.length} {tools.length === 1 ? 'tool' : 'tools'})
                  </h2>
                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    All tools listed meet the criteria above. Organic order; no paid ranking.
                  </p>
                </div>
              </div>

              {tools.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-xl">
                  <p className="text-[var(--color-muted)]">
                    No tools currently meet this exact filter criteria.
                  </p>
                  <Link href="/" className="mt-3 inline-block text-sm text-[var(--color-primary)] font-medium">
                    ← Browse all directory tools
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <article
                      key={tool.id}
                      className="p-5 sm:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                          style={{
                            backgroundColor: `hsl(${hue(tool.name)}, 65%, 45%)`,
                          }}
                          aria-hidden="true"
                        >
                          {initial(tool.name)}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="font-bold text-lg hover:text-[var(--color-primary)] transition-colors"
                            >
                              {tool.name}
                            </Link>
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-muted)]">
                              {tool.category_name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-2)] font-medium">
                              {pricingLabel(tool.pricing_model)}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-[var(--color-text)]">
                            {tool.tagline}
                          </p>

                          <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>

                          {tool.integrations.length > 0 && (
                            <p className="text-xs text-[var(--color-muted)]">
                              <span className="font-medium">Integrations:</span>{' '}
                              {tool.integrations.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--color-border)]">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
                        >
                          Details
                        </Link>
                        <a
                          href={`/out/${tool.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                        >
                          Visit site ↗
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VS GUIDE LAYOUT */}
        {guide.type === 'vs' && (
          <div className="space-y-12">
            {tools.length >= 2 ? (
              <>
                {/* Comparison Table */}
                <section aria-labelledby="comparison-heading">
                  <h2 id="comparison-heading" className="text-2xl font-bold mb-6">
                    Side-by-Side Comparison
                  </h2>

                  <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden bg-[var(--color-surface)] shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                            <th scope="col" className="p-4 font-semibold text-[var(--color-muted)] w-1/3">
                              Attribute
                            </th>
                            <th scope="col" className="p-4 font-bold text-lg w-1/3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                                  style={{ backgroundColor: `hsl(${hue(tools[0].name)}, 65%, 45%)` }}
                                >
                                  {initial(tools[0].name)}
                                </div>
                                <span>{tools[0].name}</span>
                              </div>
                            </th>
                            <th scope="col" className="p-4 font-bold text-lg w-1/3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                                  style={{ backgroundColor: `hsl(${hue(tools[1].name)}, 65%, 45%)` }}
                                >
                                  {initial(tools[1].name)}
                                </div>
                                <span>{tools[1].name}</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Tagline
                            </th>
                            <td className="p-4">{tools[0].tagline}</td>
                            <td className="p-4">{tools[1].tagline}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Category
                            </th>
                            <td className="p-4">{tools[0].category_name}</td>
                            <td className="p-4">{tools[1].category_name}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Pricing Model
                            </th>
                            <td className="p-4">
                              <span className="font-semibold">{pricingLabel(tools[0].pricing_model)}</span>
                              {tools[0].price_note && (
                                <p className="text-xs text-[var(--color-muted)] mt-0.5">{tools[0].price_note}</p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="font-semibold">{pricingLabel(tools[1].pricing_model)}</span>
                              {tools[1].price_note && (
                                <p className="text-xs text-[var(--color-muted)] mt-0.5">{tools[1].price_note}</p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Setup Effort
                            </th>
                            <td className="p-4">{setupLabel(tools[0].setup_effort)}</td>
                            <td className="p-4">{setupLabel(tools[1].setup_effort)}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Integrations
                            </th>
                            <td className="p-4">
                              {tools[0].integrations.length > 0
                                ? tools[0].integrations.join(', ')
                                : 'None listed'}
                            </td>
                            <td className="p-4">
                              {tools[1].integrations.length > 0
                                ? tools[1].integrations.join(', ')
                                : 'None listed'}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Best For
                            </th>
                            <td className="p-4 font-medium text-[var(--color-text)]">
                              {tools[0].best_for || 'General use'}
                            </td>
                            <td className="p-4 font-medium text-[var(--color-text)]">
                              {tools[1].best_for || 'General use'}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="p-4 font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)]/50">
                              Links
                            </th>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/out/${tools[0].slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold"
                                >
                                  Visit {tools[0].name} ↗
                                </a>
                                <Link
                                  href={`/tools/${tools[0].slug}`}
                                  className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] underline"
                                >
                                  Details
                                </Link>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/out/${tools[1].slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold"
                                >
                                  Visit {tools[1].name} ↗
                                </a>
                                <Link
                                  href={`/tools/${tools[1].slug}`}
                                  className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] underline"
                                >
                                  Details
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* When to Choose Which */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-labelledby="when-to-choose-heading">
                  <h2 id="when-to-choose-heading" className="sr-only">
                    When to choose each tool
                  </h2>

                  <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span>✓</span> {`When to choose ${tools[0].name}`}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                      {tools[0].description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Best match if you need: {tools[0].best_for || 'rapid onboarding'}.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Setup effort: {setupLabel(tools[0].setup_effort)}.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Pricing: {pricingLabel(tools[0].pricing_model)}.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span>✓</span> {`When to choose ${tools[1].name}`}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                      {tools[1].description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Best match if you need: {tools[1].best_for || 'advanced capabilities'}.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Setup effort: {setupLabel(tools[1].setup_effort)}.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                        <span>Pricing: {pricingLabel(tools[1].pricing_model)}.</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </>
            ) : (
              <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-xl">
                <p className="text-[var(--color-muted)]">
                  Comparison data for {guide.a} and {guide.b} is currently being verified.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Looking for custom AI automations?</h2>
            <p className="text-sm text-[var(--color-muted)] max-w-xl">
              If off-the-shelf tools don't fit your sales stack, our team at GPTify builds bespoke workflow automations and integrations.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/custom"
              className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Request Custom Build
            </Link>
            <Link
              href="/find"
              className="px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors whitespace-nowrap"
            >
              Try Finder
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
