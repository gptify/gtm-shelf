import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getStackBySlug, getAllStacks } from '@/lib/stacks';

interface StackPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllStacks().map((stack) => ({
    slug: stack.slug,
  }));
}

export function generateMetadata({ params }: StackPageProps): Metadata {
  const stack = getStackBySlug(params.slug);
  if (!stack) {
    return { title: 'Stack Not Found • GTM Shelf' };
  }

  return {
    title: `${stack.title} • GTM Architecture Blueprint`,
    description: `${stack.subtitle} Estimated cost: ${stack.monthlyCostEstimate}. Compare workflow steps, tools, and alternatives.`,
    alternates: {
      canonical: `/stacks/${stack.slug}`,
    },
    openGraph: {
      title: `${stack.title} • GTM Architecture Blueprint`,
      description: stack.subtitle,
      url: `https://gtmshelf.com/stacks/${stack.slug}`,
    },
  };
}

export default function StackDetailPage({ params }: StackPageProps) {
  const stack = getStackBySlug(params.slug);

  if (!stack) {
    notFound();
  }

  return (
    <>
      <div className="wrap" id="main-content">
        <Header />

        <main style={{ paddingBottom: '60px' }}>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/stacks">Stacks</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{stack.title}</li>
            </ol>
          </nav>

          {/* Hero Header */}
          <section style={{ padding: '20px 0 36px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
              <span
                style={{
                  font: '600 0.75rem var(--body)',
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  border: '1px solid var(--line)',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stack.category}
              </span>
              <span
                style={{
                  font: '600 0.75rem var(--body)',
                  background: '#10B98118',
                  color: '#059669',
                  border: '1px solid #10B98130',
                  padding: '3px 12px',
                  borderRadius: '999px',
                }}
              >
                {stack.badge}
              </span>
              <span
                style={{
                  font: '600 0.75rem var(--body)',
                  background: 'var(--surface)',
                  color: 'var(--muted)',
                  border: '1px solid var(--line)',
                  padding: '3px 12px',
                  borderRadius: '999px',
                }}
              >
                Verified as of {stack.verifiedDate}
              </span>
            </div>

            <h1
              style={{
                font: '800 clamp(2.2rem, 5vw, 3.4rem)/1.1 var(--display)',
                letterSpacing: '-0.025em',
                margin: '0 0 16px',
                color: 'var(--ink)',
              }}
            >
              {stack.title}
            </h1>

            <p style={{ font: '400 1.25rem/1.5 var(--body)', color: 'var(--muted)', margin: '0 0 28px', maxWidth: '780px' }}>
              {stack.subtitle}
            </p>

            {/* Key Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '20px 24px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. Monthly Cost</div>
                <div style={{ font: '700 1.25rem var(--display)', color: 'var(--brand)', marginTop: '4px' }}>{stack.monthlyCostEstimate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Target Team</div>
                <div style={{ font: '600 0.9375rem var(--body)', color: 'var(--ink)', marginTop: '4px' }}>{stack.targetTeam}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Setup Time</div>
                <div style={{ font: '600 0.9375rem var(--body)', color: 'var(--ink)', marginTop: '4px' }}>{stack.setupTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Annual Advantage</div>
                <div style={{ font: '600 0.9375rem var(--body)', color: '#059669', marginTop: '4px' }}>{stack.annualSavingsEstimate}</div>
              </div>
            </div>
          </section>

          {/* Architectural Overview */}
          <section style={{ padding: '40px 0', borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ font: '700 1.625rem var(--display)', margin: '0 0 20px', color: 'var(--ink)' }}>
              Architectural Logic & Strategy
            </h2>
            <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px', font: '400 1.0625rem/1.7 var(--body)', color: 'var(--ink)' }}>
              {stack.description.map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0, color: 'var(--muted)' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Visual Workflow Pipeline */}
          <section style={{ padding: '40px 0', borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ font: '700 1.625rem var(--display)', margin: '0 0 8px', color: 'var(--ink)' }}>
              End-to-End Workflow Pipeline
            </h2>
            <p style={{ font: '400 1rem var(--body)', color: 'var(--muted)', margin: '0 0 28px' }}>
              How data and prospects flow sequentially through this stack architecture.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {stack.workflowPipeline.map((step) => (
                <div
                  key={step.step}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--brand)',
                        color: 'var(--brand-ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {step.step}
                    </span>
                    <span style={{ font: '700 0.9375rem var(--display)', color: 'var(--ink)' }}>
                      {step.name}
                    </span>
                  </div>

                  <p style={{ font: '400 0.875rem/1.5 var(--body)', color: 'var(--muted)', margin: '0 0 16px', flexGrow: 1 }}>
                    {step.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {step.toolSlugs.map((slug) => {
                      const toolMatch = stack.tools.find((t) => t.toolSlug === slug);
                      return (
                        <span
                          key={slug}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--bg)',
                            border: '1px solid var(--line)',
                            color: 'var(--ink)',
                          }}
                        >
                          {toolMatch?.toolName || slug}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The Stack Tools Breakdown */}
          <section style={{ padding: '40px 0', borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ font: '700 1.625rem var(--display)', margin: '0 0 8px', color: 'var(--ink)' }}>
              Core Tools in This Stack
            </h2>
            <p style={{ font: '400 1rem var(--body)', color: 'var(--muted)', margin: '0 0 28px' }}>
              Why each tool was selected and the legacy cost it eliminates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {stack.tools.map((item) => (
                <div
                  key={item.toolSlug}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ font: '700 1.25rem var(--display)', margin: 0 }}>
                      <Link href={`/tools/${item.toolSlug}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                        {item.toolName} ↗
                      </Link>
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'var(--brand-soft)',
                        color: 'var(--brand)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      {item.categoryName}
                    </span>
                  </div>

                  <div style={{ font: '600 0.875rem var(--body)', color: 'var(--brand)', marginBottom: '14px' }}>
                    Role: {item.role}
                  </div>

                  <p style={{ font: '400 0.9375rem/1.5 var(--body)', color: 'var(--muted)', margin: '0 0 16px', flexGrow: 1 }}>
                    {item.whyChosen}
                  </p>

                  <div
                    style={{
                      borderTop: '1px solid var(--line)',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted)' }}>Est. Cost:</span>
                      <strong style={{ color: 'var(--ink)' }}>{item.estimatedCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted)' }}>Plan Tier:</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{item.planRequirement}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted)' }}>Seat Basis:</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{item.seatBasis}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted)' }}>Integrations:</span>
                      <span style={{ color: 'var(--muted)', textAlign: 'right' }}>{item.integrations.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', borderTop: '1px dashed var(--line)', paddingTop: '6px', marginTop: '2px' }}>
                      <span style={{ color: 'var(--muted)' }}>Replaces:</span>
                      <span style={{ color: '#059669', fontWeight: 500, textAlign: 'right' }}>{item.replaces}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Infrastructure & Additional Operating Costs Breakdown */}
          {stack.infrastructureCosts && stack.infrastructureCosts.length > 0 && (
            <section style={{ padding: '36px 0', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ font: '700 1.5rem var(--display)', margin: 0, color: 'var(--ink)' }}>
                  Infrastructure &amp; Additional Operating Costs
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontWeight: 500 }}>
                  Prerequisite auxiliary costs to run this architecture reliably
                </span>
              </div>
              <p style={{ font: '400 0.9375rem var(--body)', color: 'var(--muted)', margin: '0 0 20px' }}>
                Software subscriptions rarely operate in isolation. Budget for these additional infrastructure components to ensure deliverability and data integrity.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {stack.infrastructureCosts.map((infra, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{infra.item}</strong>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand)' }}>{infra.cost}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                      {infra.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trade-offs & Alternatives Grid */}
          <section style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Trade-offs */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '28px',
              }}
            >
              <h2 style={{ font: '700 1.25rem var(--display)', margin: '0 0 8px', color: 'var(--ink)' }}>
                Trade-offs & Considerations
              </h2>
              <p style={{ font: '400 0.875rem var(--body)', color: 'var(--muted)', margin: '0 0 20px' }}>
                Honest limitations and practical operational mitigations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stack.tradeoffs.map((t, idx) => (
                  <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--line)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>{t.point}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5, paddingLeft: '24px' }}>
                      <strong>Mitigation:</strong> {t.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '28px',
              }}
            >
              <h2 style={{ font: '700 1.25rem var(--display)', margin: '0 0 8px', color: 'var(--ink)' }}>
                Recommended Swaps &amp; Variants
              </h2>
              <p style={{ font: '400 0.875rem var(--body)', color: 'var(--muted)', margin: '0 0 20px' }}>
                When your specific constraints call for an alternative tool.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stack.alternatives.map((alt, idx) => (
                  <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                        {alt.role}
                      </span>
                      <Link href={`/tools/${alt.alternativeSlug}`} style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand)' }}>
                        {alt.alternativeName} ↗
                      </Link>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      {alt.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Action Section: B2B Implementation & Simulator */}
          <section
            style={{
              marginTop: '28px',
              padding: '36px clamp(20px, 4vw, 44px)',
              background: 'linear-gradient(135deg, var(--surface) 0%, var(--brand-soft) 100%)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <span
                style={{
                  display: 'inline-block',
                  font: '600 0.75rem var(--body)',
                  background: 'var(--surface)',
                  color: 'var(--brand)',
                  border: '1px solid var(--line)',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}
              >
                Bespoke Implementation
              </span>
              <h2 style={{ font: '800 clamp(1.6rem, 3.5vw, 2.1rem)/1.15 var(--display)', margin: '0 0 12px', color: 'var(--ink)' }}>
                Need This Architecture Deployed for Your Team?
              </h2>
              <p style={{ font: '400 1rem/1.6 var(--body)', color: 'var(--muted)', margin: '0 auto 24px', maxWidth: '580px' }}>
                Off-the-shelf tools don&apos;t connect themselves. At <strong>GPTify</strong>, we audit your current CRM, map custom properties, configure enrichment waterfalls, and validate sync reliability.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href={`/custom?stack=${encodeURIComponent(stack.title)}`}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.9375rem' }}
                >
                  Request Stack Audit &amp; Implementation →
                </Link>
                <Link
                  href="/roi-calculator"
                  className="btn btn-ghost"
                  style={{ padding: '12px 20px', fontSize: '0.9375rem', background: 'var(--surface)' }}
                >
                  Simulate Seat Costs
                </Link>
                <Link
                  href="/stacks"
                  className="btn btn-ghost"
                  style={{ padding: '12px 18px', fontSize: '0.9375rem' }}
                >
                  ← All Stacks
                </Link>
              </div>
            </div>
          </section>
        </main>

        <NewsletterSignup />
        <Footer />
      </div>
    </>
  );
}
