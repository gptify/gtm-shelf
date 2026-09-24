import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Guides & Comparisons — GTM Shelf',
  description: 'Curated evaluation guides and side-by-side comparisons of AI tools for sales and marketing teams.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Guides & Comparisons — GTM Shelf',
    description: 'Curated evaluation guides and side-by-side comparisons of AI tools for sales and marketing teams.',
    url: '/guides',
    siteName: 'GTM Shelf',
  },
};

export default function GuidesIndexPage() {
  const allGuides = getGuides();
  const bestGuides = allGuides.filter((g) => g.type === 'best');
  const vsGuides = allGuides.filter((g) => g.type === 'vs');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

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
            <li aria-current="page" className="text-[var(--color-text)] font-medium">
              Guides
            </li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header className="mb-12 border-b border-[var(--color-border)] pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Guides & Comparisons
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-3xl leading-relaxed">
            Short, pragmatic buyer guides and side-by-side breakdowns to help you choose the right AI tools for your funnel without vendor fluff.
          </p>
        </header>

        {/* Section 1: Best-of Guides */}
        <section className="mb-14" aria-labelledby="best-guides-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="best-guides-heading" className="text-2xl font-bold">
                Category Buyer Guides
              </h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Hand-picked shortlists filtered by workflow, team size, and integration requirements.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-muted)]">
              {bestGuides.length} Guides
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-stage-engage-tint,#e8f0fe)] text-[var(--color-primary)]">
                    Buyer Guide
                  </span>
                  {guide.cat && (
                    <span className="text-xs text-[var(--color-muted)]">
                      • {guide.cat}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                  {guide.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[var(--color-primary)]">
                  <span>Read guide</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Head-to-Head VS Comparisons */}
        <section className="mb-14" aria-labelledby="vs-guides-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="vs-guides-heading" className="text-2xl font-bold">
                Head-to-Head Comparisons
              </h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Direct feature, pricing, and setup comparisons between leading tools.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-muted)]">
              {vsGuides.length} Comparisons
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vsGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)]">
                    Comparison
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {guide.a} vs {guide.b}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                  {guide.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[var(--color-primary)]">
                  <span>Compare tools</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Finder Callout */}
        <section className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Can't decide between these tools?</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Answer 3 to 10 questions about your workflow to receive 3 ranked recommendations with exact reasons.
            </p>
          </div>
          <Link
            href="/find"
            className="whitespace-nowrap px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-95 transition-opacity text-sm shadow-sm"
          >
            Launch Tool Finder →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
