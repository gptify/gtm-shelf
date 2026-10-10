import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getAllUseCases, getUseCaseBySlug } from '@/lib/use-cases';
import { getAllTools, STAGES } from '@/lib/db/data';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';
import {
  UseCaseDetailTracker,
  UseCaseStackButton,
  UseCaseToolLink,
} from '@/components/UseCaseDetailTracker';
import { WorkflowDiagram } from '@/components/WorkflowDiagram';
import { StackTierComparison } from '@/components/StackTierComparison';
import { GtmBucket } from '@/lib/types';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const useCases = getAllUseCases();
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const uc = getUseCaseBySlug(params.slug);
  if (!uc) return {};

  const title = `${uc.title} • GTM Blueprint and Tool Stack | GTM Shelf`;
  const description = `${uc.short_summary} Intended outcome: ${uc.intended_outcome}`.slice(0, 155);

  return {
    title,
    description,
    alternates: {
      canonical: `/use-cases/${uc.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://gtmshelf.com/use-cases/${uc.slug}`,
      siteName: 'GTM Shelf',
    },
  };
}

function getBucketBadgeStyle(bucket: GtmBucket) {
  switch (bucket) {
    case 'Data & Orchestration':
      return { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' };
    case 'Lead Capture':
      return { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' };
    case 'Outbound':
      return { background: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' };
    case 'Inbound':
      return { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
    case 'Agentic Operations':
      return { background: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' };
    default:
      return { background: '#f1f5f9', color: '#334155', borderColor: '#e2e8f0' };
  }
}

function getEffortLabel(effort: 1 | 2 | 3) {
  if (effort === 1) return { label: 'Low effort (1-2 days)', color: '#065f46', bg: '#ecfdf5' };
  if (effort === 2) return { label: 'Medium effort (3-5 days)', color: '#1e40af', bg: '#eff6ff' };
  return { label: 'High effort (1-2 weeks)', color: '#92400e', bg: '#fffbeb' };
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const uc = getUseCaseBySlug(params.slug);
  if (!uc) notFound();

  const allUseCases = getAllUseCases();
  const allTools = await getAllTools();
  const stage = STAGES.find((s) => s.id === uc.stage_id);

  // Map primary and alternative tools from catalog
  const primaryTools = uc.primary_tool_slugs.map((slug) => {
    const found = allTools.find((t) => t.slug === slug);
    return {
      slug,
      name: found ? found.name : slug,
      tagline: found ? found.tagline : 'Ecosystem integration',
      price: found ? found.price_note || pricingLabel(found.pricing_model) : 'Contact vendor',
      pricingModel: found ? found.pricing_model : 'paid',
      setup: found ? found.setup_effort : 1,
      existsInCatalog: Boolean(found),
    };
  });

  const alternativeTools = uc.alternative_tool_slugs.map((slug) => {
    const found = allTools.find((t) => t.slug === slug);
    return {
      slug,
      name: found ? found.name : slug,
      tagline: found ? found.tagline : 'Alternative solution',
      price: found ? found.price_note || pricingLabel(found.pricing_model) : 'Contact vendor',
      pricingModel: found ? found.pricing_model : 'paid',
      setup: found ? found.setup_effort : 1,
      existsInCatalog: Boolean(found),
    };
  });

  // Related use cases (same bucket or stage)
  const relatedUseCases = allUseCases
    .filter((other) => other.id !== uc.id && (other.bucket === uc.bucket || other.stage_id === uc.stage_id))
    .slice(0, 3);

  const bucketBadge = getBucketBadgeStyle(uc.bucket);
  const effortBadge = getEffortLabel(uc.effort_level);

  // JSON-LD Schema (HowTo)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: uc.title,
    description: `${uc.short_summary} Intended outcome: ${uc.intended_outcome}`,
    totalTime: uc.time_to_value,
    step: uc.workflow_steps.map((st) => ({
      '@type': 'HowToStep',
      position: st.step,
      name: st.title,
      text: `${st.description} Recommended action: ${st.recommended_action}`,
    })),
    tool: primaryTools.map((t) => ({
      '@type': 'HowToTool',
      name: t.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <UseCaseDetailTracker slug={uc.slug} bucket={uc.bucket} />

      <div className="wrap" id="main-content">
        <Header />

        <main style={{ paddingBottom: '64px', maxWidth: '960px', margin: '0 auto' }}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/use-cases">Use Cases</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/use-cases?bucket=${encodeURIComponent(uc.bucket)}`}>
                  {uc.bucket}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{uc.title}</li>
            </ol>
          </nav>

          {/* Hero Header */}
          <header
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '36px clamp(20px, 4vw, 40px)',
              marginBottom: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: `1px solid ${bucketBadge.borderColor}`,
                  ...bucketBadge,
                }}
              >
                {uc.bucket}
              </span>

              {stage && (
                <Link
                  href={`/stage/${stage.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    background: 'var(--bg)',
                    color: 'var(--muted)',
                    border: '1px solid var(--line)',
                    textDecoration: 'none',
                  }}
                >
                  Stage {stage.id}: {stage.name}
                </Link>
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  background: effortBadge.bg,
                  color: effortBadge.color,
                }}
              >
                {effortBadge.label}
              </span>
            </div>

            <h1
              style={{
                font: '800 clamp(1.875rem, 3.8vw, 2.75rem)/1.15 var(--display)',
                letterSpacing: '-0.025em',
                margin: '0 0 16px',
                color: 'var(--ink)',
              }}
            >
              {uc.title}
            </h1>

            <p
              style={{
                font: '400 1.125rem/1.65 var(--body)',
                color: 'var(--muted)',
                margin: '0 0 28px',
              }}
            >
              {uc.short_summary}
            </p>

            {/* Key Facts Summary Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                marginBottom: '28px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target Buyer
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginTop: '4px' }}>
                  {uc.buyer}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Expected Outcome
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginTop: '4px' }}>
                  {uc.intended_outcome}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Time to Value
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginTop: '4px' }}>
                  {uc.time_to_value}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estimated Cost
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginTop: '4px' }}>
                  {uc.cost_note}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <UseCaseStackButton
                slug={uc.slug}
                goal={uc.builder_query.goal}
                buckets={uc.builder_query.buckets}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.9375rem' }}
              >
                Pre-fill in Stack Builder →
              </UseCaseStackButton>

              {uc.gptify_resource_url && (
                <a
                  href={`${uc.gptify_resource_url}?utm_source=gtmshelf&utm_medium=use_case_header&utm_campaign=${uc.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ padding: '12px 20px', fontSize: '0.9375rem' }}
                >
                  GPTify Operational Guide ↗
                </a>
              )}
            </div>
          </header>

          {/* Section 1: Business Problem */}
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                font: '700 1.375rem/1.3 var(--display)',
                color: 'var(--ink)',
                margin: '0 0 12px',
                letterSpacing: '-0.015em',
              }}
            >
              The Revenue Bottleneck
            </h2>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--muted)',
                margin: 0,
              }}
            >
              {uc.business_problem}
            </p>
          </section>

          {/* Section 1.5: Interactive Workflow Visual Diagram */}
          {uc.workflow_diagram && uc.workflow_diagram.length > 0 && (
            <WorkflowDiagram
              steps={uc.workflow_diagram}
              useCaseSlug={uc.slug}
            />
          )}

          {/* Section 2: Prerequisites */}
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                font: '700 1.375rem/1.3 var(--display)',
                color: 'var(--ink)',
                margin: '0 0 16px',
                letterSpacing: '-0.015em',
              }}
            >
              Required Technical Inputs & Prerequisites
            </h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                color: 'var(--muted)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
              }}
            >
              {uc.prerequisites.map((prereq, i) => (
                <li key={i}>
                  <strong style={{ color: 'var(--ink)' }}>{prereq}</strong>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Step-by-Step Workflow */}
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                font: '700 1.375rem/1.3 var(--display)',
                color: 'var(--ink)',
                margin: '0 0 24px',
                letterSpacing: '-0.015em',
              }}
            >
              Step-by-Step Workflow Implementation
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {uc.workflow_steps.map((st) => (
                <div
                  key={st.step}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '20px',
                    background: 'var(--bg)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--brand)',
                        color: 'var(--brand-ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                    >
                      {st.step}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.0625rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                      }}
                    >
                      {st.title}
                    </h3>
                  </div>

                  <p
                    style={{
                      margin: '0 0 12px',
                      color: 'var(--muted)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      paddingLeft: '40px',
                    }}
                  >
                    {st.description}
                  </p>

                  <div
                    style={{
                      marginLeft: '40px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      fontSize: '0.8125rem',
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="2"
                      aria-hidden="true"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>
                      <b>Recommended Action:</b> {st.recommended_action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Human Review Checkpoints */}
          <section
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '28px',
              color: '#92400e',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2
                style={{
                  font: '700 1.25rem/1.3 var(--display)',
                  margin: 0,
                  color: '#78350f',
                }}
              >
                Human Approval & Review Checkpoints
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 16px', color: '#92400e' }}>
              Autonomous systems must never operate completely unmonitored. The following critical checkpoints require explicit human review to protect deliverability, domain reputation, and buyer trust:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {uc.human_checkpoints.map((cp, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    color: '#78350f',
                  }}
                >
                  <strong style={{ color: '#92400e' }}>{cp.checkpoint}:</strong> {cp.why_required}
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Stack Architecture: Lean vs. Advanced Configurations */}
          {uc.stack_options ? (
            <StackTierComparison
              useCaseSlug={uc.slug}
              useCaseTitle={uc.title}
              leanOption={uc.stack_options.lean}
              advancedOption={uc.stack_options.advanced}
              builderQuery={{
                goal: uc.builder_query.goal,
                buckets: uc.builder_query.buckets,
                use_case: uc.slug,
              }}
            />
          ) : (
            <section
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '28px',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    font: '700 1.375rem/1.3 var(--display)',
                    color: 'var(--ink)',
                    margin: '0 0 8px',
                    letterSpacing: '-0.015em',
                  }}
                >
                  Suggested Tools
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0 }}>
                  Tools cataloged from our active 50-tool GTM index to support this workflow.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {primaryTools.map((t) => (
                  <div
                    key={t.slug}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '16px',
                      background: 'var(--bg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                        }}
                      >
                        <div
                          className="mono"
                          style={{ '--h': hue(t.name), width: '32px', height: '32px', fontSize: '0.875rem' } as React.CSSProperties}
                          aria-hidden="true"
                        >
                          {initial(t.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {t.price}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                        {t.tagline}
                      </p>
                    </div>

                    <div>
                      {t.existsInCatalog ? (
                        <UseCaseToolLink
                          useCaseSlug={uc.slug}
                          toolSlug={t.slug}
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'var(--brand)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          View Profile & Pricing →
                        </UseCaseToolLink>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          Ecosystem Platform
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternatives */}
              {alternativeTools.length > 0 && (
                <div>
                  <h3
                    style={{
                      font: '600 1.0625rem/1.3 var(--display)',
                      color: 'var(--ink)',
                      margin: '0 0 12px',
                    }}
                  >
                    Choose-One Alternatives
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {alternativeTools.map((t) => (
                      <UseCaseToolLink
                        key={t.slug}
                        useCaseSlug={uc.slug}
                        toolSlug={t.slug}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--bg)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <span>{t.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 400 }}>
                          ({t.price})
                        </span>
                      </UseCaseToolLink>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Section 6: Data Privacy & Security */}
          <section
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                font: '700 1.375rem/1.3 var(--display)',
                color: 'var(--ink)',
                margin: '0 0 14px',
                letterSpacing: '-0.015em',
              }}
            >
              Data Privacy, Compliance & Security Considerations
            </h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                color: 'var(--muted)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
              }}
            >
              {uc.privacy_security_considerations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 7: Build My Stack Conversion Card */}
          <section
            style={{
              background: 'linear-gradient(135deg, var(--surface) 0%, var(--brand-soft) 100%)',
              border: '1.5px solid var(--brand)',
              borderRadius: '20px',
              padding: '36px',
              marginBottom: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(47, 69, 224, 0.08)',
            }}
          >
            <h2
              style={{
                font: '800 clamp(1.5rem, 3vw, 2rem)/1.2 var(--display)',
                margin: '0 0 12px',
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              Assemble This Software Stack in Minutes
            </h2>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--muted)',
                maxWidth: '600px',
                margin: '0 auto 24px',
              }}
            >
              Use our interactive recommendation engine to calculate estimated monthly subscription costs,
              check CRM compatibility, and customize this workflow for your team size and budget.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <UseCaseStackButton
                slug={uc.slug}
                goal={uc.builder_query.goal}
                buckets={uc.builder_query.buckets}
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontSize: '1rem' }}
              >
                Pre-fill This Stack in Build My Stack →
              </UseCaseStackButton>
            </div>
          </section>

          {/* Section 8: Related Operational Use Cases */}
          {relatedUseCases.length > 0 && (
            <section style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  font: '700 1.375rem/1.3 var(--display)',
                  color: 'var(--ink)',
                  margin: '0 0 20px',
                  letterSpacing: '-0.015em',
                }}
              >
                Related Operational Blueprints
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {relatedUseCases.map((other) => (
                  <Link
                    key={other.id}
                    href={`/use-cases/${other.slug}`}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '20px',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', marginBottom: '8px' }}>
                        {other.bucket}
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                        {other.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                        {other.short_summary}
                      </p>
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand)' }}>
                      Read blueprint →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Newsletter */}
          <section>
            <NewsletterSignup placement="guide" />
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
