import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About GTM Shelf — Independent AI Directory for Revenue Teams',
  description: 'GTM Shelf is an independent directory of AI tools built exclusively for sales and marketing teams, organized by funnel stage and ranked without vendor pay-to-play.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About GTM Shelf — Independent AI Directory for Revenue Teams',
    description: 'GTM Shelf is an independent directory of AI tools built exclusively for sales and marketing teams, organized by funnel stage and ranked without vendor pay-to-play.',
    url: '/about',
    siteName: 'GTM Shelf',
  },
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <Header />

      <main className="page prose-page" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <span className="badge-pill">
            Our Mission & Editorial Code
          </span>
          <h1>Why We Built GTM Shelf</h1>
          <p className="lede">
            Choosing an AI tool for sales or marketing meant 40 open browser tabs, identical claims, hidden pricing, and pay-to-play rankings. We built GTM Shelf to change that.
          </p>
        </header>

        {/* Content */}
        <article>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">1. Funnel-First Organization</h2>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              Most software directories list tools in alphabetical heaps or by broad categories like &quot;Artificial Intelligence&quot;. Revenue teams don&apos;t think in generic categories — they think in bottlenecks along their revenue engine:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase block">Stage 1</span>
                <span className="font-bold text-sm block mt-1">Attract</span>
                <span className="text-xs text-[var(--color-muted)] mt-1 block">Content, SEO, ads</span>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase block">Stage 2</span>
                <span className="font-bold text-sm block mt-1">Prospect</span>
                <span className="text-xs text-[var(--color-muted)] mt-1 block">Lead data, intent</span>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase block">Stage 3</span>
                <span className="font-bold text-sm block mt-1">Engage</span>
                <span className="text-xs text-[var(--color-muted)] mt-1 block">Cold email, AI SDRs</span>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase block">Stage 4</span>
                <span className="font-bold text-sm block mt-1">Close</span>
                <span className="text-xs text-[var(--color-muted)] mt-1 block">Meeting notes, CRM</span>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase block">Stage 5</span>
                <span className="font-bold text-sm block mt-1">Grow</span>
                <span className="text-xs text-[var(--color-muted)] mt-1 block">Lifecycle, revenue</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">2. No Paid Rankings. Ever.</h2>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              We believe recommendation algorithms lose all value the moment they can be bought. Here are our non-negotiable rules:
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                <span><strong>Pure finder logic:</strong> The Tool Finder scores tools strictly against your goal, budget, team size, CRM, and technical bandwidth. Vendors cannot pay to appear or rank higher in finder results.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                <span><strong>Transparent labels:</strong> If a vendor purchases a sponsored slot, it is visibly marked with a &quot;Sponsored&quot; badge and clearly separated. It never alters organic directory order.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[var(--color-success,#137333)] font-bold">✓</span>
                <span><strong>Affiliate disclosures:</strong> When outbound links use affiliate tracking, it is openly disclosed on the page. Affiliate relationships never influence whether a tool is listed, recommended, or reviewed.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">3. Verified Data & Audit Trail</h2>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              Every published tool on GTM Shelf has been manually reviewed and verified against vendor documentation. We enforce database-level guardrails: no tool can be published without an audit timestamp (<code className="text-xs font-mono">verified_at</code>) and at least one public source URL proving its pricing, features, and integrations. Listings are re-audited every 90 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">4. Who Runs GTM Shelf</h2>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              GTM Shelf is operated by <strong>GPTify</strong> (<strong>GPTify.co</strong>), a pragmatic B2B AI workflow consultancy and systems builder, and founded by <strong>Shukhrat Iskandarov</strong>.
            </p>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              In our day-to-day client work auditing CRMs, designing outbound pipelines, and deploying AI workflows for sales teams, we needed an honest, fast, and unbloated reference for modern sales and marketing technology. When we couldn&apos;t find one, we built GTM Shelf for ourselves and made it freely available to the entire community.
            </p>
          </section>

          {/* CTA Box */}
          <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 not-prose mt-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Looking for custom AI automations?</h3>
              <p className="text-sm text-[var(--color-muted)] max-w-xl">
                When off-the-shelf tools don&apos;t fit your proprietary data or CRM workflows, our team at GPTify builds bespoke AI workflows and integrations.
              </p>
            </div>
            <Link
              href="/custom"
              className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              Request Custom Build →
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
