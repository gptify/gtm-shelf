import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StackCostSimulator } from '@/components/StackCostSimulator';

export const metadata: Metadata = {
  title: 'Free AI Calculators & Tools for Revenue Teams — GTM Shelf',
  description: 'Interactive ROI calculators, AI readiness assessments, policy generators, and prompt builders built by GPTify.co to help B2B teams evaluate AI investments.',
  alternates: {
    canonical: '/free-tools',
  },
  openGraph: {
    title: 'Free AI Calculators & Tools for Revenue Teams — GTM Shelf',
    description: 'Interactive ROI calculators, AI readiness assessments, policy generators, and prompt builders built by GPTify.co to help B2B teams evaluate AI investments.',
    url: '/free-tools',
    siteName: 'GTM Shelf',
  },
};

interface FreeTool {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  features: string[];
  url: string;
  badge?: string;
  buttonText: string;
}

const FREE_TOOLS: FreeTool[] = [
  {
    id: 'ai-roi-calculator',
    name: 'AI ROI Calculator',
    eyebrow: 'Financial Modelling',
    badge: 'Popular',
    description:
      'Model your AI software budget against pipeline throughput, administrative friction eliminated, and campaign velocity before purchasing commercial software licenses.',
    features: ['Manual data entry hours eliminated', 'Software budget vs. pipeline velocity', 'Tool stack payback period'],
    url: '/roi-calculator',
    buttonText: 'Launch Calculator →',
  },
  {
    id: 'ai-readiness-assessment',
    name: 'AI Readiness Assessment',
    eyebrow: 'Diagnostic Audit',
    badge: 'Diagnostic',
    description:
      "Benchmark your team's workflow automation maturity, data hygiene, CRM readiness, and technical bandwidth across 6 strategic revenue dimensions.",
    features: ['5-minute executive survey', 'Instant maturity score (0–100)', 'Targeted gap analysis breakdown'],
    url: '/ai-readiness',
    buttonText: 'Take Assessment →',
  },
  {
    id: 'ai-policy-generator',
    name: 'AI Policy Generator',
    eyebrow: 'Governance & Compliance',
    description:
      'Generate an executive-ready internal AI acceptable-use policy for employees, sales teams, and contractors in less than 3 minutes.',
    features: ['Data privacy & IP protection clauses', 'Customer communication disclosure rules', 'Ready-to-sign template export'],
    url: 'https://gptify.co/ai-policy-generator/?utm_source=gtmshelf&utm_medium=free-tools-hub&utm_campaign=policy-gen',
    buttonText: 'Generate Policy ↗',
  },
  {
    id: 'prompt-generator',
    name: 'Free Prompt Generator',
    eyebrow: 'Prompt Engineering',
    description:
      'Craft battle-tested, structured prompts specifically tuned for B2B outbound cold emails, deal qualification, and market research.',
    features: ['Role & tone framing', 'Anti-hallucination constraints', 'Strict output schema formatting'],
    url: 'https://gptify.co/prompt-generator/?utm_source=gtmshelf&utm_medium=free-tools-hub&utm_campaign=prompt-gen',
    buttonText: 'Build Prompts ↗',
  },
  {
    id: 'ai-use-case-library',
    name: 'AI Use-Case Library',
    eyebrow: 'Operational Playbooks',
    description:
      'Explore verified B2B revenue playbooks showcasing actual workflow blueprints, software stacks, and measurable conversion lifts.',
    features: ['Step-by-step workflow diagrams', 'Real conversion benchmarks', 'Recommended tool stacks'],
    url: 'https://gptify.co/ai-use-case-library/?utm_source=gtmshelf&utm_medium=free-tools-hub&utm_campaign=use-cases',
    buttonText: 'Explore Use Cases ↗',
  },
  {
    id: 'prompts-vault',
    name: '400+ Business Prompt Vault',
    eyebrow: 'Prompt Vault',
    description:
      'A searchable library of 400+ tested prompts for sales pipeline audits, customer discovery prep, cold outreach, and revenue forecasting.',
    features: ['Organized by revenue funnel stage', '1-click copy to clipboard', 'Model-tested on Claude 3.5 & GPT-4o'],
    url: 'https://gptify.co/prompts/?utm_source=gtmshelf&utm_medium=free-tools-hub&utm_campaign=prompt-vault',
    buttonText: 'Browse 400+ Prompts ↗',
  },
];

export default function FreeToolsPage() {
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
            <li aria-current="page">Free Tools &amp; Calculators</li>
          </ol>
        </nav>

        <header className="page-center">
          <span className="badge-pill">Free Utilities by GPTify.co</span>
          <h1 style={{ margin: '12px 0 8px' }}>
            Free AI Calculators &amp; Revenue Utilities
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '38em' }}>
            Interactive decision-support tools built by the team at <a href="https://gptify.co" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>GPTify.co</a> to help revenue leaders plan software spend, evaluate operational readiness, and deploy reliable workflows.
          </p>
        </header>

        {/* Live Interactive Stack Budget & Capacity Simulator */}
        <StackCostSimulator />

        {/* Free Utilities Grid Header */}
        <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Explore Dedicated Calculators &amp; Generators
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: 0 }}>
            Interactive ROI calculators, diagnostic maturity audits, and prompt vaults.
          </p>
        </div>

        {/* Free Utilities Grid */}
        <section style={{ margin: '0 0 48px' }} aria-label="Free tools directory">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {FREE_TOOLS.map((tool) => (
              <div
                key={tool.id}
                style={{
                  padding: '28px',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  background: 'var(--surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--muted)',
                      }}
                    >
                      {tool.eyebrow}
                    </span>
                    {tool.badge && (
                      <span
                        className="badge-pill"
                        style={{
                          background: 'rgba(239, 159, 39, 0.12)',
                          color: '#d97706',
                          borderColor: 'rgba(239, 159, 39, 0.3)',
                          fontSize: '0.6875rem',
                          padding: '2px 8px',
                        }}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)' }}>
                    {tool.name}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
                    {tool.description}
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '8px' }}>
                      Key Capabilities:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {tool.features.map((feat, i) => (
                        <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  {tool.url.startsWith('/') ? (
                    <Link
                      href={tool.url}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        justifyContent: 'center',
                      }}
                    >
                      {tool.buttonText}
                    </Link>
                  ) : (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        justifyContent: 'center',
                      }}
                    >
                      {tool.buttonText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Automation Callout */}
        <section
          style={{
            margin: '64px auto 32px',
            padding: '36px 32px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '820px',
          }}
        >
          <span className="badge-pill">Bespoke Enterprise Systems</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 8px' }}>
            Need Custom Internal Tooling or CRM Integrations?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 auto 24px', maxWidth: '38em' }}>
            When public calculators and spreadsheets are not enough, our team at GPTify.co designs bespoke AI workflows, automated lead routing, and custom CRM integrations directly tailored to your proprietary stack.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/custom" className="btn btn-primary" style={{ padding: '12px 24px', textDecoration: 'none' }}>
              Request a Custom Build →
            </Link>
            <Link href="/find" className="btn btn-ghost" style={{ padding: '12px 20px', textDecoration: 'none' }}>
              Find Off-the-Shelf Tools
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
