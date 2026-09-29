'use client';

import Link from 'next/link';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export function Hero({ searchQuery, onSearchChange, children }: HeroProps) {
  const popularSearches = ['cold email', 'meeting notes', 'SEO', 'CRM'];

  return (
    <section className="hero" aria-labelledby="h1">
      <div className="hero-text">
        <div className="hero-intro">
          <div className="trust-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted)', background: 'var(--brand-soft)', border: '1px solid var(--line)', padding: '4px 12px', borderRadius: '999px', marginBottom: '14px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }}></span>
            50 vetted tools across 5 funnel stages • Zero vendor bias
          </div>
          <h1 id="h1">
            Find the right <mark className="hl">AI stack</mark><br className="desk-br" />{' '}
            for your GTM team.
          </h1>
          <p className="lede">
            Compare vetted AI tools for sales and marketing by workflow, pricing, integrations and funnel stage. Discover battle-tested stacks or build a tailored architecture.
          </p>
        </div>

        <div className="hero-action">
          <div className="search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="q"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, category, or workflow..."
              aria-label="Search AI tools by name, category, or workflow"
            />
          </div>

          <div className="try">
            <span>Popular searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearchChange(term)}
              >
                {term}
              </button>
            ))}
          </div>

          <p className="ctaline">
            <span>Discover stacks:</span>{' '}
            <Link href="/find" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
              Build My Stack
            </Link>
            <Link href="/stacks" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
              Explore Stacks
            </Link>
          </p>
        </div>
      </div>

      <div className="hero-funnel">{children}</div>
    </section>
  );
}
