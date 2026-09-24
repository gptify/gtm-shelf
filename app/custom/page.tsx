import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CustomBuildForm } from '@/components/CustomBuildForm';

export const metadata: Metadata = {
  title: 'Request a Custom AI Build — GTM Shelf',
  description: 'When off-the-shelf tools fall short, GPTify designs and builds custom AI automations and bespoke GTM workflows tailored to your exact stack.',
  alternates: {
    canonical: '/custom',
  },
  openGraph: {
    title: 'Request a Custom AI Build — GTM Shelf',
    description: 'When off-the-shelf tools fall short, GPTify designs and builds custom AI automations and bespoke GTM workflows tailored to your exact stack.',
    url: '/custom',
    siteName: 'GTM Shelf',
  },
};

export default function CustomBuildPage() {
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
              Custom Build
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-stage-engage-tint,#e8f0fe)] text-[var(--color-primary)]">
            Bespoke GTM Automations
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 mb-3">
            Request a Custom AI Build
          </h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed">
            Need an AI workflow connected directly to your proprietary CRM, custom outbound triggers, or internal database? Tell us what you need and our team at GPTify will review your stack.
          </p>
        </header>

        {/* Form Container with Suspense for query parameter prefilling */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[var(--color-muted)]">
              Loading form...
            </div>
          }
        >
          <CustomBuildForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
