import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — GTM Shelf',
  description: 'Our commitment to privacy: no tracking cookies, no third-party ad networks, hashed IP rate limiting, and double opt-in subscriber lists.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
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
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        <header>
          <h1>Privacy Policy</h1>
          <p className="lede">
            Last updated: September 2026. How GTM Shelf protects your data and adheres to privacy principles.
          </p>
        </header>

        <div>
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Who We Are</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              <strong>GTM Shelf</strong> (<a href="https://gtmshelf.com" className="text-[var(--color-primary)]">gtmshelf.com</a>) is operated by <strong>GPTify.co</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). You can contact us regarding privacy inquiries at <a href="mailto:privacy@gtmshelf.com" className="font-mono text-[var(--color-primary)]">privacy@gtmshelf.com</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. Data We Collect and Why</h2>
            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      <th className="p-3">Data</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Legal Basis (GDPR)</th>
                      <th className="p-3">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    <tr>
                      <td className="p-3 font-medium">Email &amp; finder answers</td>
                      <td className="p-3 text-[var(--color-muted)]">To send your personalized tool picks and optional weekly AI updates</td>
                      <td className="p-3 text-[var(--color-muted)]">Consent (Double opt-in)</td>
                      <td className="p-3 text-[var(--color-muted)]">Until unsubscribed</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Custom build requests</td>
                      <td className="p-3 text-[var(--color-muted)]">To review project requirements and reply with a scope estimate</td>
                      <td className="p-3 text-[var(--color-muted)]">Pre-contractual steps &amp; legitimate interest</td>
                      <td className="p-3 text-[var(--color-muted)]">24 months</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Tool submissions</td>
                      <td className="p-3 text-[var(--color-muted)]">To fact-check and verify listings with submitters/vendors</td>
                      <td className="p-3 text-[var(--color-muted)]">Legitimate interest</td>
                      <td className="p-3 text-[var(--color-muted)]">24 months</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Hashed IP addresses</td>
                      <td className="p-3 text-[var(--color-muted)]">Abuse prevention and rate limiting (never stored in plain text)</td>
                      <td className="p-3 text-[var(--color-muted)]">Security &amp; legitimate interest</td>
                      <td className="p-3 text-[var(--color-muted)]">1 hour in memory</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[var(--color-muted)] font-medium pt-1">
              We never sell your personal information, and we do not use third-party advertising trackers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. Cookies and Local Storage</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We do not use advertising or cross-site tracking cookies. We employ privacy-first, cookieless analytics that do not track individuals across the web.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Your browser stores a few small items in <code className="font-mono text-xs">localStorage</code> to remember your display preferences:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[var(--color-muted)]">
              <li><strong>Saved tools:</strong> Which tools you have bookmarked with the Save button.</li>
              <li><strong>View choice:</strong> Whether you prefer List, Grid, or Table view.</li>
              <li><strong>Theme:</strong> Your preference for Light or Dark mode.</li>
            </ul>
            <p className="text-[var(--color-muted)] leading-relaxed">
              These preferences stay entirely on your local machine and can be cleared at any time in your browser settings. Administrative staff login uses an encrypted HTTP-only session cookie.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Double Opt-in and Unsubscribe</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We practice strict double opt-in. When you request your tool recommendations, we send a verification email with a single-use token. We do not dispatch newsletter updates until you click to confirm. Every email contains a direct unsubscribe link, and you can visit our <Link href="/unsubscribe" className="text-[var(--color-primary)] hover:underline">unsubscribe page</Link> at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">5. Your Data Rights</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Under GDPR, UK GDPR, and applicable privacy laws, you have the right to request access to the personal data we hold about you, request corrections or complete deletion, object to processing, or withdraw consent. To exercise your rights, email us at <a href="mailto:privacy@gtmshelf.com" className="font-mono text-[var(--color-primary)]">privacy@gtmshelf.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
