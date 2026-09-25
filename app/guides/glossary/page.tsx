import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'B2B Sales & Marketing AI Glossary — GTM Shelf',
  description: 'Plain-English definitions and practical use cases for 21 essential AI and modern revenue concepts, with direct links to vetted software tools.',
  alternates: {
    canonical: '/guides/glossary',
  },
  openGraph: {
    title: 'B2B Sales & Marketing AI Glossary — GTM Shelf',
    description: 'Plain-English definitions and practical use cases for 21 essential AI and modern revenue concepts, with direct links to vetted software tools.',
    url: '/guides/glossary',
    siteName: 'GTM Shelf',
  },
};

interface GlossaryTerm {
  term: string;
  stageGroup: 'Attract' | 'Prospect' | 'Engage' | 'Close' | 'Grow' | 'Cross-Cutting';
  definition: string;
  usedFor: string;
  linkUrl: string;
  linkLabel: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Attract
  {
    term: 'ICP (Ideal Customer Profile)',
    stageGroup: 'Attract',
    definition: 'A defined description of the type of company most likely to buy and succeed with your product — industry, size, tech stack, and role.',
    usedFor: 'Setting targeting criteria for outbound tools, enrichment workflows, and paid ad campaigns.',
    linkUrl: '/stage/attract',
    linkLabel: 'Attract Stage Tools',
  },
  {
    term: 'ABM (Account-Based Marketing)',
    stageGroup: 'Attract',
    definition: 'A go-to-market approach that targets a defined list of named high-value accounts with coordinated marketing and sales effort, instead of broad lead generation.',
    usedFor: 'Focusing pipeline budget on a smaller number of high-value target companies.',
    linkUrl: '/stage/attract',
    linkLabel: 'ABM & Targeting Tools',
  },
  {
    term: 'Lookalike audience',
    stageGroup: 'Attract',
    definition: 'An ad-targeting audience built by matching the characteristics and firmographics of your existing best customers to find similar prospects.',
    usedFor: 'Scaling paid acquisition and inbound reach without manually rebuilding targeting criteria.',
    linkUrl: '/stage/attract',
    linkLabel: 'Paid & Targeting Tools',
  },
  {
    term: 'Sales enablement content',
    stageGroup: 'Attract',
    definition: 'AI tools that generate or surface the right case study, one-pager, deck, or battlecard for a specific deal or objection in real time, rather than reps searching a shared drive.',
    usedFor: 'Making sure sales reps use current, approved material instead of outdated decks.',
    linkUrl: '/stage/attract',
    linkLabel: 'Content & Enablement Tools',
  },

  // Prospect
  {
    term: 'Intent data',
    stageGroup: 'Prospect',
    definition: 'Signals — website visits, content downloads, search behavior, review-site activity — that show a company is actively researching a purchase before they fill out a form.',
    usedFor: 'Prioritizing which accounts to reach out to first instead of working a flat, unranked list.',
    linkUrl: '/stage/prospect',
    linkLabel: 'Intent & Prospecting Tools',
  },
  {
    term: 'Lead scoring',
    stageGroup: 'Prospect',
    definition: 'A method (often AI-assisted) for ranking inbound leads by how likely they are to convert, based on firmographic fit, tech stack match, and behavior.',
    usedFor: 'Telling reps which of 500 inbound leads to call first.',
    linkUrl: '/stage/prospect',
    linkLabel: 'Lead Scoring & Routing Tools',
  },
  {
    term: 'Enrichment',
    stageGroup: 'Prospect',
    definition: 'Filling in missing data on a lead or account — company size, tech stack, revenue, verified contact details — usually pulled from third-party databases.',
    usedFor: 'Making a thin CRM record usable for personalization and intelligent routing.',
    linkUrl: '/stage/prospect',
    linkLabel: 'Enrichment Tools',
  },
  {
    term: 'Buying signals',
    stageGroup: 'Prospect',
    definition: 'Specific, observable events that indicate purchase intent — a pricing-page visit, a competitor comparison search, or a champion changing jobs.',
    usedFor: 'Timing outbound outreach to when a prospect is actually receptive.',
    linkUrl: '/stage/prospect',
    linkLabel: 'Buying Signal & Intent Tools',
  },
  {
    term: 'Waterfall enrichment',
    stageGroup: 'Prospect',
    definition: 'Querying multiple data providers in sequence (cheapest or most reliable first) to fill a data field, falling back to the next source only if the first misses.',
    usedFor: 'Maximizing match rates on contact and company data while controlling API credit cost.',
    linkUrl: '/stage/prospect',
    linkLabel: 'Waterfall Enrichment Tools',
  },

  // Prospect / Engage
  {
    term: 'AI SDR agent',
    stageGroup: 'Engage',
    definition: 'Software that performs outbound prospecting tasks autonomously — account research, personalized outreach, follow-up sequencing — with minimal human input per lead.',
    usedFor: 'Scaling outbound volume and pipeline coverage without proportionally scaling headcount.',
    linkUrl: '/stage/engage',
    linkLabel: 'AI SDR & Outreach Tools',
  },
  {
    term: 'Email sequencing',
    stageGroup: 'Engage',
    definition: 'A pre-built series of outbound emails (and sometimes calls or LinkedIn touches) sent automatically on a schedule, often with branching logic based on replies.',
    usedFor: 'Running consistent outbound cadences across a whole team without manual follow-up friction.',
    linkUrl: '/stage/engage',
    linkLabel: 'Outreach & Sequencing Tools',
  },
  {
    term: 'Deliverability / email warm-up',
    stageGroup: 'Engage',
    definition: 'The practice (and supporting tools) of gradually increasing sending volume from a new domain or mailbox to build sender reputation and avoid spam filters.',
    usedFor: 'Ensuring cold outbound sequences land reliably in the primary inbox.',
    linkUrl: '/stage/engage',
    linkLabel: 'Deliverability Tools',
  },
  {
    term: 'Meeting intelligence',
    stageGroup: 'Engage',
    definition: 'Tools that record, transcribe, and analyze sales calls — automatically surfacing action items, customer objections, and talk-time ratios.',
    usedFor: 'Coaching reps and capturing what was actually said without manual note-taking.',
    linkUrl: '/stage/engage',
    linkLabel: 'Meeting Intelligence Tools',
  },
  {
    term: 'Conversation intelligence',
    stageGroup: 'Engage',
    definition: 'Broader than per-call meeting notes — analyzes patterns across hundreds of customer calls to surface trends, common objections, win/loss language, and competitor mentions.',
    usedFor: 'Informing positioning, messaging, and sales enablement at the organizational level.',
    linkUrl: '/stage/engage',
    linkLabel: 'Conversation Intelligence Tools',
  },

  // Close
  {
    term: 'MEDDIC',
    stageGroup: 'Close',
    definition: 'A structured B2B sales qualification framework (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion) used to assess deal health.',
    usedFor: 'Scoring deal pipeline and qualification health systematically before sales forecast calls.',
    linkUrl: '/stage/close',
    linkLabel: 'Deal Inspection Tools',
  },
  {
    term: 'Forecasting (AI deal scoring)',
    stageGroup: 'Close',
    definition: 'Predictive models that estimate a deal\'s close probability and likely close date from CRM activity, email engagement, and stage velocity — distinct from subjective rep gut-feel.',
    usedFor: 'Giving sales leaders early warnings on deals at risk of stalling or slipping out of quarter.',
    linkUrl: '/stage/close',
    linkLabel: 'AI Forecasting Tools',
  },
  {
    term: 'Proposal / quote automation',
    stageGroup: 'Close',
    definition: 'Generating pricing proposals, contracts, or order forms automatically from CRM deal data instead of building them manually in a spreadsheet each time.',
    usedFor: 'Cutting the lag between a verbal agreement and a signed contract in front of the buyer.',
    linkUrl: '/stage/close',
    linkLabel: 'Proposal & CPQ Tools',
  },

  // Grow
  {
    term: 'Churn prediction',
    stageGroup: 'Grow',
    definition: 'Predictive models that flag customer accounts likely to cancel or downsell, based on product usage drop-off, support tickets, or declining login frequency.',
    usedFor: 'Giving customer success teams time to proactively intervene before a renewal is at risk.',
    linkUrl: '/stage/grow',
    linkLabel: 'Retention & CS Tools',
  },
  {
    term: 'Customer health score',
    stageGroup: 'Grow',
    definition: 'A composite metric — usage telemetry, support ticket history, executive engagement, and survey feedback — used to rank which accounts need attention first.',
    usedFor: 'Prioritizing a customer success team\'s limited bandwidth across a large book of business.',
    linkUrl: '/stage/grow',
    linkLabel: 'Customer Success Tools',
  },
  {
    term: 'Expansion / upsell signals',
    stageGroup: 'Grow',
    definition: 'Usage patterns — approaching seat or credit limits, heavy adoption of an advanced feature — that indicate an account is ready for an upgrade or add-on.',
    usedFor: 'Timing upsell conversations to when the customer is actively deriving value, rather than on an arbitrary renewal schedule.',
    linkUrl: '/stage/grow',
    linkLabel: 'Expansion & Lifecycle Tools',
  },

  // Cross-Cutting
  {
    term: 'CRM sync',
    stageGroup: 'Cross-Cutting',
    definition: 'The two-way automated pipeline between point solutions and your primary CRM (HubSpot, Salesforce) so enrichment, activity, and notes stay consistent in one system of record.',
    usedFor: 'Eliminating manual double-entry and keeping reps working out of a single source of truth.',
    linkUrl: '/find',
    linkLabel: 'Filter Tools by CRM Integration',
  },
];

export default function GlossaryPage() {
  return (
    <div className="wrap">
      <Header />

      <main className="page" id="main-content">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Glossary</li>
          </ol>
        </nav>

        <header style={{ marginBottom: '32px' }}>
          <span className="badge-pill">Operational Knowledge Base</span>
          <h1 style={{ margin: '12px 0 8px' }}>
            B2B Sales &amp; Marketing AI Glossary
          </h1>
          <p className="lede" style={{ maxWidth: '42em', textWrap: 'pretty' }}>
            21 modern revenue and AI concepts defined in plain English. Every entry includes a real operational use case and a direct link to vetted software in the directory.
          </p>
        </header>

        {/* Glossary Quick Stage Jump */}
        <section style={{ marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Jump to Stage:
          </span>
          {['Attract', 'Prospect', 'Engage', 'Close', 'Grow', 'Cross-Cutting'].map((stg) => (
            <a
              key={stg}
              href={`#stage-${stg.toLowerCase()}`}
              className="chip"
              style={{ textDecoration: 'none', padding: '4px 12px', fontSize: '0.8125rem' }}
            >
              {stg}
            </a>
          ))}
        </section>

        {/* Glossary Terms List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px', margin: '0 auto' }}>
          {['Attract', 'Prospect', 'Engage', 'Close', 'Grow', 'Cross-Cutting'].map((stageGroup) => {
            const termsInGroup = GLOSSARY_TERMS.filter((t) => t.stageGroup === stageGroup);
            if (termsInGroup.length === 0) return null;

            return (
              <div key={stageGroup} id={`stage-${stageGroup.toLowerCase()}`} style={{ scrollMarginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {stageGroup} Stage Terms
                  </h2>
                  <span className="count-pill">{termsInGroup.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {termsInGroup.map((item) => (
                    <article
                      key={item.term}
                      style={{
                        padding: '20px 24px',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        background: 'var(--surface)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                          {item.term}
                        </h3>
                        <span className="badge-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {item.stageGroup}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
                        {item.definition}
                      </p>

                      <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                        <strong style={{ color: 'var(--ink)' }}>Used for:</strong> <em>{item.usedFor}</em>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        <Link
                          href={item.linkUrl}
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          → {item.linkLabel}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Newsletter Signup at end of Guide section */}
        <NewsletterSignup placement="guide" />
      </main>

      <Footer />
    </div>
  );
}
