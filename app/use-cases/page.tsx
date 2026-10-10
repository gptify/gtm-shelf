import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getAllUseCases } from '@/lib/use-cases';
import { UseCasesDirectoryClient } from '@/components/UseCasesDirectoryClient';

export const metadata: Metadata = {
  title: 'GTM Use-Case Library • 18 B2B Revenue Workflows and AI Stacks | GTM Shelf',
  description:
    'Explore 18 pragmatic B2B go-to-market operational blueprints. Step-by-step workflows for waterfall enrichment, inbound lead routing, signal prospecting, and autonomous CRM sync.',
  alternates: {
    canonical: '/use-cases',
  },
  openGraph: {
    title: 'GTM Use-Case Library • 18 B2B Revenue Workflows and AI Stacks | GTM Shelf',
    description:
      'From revenue bottlenecks to working software stacks. Explore 18 operational GTM blueprints with human approval checkpoints and suggested tool configurations.',
    url: 'https://gtmshelf.com/use-cases',
    siteName: 'GTM Shelf',
  },
};

export default function UseCasesPage() {
  const useCases = getAllUseCases();

  // Structured Data (Schema.org CollectionPage / ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GTM Use-Case Library: 18 Operational Revenue Blueprints',
    description:
      'Curated operational blueprints matching common B2B revenue problems to suggested software stacks and step-by-step implementation workflows.',
    url: 'https://gtmshelf.com/use-cases',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: useCases.map((uc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://gtmshelf.com/use-cases/${uc.slug}`,
        name: uc.title,
        description: uc.short_summary,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap" id="main-content">
        <Header />

        <main style={{ paddingBottom: '64px' }}>
          {/* Hero Header */}
          <section
            style={{
              padding: '48px 0 24px',
              textAlign: 'center',
              maxWidth: '840px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                borderRadius: '999px',
                background: 'var(--brand-soft)',
                border: '1px solid var(--line)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--brand)',
                marginBottom: '18px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--brand)',
                }}
              />
              18 Operational GTM Blueprints
            </div>

            <h1
              style={{
                font: '800 clamp(2.2rem, 4.8vw, 3.5rem)/1.1 var(--display)',
                letterSpacing: '-0.025em',
                margin: '0 0 18px',
                color: 'var(--ink)',
              }}
            >
              From Revenue Bottlenecks to <mark className="hl">Working AI Stacks</mark>
            </h1>

            <p
              style={{
                font: '400 1.125rem/1.65 var(--body)',
                color: 'var(--muted)',
                margin: '0 auto 28px',
                maxWidth: '680px',
              }}
            >
              Stop buying disconnected point solutions. Map your immediate revenue problems to
              pragmatic step-by-step workflows, human review checkpoints, data privacy guardrails, and
              suggested tool configurations from our curated 50-tool catalog.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '28px',
              }}
            >
              <Link
                href="/build-my-stack"
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.9375rem' }}
              >
                Build My GTM Stack →
              </Link>
              <Link
                href="/stacks"
                className="btn btn-ghost"
                style={{ padding: '12px 24px', fontSize: '0.9375rem' }}
              >
                Browse Curated Stacks
              </Link>
            </div>

            {/* Cross-link contextual box */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '0.8125rem',
                color: 'var(--muted)',
                lineHeight: 1.5,
                textAlign: 'left',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '720px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                Need broader AI frameworks or team enablement? Explore our research partner{' '}
                <a
                  href="https://gptify.co/ai-use-case-library/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}
                >
                  GPTify Use-Case Library ↗
                </a>{' '}
                for organizational strategy, then use GTMShelf to select and price the exact tooling.
              </span>
            </div>
          </section>

          {/* Interactive Client Directory */}
          <UseCasesDirectoryClient initialUseCases={useCases} />

          {/* Bottom Newsletter & Resources */}
          <section style={{ marginTop: '64px' }}>
            <NewsletterSignup placement="guide" />
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
