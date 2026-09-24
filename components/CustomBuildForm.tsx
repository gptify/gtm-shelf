'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function CustomBuildForm() {
  const searchParams = useSearchParams();

  // Prefill extraction
  const prefillGoal = searchParams.get('goal') || '';
  const prefillNeed = searchParams.get('need') || '';
  const prefillQ = searchParams.get('q') || '';
  const prefillCrm = searchParams.get('crm') || '';
  const prefillTeam = searchParams.get('team') || '';

  const hasPrefill = Boolean(prefillGoal || prefillNeed || prefillQ || prefillCrm || prefillTeam);

  // Initial what construction
  const initialWhat = (() => {
    const parts = [];
    if (prefillNeed) parts.push(`Primary need: ${prefillNeed}`);
    if (prefillGoal) parts.push(`Goal: ${prefillGoal}`);
    if (prefillQ) parts.push(`Search keyword: ${prefillQ}`);
    if (prefillCrm) parts.push(`Current CRM: ${prefillCrm}`);
    return parts.length > 0 ? parts.join('\n') : '';
  })();

  const initialTeamSize = (() => {
    if (prefillTeam === 'solo') return 'Just me (1)';
    if (prefillTeam === 'small') return 'Small team (2–10)';
    if (prefillTeam === 'mid') return 'Growing team (11–50)';
    return '';
  })();

  const [formData, setFormData] = useState({
    what: initialWhat,
    tools_used: prefillCrm ? `CRM: ${prefillCrm}` : '',
    team_size: initialTeamSize,
    budget: '',
    timing: '',
    language: 'English',
    name: '',
    email: '',
    hp_field: '', // Honeypot
  });

  const [prefillShown, setPrefillShown] = useState(hasPrefill);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hasPrefill) {
      setFormData((prev) => ({
        ...prev,
        what: prev.what || initialWhat,
        tools_used: prev.tools_used || (prefillCrm ? `CRM: ${prefillCrm}` : ''),
        team_size: prev.team_size || initialTeamSize,
      }));
    }
  }, [hasPrefill, initialWhat, prefillCrm, initialTeamSize]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    // Client validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid work email address.';
    }
    if (formData.what.trim().length < 15) {
      errors.what = 'Please describe your requirements (at least 15 characters).';
    } else if (formData.what.trim().length > 800) {
      errors.what = 'Description is too long (maximum 800 characters).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: hasPrefill ? (prefillQ ? 'search' : 'finder') : 'direct',
          prefill: hasPrefill
            ? { goal: prefillGoal, need: prefillNeed, q: prefillQ, crm: prefillCrm, team: prefillTeam }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)] flex items-center justify-center text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
        <p className="text-[var(--color-muted)] leading-relaxed mb-6">
          Thank you, <span className="font-semibold text-[var(--color-text)]">{formData.name}</span>. Our team at GPTify will review your workflow requirements and reach out within 1 business day.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            ← Back to Directory
          </Link>
          <Link
            href="/find"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
          >
            Try the Tool Finder
          </Link>
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
      {prefillShown && (
        <div className="p-4 rounded-xl bg-[var(--color-stage-engage-tint,#e8f0fe)] border border-[var(--color-primary)]/20 text-xs text-[var(--color-primary)] flex items-center justify-between">
          <span>Prefilled from your finder answers. Edit anything you like.</span>
          <button
            type="button"
            onClick={() => setPrefillShown(false)}
            className="font-bold hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="hp_field">Leave this empty</label>
        <input
          type="text"
          id="hp_field"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
          value={formData.hp_field}
          onChange={handleChange}
        />
      </div>

      {/* What it should do */}
      <div>
        <label htmlFor="what" className="block text-sm font-semibold mb-1.5">
          What should the AI workflow or tool do? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-[var(--color-muted)] mb-2">
          Describe the manual bottleneck, the sales/marketing task, and desired outcome (15–800 characters).
        </p>
        <textarea
          id="what"
          name="what"
          rows={4}
          maxLength={800}
          value={formData.what}
          onChange={handleChange}
          aria-describedby={fieldErrors.what ? 'what-error' : 'what-hint'}
          className={`w-full p-3 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            fieldErrors.what ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
          }`}
          placeholder="e.g. Automatically enrich inbound demo requests with company tech stack data, verify work emails, and draft personalized SDR intro sequences into HubSpot."
        />
        <div className="flex justify-between items-center mt-1">
          <span id="what-hint" className="text-xs text-[var(--color-muted)]">
            {formData.what.length} / 800 characters
          </span>
          {fieldErrors.what && (
            <span id="what-error" className="text-xs text-red-500 font-medium">
              {fieldErrors.what}
            </span>
          )}
        </div>
      </div>

      {/* Tools used */}
      <div>
        <label htmlFor="tools_used" className="block text-sm font-semibold mb-1.5">
          Current tools in your stack (optional)
        </label>
        <input
          type="text"
          id="tools_used"
          name="tools_used"
          value={formData.tools_used}
          onChange={handleChange}
          className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="e.g. HubSpot, Apollo, Slack, Google Workspace"
        />
      </div>

      {/* Team Size & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="team_size" className="block text-sm font-semibold mb-1.5">
            Team size
          </label>
          <select
            id="team_size"
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Select team size</option>
            <option value="Just me (1)">Just me (1)</option>
            <option value="Small team (2–10)">Small team (2–10)</option>
            <option value="Growing team (11–50)">Growing team (11–50)</option>
            <option value="Scale (51–200)">Scale (51–200)</option>
            <option value="Enterprise (200+)">Enterprise (200+)</option>
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-semibold mb-1.5">
            Project budget
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Select budget range</option>
            <option value="Under $2,000">Under $2,000</option>
            <option value="$2,000 – $5,000">$2,000 – $5,000</option>
            <option value="$5,000 – $15,000">$5,000 – $15,000</option>
            <option value="$15,000+">$15,000+</option>
          </select>
        </div>
      </div>

      {/* Timing & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="timing" className="block text-sm font-semibold mb-1.5">
            When do you need this?
          </label>
          <select
            id="timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Select timing</option>
            <option value="Immediately">Immediately (within 2 weeks)</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="1–3 months">1–3 months</option>
            <option value="Exploring options">Exploring options</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-semibold mb-1.5">
            Communication language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="English">English</option>
            <option value="Uzbek">O'zbek tili</option>
          </select>
        </div>
      </div>

      {/* Contact Info: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
            Your name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
            }`}
            placeholder="e.g. Alex Smith"
          />
          {fieldErrors.name && (
            <span id="name-error" className="block mt-1 text-xs text-red-500 font-medium">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            Work email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={`w-full p-2.5 rounded-lg border bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
            }`}
            placeholder="alex@company.com"
          />
          {fieldErrors.email && (
            <span id="email-error" className="block mt-1 text-xs text-red-500 font-medium">
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-6 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 shadow-sm"
        >
          {submitting ? 'Submitting request...' : 'Submit Custom Build Request →'}
        </button>
        <p className="text-center text-xs text-[var(--color-muted)] mt-3">
          No spam, no vendor lists. Reviewed by GPTify engineers. Response within 1 business day.
        </p>
      </div>
    </form>
  );
}
