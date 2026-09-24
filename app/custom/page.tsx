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
    <div className="wrap">
      <Header />

      <main className="page" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Custom Build</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="page-center">
          <span className="badge-pill">
            Bespoke GTM Automations
          </span>
          <h1 style={{ margin: '10px 0' }}>
            Request a Custom AI Build
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '36em' }}>
            Need an AI workflow connected directly to your proprietary CRM, custom outbound triggers, or internal database? Tell us what you need and our team at GPTify will review your stack.
          </p>
        </header>

        {/* Form Container with Suspense for query parameter prefilling */}
        <Suspense
          fallback={
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: '.9375rem' }}>
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
