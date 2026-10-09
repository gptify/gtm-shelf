'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { UseCase, GtmBucket } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

const BUCKETS: { id: string; label: string; value: GtmBucket | 'All' }[] = [
  { id: 'all', label: 'All Use Cases', value: 'All' },
  { id: 'data', label: 'Data & Orchestration', value: 'Data & Orchestration' },
  { id: 'capture', label: 'Lead Capture', value: 'Lead Capture' },
  { id: 'outbound', label: 'Outbound', value: 'Outbound' },
  { id: 'inbound', label: 'Inbound', value: 'Inbound' },
  { id: 'agentic', label: 'Agentic Operations', value: 'Agentic Operations' },
];

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

function getEffortBadge(effort: 1 | 2 | 3) {
  if (effort === 1) {
    return {
      label: 'Low effort (1-2 days)',
      style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
    };
  }
  if (effort === 2) {
    return {
      label: 'Medium effort (3-5 days)',
      style: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' },
    };
  }
  return {
    label: 'High effort (1-2 weeks)',
    style: { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' },
  };
}

interface Props {
  initialUseCases: UseCase[];
}

export function UseCasesDirectoryClient({ initialUseCases }: Props) {
  const [selectedBucket, setSelectedBucket] = useState<GtmBucket | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const bucketCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialUseCases.length };
    initialUseCases.forEach((uc) => {
      counts[uc.bucket] = (counts[uc.bucket] || 0) + 1;
    });
    return counts;
  }, [initialUseCases]);

  const filteredUseCases = useMemo(() => {
    return initialUseCases.filter((uc) => {
      const matchesBucket = selectedBucket === 'All' || uc.bucket === selectedBucket;
      if (!matchesBucket) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = uc.title.toLowerCase().includes(q);
      const inSummary = uc.short_summary.toLowerCase().includes(q);
      const inBuyer = uc.buyer.toLowerCase().includes(q);
      const inProblem = uc.business_problem.toLowerCase().includes(q);
      const inTools = [...uc.primary_tool_slugs, ...uc.alternative_tool_slugs].some((slug) =>
        slug.toLowerCase().includes(q)
      );

      return inTitle || inSummary || inBuyer || inProblem || inTools;
    });
  }, [initialUseCases, selectedBucket, searchQuery]);

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Search Bar & Filter Bar */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search use cases by problem, tool (e.g. Clay, Smartlead), or buyer role..."
            aria-label="Search use cases"
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: '10px',
              border: '1.5px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              fontSize: '0.9375rem',
              outline: 'none',
              fontFamily: 'var(--body)',
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Bucket filter pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
          role="tablist"
          aria-label="GTM capability buckets"
        >
          {BUCKETS.map((b) => {
            const isSelected = selectedBucket === b.value;
            const count = bucketCounts[b.value] || 0;

            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedBucket(b.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid var(--brand)' : '1px solid var(--line)',
                  background: isSelected ? 'var(--brand)' : 'var(--bg)',
                  color: isSelected ? 'var(--brand-ink)' : 'var(--ink)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <span>{b.label}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--surface)',
                    color: isSelected ? 'var(--brand-ink)' : 'var(--muted)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Filter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>
          Showing <b>{filteredUseCases.length}</b> of {initialUseCases.length} operational blueprints
          {selectedBucket !== 'All' && <span> in <b>{selectedBucket}</b></span>}
          {searchQuery.trim() && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
        </div>

        {(selectedBucket !== 'All' || searchQuery.trim()) && (
          <button
            type="button"
            onClick={() => {
              setSelectedBucket('All');
              setSearchQuery('');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--brand)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px',
              textDecoration: 'underline',
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Use Cases */}
      {filteredUseCases.length === 0 ? (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
            No matching use cases found
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: '0 0 20px' }}>
            Try clearing your search query or switching to another GTM capability bucket.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSelectedBucket('All');
              setSearchQuery('');
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredUseCases.map((uc) => {
            const badge = getBucketBadgeStyle(uc.bucket);
            const effort = getEffortBadge(uc.effort_level);
            const builderHref = `/build-my-stack?goal=${uc.builder_query.goal}&buckets=${uc.builder_query.buckets}`;

            return (
              <article
                key={uc.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: `1px solid ${badge.borderColor}`,
                        ...badge,
                      }}
                    >
                      {uc.bucket}
                    </span>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        ...effort.style,
                      }}
                    >
                      {effort.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: '1.1875rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      margin: '0 0 10px',
                      color: 'var(--ink)',
                      letterSpacing: '-0.015em',
                    }}
                  >
                    <Link
                      href={`/use-cases/${uc.slug}`}
                      onClick={() => {
                        trackEvent('use_case_viewed', { slug: uc.slug, bucket: uc.bucket });
                      }}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {uc.title}
                    </Link>
                  </h2>

                  {/* Short summary */}
                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      margin: '0 0 16px',
                    }}
                  >
                    {uc.short_summary}
                  </p>

                  {/* Target Buyer & Time to Value */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '18px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>{uc.buyer}</span>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg)',
                        color: 'var(--muted)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Value: {uc.time_to_value}</span>
                    </div>
                  </div>

                  {/* Primary Tools List */}
                  <div style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--muted)',
                        marginBottom: '8px',
                      }}
                    >
                      Primary Verified Stack:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {uc.primary_tool_slugs.map((toolSlug) => (
                        <Link
                          key={toolSlug}
                          href={`/tools/${toolSlug}`}
                          onClick={() => {
                            trackEvent('use_case_tool_clicked', {
                              use_case: uc.slug,
                              tool: toolSlug,
                            });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'var(--bg)',
                            color: 'var(--ink)',
                            border: '1px solid var(--line)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {toolSlug}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href={`/use-cases/${uc.slug}`}
                    onClick={() => {
                      trackEvent('use_case_viewed', { slug: uc.slug, bucket: uc.bucket });
                    }}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--brand)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View Blueprint →
                  </Link>

                  <Link
                    href={builderHref}
                    onClick={() => {
                      trackEvent('use_case_stack_started', {
                        slug: uc.slug,
                        goal: uc.builder_query.goal,
                      });
                    }}
                    className="btn btn-ghost"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                    }}
                  >
                    Build Stack ↗
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
