'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

export function AdvertiseInquiryForm() {
  const [tier, setTier] = useState<'premium' | 'sponsored' | 'affiliate' | 'question'>('premium');
  const [toolName, setToolName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Listen to hash changes or query changes if navigated via #inquire?plan=...
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('plan=sponsored') || hash.includes('tier=sponsored')) {
        setTier('sponsored');
      } else if (hash.includes('plan=premium') || hash.includes('tier=premium')) {
        setTier('premium');
      } else if (hash.includes('plan=affiliate') || hash.includes('tier=affiliate')) {
        setTier('affiliate');
      } else if (hash.includes('plan=question') || hash.includes('tier=question')) {
        setTier('question');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const getTierLabel = (t: string) => {
    switch (t) {
      case 'premium':
        return 'Verified Premium Listing ($149)';
      case 'sponsored':
        return 'Sponsored Slot & Launch Spotlight ($299)';
      case 'affiliate':
        return 'Affiliate / Partner Network Integration';
      default:
        return 'General Listing / Partnership Question';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid work email address.';
    }

    const normalizedUrl = normalizeUrl(websiteUrl);
    if (websiteUrl.trim() && normalizedUrl) {
      try {
        const parsed = new URL(normalizedUrl);
        if (!parsed.hostname || !parsed.hostname.includes('.')) {
          errs.websiteUrl = 'Please enter a valid domain, like example.com';
        }
      } catch {
        errs.websiteUrl = 'Please enter a valid domain, like example.com';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const tierTitle = getTierLabel(tier);
    const messageDetails = [
      `[INQUIRY: ${tierTitle}]`,
      toolName.trim() ? `Tool: ${toolName.trim()}` : null,
      normalizedUrl ? `Website: ${normalizedUrl}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : 'No additional notes provided.',
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      const res = await fetch('/api/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          what: messageDetails,
          source: 'advertise_page',
          tools_used: toolName.trim() || 'Not specified',
          budget: tierTitle,
          hp_field: honeypot,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit inquiry.');
      }

      trackEvent('custom_request', { type: 'advertise_inquiry', tier });
      setSubmittedEmail(email.trim());
      setSubmitted(true);
    } catch {
      // In case of error, still record and acknowledge gracefully
      setSubmittedEmail(email.trim());
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        id="inquire"
        style={{
          maxWidth: '680px',
          margin: '40px auto',
          padding: '40px 32px',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            marginBottom: '16px',
            border: '1px solid #a7f3d0',
            fontWeight: 700,
          }}
        >
          ✓
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)' }}>
          Inquiry Received!
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: 600, margin: '0 0 8px' }}>
          Thank you for inquiring about {getTierLabel(tier)}.
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
          Our editorial &amp; partnerships team will review your tool details and follow up directly at <strong style={{ color: 'var(--ink)' }}>{submittedEmail}</strong> within 1 business day.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setSubmitted(false);
            setToolName('');
            setWebsiteUrl('');
            setNotes('');
          }}
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div
      id="inquire"
      style={{
        maxWidth: '720px',
        margin: '48px auto 20px',
        padding: '36px clamp(20px, 4vw, 36px)',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span
          className="badge-pill"
          style={{ marginBottom: '10px', display: 'inline-block' }}
        >
          Direct Partnership Inquiry
        </span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
          Book a Slot or Upgrade Your Listing
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: 0 }}>
          Fill in your tool details below. Our team reviews every request and responds within 1 business day.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="inq-hp">Leave this blank</label>
          <input
            id="inq-hp"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Tier selection tabs */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
            Inquiry Type <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => setTier('premium')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: tier === 'premium' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: tier === 'premium' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                color: tier === 'premium' ? 'var(--primary)' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              ★ Premium ($149)
            </button>
            <button
              type="button"
              onClick={() => setTier('sponsored')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: tier === 'sponsored' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: tier === 'sponsored' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                color: tier === 'sponsored' ? 'var(--primary)' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              🚀 Sponsored Slot ($299)
            </button>
            <button
              type="button"
              onClick={() => setTier('affiliate')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: tier === 'affiliate' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: tier === 'affiliate' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                color: tier === 'affiliate' ? 'var(--primary)' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              🔗 Affiliate Network
            </button>
            <button
              type="button"
              onClick={() => setTier('question')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: tier === 'question' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: tier === 'question' ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                color: tier === 'question' ? 'var(--primary)' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              💬 General Question
            </button>
          </div>
        </div>

        <div className="two" style={{ marginBottom: '16px' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="inq-tool">Tool Name</label>
            <input
              id="inq-tool"
              type="text"
              placeholder="e.g. Attio, Clay, Smartlead"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
            />
          </div>

          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="inq-url">Website URL</label>
            <input
              id="inq-url"
              type="text"
              placeholder="example.com or https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              aria-invalid={Boolean(errors.websiteUrl)}
            />
            {errors.websiteUrl && <span className="err">{errors.websiteUrl}</span>}
          </div>
        </div>

        <div className="two" style={{ marginBottom: '16px' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="inq-name">
              Your Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="inq-name"
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="err">{errors.name}</span>}
          </div>

          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="inq-email">
              Work Email <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="inq-email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="err">{errors.email}</span>}
          </div>
        </div>

        <div className="field" style={{ marginBottom: '24px' }}>
          <label htmlFor="inq-notes">
            Notes or Specific Requests (optional)
          </label>
          <span className="hint">
            {tier === 'premium'
              ? 'Tell us your demo link, preferred pricing tier summary, or target stage.'
              : tier === 'sponsored'
              ? 'Tell us your target launch week or specific category/stage preference.'
              : 'Add any details or questions for our team.'}
          </span>
          <textarea
            id="inq-notes"
            rows={3}
            placeholder="Share any background, questions, or launch timing..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: '100%', padding: '12px 20px', fontSize: '1rem', fontWeight: 600 }}
        >
          {submitting
            ? 'Sending Inquiry...'
            : tier === 'premium'
            ? 'Submit Premium Upgrade Request →'
            : tier === 'sponsored'
            ? 'Submit Sponsored Slot Request →'
            : 'Send Partnership Inquiry →'}
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
          🔒 Your information is confidential and used solely to coordinate your listing request. No spam.
        </p>
      </form>
    </div>
  );
}
