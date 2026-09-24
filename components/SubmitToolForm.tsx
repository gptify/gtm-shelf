'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stage, Category } from '@/lib/types';

interface SubmitToolFormProps {
  stages: Stage[];
  categories: Category[];
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
    if (availableCategories.length > 0 && !availableCategories.some((c) => c.name === categoryName)) {
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
    if (!url.trim()) {
      errs.url = 'Enter a full web address, like https://example.com.';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          errs.url = 'Enter a valid URL with http:// or https://.';
        }
      } catch {
        errs.url = 'Enter a full web address, like https://example.com.';
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
          website_url: url.trim(),
          stage_id: stageId,
          category_name: categoryName,
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
      <div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)] flex items-center justify-center text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-2xl font-bold mb-2">Tool Submitted!</h2>
        <p className="text-[var(--color-muted)] leading-relaxed mb-6">
          Thank you for submitting <span className="font-semibold text-[var(--color-text)]">{name}</span>. Our editorial team reviews every listing against vendor documentation before publication.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            ← Back to Directory
          </Link>
          <button
            type="button"
            onClick={() => {
              setName('');
              setUrl('');
              setTagline('');
              setDescription('');
              setSubmitted(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
          >
            Submit Another Tool
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[var(--color-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] shadow-sm max-w-2xl mx-auto"
      noValidate
    >
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
          {serverError}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tool_name" className="block text-sm font-semibold mb-1.5">
            Tool name <span className="text-red-500">*</span>
          </label>
          <input
            id="tool_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
            }`}
            placeholder="e.g. Clay"
          />
          {errors.name && (
            <span className="block mt-1 text-xs text-red-500 font-medium">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-semibold mb-1.5">
            Website URL <span className="text-red-500">*</span>
          </label>
          <input
            id="website_url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.url ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
            }`}
            placeholder="https://example.com"
          />
          {errors.url && (
            <span className="block mt-1 text-xs text-red-500 font-medium">
              {errors.url}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stage_select" className="block text-sm font-semibold mb-1.5">
            Funnel stage <span className="text-red-500">*</span>
          </label>
          <select
            id="stage_select"
            value={stageId}
            onChange={(e) => setStageId(Number(e.target.value))}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.hint})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category_select" className="block text-sm font-semibold mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category_select"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="pricing_model" className="block text-sm font-semibold mb-1.5">
          Pricing model <span className="text-red-500">*</span>
        </label>
        <select
          id="pricing_model"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="Free plan">Free plan (has a meaningful free tier)</option>
          <option value="Paid">Paid (starts with a fixed monthly or annual price)</option>
          <option value="Custom quote">Custom quote (talk to sales / enterprise pricing)</option>
        </select>
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-semibold mb-1.5">
          One-line summary (tagline) <span className="text-red-500">*</span>
        </label>
        <input
          id="tagline"
          type="text"
          maxLength={90}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            errors.tagline ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
          }`}
          placeholder="e.g. Scale 1:1 outbound personalization using AI research"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[var(--color-muted)]">
            {tagline.length} / 90 characters
          </span>
          {errors.tagline && (
            <span className="text-xs text-red-500 font-medium">
              {errors.tagline}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold mb-1.5">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Key features, standout differentiators, and who gets the most value from it."
        />
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]">
        <label htmlFor="contact_email" className="block text-sm font-semibold mb-1.5">
          Your contact email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            errors.contactEmail ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
          }`}
          placeholder="you@example.com"
        />
        {errors.contactEmail && (
          <span className="block mt-1 text-xs text-red-500 font-medium">
            {errors.contactEmail}
          </span>
        )}
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Used only to verify the listing or ask clarifying questions. Never published or shared.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="is_vendor"
          checked={isVendor}
          onChange={(e) => setIsVendor(e.target.checked)}
          className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4"
        />
        <label htmlFor="is_vendor" className="text-sm">
          I represent this vendor / maker team
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-6 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 shadow-sm"
        >
          {submitting ? 'Submitting tool...' : 'Submit Tool for Review →'}
        </button>
        <p className="text-center text-xs text-[var(--color-muted)] mt-3">
          Submissions are reviewed by our team and checked against source documentation before being published.
        </p>
      </div>
    </form>
  );
}
