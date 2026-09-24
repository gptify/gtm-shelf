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
          <h1 id="h1">
            Pick the AI tool for the stage <span className="hl">where your funnel leaks.</span>
          </h1>
          <p className="lede">
            A curated directory of AI tools built only for <strong>sales and marketing</strong>. Browse by funnel stage or answer a few questions to get three picks. Run by <strong>GPTify</strong>.
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
            <span>Not sure where to start?</span> <Link href="/find" className="btn btn-ghost">Find my tools</Link>
          </p>
        </div>
      </div>

      <div className="hero-funnel">{children}</div>
    </section>
  );
}
