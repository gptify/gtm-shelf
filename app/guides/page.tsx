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
    <div className="wrap">
      <Header />

      <main className="page" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Guides</li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header style={{ marginBottom: '28px' }}>
          <h1>Guides & Comparisons</h1>
          <p className="lede">
            Short, pragmatic buyer guides and side-by-side breakdowns to help you choose the right AI tools for your funnel without vendor fluff. Not sure where to start? <Link href="/find" style={{ color: 'var(--brand)', fontWeight: 600 }}>Try the Tool Finder</Link>.
          </p>
        </header>

        {/* Featured Glossary Banner */}
        <div
          style={{
            marginBottom: '36px',
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span className="badge-pill" style={{ marginBottom: '6px', display: 'inline-block' }}>Reference</span>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '2px 0 4px' }}>
              B2B Sales &amp; Marketing AI Glossary
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
              21 essential modern revenue and AI concepts defined with operational use cases and directory links.
            </p>
          </div>
          <Link
            href="/guides/glossary"
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
          >
            Explore Glossary →
          </Link>
        </div>

        {/* Section 1: Best-of Guides */}
        <section aria-labelledby="best-guides-heading" style={{ marginBottom: '40px' }}>
          <div className="gl-group">
            <h2 id="best-guides-heading" style={{ margin: 0, font: 'inherit' }}>
              Category Buyer Guides
            </h2>
            <span className="count-pill">{bestGuides.length} Guides</span>
          </div>

          <div className="card-grid">
            {bestGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="guide-card"
              >
                <div>
                  <span className="badge-pill">Buyer Guide</span>
                  {guide.cat && (
                    <span style={{ fontSize: '.8125rem', color: 'var(--muted)', marginLeft: '8px' }}>
                      {guide.cat}
                    </span>
                  )}
                </div>
                <h3 className="gt">{guide.title}</h3>
                <p className="gd">{guide.desc}</p>
                <div className="action">
                  <span>Read guide</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Head-to-Head VS Comparisons */}
        <section aria-labelledby="vs-guides-heading" style={{ marginBottom: '40px' }}>
          <div className="gl-group">
            <h2 id="vs-guides-heading" style={{ margin: 0, font: 'inherit' }}>
              Head-to-Head Comparisons
            </h2>
            <span className="count-pill">{vsGuides.length} Comparisons</span>
          </div>

          <div className="card-grid">
            {vsGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="guide-card"
              >
                <div>
                  <span className="badge-pill success">Comparison</span>
                  <span style={{ fontSize: '.8125rem', color: 'var(--muted)', marginLeft: '8px' }}>
                    {guide.a} vs {guide.b}
                  </span>
                </div>
                <h3 className="gt">{guide.title}</h3>
                <p className="gd">{guide.desc}</p>
                <div className="action">
                  <span>Compare tools</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Finder Callout */}
        <section className="guide-cta">
          <strong>Can&apos;t decide between these tools?</strong>
          <p>
            Answer 3 to 10 questions about your workflow to receive 3 ranked recommendations with exact reasons.
          </p>
          <Link href="/find" className="btn btn-primary">
            Launch Tool Finder →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
