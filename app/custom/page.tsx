import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CustomBuildForm } from '@/components/CustomBuildForm';

export const metadata: Metadata = {
  title: 'Request a Custom AI Build — GTM Shelf',
  description: 'When off-the-shelf tools fall short, GPTify.co designs and builds custom AI automations and bespoke GTM workflows tailored to your exact stack.',
  alternates: {
    canonical: '/custom',
  },
  openGraph: {
    title: 'Request a Custom AI Build — GTM Shelf',
    description: 'When off-the-shelf tools fall short, GPTify.co designs and builds custom AI automations and bespoke GTM workflows tailored to your exact stack.',
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
        <header className="page-center" style={{ maxWidth: '820px' }}>
          <span className="badge-pill">
            Bespoke GTM Automations &amp; Advisory
          </span>
          <h1 style={{ margin: '10px 0' }}>
            Talk to Us — Request a Custom Build or Stack Audit
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '44em', textWrap: 'pretty' }}>
            Need an AI workflow connected directly to your proprietary CRM, custom outbound triggers, or internal database? Tell us what you need and our team will review your stack within 1 business day.
          </p>
        </header>

        {/* Form Container */}
        <CustomBuildForm />
      </main>

      <Footer />
    </div>
  );
}
