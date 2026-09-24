import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AiReadinessAssessment } from '@/components/AiReadinessAssessment';
import { InlineEnquiryForm } from '@/components/InlineEnquiryForm';

export const metadata: Metadata = {
  title: 'AI Readiness Assessment — Audit Capability & Maturity | GTM Shelf',
  description:
    'Assess individual and organizational AI readiness across 6 core dimensions. Get an instant score and practical 90-day action plan. Free, in-browser tool by GPTify.co.',
  alternates: {
    canonical: '/ai-readiness',
  },
  openGraph: {
    title: 'AI Readiness Assessment — Audit Capability & Maturity | GTM Shelf',
    description:
      'Assess individual and organizational AI readiness across 6 core dimensions. Get an instant score and practical 90-day action plan. Free, in-browser tool by GPTify.co.',
    url: '/ai-readiness',
    siteName: 'GTM Shelf',
  },
};

export default function AiReadinessPage() {
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
            AI Readiness &amp; Maturity Assessment
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              margin: '0 0 24px',
            }}
          >
            Evaluate your personal or organizational AI capability across six strategic dimensions. Receive an instant
            diagnostic maturity score, identified priority gaps, and a tailored 90-day execution plan.
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
            <span>✓ No Sign-Up Required</span>
            <span>✓ Complete in ~5–8 Minutes</span>
          </div>
        </header>

        {/* Live Interactive Readiness Assessment */}
        <AiReadinessAssessment />

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
              The 6 Dimensions of AI Operational Readiness
            </h2>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              A balanced approach to AI adoption balances leadership vision, data readiness, and responsible human oversight.
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
                1. Strategy &amp; Executive Ownership
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                AI tools cannot create value without strategic clarity. Organizations need designated operational ownership, defined outcome KPIs, and prioritised use case roadmaps.
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
                2. People &amp; Role-Specific Literacy
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                Generic prompt tricks don’t move the needle. True capability comes from teaching teams how to integrate AI tools into their specific day-to-day CRM, research, and messaging workflows.
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
                3. Governance &amp; Responsible Verification
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                High-performing teams maintain strict human-in-the-loop checkpoints, explicit data privacy controls, and clear escalation protocols for AI-generated customer deliverables.
              </p>
            </div>
          </div>

          <div
            id="talk-to-us"
            style={{
              marginTop: '48px',
              borderTop: '1px solid var(--line)',
              paddingTop: '36px',
            }}
          >
            <InlineEnquiryForm
              title="Talk to us"
              subtitle="Want an expert review of your readiness diagnostic, a guided CRM data audit, or custom workflow design? Send us your enquiry and we'll respond within 1 business day."
              source="ai-readiness"
              defaultMessage="Hi, I took the AI Readiness Assessment and would like to discuss our diagnostic results and next steps."
              buttonText="Send Enquiry →"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
