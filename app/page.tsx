import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="wrap" id="main-content">
      <header className="top">
        <Link href="/" className="brand" aria-label="GTM Shelf home">
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
            <rect x="0" y="8" width="8" height="12" rx="2" fill="var(--brand)" />
            <path d="M2.5 13.5L4.5 15.5L7 11.5" stroke="var(--brand-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="10" y="4" width="8" height="16" rx="2" fill="var(--brand)" fillOpacity="0.4" />
            <rect x="20" y="0" width="8" height="20" rx="2" fill="var(--brand)" fillOpacity="0.2" />
            <line x1="0" y1="23" x2="28" y2="23" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>
            <b>GTM</b> Shelf
          </span>
        </Link>
        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/find" className="btn btn-ghost">
            Find my tools
          </Link>
          <Link href="/submit" className="btn btn-primary">
            Submit a tool
          </Link>
        </nav>
      </header>

      <main style={{ paddingBlock: '48px', maxWidth: '720px' }}>
        <h1>
          Pick the AI tool for the stage <span className="hl">where your funnel leaks.</span>
        </h1>
        <p className="lede">
          A curated directory of AI tools built only for <strong>sales and marketing</strong>. Browse by funnel stage or answer a few questions to get three picks. Run by <strong>GPTify</strong>.
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px', marginBlock: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 12px' }}>Project Scaffold Status (Step 1)</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Next.js App Router scaffolded with TypeScript and self-hosted fonts</li>
            <li>Design system tokens and responsive layouts integrated</li>
            <li>Pure finder module ported to <code>lib/finder/</code> with 10/10 automated tests passing</li>
            <li>Postgres database schema (<code>db/schema.sql</code>) verified against authentic PostgreSQL engine</li>
            <li>Reference and draft tool seed data validated</li>
            <li>Anti-bloat, strict YAGNI, and no tracking cookies configured</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
