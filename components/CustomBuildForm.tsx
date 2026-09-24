'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PrefillData {
  goal: string;
  need: string;
  q: string;
  crm: string;
  team: string;
}

function QueryPrefill({
  onPrefill,
}: {
  onPrefill: (data: {
    what: string;
    tools_used: string;
    team_size: string;
    hasPrefill: boolean;
    meta: PrefillData;
  }) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const goal = searchParams.get('goal') || '';
    const need = searchParams.get('need') || '';
    const q = searchParams.get('q') || '';
    const crm = searchParams.get('crm') || '';
    const team = searchParams.get('team') || '';

    const has = Boolean(goal || need || q || crm || team);
    if (!has) return;

    const parts = [];
    if (need) parts.push(`Primary need: ${need}`);
    if (goal) parts.push(`Goal: ${goal}`);
    if (q) parts.push(`Search keyword: ${q}`);
    if (crm) parts.push(`Current CRM: ${crm}`);

    let teamSize = '';
    if (team === 'solo') teamSize = 'Just me (1)';
    if (team === 'small') teamSize = 'Small team (2–10)';
    if (team === 'mid') teamSize = 'Growing team (11–50)';

    onPrefill({
      what: parts.join('\n'),
      tools_used: crm ? `CRM: ${crm}` : '',
      team_size: teamSize,
      hasPrefill: true,
      meta: { goal, need, q, crm, team },
    });
  }, [searchParams, onPrefill]);

  return null;
}

export function CustomBuildForm() {
  const [formData, setFormData] = useState({
    what: '',
    tools_used: '',
    team_size: '',
    budget: '',
    timing: '',
    language: 'English',
    name: '',
    email: '',
    hp_field: '', // Honeypot
  });

  const [prefillMeta, setPrefillMeta] = useState<PrefillData | null>(null);
  const [prefillShown, setPrefillShown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handlePrefillData(data: {
    what: string;
    tools_used: string;
    team_size: string;
    hasPrefill: boolean;
    meta: PrefillData;
  }) {
    setFormData((prev) => ({
      ...prev,
      what: prev.what || data.what,
      tools_used: prev.tools_used || data.tools_used,
      team_size: prev.team_size || data.team_size,
    }));
    setPrefillMeta(data.meta);
    setPrefillShown(true);
  }

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
          source: prefillMeta ? (prefillMeta.q ? 'search' : 'finder') : 'direct',
          prefill: prefillMeta || null,
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
      <div className="form-success">
        <div className="check">✓</div>
        <h2>Request Received!</h2>
        <p>
          Thank you, <strong style={{ color: 'var(--ink)' }}>{formData.name}</strong>. Our team at GPTify.co will review your workflow requirements and reach out within 1 business day.
        </p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            ← Back to Directory
          </Link>
          <Link href="/find" className="btn btn-ghost">
            Try the Tool Finder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <QueryPrefill onPrefill={handlePrefillData} />
      </Suspense>

      <form onSubmit={handleSubmit} className="form-box" noValidate>
        {prefillShown && (
          <div className="form-banner info">
            <span>Prefilled from your finder answers. Edit anything you like.</span>
            <button
              type="button"
              onClick={() => setPrefillShown(false)}
              style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}


      {errorMsg && (
        <div className="form-banner error">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Honeypot field */}
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
      <div className="field">
        <label htmlFor="what">
          What should the AI workflow or tool do? <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <span className="hint">
          Describe the manual bottleneck, the sales/marketing task, and desired outcome (15–800 characters).
        </span>
        <textarea
          id="what"
          name="what"
          rows={4}
          maxLength={800}
          value={formData.what}
          onChange={handleChange}
          aria-describedby={fieldErrors.what ? 'what-error' : 'what-hint'}
          className={fieldErrors.what ? 'err' : ''}
          placeholder="e.g. Automatically enrich inbound demo requests with company tech stack data, verify work emails, and draft personalized SDR intro sequences into HubSpot."
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span className="hint">{formData.what.length} / 800 characters</span>
          {fieldErrors.what && <span className="err">{fieldErrors.what}</span>}
        </div>
      </div>

      {/* Tools used */}
      <div className="field">
        <label htmlFor="tools_used">
          Current tools in your stack (optional)
        </label>
        <input
          type="text"
          id="tools_used"
          name="tools_used"
          value={formData.tools_used}
          onChange={handleChange}
          placeholder="e.g. HubSpot, Apollo, Slack, Google Workspace"
        />
      </div>

      {/* Team Size & Budget */}
      <div className="two">
        <div className="field">
          <label htmlFor="team_size">Team size</label>
          <select
            id="team_size"
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
          >
            <option value="">Select team size</option>
            <option value="Just me (1)">Just me (1)</option>
            <option value="Small team (2–10)">Small team (2–10)</option>
            <option value="Growing team (11–50)">Growing team (11–50)</option>
            <option value="Scale (51–200)">Scale (51–200)</option>
            <option value="Enterprise (200+)">Enterprise (200+)</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="budget">Project budget</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
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
      <div className="two">
        <div className="field">
          <label htmlFor="timing">When do you need this?</label>
          <select
            id="timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
          >
            <option value="">Select timing</option>
            <option value="Immediately">Immediately (within 2 weeks)</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="1–3 months">1–3 months</option>
            <option value="Exploring options">Exploring options</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="language">Communication language</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="English">English</option>
            <option value="Uzbek">O&apos;zbek tili</option>
          </select>
        </div>
      </div>

      {/* Contact Info: Name & Email */}
      <div className="two" style={{ paddingTop: '8px', borderTop: '1px solid var(--line)' }}>
        <div className="field">
          <label htmlFor="name">
            Your name <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={fieldErrors.name ? 'err' : ''}
            placeholder="e.g. Alex Smith"
          />
          {fieldErrors.name && <span className="err">{fieldErrors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">
            Work email <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={fieldErrors.email ? 'err' : ''}
            placeholder="alex@company.com"
          />
          {fieldErrors.email && <span className="err">{fieldErrors.email}</span>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px 24px', fontSize: '1rem' }}
        >
          {submitting ? 'Submitting request...' : 'Submit Custom Build Request →'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '.8125rem', color: 'var(--muted)', marginTop: '12px' }}>
          No spam, no vendor lists. Reviewed by GPTify.co engineers. Response within 1 business day.
        </p>
      </div>
    </form>
    </>
  );
}
