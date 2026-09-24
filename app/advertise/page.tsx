import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Launch & Sponsor — GTM Shelf',
  description: 'Put your B2B AI tool in front of active revenue leaders, founders, and operators. Single all-in-one launch package covering directory, guides, newsletter, and LinkedIn.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'Launch & Sponsor — GTM Shelf',
    description: 'Put your B2B AI tool in front of active revenue leaders, founders, and operators. Single all-in-one launch package covering directory, guides, newsletter, and LinkedIn.',
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
          <span className="badge-pill">Single Multi-Channel Launch Bundle</span>
          <h1 style={{ margin: '12px 0 8px' }}>
            Put Your AI Tool in Front of Active B2B Buyers
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '38em' }}>
            No monthly subscription traps. One simple, high-impact launch package that puts your product across the GTM Shelf directory, dedicated SEO guides, our 15,000+ subscriber newsletter, and our 30,000+ LinkedIn network.
          </p>
        </header>

        {/* Audience Metrics */}
        <section style={{ margin: '36px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>30,000+</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>LinkedIn Followers</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Active B2B revenue network
            </p>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>15,000+</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>Newsletter Readers</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Verified weekly briefing list
            </p>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink)' }}>100%</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>B2B &amp; Revenue Focus</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
              Sales, marketing &amp; Ops buyers
            </p>
          </div>
        </section>

        {/* The One-Off Launch Bundle Card */}
        <section style={{ margin: '48px auto', maxWidth: '780px' }}>
          <div
            style={{
              padding: '36px 32px',
              border: '2px solid var(--primary)',
              borderRadius: '16px',
              background: 'var(--surface)',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span className="badge-pill" style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
                  All-in-One Launch &amp; Spotlight
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>
                  The GTM Launch Bundle
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: 0 }}>
                  Everything you need for an instant spike of targeted B2B distribution and lasting search authority.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
                  $299
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px', fontWeight: 500 }}>
                  One-time fee • Lifetime presence
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0', paddingTop: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>
                What&apos;s Included in Your Launch:
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong>Featured Directory Profile:</strong> Pinned &quot;Featured&quot; placement at the top of your funnel stage and category on GTM Shelf, enhanced with your logo, product screenshots, and a direct <strong>&quot;Book a Demo&quot;</strong> or <strong>&quot;Interactive Demo&quot;</strong> button.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong>Permanent Sponsored Guide Feature:</strong> A dedicated feature or comparison spot in our authoritative <Link href="/guides" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>GTM Shelf Guides</Link> section, delivering perpetual SEO authority and qualified organic inbound traffic.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong>Weekly Newsletter Sponsor Spotlight:</strong> Dedicated sponsor showcase in the weekly <strong>GPTify.co AI Briefing</strong> delivered directly to 15,000+ verified B2B decision-makers.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong>LinkedIn Community Spotlight:</strong> Feature post published across our 30,000+ follower LinkedIn network highlighting your tool&apos;s specific workflow advantage.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong>Editorial Integrity:</strong> Enhanced profile features amplify visibility and clicks without corrupting algorithmic Tool Finder recommendations.
                  </div>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <a
                href="mailto:team@gptify.co?subject=GTM%20Shelf%20Launch%20Bundle%20Inquiry%20($299)&body=Hi%20GPTify.co%20team,%0A%0AI%20would%20like%20to%20book%20the%20$299%20GTM%20Launch%20Bundle%20for%20our%20tool.%0A%0ATool%20Name:%20%0AWebsite%20URL:%20%0ATarget%20Funnel%20Stage:%20(Attract%20/%20Prospect%20/%20Engage%20/%20Close%20/%20Grow)%0A%0AThanks!"
                className="btn btn-primary"
                style={{ width: '100%', maxWidth: '380px', padding: '14px 28px', fontSize: '1.0625rem', textAlign: 'center', textDecoration: 'none', fontWeight: 700 }}
              >
                Book Your Launch Slot ($299) →
              </a>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                ⚡ Limited to 3–4 vetted AI tools per month to ensure maximum attention and CTR.
              </span>
            </div>
          </div>
        </section>

        {/* Additional Partnership Levers */}
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
            Have a Custom Partnership Proposal?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '16px' }}>
            We work directly with founders and growth teams. Reach out with your tool URL.
          </p>
          <a
            href="mailto:team@gptify.co?subject=GTM%20Shelf%20Partnership%20Proposal"
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
