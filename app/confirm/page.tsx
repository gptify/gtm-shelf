import type { Metadata } from 'next';
import Link from 'next/link';
import { confirmLead } from '@/lib/leads';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Confirm Your Email — GTM Shelf',
  description: 'Confirm your email address to receive your curated AI tool picks from GTM Shelf.',
  robots: {
    index: false,
    follow: false,
  },
};

interface ConfirmPageProps {
  searchParams: { token?: string };
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const token = searchParams.token;
  let confirmed = false;

  if (token) {
    confirmed = await confirmLead(token);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 py-16 w-full flex items-center justify-center">
        <div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center shadow-sm w-full">
          {confirmed ? (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)] flex items-center justify-center text-3xl font-bold">
                ✓
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
                Your Email is Confirmed!
              </h1>
              <p className="text-base text-[var(--color-muted)] leading-relaxed mb-8">
                We've verified your email and dispatched your personalized AI tool picks to your inbox. You can unsubscribe at any time with a single click.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Explore Directory
                </Link>
                <Link
                  href="/guides"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  Browse Guides
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl font-bold">
                !
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
                Invalid or Expired Link
              </h1>
              <p className="text-base text-[var(--color-muted)] leading-relaxed mb-8">
                This confirmation link is invalid or has already been used. If you need your tool picks sent again, you can run the finder again at any time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/find"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Launch Tool Finder
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
