'use client';

import React from 'react';
import Link from 'next/link';
import { StackOption } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface StackTierComparisonProps {
  useCaseSlug: string;
  useCaseTitle: string;
  leanOption: StackOption;
  advancedOption?: StackOption;
  builderQuery: {
    goal: string;
    buckets: string;
    use_case: string;
  };
}

export function StackTierComparison({
  useCaseSlug,
  leanOption,
  advancedOption,
  builderQuery,
}: StackTierComparisonProps) {
  const options = [leanOption, ...(advancedOption ? [advancedOption] : [])];

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--brand)',
            marginBottom: '4px',
          }}
        >
          Stack Architecture Options
        </div>
        <h2
          style={{
            font: '700 1.375rem/1.3 var(--display)',
            color: 'var(--ink)',
            margin: '0 0 8px',
            letterSpacing: '-0.015em',
          }}
        >
          Lean vs. Advanced Tool Configurations
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0, maxWidth: '640px' }}>
          Avoid buying overlapping subscriptions. Review the minimum viable setup needed to accomplish this workflow, along with modular choose-one alternatives.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: options.length > 1 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
          gap: '24px',
        }}
      >
        {options.map((opt) => {
          const isLean = opt.tier === 'lean';
          const builderUrl = `/build-my-stack?use_case=${encodeURIComponent(useCaseSlug)}&goal=${encodeURIComponent(builderQuery.goal)}&buckets=${encodeURIComponent(builderQuery.buckets)}&tier=${opt.tier}`;

          return (
            <div
              key={opt.tier}
              style={{
                border: isLean ? '2px solid var(--brand)' : '1px solid var(--line)',
                borderRadius: '14px',
                padding: '24px',
                background: isLean ? 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)' : 'var(--bg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                {/* Header Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: isLean ? 'var(--brand)' : 'var(--surface)',
                      color: isLean ? 'var(--brand-ink)' : 'var(--ink)',
                      border: isLean ? 'none' : '1px solid var(--line)',
                    }}
                  >
                    {isLean ? 'Minimum Viable Setup' : 'Advanced Multi-Tool Setup'}
                  </span>

                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {opt.estimated_cost}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>
                  {opt.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {opt.description}
                </p>

                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    fontSize: '0.8125rem',
                    color: 'var(--muted)',
                    marginBottom: '20px',
                  }}
                >
                  <strong style={{ color: 'var(--ink)' }}>Best for:</strong> {opt.target_profile}
                </div>

                {/* Required Tools Section */}
                <div style={{ marginBottom: '18px' }}>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                    }}
                  >
                    Required Tools & Workflow Roles:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {opt.required_tools.map((t) => (
                      <div
                        key={t.slug}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <Link
                          href={`/tools/${t.slug}`}
                          onClick={() => {
                            trackEvent('use_case_tool_clicked', { use_case: useCaseSlug, tool: t.slug });
                          }}
                          style={{
                            fontWeight: 700,
                            color: 'var(--brand)',
                            textDecoration: 'none',
                          }}
                        >
                          {t.name}
                        </Link>
                        <span style={{ color: 'var(--muted)', fontSize: '0.75rem', textAlign: 'right' }}>
                          {t.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Choose-One Alternatives Section */}
                {opt.choose_one_alternatives && opt.choose_one_alternatives.length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    {opt.choose_one_alternatives.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px dashed var(--line)',
                          background: 'var(--surface)',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: '#d97706',
                            marginBottom: '4px',
                          }}
                        >
                          Choose ONE Alternative: {group.role}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
                          {group.description}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {group.options.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/tools/${t.slug}`}
                              onClick={() => {
                                trackEvent('use_case_tool_clicked', { use_case: useCaseSlug, tool: t.slug });
                              }}
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: 'var(--bg)',
                                border: '1px solid var(--line)',
                                color: 'var(--ink)',
                                textDecoration: 'none',
                              }}
                            >
                              {t.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Upgrades Section */}
                {opt.optional_upgrades && opt.optional_upgrades.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        letterSpacing: '0.05em',
                        marginBottom: '6px',
                      }}
                    >
                      Optional Capability Add-Ons:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {opt.optional_upgrades.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          onClick={() => {
                            trackEvent('use_case_tool_clicked', { use_case: useCaseSlug, tool: t.slug });
                          }}
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'var(--surface)',
                            border: '1px solid var(--line)',
                            color: 'var(--muted)',
                            textDecoration: 'none',
                          }}
                        >
                          + {t.name} ({t.role})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <Link
                  href={builderUrl}
                  onClick={() => {
                    trackEvent('use_case_stack_started', {
                      slug: useCaseSlug,
                      tier: opt.tier,
                      goal: builderQuery.goal,
                    });
                  }}
                  className={isLean ? 'btn btn-primary' : 'btn btn-ghost'}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  Configure {opt.tier === 'lean' ? 'Lean' : 'Advanced'} Setup in Stack Builder →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
