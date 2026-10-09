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
            Discover the right <mark className="hl">AI tools</mark>.<br className="desk-br" />{' '}
            Build a smarter GTM stack.
          </h1>
          <p className="lede">
            Explore, compare, and connect AI-powered sales and marketing tools based on your goals, existing software, and budget.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', margin: '20px 0 24px' }}>
            <Link
              href="/build-my-stack"
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Build My GTM Stack →
            </Link>
            <Link
              href="/use-cases"
              className="btn btn-ghost"
              style={{ padding: '10px 20px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Explore 18 Use Cases ↗
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                const el = document.getElementById('tools-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '10px 20px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Browse 50 Tools
            </button>
          </div>
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
            <span>Pre-curated architectures:</span>{' '}
            <Link href="/stacks" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
              Explore Pre-built Stacks
            </Link>
          </p>
        </div>
      </div>

      <div className="hero-funnel">{children}</div>
    </section>
  );
}
