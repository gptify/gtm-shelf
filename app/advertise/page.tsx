import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Advertise & Sponsor — GTM Shelf',
  description: 'Reach high-intent B2B sales leaders, marketers, and founders actively discovering AI tools for their revenue stack.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'Advertise & Sponsor — GTM Shelf',
    description: 'Reach high-intent B2B sales leaders, marketers, and founders actively discovering AI tools for their revenue stack.',
    url: '/advertise',
    siteName: 'GTM Shelf',
  },
};

export default function AdvertisePage() {
  return (
    <div className="wrap">
      <Header />

      <main className="page" id="main-content">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Advertise</li>
          </ol>
        </nav>

        <header className="page-center">
          <span className="badge-pill">Partnerships &amp; Placements</span>
          <h1 style={{ margin: '10px 0' }}>
            Put Your AI Tool in Front of Active B2B Buyers
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '36em' }}>
            GTM Shelf is visited daily by founders, RevOps leaders, and sales managers looking to plug funnel leaks. We offer transparent, strictly labelled sponsorships that maintain editorial trust.
          </p>
        </header>

        {/* Audience Metrics */}
        <section style={{ margin: '40px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
            <div style={{ fontWeight: 600, marginTop: '4px' }}>B2B &amp; Revenue Focus</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '6px' }}>
              No general consumer AI noise. Every visitor is focused on sales, marketing, and pipeline growth.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>High-Intent</div>
            <div style={{ fontWeight: 600, marginTop: '4px' }}>Stage-Specific Search</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '6px' }}>
              Users search by specific funnel stage (Attract, Prospect, Engage, Close, Grow) with ready budget.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>Zero Bloat</div>
            <div style={{ fontWeight: 600, marginTop: '4px' }}>Editorial Integrity</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '6px' }}>
              Sponsored placements are clearly marked and verified. We never recommend tools that don&apos;t work.
            </p>
          </div>
        </section>

        {/* Placement Options */}
        <section style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
            Sponsorship &amp; Partnership Options
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Option 1 */}
            <div style={{ padding: '28px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
              <span className="badge-pill" style={{ alignSelf: 'flex-start' }}>Category Spotlight</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 8px' }}>Featured Tool Listing</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', flexGrow: 1 }}>
                Pinned to the top of your relevant category and funnel stage with a &quot;Featured&quot; badge, direct outbound tracking, and expanded tool drawer profile.
              </p>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Monthly / Quarterly</span>
              </div>
            </div>

            {/* Option 2 */}
            <div style={{ padding: '28px', border: '2px solid var(--primary)', borderRadius: '12px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <span className="badge-pill" style={{ alignSelf: 'flex-start', background: 'var(--primary)', color: '#fff' }}>Most Popular</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 8px' }}>Newsletter + Shelf Bundle</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', flexGrow: 1 }}>
                Combine a top-tier featured placement on GTM Shelf with a dedicated sponsor spotlight in the weekly GPTify.co AI GTM newsletter delivered to verified B2B operators.
              </p>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Custom Package</span>
              </div>
            </div>

            {/* Option 3 */}
            <div style={{ padding: '28px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
              <span className="badge-pill" style={{ alignSelf: 'flex-start' }}>Deep Dive</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 8px' }}>Sponsored &quot;VS&quot; Guide</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', flexGrow: 1 }}>
                Get an objective, rigorous head-to-head comparison guide written by our editorial team, analyzing your tool against alternatives with permanent ranking.
              </p>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>One-time editorial fee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Inquiry Box */}
        <section style={{ maxWidth: '640px', margin: '48px auto', padding: '36px', border: '1px solid var(--border)', borderRadius: '16px', background: 'var(--surface)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '8px' }}>
            Inquire About Sponsorships
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: '24px' }}>
            We work directly with AI tool founders and growth teams. Reach out with your tool URL and target audience.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <a
              href="mailto:sponsor@gtmshelf.com?subject=GTM%20Shelf%20Sponsorship%20Inquiry"
              className="btn btn-primary"
              style={{ width: '100%', maxWidth: '320px', padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}
            >
              Contact Partnerships Team →
            </a>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
              Direct email:{' '}
              <a href="mailto:sponsor@gtmshelf.com" style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                sponsor@gtmshelf.com
              </a>{' '}
              / response within 24 hours
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
