'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stage, Category } from '@/lib/types';

interface SubmitToolFormProps {
  stages: Stage[];
  categories: Category[];
}

function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

export function SubmitToolForm({ stages, categories }: SubmitToolFormProps) {
  const [stageId, setStageId] = useState<number>(stages[0]?.id || 1);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [pricing, setPricing] = useState('Free plan');
  const [categoryName, setCategoryName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const availableCategories = categories.filter((c) => c.stage_id === stageId);

  useEffect(() => {
    if (stageId === 0) {
      setCategoryName('Other / Not sure');
    } else if (availableCategories.length > 0 && !availableCategories.some((c) => c.name === categoryName) && categoryName !== 'Other / Not sure') {
      setCategoryName(availableCategories[0].name);
    }
  }, [stageId, availableCategories, categoryName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Honeypot check
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Enter the tool name.';

    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      errs.url = 'Enter a web address, like example.com or https://example.com.';
    } else {
      try {
        const parsed = new URL(normalizedUrl);
        if (!parsed.hostname || !parsed.hostname.includes('.')) {
          errs.url = 'Enter a valid web address, like example.com or https://example.com.';
        }
      } catch {
        errs.url = 'Enter a valid web address, like example.com or https://example.com.';
      }
    }

    if (!tagline.trim()) {
      errs.tagline = 'Add a one-line summary.';
    } else if (tagline.trim().length > 90) {
      errs.tagline = 'Summary must be 90 characters or fewer.';
    }
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      errs.contactEmail = 'Enter an email address we can reach you at.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setServerError(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          website_url: normalizedUrl,
          stage_id: stageId === 0 ? null : stageId,
          category_name: categoryName || 'Other / Not sure',
          pricing_model: pricing,
          tagline: tagline.trim(),
          description: description.trim(),
          contact_email: contactEmail.trim(),
          is_vendor: isVendor,
          hp_field: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit tool.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-success">
        <div className="check">✓</div>
        <h2>Tool Submitted!</h2>
        <p>
          Thank you for submitting <strong style={{ color: 'var(--ink)' }}>{name}</strong>. Our editorial team will review your submission against vendor documentation and get back to you{contactEmail ? <> at <strong style={{ color: 'var(--ink)' }}>{contactEmail}</strong></> : null} within 1 business day.
        </p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            ← Back to Directory
          </Link>
          <button
            type="button"
            onClick={() => {
              setName('');
              setUrl('');
              setTagline('');
              setDescription('');
              setContactEmail('');
              setSubmitted(false);
            }}
            className="btn btn-ghost"
          >
            Submit Another Tool
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-box" noValidate>
      {serverError && (
        <div className="form-banner error">
          <span>{serverError}</span>
        </div>
      )}

      {/* Honeypot */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="submit_hp">Leave this empty</label>
        <input
          type="text"
          id="submit_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="tool_name">
            Tool name <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="tool_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'err' : ''}
            placeholder="e.g. Clay"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="website_url">
            Website URL <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="website_url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={errors.url ? 'err' : ''}
            placeholder="example.com or https://example.com"
            aria-invalid={Boolean(errors.url)}
          />
          {errors.url && <span className="err">{errors.url}</span>}
        </div>
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="stage_select">
            Funnel stage <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <select
            id="stage_select"
            value={stageId}
            onChange={(e) => {
              const val = Number(e.target.value);
              setStageId(val);
              if (val === 0) {
                setCategoryName('Other / Not sure');
              }
            }}
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.hint})
              </option>
            ))}
            <option value={0}>Other / Not sure</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="category_select">
            Category <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <select
            id="category_select"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          >
            {stageId === 0 ? (
              <option value="Other / Not sure">Other / Not sure</option>
            ) : (
              <>
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="Other / Not sure">Other / Not sure</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="pricing_model">
          Pricing model <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          id="pricing_model"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
        >
          <option value="Free plan">Free plan (has a meaningful free tier)</option>
          <option value="Paid">Paid (starts with a fixed monthly or annual price)</option>
          <option value="Custom quote">Custom quote (talk to sales / enterprise pricing)</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="tagline">
          One-line summary (tagline) <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id="tagline"
          type="text"
          maxLength={90}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={errors.tagline ? 'err' : ''}
          placeholder="e.g. Scale 1:1 outbound personalization using AI research"
          aria-invalid={Boolean(errors.tagline)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span className="hint">{tagline.length} / 90 characters</span>
          {errors.tagline && <span className="err">{errors.tagline}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key features, standout differentiators, and who gets the most value from it."
        />
      </div>

      <div className="field" style={{ paddingTop: '8px', borderTop: '1px solid var(--line)' }}>
        <label htmlFor="contact_email">
          Your contact email <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className={errors.contactEmail ? 'err' : ''}
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.contactEmail)}
        />
        {errors.contactEmail && <span className="err">{errors.contactEmail}</span>}
        <span className="hint">
          Used only to verify the listing or ask clarifying questions. Never published or shared.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 20px' }}>
        <input
          type="checkbox"
          id="is_vendor"
          checked={isVendor}
          onChange={(e) => setIsVendor(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--brand)' }}
        />
        <label htmlFor="is_vendor" style={{ fontSize: '.9375rem', cursor: 'pointer' }}>
          I represent this vendor / maker team
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px 24px', fontSize: '1rem' }}
        >
          {submitting ? 'Submitting tool...' : 'Submit Tool for Review →'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '.8125rem', color: 'var(--muted)', marginTop: '12px' }}>
          Submissions are reviewed by our team and checked against source documentation before being published.
        </p>
      </div>
    </form>
  );
}
