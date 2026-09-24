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
            <li aria-current="page">Submit Tool</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="page-center">
          <span className="badge-pill">
            Community & Vendor Submissions
          </span>
          <h1 style={{ margin: '10px 0' }}>
            Submit an AI Tool
          </h1>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '36em' }}>
            Know a great AI tool for sales or marketing that should be listed? Or represent a vendor? Submit it here for editorial review and fact-checking.
          </p>
        </header>

        <SubmitToolForm stages={STAGES} categories={CATEGORIES} />
      </main>

      <Footer />
    </div>
  );
}
