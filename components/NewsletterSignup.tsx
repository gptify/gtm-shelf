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
        maxWidth: '1040px',
      }}
      aria-labelledby="newsletter-section-heading"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Card 1: Email Newsletter (Similar to gptify.co) */}
        <div
          style={{
            padding: '32px 28px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="badge-pill" style={{ marginBottom: '12px', display: 'inline-block' }}>
              Weekly Briefing
            </span>
            <h2
              id="newsletter-section-heading"
              style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}
            >
              Stay Ahead of the AI Revolution
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Get practical AI workflows, vetted B2B sales stacks, and prompt breakdowns delivered to your inbox every week. No fluff, just operational mechanics.
            </p>

            <form onSubmit={handleSubmit} noValidate>
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
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: '1 1 200px',
                    padding: '12px 14px',
                    fontSize: '0.9rem',
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
                  style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  {submitting ? 'Subscribing...' : 'Subscribe Free →'}
                </button>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.78125rem',
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
                  I agree to receive weekly AI intel. Double opt-in: we will send a confirmation link first. Unsubscribe anytime.
                </span>
              </label>

              {message && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
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
          </div>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78125rem',
              color: 'var(--muted)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span>✓ Zero spam</span>
            <span>✓ 1-click unsubscribe</span>
            <span>✓ Curated by GPTify.co</span>
          </div>
        </div>

        {/* Card 2: LinkedIn Edition (Directly mirroring gptify.co community block) */}
        <div
          style={{
            padding: '32px 28px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              className="badge-pill"
              style={{
                marginBottom: '12px',
                display: 'inline-block',
                background: 'rgba(10, 102, 194, 0.12)',
                color: '#0a66c2',
                borderColor: 'rgba(10, 102, 194, 0.25)',
              }}
            >
              LinkedIn Edition
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Join Our LinkedIn Community
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Prefer reading on LinkedIn? Read our bi-weekly edition and connect with 30,000+ B2B revenue leaders, AI practitioners, and growth engineers.
            </p>

            {/* Social Proof Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                margin: '20px 0',
              }}
            >
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)' }}>30,000+</div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--muted)', marginTop: '2px' }}>LinkedIn Followers</div>
              </div>
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)' }}>15,000+</div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--muted)', marginTop: '2px' }}>Newsletter Readers</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            <a
              href="https://www.linkedin.com/newsletters/stay-ahead-of-ai-revolution-7050278857534238720/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                flex: '1 1 180px',
                textAlign: 'center',
                textDecoration: 'none',
                background: '#0a66c2',
                borderColor: '#0a66c2',
                color: '#fff',
                fontSize: '0.875rem',
                padding: '11px 16px',
              }}
            >
              Subscribe on LinkedIn ↗
            </a>
            <a
              href="https://www.linkedin.com/company/92931267/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                flex: '1 1 120px',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '0.875rem',
                padding: '11px 16px',
              }}
            >
              Follow Page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
