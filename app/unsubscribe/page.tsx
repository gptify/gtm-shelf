import type { Metadata } from 'next';
import Link from 'next/link';
import { unsubscribeLead } from '@/lib/leads';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Unsubscribe — GTM Shelf',
  description: 'Unsubscribe from GTM Shelf email updates.',
  robots: {
    index: false,
    follow: false,
  },
};

interface UnsubscribePageProps {
  searchParams: { token?: string; email?: string };
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const tokenOrEmail = searchParams.token || searchParams.email;
  let unsubscribed = false;

  if (tokenOrEmail) {
    unsubscribed = await unsubscribeLead(tokenOrEmail);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 py-16 w-full flex items-center justify-center">
        <div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center shadow-sm w-full">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-muted)] flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
            Unsubscribed
          </h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed mb-8">
            {unsubscribed
              ? 'You have been successfully removed from our email list. You will no longer receive updates from GTM Shelf.'
              : 'Your email address has been unsubscribed from all future GTM Shelf communications.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            ← Return to Directory
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
