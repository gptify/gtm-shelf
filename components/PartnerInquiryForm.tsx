'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export function PartnerInquiryForm() {
  const [vendorName, setVendorName] = useState('');
  const [toolName, setToolName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('Outbound');
  const [track, setTrack] = useState('Affiliate & Co-Marketing');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !toolName.trim() || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vendorName.trim() || toolName.trim(),
          email: contactEmail.trim(),
          what: `[PARTNER APPLICATION] Tool: ${toolName.trim()} (${websiteUrl.trim()}) | Track: ${track} | Category: ${category} | Notes: ${notes.trim()}`,
          source: 'partners_page',
          tools_used: toolName.trim(),
          team_size: 'Vendor Team',
          budget: track,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        trackEvent('custom_request', { type: 'partner_inquiry', track });
      } else {
        setErrorMsg('Failed to submit application. Please check your information and try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again or contact us directly at gptify.co@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '36px', background: 'var(--brand-soft)', border: '1px solid var(--line)', borderRadius: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', margin: '0 0 10px' }}>
          ✓ Application Received
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: '0 0 16px', lineHeight: 1.5 }}>
          Thank you for applying. Our editorial and partnerships team will inspect {toolName} against our evaluation rubric and follow up with you at <strong>{contactEmail}</strong> within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
        Apply for Vendor Partnership
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Join 50+ vetted AI tools evaluated by operators across B2B sales and marketing.
      </p>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Your Name
          </label>
          <input
            type="text"
            required
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Work Email
          </label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="alex@company.com"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Tool / Product Name
          </label>
          <input
            type="text"
            required
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="e.g. Clay / Instantly / Lindy"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Tool Website URL
          </label>
          <input
            type="url"
            required
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourproduct.ai"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Primary GTM Capability
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem', background: '#fff' }}
          >
            <option value="Inbound">Inbound (Content, SEO, Ads)</option>
            <option value="Outbound">Outbound (Email, Prospecting, AI SDRs)</option>
            <option value="Lead Capture">Lead Capture (Chat, Conversion, Intent)</option>
            <option value="Data & Orchestration">Data &amp; Orchestration (CRM, Enrichment)</option>
            <option value="Agentic Operations">Agentic Operations (Call Intelligence, Meeting AI)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Preferred Partnership Model
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem', background: '#fff' }}
          >
            <option value="Affiliate & Co-Marketing">Affiliate &amp; Co-Marketing Partnership</option>
            <option value="Growth & Sponsored Architecture">Growth &amp; Sponsored Architecture</option>
            <option value="Bespoke Workflow Integration">Bespoke Workflow Integration (via GPTify.co)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
          Brief Description &amp; What makes your product distinctive
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tell us about your core differentiators, verified integrations, and target customer profile..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.875rem', resize: 'vertical' }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ width: '100%', padding: '12px 20px', fontSize: '0.9375rem', fontWeight: 600 }}
      >
        {submitting ? 'Submitting Application...' : 'Submit Partnership Application →'}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', margin: '14px 0 0' }}>
        Editorial policy: Submitting an inquiry does not guarantee featured listing. All tools undergo technical validation.
      </p>
    </form>
  );
}
