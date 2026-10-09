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
                Targeted B2B Readership
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Visitors explore GTMShelf to evaluate software combinations, integrations, and operational workflows for revenue and marketing teams.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pillar 02</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                Workflow Context
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Tools are presented in operational context alongside relevant CRMs and adjacent software components rather than isolated listings.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pillar 03</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                Co-Marketing Options
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Opportunity to propose joint workflow playbooks and technical deep-dives across our B2B subscriber network.
              </p>
            </div>
          </section>

          {/* Partnership Models */}
          <section style={{ marginBottom: '56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
                Partnership Inventory &amp; Engagement Models
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: 0 }}>
                Organic inclusion is strictly editorial and free. Paid sponsorships provide labeled visibility and do not alter independent algorithmic recommendations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Model 1: Affiliate & Co-Marketing */}
              <div style={{ padding: '32px', background: '#ffffff', border: '1px solid var(--line)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Model 01</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px', color: 'var(--ink)' }}>
                    Affiliate &amp; Referral Program
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
                    For vendors with active affiliate networks seeking verified referral tracking across our public directory pages.
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    <li>Verified product profile with accurate CRM compatibility tags</li>
                    <li>Transparent partner attribution links with standard disclosures</li>
                    <li>Objective inclusion in directory categories (neutral editorial review)</li>
                    <li>Periodic data accuracy verification for pricing and features</li>
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  Performance-based referral links • Standard editorial review
                </div>
              </div>

              {/* Model 2: Growth & Sponsored Architecture */}
              <div style={{ padding: '32px', background: 'var(--surface)', border: '2px solid var(--brand)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-11px', right: '20px', background: 'var(--brand)', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                  Sponsored Slot
                </span>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Model 02</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px', color: 'var(--ink)' }}>
                    Sponsored Category Inventory
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
                    For software vendors seeking prominent, clearly disclosed banner visibility across designated category header inventory.
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    <li>Prominent &quot;Sponsored Partner&quot; header banner in target category</li>
                    <li>Direct inbound click tracking and transparent monthly impression reporting</li>
                    <li>Optional add-on: Editorial evaluation for case study feature (agreed per campaign)</li>
                    <li>Optional add-on: Sponsored technical integration guide (agreed per campaign)</li>
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '0.8125rem', color: 'var(--brand)', fontWeight: 600 }}>
                  Limited inventory: Maximum 2 sponsored slots per category
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
