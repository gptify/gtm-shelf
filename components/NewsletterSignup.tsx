'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [hpField, setHpField] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setMessage({ text: 'Please enter a valid work email address.', type: 'error' });
      return;
    }

    if (!consent) {
      setMessage({ text: 'Please check the consent box to receive updates.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          source: 'homepage_newsletter',
          hp_field: hpField,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe.');
      }

      setMessage({
        text: 'Check your inbox! We sent a confirmation link. Click it to confirm your subscription.',
        type: 'success',
      });
      setEmail('');
      setConsent(false);
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({
        text: error.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      style={{
        margin: '64px auto 32px',
        padding: '36px 32px',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        background: 'var(--surface)',
        maxWidth: '820px',
      }}
      aria-labelledby="newsletter-heading"
    >
      <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
        <span className="badge-pill">Weekly GTM Intel</span>
        <h2 id="newsletter-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
          Get the Weekly AI Stack Briefing
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          Every week, we break down one real AI workflow, test new tools added to the shelf, and audit pipeline bottlenecks. No vendor fluff, just pragmatic B2B mechanics.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '24px', maxWidth: '540px', margin: '24px auto 0' }} noValidate>
        {/* Honeypot field */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            value={hpField}
            onChange={(e) => setHpField(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: '1 1 280px',
              padding: '12px 16px',
              fontSize: '0.9375rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              outline: 'none',
            }}
            aria-label="Work email address"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.9375rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {submitting ? 'Subscribing...' : 'Subscribe Free →'}
          </button>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '0.8125rem',
            color: 'var(--muted)',
            marginTop: '12px',
            cursor: 'pointer',
            lineHeight: 1.4,
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
            required
          />
          <span>
            Send me weekly updates on new AI tools for sales and marketing. Double opt-in: we will send a confirmation link first. Unsubscribe anytime.
          </span>
        </label>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              textAlign: 'center',
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#059669' : '#dc2626',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
            role="status"
          >
            {message.text}
          </div>
        )}
      </form>
    </section>
  );
}
