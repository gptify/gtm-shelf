import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Advertise & Listings — GTM Shelf',
  description: 'Put your B2B AI tool in front of active revenue leaders, founders, and operators. Free, Premium, and Sponsored tiers with zero pay-to-play rankings.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'Advertise & Listings — GTM Shelf',
    description: 'Put your B2B AI tool in front of active revenue leaders, founders, and operators. Free, Premium, and Sponsored tiers with zero pay-to-play rankings.',
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
          <span className="badge-pill">Directory Listings &amp; Sponsorships</span>
          <h1 style={{ margin: '12px 0 8px' }}>
            Put Your AI Tool in Front of Active B2B Buyers
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '42em', textWrap: 'pretty' }}>
            GTM Shelf connects qualified revenue leaders, sales directors, and marketing ops teams with modern AI software. We offer three transparent listing tiers designed for genuine discovery.
          </p>
        </header>

        {/* Audience Metrics */}
        <section style={{ margin: '36px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>30,000+</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>LinkedIn Network</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Active B2B revenue community
            </p>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>15,000+</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>Newsletter Readers</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Weekly B2B briefing subscribers
            </p>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>100%</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>Revenue &amp; GTM Focus</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Sales, marketing &amp; Ops decision-makers
            </p>
          </div>
        </section>

        {/* Editorial Integrity Box */}
        <section
          style={{
            margin: '32px auto',
            maxWidth: '820px',
            padding: '20px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)', marginBottom: '4px' }}>
            Our Editorial Rule: No Paid Rankings
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            A paid listing gets you a richer profile — logo, screenshots, a direct link to book a demo — never a higher rank. Rank and finder results are earned, not bought. The Tool Finder recommends software strictly based on fit, budget, and CRM compatibility.
          </p>
        </section>

        {/* 3 Pricing Tiers Grid */}
        <section style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
            Listing &amp; Promotion Tiers
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9375rem', marginBottom: '32px' }}>
            Choose the right level of visibility for your tool.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1040px',
              margin: '0 auto',
            }}
          >
            {/* Tier 1: Free Listing */}
            <div
              style={{
                padding: '32px 24px',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge-pill" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  Standard
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>
                  Free Listing
                </h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
                  $0
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  What every quality tool gets. Indexed in the directory and eligible for organic Tool Finder matches.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--success, #059669)', fontWeight: 700 }}>✓</span>
                    <span>Tool name, tagline &amp; website link</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--success, #059669)', fontWeight: 700 }}>✓</span>
                    <span>Funnel stage &amp; category indexing</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--success, #059669)', fontWeight: 700 }}>✓</span>
                    <span>Pricing model badge &amp; CRM filter tags</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--success, #059669)', fontWeight: 700 }}>✓</span>
                    <span>One-line editorial summary</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <Link
                  href="/submit"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px 16px', display: 'block' }}
                >
                  Submit Free Tool →
                </Link>
              </div>
            </div>

            {/* Tier 2: Premium Listing */}
            <div
              style={{
                padding: '32px 24px',
                border: '2px solid var(--primary)',
                borderRadius: '16px',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Recommended
              </div>

              <div>
                <span className="badge-pill" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  Enhanced Profile
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>
                  Premium Listing
                </h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
                  $149 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>/ month</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '16px' }}>
                  or $1,490/year (2 months free)
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  A richer profile built to turn directory visitors into qualified pipeline and demo bookings.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span><strong>High-res logo &amp; product screenshots</strong></span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span><strong>Direct &quot;Book a Demo&quot; button</strong> to your calendar</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span>Extended description &amp; key feature highlights</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span>Self-reported &quot;Verified by vendor&quot; profile badge</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span>Detailed pricing tiers &amp; seat breakdown note</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <a
                  href="mailto:team@gptify.co?subject=GTM%20Shelf%20Premium%20Listing%20Inquiry&body=Hi%20team,%0A%0AWe%20would%20like%20to%20upgrade%20our%20listing%20to%20Premium%20($149/mo).%0A%0ATool%20Name:%20%0AWebsite:%20%0ADemo%20URL:%20%0A%0AThanks!"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px 16px', display: 'block', textDecoration: 'none' }}
                >
                  Upgrade to Premium →
                </a>
              </div>
            </div>

            {/* Tier 3: Sponsored Slot / Launch Bundle */}
            <div
              style={{
                padding: '32px 24px',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge-pill" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  Multi-Channel Spotlight
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>
                  Sponsored Slot &amp; Launch
                </h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
                  $299 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>one-off</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '16px' }}>
                  or monthly sponsorship packages
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Prominent, transparently labeled placements across directory rows, guide pages, and newsletter.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span><strong>Labeled &quot;Sponsored&quot; slot</strong> in category &amp; stage rows</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span><strong>Sponsored feature in GTM Shelf Guides</strong> (SEO authority)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span><strong>Spotlight in GPTify AI Briefing</strong> (15,000+ subscribers)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                    <span>LinkedIn post to 30,000+ followers</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>
                      <em>Never alters organic directory order or Finder logic</em>
                    </span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <a
                  href="mailto:team@gptify.co?subject=GTM%20Shelf%20Sponsored%20Slot%20Inquiry%20($299)&body=Hi%20team,%0A%0AWe%20would%20like%20to%20book%20a%20Sponsored%20Slot%20/%20Launch%20Spotlight.%0A%0ATool%20Name:%20%0AWebsite:%20%0ATarget%20Funnel%20Stage:%20%0A%0AThanks!"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px 16px', display: 'block', textDecoration: 'none' }}
                >
                  Book Sponsored Slot →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Collaboration Levers */}
        <section style={{ margin: '56px 0', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
            Further Collaboration Levers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                Affiliate &amp; Partner Networks
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                Do you manage an affiliate or partner program on PartnerStack, Rewardful, or FirstPromoter? We integrate transparent referral tracking for qualifying tools. Email us at <a href="mailto:team@gptify.co" style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>team@gptify.co</a>.
              </p>
            </div>

            <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                Custom Enterprise Workflows
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                Need your product embedded into complex enterprise tech stacks? Our team at <a href="https://gptify.co" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>GPTify.co</a> designs custom automations and API orchestrations for mutual B2B clients.
              </p>
            </div>
          </div>
        </section>

        {/* General Inquiries Box */}
        <section style={{ maxWidth: '600px', margin: '40px auto 20px', padding: '28px', border: '1px solid var(--border)', borderRadius: '14px', background: 'var(--surface)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
            Have Questions About Listings?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '16px' }}>
            Reach out directly with your tool details and team size.
          </p>
          <a
            href="mailto:team@gptify.co?subject=GTM%20Shelf%20Listing%20Inquiry"
            className="btn btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Email team@gptify.co
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
