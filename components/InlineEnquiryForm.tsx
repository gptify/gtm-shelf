'use client';

import { useState, useId } from 'react';

interface InlineEnquiryFormProps {
  title?: string;
  subtitle?: string;
  source?: string;
  defaultMessage?: string;
  buttonText?: string;
}

export function InlineEnquiryForm({
  title = 'Talk to us',
  subtitle = 'Send us your enquiry and our team will get back to you within 1 business day.',
  source = 'direct',
  defaultMessage = '',
  buttonText = 'Send Enquiry →',
}: InlineEnquiryFormProps) {
  const formId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [hpField, setHpField] = useState(''); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMsg = message.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    if (cleanMsg.length < 15) {
      setErrorMsg('Please provide a brief description (at least 15 characters).');
      return;
    }

    if (cleanMsg.length > 800) {
      setErrorMsg('Message is too long (maximum 800 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          what: cleanMsg,
          hp_field: hpField,
          source,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '32px 24px',
          borderRadius: '14px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--brand-soft)',
            color: 'var(--brand)',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 14px',
          }}
        >
          ✓
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
          Enquiry Received!
        </h3>
        <p style={{ margin: '0 auto 16px', fontSize: '0.875rem', color: 'var(--muted)', maxWidth: '32em', lineHeight: 1.5 }}>
          Thank you, <strong style={{ color: 'var(--ink)' }}>{name}</strong>. We received your note and will review your workflow requirements within 1 business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="btn btn-ghost"
          style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '28px',
        borderRadius: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Hidden Honeypot */}
        <input
          type="text"
          name="hp_field"
          value={hpField}
          onChange={(e) => setHpField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label
              htmlFor={`${formId}-name`}
              style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}
            >
              Your Name *
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              required
              placeholder="Alex Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--ink)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-email`}
              style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}
            >
              Work Email *
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--ink)',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor={`${formId}-message`}
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}
          >
            How can we help? *
          </label>
          <textarea
            id={`${formId}-message`}
            required
            rows={3}
            placeholder="Tell us about the workflows you want to automate, tools you currently use, or questions about your AI setup..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1.5px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              fontSize: '0.875rem',
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
          <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>
            Minimum 15 characters. All enquiries are reviewed privately.
          </span>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#dc2626',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px 18px', fontSize: '0.9375rem', fontWeight: 700 }}
        >
          {submitting ? 'Sending Enquiry...' : buttonText}
        </button>
      </form>
    </div>
  );
}
