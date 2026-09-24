import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use — GTM Shelf',
  description: 'Terms of Use for GTM Shelf: directory terms, editorial disclosures, and acceptable use guidelines.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="wrap">
      <Header />

      <main className="page prose-page" id="main-content">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Terms of Use</li>
          </ol>
        </nav>

        <header>
          <h1>Terms of Use</h1>
          <p className="lede">
            Last updated: September 2026. Terms and conditions governing the use of GTM Shelf.
          </p>
        </header>

        <div>
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Agreement to Terms</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              By accessing or using <strong>GTM Shelf</strong> (<a href="https://gtmshelf.com" className="text-[var(--color-primary)]">gtmshelf.com</a>), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the directory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. Nature of the Directory</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              GTM Shelf is an independent software directory and decision-support guide for B2B sales and marketing technology. We describe software tools using public vendor documentation, press materials, and our own independent editorial research. Unless explicitly stated, we are not affiliated with or endorsed by any vendor listed on this site.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Information provided in listings, guides, and finder results is for general informational purposes only and does not constitute technical, financial, or legal advice. Pricing, features, and API limits change frequently; always confirm exact terms directly with the software vendor before purchasing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. Paid Placements &amp; Affiliate Links</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Certain listings on GTM Shelf may be sponsored by vendors. All paid placements are prominently and explicitly labelled with a &quot;Sponsored&quot; badge and use <code className="font-mono text-xs">rel=&quot;sponsored&quot;</code> attributes. Paid status does not influence our Tool Finder ranking algorithm, organic category ordering, or editorial reviews.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Some outbound links may be affiliate links through which GTM Shelf earns a referral commission at no additional cost to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Custom AI Workflows by GPTify.co</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              GTM Shelf is operated by <strong>GPTify.co</strong>, which designs and builds custom AI automations and workflows. Submitting a request through our <Link href="/custom" className="text-[var(--color-primary)] hover:underline">Custom Build form</Link> does not create a binding contract; any commercial engagement is agreed upon separately in a formal written scope of work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">5. Vendor Submissions</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              When submitting a software tool via our <Link href="/submit" className="text-[var(--color-primary)] hover:underline">Submit Tool form</Link>, you represent and warrant that the submitted details are accurate. We reserve the absolute right to edit descriptions for clarity, reject unverified submissions, or remove listings at our editorial discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">6. Acceptable Use</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              You agree not to engage in malicious activities, including scraping that disrupts site performance, automated form spamming, attempting to circumvent security guardrails, or submitting false data.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
