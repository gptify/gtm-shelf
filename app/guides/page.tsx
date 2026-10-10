import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Resources and Buyer Guides — GTM Shelf',
  description: 'Free B2B revenue calculators, AI readiness assessments, buyer guides, and head-to-head comparisons for sales and marketing teams.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Resources and Buyer Guides — GTM Shelf',
    description: 'Free B2B revenue calculators, AI readiness assessments, buyer guides, and head-to-head comparisons for sales and marketing teams.',
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
            <li aria-current="page">Resources</li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header style={{ marginBottom: '32px' }}>
          <span className="badge-pill" style={{ marginBottom: '8px', display: 'inline-block' }}>
            Resource Center
          </span>
          <h1 style={{ margin: '0 0 10px' }}>Resources &amp; Buyer Guides</h1>
          <p className="lede">
            Pragmatic evaluation guides, head-to-head tool comparisons, interactive ROI calculators, and operational revenue definitions — built without vendor fluff. Not sure where to start? <Link href="/find" style={{ color: 'var(--brand)', fontWeight: 600 }}>Try the Tool Finder</Link>.
          </p>
        </header>

        {/* Section 0: Interactive Calculators & Free Tools */}
        <section aria-labelledby="free-tools-heading" style={{ marginBottom: '44px' }}>
          <div className="gl-group" style={{ marginTop: 0 }}>
            <h2 id="free-tools-heading" style={{ margin: 0, font: 'inherit' }}>
              Free Calculators &amp; Diagnostics
            </h2>
            <Link
              href="/free-tools"
              style={{
                fontSize: '.875rem',
                color: 'var(--brand)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View all 6 free tools →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
              marginTop: '16px',
            }}
          >
            {/* Tool 1: ROI Calculator */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--brand)',
                    letterSpacing: '0.04em',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Financial Model • Free
                </span>
                <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                  AI ROI &amp; Payback Calculator
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                  Model your software budget, manual data entry hours eliminated, and payback period across pipeline velocity before purchasing licenses.
                </p>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Link
                  href="/roi-calculator"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '9px 16px', fontSize: '0.875rem' }}
                >
                  Launch ROI Calculator →
                </Link>
              </div>
            </div>

            {/* Tool 2: AI Readiness Assessment */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#059669',
                    letterSpacing: '0.04em',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Diagnostic Audit • 5 Minutes
                </span>
                <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                  AI Revenue Readiness Diagnostic
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                  Benchmark your revenue team&apos;s automation maturity, CRM hygiene, and data readiness across 6 dimensions with an instant 0–100 score.
                </p>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Link
                  href="/ai-readiness"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '9px 16px', fontSize: '0.875rem' }}
                >
                  Take Readiness Assessment →
                </Link>
              </div>
            </div>

            {/* Tool 3: Stack Cost Simulator */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#4f46e5',
                    letterSpacing: '0.04em',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Cost Estimator • Interactive
                </span>
                <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                  GTM Stack Cost Simulator
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                  Simulate monthly software expenditures across CRM tiers (HubSpot, Salesforce), outbound seats, and workflow automation usage.
                </p>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Link
                  href="/free-tools"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', padding: '9px 16px', fontSize: '0.875rem', display: 'block' }}
                >
                  Open Simulator Hub →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Glossary Banner */}
        <div
          style={{
            marginBottom: '40px',
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
                  <span className="badge-pill success">Head-to-Head</span>
                  {guide.cat && (
                    <span style={{ fontSize: '.8125rem', color: 'var(--muted)', marginLeft: '8px' }}>
                      {guide.cat}
                    </span>
                  )}
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
