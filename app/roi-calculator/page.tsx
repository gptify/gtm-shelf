import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RoiCalculator } from '@/components/RoiCalculator';

export const metadata: Metadata = {
  title: 'AI ROI Calculator — Model Financial Returns & Hours Reclaimed | GTM Shelf',
  description:
    'Calculate estimated annual cost savings, reclaimed hours, and software payback period before purchasing B2B AI tools. Built by GPTify.co.',
  alternates: {
    canonical: '/roi-calculator',
  },
  openGraph: {
    title: 'AI ROI Calculator — Model Financial Returns & Hours Reclaimed | GTM Shelf',
    description:
      'Calculate estimated annual cost savings, reclaimed hours, and software payback period before purchasing B2B AI tools. Built by GPTify.co.',
    url: '/roi-calculator',
    siteName: 'GTM Shelf',
  },
};

export default function RoiCalculatorPage() {
  return (
    <div className="wrap">
      <Header />

      <main style={{ padding: '32px 0 64px' }}>
        {/* Page Hero Header */}
        <header style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'var(--brand-soft)',
              color: 'var(--brand)',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            ✦ In-House Diagnostic Utility
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              margin: '0 0 16px',
              color: 'var(--ink)',
            }}
          >
            AI ROI &amp; Productivity Calculator
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              margin: '0 0 24px',
            }}
          >
            Model your team’s direct financial return, administrative hours reclaimed, and licensing payback
            period before investing in commercial AI software licenses.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              color: 'var(--muted)',
            }}
          >
            <span>✓ 100% Free &amp; In-Browser</span>
            <span>✓ No Registration or Email Gate</span>
            <span>✓ Zero Data Transmitted to Servers</span>
          </div>
        </header>

        {/* Live Interactive ROI Calculator */}
        <RoiCalculator />

        {/* Supporting Context & FAQ Section */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '64px auto 0',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                margin: '0 0 10px',
                letterSpacing: '-0.01em',
              }}
            >
              How B2B Teams Measure True AI Workflow Value
            </h2>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              Successful AI adoption isn’t about replacing colleagues—it’s about eliminating repetitive friction so reps spend more time in high-value conversations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                1. Focus on Specific High-Frequency Workflows
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                Instead of vague &quot;company-wide AI,&quot; quantify high-frequency tasks such as CRM meeting note synthesis, lead firmographic enrichment, or RFP parsing where manual hours are directly measurable.
              </p>
            </div>

            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                2. Factor in Implementation &amp; Change Management
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                Software licenses are only half the investment. Budgeting for workflow setup, prompt refinement, and team onboarding ensures your adoption curve reaches the projected efficiency gains.
              </p>
            </div>

            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                3. Reinvest Saved Hours into Revenue Growth
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                When sales and marketing reps save 5–10 hours per week from administrative burden, those hours directly transfer to deeper prospect discovery, tailored customer demos, and faster pipeline velocity.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '36px',
              padding: '24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-soft) 0%, var(--bg) 100%)',
              border: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
                Need help auditing your revenue stack?
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                GPTify.co helps B2B organizations design, benchmark, and deploy reliable AI workflows.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/free-tools" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                View All Free Tools
              </Link>
              <Link href="/custom" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Talk to GPTify.co →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
