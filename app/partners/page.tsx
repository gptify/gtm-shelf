import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { STAGES } from '@/lib/db/data';
import { PartnerInquiryForm } from '@/components/PartnerInquiryForm';

export const metadata: Metadata = {
  title: 'Partner with GTMShelf • Vendor Partnerships & Co-Marketing',
  description:
    'Put your AI sales or marketing tool in front of high-intent B2B operators, founders, and revenue architects actively building their software stacks.',
  alternates: {
    canonical: '/partners',
  },
  openGraph: {
    title: 'Partner with GTMShelf • Vendor Partnerships & Co-Marketing',
    description:
      'Put your AI tool in front of modern B2B operators actively building their software stacks.',
    url: '/partners',
    siteName: 'GTM Shelf',
  },
};

export default function PartnersPage() {
  return (
    <>
      <div className="wrap" id="main-content">
        <Header />

        <main style={{ padding: '40px 0 80px', maxWidth: '880px', margin: '0 auto' }}>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                borderRadius: '999px',
                background: 'var(--brand-soft)',
                border: '1px solid var(--line)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--brand)',
                marginBottom: '16px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }}></span>
              Vendor Partnerships &amp; Ecosystem Program
            </div>

            <h1
              style={{
                font: '800 clamp(2.2rem, 5vw, 3.25rem)/1.15 var(--display)',
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
                margin: '0 0 18px',
              }}
            >
              Get Discovered by Teams <mark className="hl">Building Their Stack</mark>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: 'var(--muted)',
                maxWidth: '680px',
                margin: '0 auto 28px',
              }}
            >
              GTMShelf is where founders, VPs of Sales, and growth architects come to design their AI software architecture. We cut through marketing hype to match real tools with real workflows.
            </p>
          </div>

          {/* Value Pillars */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '56px' }}>
            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pillar 01</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                High-Intent Operators
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Our traffic isn&apos;t casual hobbyists—it consists of verified sales leaders and operators with budget seeking immediate stack upgrades.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pillar 02</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                Contextual Stack Placement
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Your software isn&apos;t buried in an alphabetical list. It is surfaced contextually inside recommended workflow architectures.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pillar 03</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                GPTify Amplification
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Gain co-marketing reach through practical case studies and newsletter features published weekly across the GPTify.co network.
              </p>
            </div>
          </section>

          {/* Partnership Models */}
          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 20px', color: 'var(--ink)', textAlign: 'center' }}>
              Two Partnership Models
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Model 1: Affiliate & Co-Marketing */}
              <div style={{ padding: '32px', background: '#ffffff', border: '1px solid var(--line)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Model 01</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px', color: 'var(--ink)' }}>
                    Affiliate &amp; Co-Marketing
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
                    Ideal for established SaaS products with active affiliate or referral programs looking to expand verified distribution.
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    <li>Verified product profile with CRM integration tags</li>
                    <li>Eligible for algorithmic inclusion in Build My Stack</li>
                    <li>Direct partner link tracking with transparent disclosure</li>
                    <li>Community submission verification</li>
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  Performance-based • Standard review timeline
                </div>
              </div>

              {/* Model 2: Growth & Sponsored Architecture */}
              <div style={{ padding: '32px', background: 'var(--surface)', border: '2px solid var(--brand)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-11px', right: '20px', background: 'var(--brand)', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                  High Impact
                </span>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Model 02</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px', color: 'var(--ink)' }}>
                    Growth &amp; Sponsored Architecture
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
                    For ambitious AI vendors seeking marquee visibility, category leadership, and dedicated workflow positioning.
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    <li>Featured badge on homepage and category head</li>
                    <li>Priority placement in relevant Stack Architecture Blueprints</li>
                    <li>Dedicated case-study feature in GPTify.co newsletter</li>
                    <li>Custom Zapier / Webhook integration tutorial</li>
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '0.8125rem', color: 'var(--brand)', fontWeight: 600 }}>
                  Limited to 2 vendors per category per month
                </div>
              </div>
            </div>
          </section>

          {/* Editorial Integrity Guarantee */}
          <section
            style={{
              padding: '24px 28px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '56px',
              lineHeight: 1.5,
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
              Editorial Integrity Standard
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
              At GTMShelf, recommendations are strictly determined by software utility, integration depth, and budget fit. Paid sponsorships are clearly labeled as sponsored placements and never alter objective tool specifications or organic ranking algorithms.
            </p>
          </section>

          {/* Vendor Inquiry Form */}
          <PartnerInquiryForm />
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
