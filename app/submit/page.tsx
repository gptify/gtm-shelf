import type { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, CATEGORIES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SubmitToolForm } from '@/components/SubmitToolForm';

export const metadata: Metadata = {
  title: 'Submit a Tool — GTM Shelf',
  description: 'Submit an AI tool built for sales or marketing to be reviewed and listed on GTM Shelf.',
  alternates: {
    canonical: '/submit',
  },
  openGraph: {
    title: 'Submit a Tool — GTM Shelf',
    description: 'Submit an AI tool built for sales or marketing to be reviewed and listed on GTM Shelf.',
    url: '/submit',
    siteName: 'GTM Shelf',
  },
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-muted)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-text)] font-medium">
              Submit Tool
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-stage-engage-tint,#e8f0fe)] text-[var(--color-primary)]">
            Community & Vendor Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 mb-3">
            Submit an AI Tool
          </h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed">
            Know a great AI tool for sales or marketing that should be listed? Or represent a vendor? Submit it here for editorial review and fact-checking.
          </p>
        </header>

        <SubmitToolForm stages={STAGES} categories={CATEGORIES} />
      </main>

      <Footer />
    </div>
  );
}
