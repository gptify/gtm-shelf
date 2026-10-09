'use client';

import React from 'react';
import Link from 'next/link';
import { WorkflowStepData } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface WorkflowDiagramProps {
  steps: WorkflowStepData[];
  useCaseSlug: string;
}

function getStepIcon(actionType: WorkflowStepData['action_type'], isHumanGate?: boolean) {
  if (isHumanGate) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  switch (actionType) {
    case 'trigger':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'enrich':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'action':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'approval':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      );
    case 'deliver':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'sync':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );
  }
}

export function WorkflowDiagram({ steps, useCaseSlug }: WorkflowDiagramProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '28px clamp(16px, 3vw, 28px)',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      aria-label="Interactive workflow diagram"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
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
            Visual Architecture
          </div>
          <h2
            style={{
              font: '700 1.25rem/1.25 var(--display)',
              color: 'var(--ink)',
              margin: 0,
              letterSpacing: '-0.015em',
            }}
          >
            Workflow Process Map
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '0.75rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }} />
            Core Action
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
            Human Approval Gate
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px dashed var(--muted)' }} />
            Conditional Step
          </span>
        </div>
      </div>

      {/* Workflow Step Grid / Sequence */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {steps.map((st, idx) => {
          const isLast = idx === steps.length - 1;
          const isGate = Boolean(st.is_human_gate);
          const isOptional = Boolean(st.is_optional);

          return (
            <React.Fragment key={st.id || `step-${idx}`}>
              {/* Step Card */}
              <div
                style={{
                  flex: '1 1 200px',
                  minWidth: '200px',
                  maxWidth: '260px',
                  background: isGate ? '#fffbeb' : isOptional ? 'var(--surface)' : 'var(--bg)',
                  border: isGate
                    ? '1.5px solid #fde68a'
                    : isOptional
                    ? '1.5px dashed var(--line)'
                    : '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Step Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: isGate ? '#fef3c7' : 'var(--surface)',
                          border: isGate ? '1px solid #fde68a' : '1px solid var(--line)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isGate ? '#92400e' : 'var(--ink)',
                        }}
                      >
                        {st.step_number}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getStepIcon(st.action_type, isGate)}
                      </span>
                    </div>

                    {isGate && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: '#92400e',
                          background: '#fef3c7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #fde68a',
                        }}
                      >
                        Human Gate
                      </span>
                    )}

                    {isOptional && !isGate && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: 'var(--muted)',
                          background: 'var(--bg)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--line)',
                        }}
                      >
                        Conditional
                      </span>
                    )}
                  </div>

                  {/* Step Title */}
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: isGate ? '#78350f' : 'var(--ink)',
                      margin: '0 0 6px',
                      lineHeight: 1.35,
                    }}
                  >
                    {st.label}
                  </h3>

                  {/* Step Description */}
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: isGate ? '#92400e' : 'var(--muted)',
                      margin: '0 0 12px',
                      lineHeight: 1.45,
                    }}
                  >
                    {st.description}
                  </p>
                </div>

                {/* Step Tool & Role Attribution */}
                <div>
                  {st.tool_role && (
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: isGate ? '#92400e' : 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '4px',
                      }}
                    >
                      {st.tool_role}
                    </div>
                  )}

                  {st.tool_slugs && st.tool_slugs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {st.tool_slugs.map((slug) => (
                        <Link
                          key={slug}
                          href={`/tools/${slug}`}
                          onClick={() => {
                            trackEvent('use_case_tool_clicked', {
                              use_case: useCaseSlug,
                              tool: slug,
                            });
                          }}
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'var(--surface)',
                            border: '1px solid var(--line)',
                            color: 'var(--ink)',
                            textDecoration: 'none',
                          }}
                        >
                          {slug}
                        </Link>
                      ))}
                    </div>
                  )}

                  {isGate && st.gate_reason && (
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        color: '#92400e',
                        background: '#ffffff',
                        border: '1px solid #fde68a',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        marginTop: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      ⚠️ {st.gate_reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Directional Connector Arrow */}
              {!isLast && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    padding: '0 2px',
                    alignSelf: 'center',
                  }}
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.6 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
