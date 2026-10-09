import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getAllStacks } from '@/lib/stacks';

export const metadata: Metadata = {
  title: 'GTM Stacks • Curated AI Stacks for B2B Sales and Marketing',
  description: 'Discover battle-tested AI stacks for outbound sales, founder-led prospecting, HubSpot native teams, and retention. Compare costs, workflows, and integrations.',
  alternates: {
    canonical: '/stacks',
  },
  openGraph: {
    title: 'GTM Stacks • Curated AI Stacks for B2B Sales and Marketing',
    description: 'Discover battle-tested AI stacks for outbound sales, founder-led prospecting, HubSpot native teams, and retention.',
    url: 'https://gtmshelf.com/stacks',
  },
};

export default function StacksPage() {
  const stacks = getAllStacks();

  return (
    <>
      <div className="wrap" id="main-content">
        <Header />

        <main style={{ paddingBottom: '60px' }}>
          {/* Header Banner */}
          <section style={{ padding: '40px 0 32px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'var(--brand-soft)',
                border: '1px solid var(--line)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--muted)',
                marginBottom: '16px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }}></span>
              First-Class Architecture Blueprints
            </div>

            <h1
              style={{
                font: '800 clamp(2rem, 4.5vw, 3.25rem)/1.1 var(--display)',
                letterSpacing: '-0.025em',
                margin: '0 0 16px',
                color: 'var(--ink)',
              }}
            >
              Battle-Tested AI Stacks for <mark className="hl">Go-To-Market</mark>
            </h1>

            <p style={{ font: '400 1.125rem/1.6 var(--body)', color: 'var(--muted)', margin: '0 auto 28px', maxWidth: '640px' }}>
              Stop buying isolated point solutions. Discover curated end-to-end software combinations engineered for specific team sizes, budgets, and growth motions.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/build-my-stack" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                Build My GTM Stack →
              </Link>
              <Link href="/roi-calculator" className="btn btn-ghost" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                Stack Cost Simulator
              </Link>
            </div>
          </section>

          {/* Stacks Grid */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginTop: '24px' }}>
            {stacks.map((stack) => (
              <article
                key={stack.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  transition: 'border-color 0.2s, transform 0.2s',
                  position: 'relative',
                }}
              >
                {/* Header tag & category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                  <span
                    style={{
                      font: '600 0.75rem var(--body)',
                      background: 'var(--brand-soft)',
                      color: 'var(--brand)',
                      border: '1px solid var(--line)',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stack.category}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        font: '600 0.75rem var(--body)',
                        background: '#10B98118',
                        color: '#059669',
                        border: '1px solid #10B98130',
                        padding: '3px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {stack.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--muted)',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 500,
                      }}
                    >
                      {stack.verifiedDate}
                    </span>
                  </div>
                </div>

                {/* Stack Title */}
                <h2 style={{ font: '700 1.375rem/1.25 var(--display)', margin: '0 0 10px', color: 'var(--ink)' }}>
                  <Link href={`/stacks/${stack.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {stack.title}
                  </Link>
                </h2>

                <p style={{ font: '400 0.9375rem/1.5 var(--body)', color: 'var(--muted)', margin: '0 0 20px', flexGrow: 1 }}>
                  {stack.subtitle}
                </p>

                {/* Metrics Box */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. Software Cost</div>
                    <div style={{ font: '700 1.0625rem var(--display)', color: 'var(--ink)', marginTop: '2px' }}>{stack.monthlyCostEstimate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Setup Time</div>
                    <div style={{ font: '700 1.0625rem var(--display)', color: 'var(--ink)', marginTop: '2px' }}>{stack.setupTime}</div>
                  </div>
                </div>

                {/* Tool Pills included */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
                    Included Tools ({stack.tools.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {stack.tools.map((t) => (
                      <span
                        key={t.toolSlug}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)' }}></span>
                        {t.toolName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <Link
                  href={`/stacks/${stack.slug}`}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px 18px',
                    fontWeight: 600,
                    borderColor: 'var(--line)',
                  }}
                >
                  View Blueprint & Workflow →
                </Link>
              </article>
            ))}
          </section>

          {/* Bottom Help Banner */}
          <section
            style={{
              marginTop: '56px',
              padding: '36px clamp(20px, 4vw, 44px)',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <h2 style={{ font: '700 1.5rem var(--display)', margin: '0 0 8px', color: 'var(--ink)' }}>
                Don&apos;t see your exact growth motion?
              </h2>
              <p style={{ font: '400 0.9375rem/1.6 var(--body)', color: 'var(--muted)', margin: 0 }}>
                Answer 4 quick questions about your sales motion, team headcount, and CRM to get a tailored 3-tool recommendation with integration verification.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/find" className="btn btn-primary" style={{ padding: '12px 22px' }}>
                Run Stack Finder
              </Link>
              <Link href="/custom" className="btn btn-ghost" style={{ padding: '12px 22px' }}>
                Request Custom Review
              </Link>
            </div>
          </section>
        </main>

        <NewsletterSignup />
        <Footer />
      </div>
    </>
  );
}
