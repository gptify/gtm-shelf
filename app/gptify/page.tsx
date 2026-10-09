import type { Metadata } from 'next';
import Link from 'next/link';
import { getTools, STAGES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Welcome GPTify Readers • From AI Insights to Your Next GTM Stack',
  description:
    "You've explored practical AI workflows through GPTify.co. Now discover, compare, and connect the vetted tools that power your sales and marketing operations.",
  alternates: {
    canonical: '/gptify',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'From AI Insights to Your Next GTM Stack • GTMShelf',
    description:
      'Curated AI tools and architecture blueprints for GPTify readers and modern B2B revenue teams.',
    url: '/gptify',
    siteName: 'GTM Shelf',
  },
};

export default async function GptifyLandingPage() {
  const tools = await getTools();
  const featuredTools = tools.filter((t) => t.featured).slice(0, 6);

  return (
    <>
      <div className="wrap" id="main-content">
        <Header />

        <main style={{ padding: '40px 0 80px', maxWidth: '880px', margin: '0 auto' }}>
          {/* Welcome Badge */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'var(--brand-soft)',
                border: '1px solid var(--line)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--brand)',
                marginBottom: '16px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }}></span>
              Special Welcome for GPTify Community Readers
            </div>

            <h1
              style={{
                font: '800 clamp(2.2rem, 5vw, 3.25rem)/1.15 var(--display)',
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
                margin: '0 0 18px',
              }}
            >
              From AI Insights to Your <mark className="hl">Next GTM Stack</mark>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: 'var(--muted)',
                maxWidth: '680px',
                margin: '0 auto 28px',
              }}
            >
              You&apos;ve explored practical AI through <strong>GPTify.co</strong>. Now discover the vetted software tools and architectures that turn those frameworks into running sales and marketing workflows.
            </p>

            {/* Suggested CTAs */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link
                href="/build-my-stack?utm_source=gptify&utm_medium=welcome_landing"
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Build My GTM Stack →
              </Link>
              <Link
                href="/stage/prospect?utm_source=gptify&utm_medium=welcome_landing"
                className="btn btn-ghost"
                style={{ padding: '12px 22px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none' }}
              >
                Explore AI Sales Tools
              </Link>
              <Link
                href="/stacks?utm_source=gptify&utm_medium=welcome_landing"
                className="btn btn-ghost"
                style={{ padding: '12px 22px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none' }}
              >
                Compare GTM Platforms
              </Link>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0 }}>
              Zero vendor bias • Independent evaluations • Unlocked for all operators
            </p>
          </div>

          {/* Clarity on GPTify & GTMShelf connection */}
          <div
            style={{
              padding: '24px 28px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              marginBottom: '48px',
              lineHeight: 1.6,
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--ink)' }}>
              How GTMShelf &amp; GPTify work together
            </h2>
            <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '0.9375rem' }}>
              <strong>GTMShelf</strong> was developed by the team at <strong>GPTify.co</strong> as a public, independent architecture directory. While GPTify focuses on deep-dive workflow playbooks and bespoke B2B AI consulting, GTMShelf exists to help revenue teams quickly evaluate pricing, CRM integrations, and tech stack compatibility without marketing spin.
            </p>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8125rem', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
              <em>Note:</em> Visiting GTMShelf from GPTify does not share your contact details. Subscriptions to GTMShelf alerts or stack exports require your separate opt-in consent.
            </p>
          </div>

          {/* Quick-Start Operational Tracks */}
          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: '0 0 20px', color: 'var(--ink)' }}>
              Choose Your Growth Motion
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Track 01</span>
                <h3 style={{ fontSize: '1.125rem', margin: '8px 0', fontWeight: 700 }}>Outbound Prospecting</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Waterfall email enrichment, secondary domain rotation, and multi-channel LinkedIn campaigns.
                </p>
                <Link
                  href="/build-my-stack?goal=outbound_pipeline&crm=HubSpot&budget=growth&utm_source=gptify"
                  className="btn btn-ghost"
                  style={{ width: '100%', textAlign: 'center', fontSize: '0.8125rem' }}
                >
                  Configure Outbound Stack →
                </Link>
              </div>

              <div style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Track 02</span>
                <h3 style={{ fontSize: '1.125rem', margin: '8px 0', fontWeight: 700 }}>Meeting &amp; Call Intelligence</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Autonomous call recorders that transcribe objections, track competitor mentions, and update your CRM.
                </p>
                <Link
                  href="/category/call-intelligence?utm_source=gptify"
                  className="btn btn-ghost"
                  style={{ width: '100%', textAlign: 'center', fontSize: '0.8125rem' }}
                >
                  Compare Call AI Tools →
                </Link>
              </div>

              <div style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Track 03</span>
                <h3 style={{ fontSize: '1.125rem', margin: '8px 0', fontWeight: 700 }}>Inbound Demand &amp; SEO</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  High-intent content research, programmatic search engines, and website conversion chat bots.
                </p>
                <Link
                  href="/category/content-writing?utm_source=gptify"
                  className="btn btn-ghost"
                  style={{ width: '100%', textAlign: 'center', fontSize: '0.8125rem' }}
                >
                  Explore Inbound Tools →
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Directory Picks */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                Featured Battle-Tested Tools
              </h2>
              <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--brand)', fontWeight: 600 }}>
                View all 50+ tools →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {featuredTools.map((t) => (
                <div key={t.id} style={{ padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                      <Link href={`/tools/${t.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {t.name}
                      </Link>
                    </h3>
                    <span style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--brand-soft)', color: 'var(--brand)', fontWeight: 600 }}>
                      {t.category_name}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
                    {t.tagline}
                  </p>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', width: '100%', textAlign: 'center' }}
                  >
                    View Architecture Specs →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
