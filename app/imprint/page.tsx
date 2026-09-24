import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Imprint (Legal Notice) — GTM Shelf',
  description: 'Legal notice and statutory company information for GTM Shelf and GPTify.',
  alternates: {
    canonical: '/imprint',
  },
};

export default function ImprintPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-muted)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-text)] font-medium">
              Imprint
            </li>
          </ol>
        </nav>

        <header className="mb-10 border-b border-[var(--color-border)] pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Imprint (Legal Notice)
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Information in accordance with statutory provider identification requirements.
          </p>
        </header>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-[var(--color-text)]">
          <section className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-[var(--color-muted)] text-xs mb-1">
                Website Operator
              </h2>
              <p className="font-semibold text-base text-[var(--color-text)]">
                GPTify (GPTify.co)
              </p>
              <p className="text-[var(--color-muted)] mt-1">
                Pragmatic B2B AI Workflow Consultancy &amp; Systems Builder
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Represented By
              </h3>
              <p className="text-[var(--color-text)] font-medium">
                Shukhrat Iskandarov, Founder
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Contact Information
              </h3>
              <p className="text-[var(--color-text)]">
                Email:{' '}
                <a href="mailto:hello@gptify.co" className="text-[var(--color-primary)] font-mono hover:underline">
                  hello@gptify.co
                </a>{' '}
                / <a href="mailto:legal@gtmshelf.com" className="text-[var(--color-primary)] font-mono hover:underline">
                  legal@gtmshelf.com
                </a>
              </p>
              <p className="text-[var(--color-text)] mt-1">
                Website:{' '}
                <a href="https://gptify.co" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-mono hover:underline">
                  https://gptify.co
                </a>
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Responsible for Editorial Content
              </h3>
              <p className="text-[var(--color-text)]">
                Shukhrat Iskandarov
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold">Dispute Resolution</h2>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              The European Commission provides a platform for online dispute resolution (ODR):{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
                https://ec.europa.eu/consumers/odr/
              </a>. We are neither obligated nor willing to participate in dispute settlement proceedings before a consumer arbitration board.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
