'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Category } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
  categories: Category[];
  onSubmitted: (toolName: string) => void;
}

function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

export function SubmitModal({
  isOpen,
  onClose,
  stages,
  categories,
  onSubmitted,
}: SubmitModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
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
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [submittedToolName, setSubmittedToolName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const availableCategories = categories.filter((c) => c.stage_id === stageId);

  useEffect(() => {
    if (stageId === 0) {
      setCategoryName('Other / Not sure');
    } else if (availableCategories.length > 0 && !availableCategories.some((c) => c.name === categoryName) && categoryName !== 'Other / Not sure') {
      setCategoryName(availableCategories[0].name);
    }
  }, [stageId, availableCategories, categoryName]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setUrl('');
    setTagline('');
    setDescription('');
    setContactEmail('');
    setIsVendor(false);
    setErrors({});
    setStageId(stages[0]?.id || 1);
    setSubmittedSuccessfully(false);
  };

  const handleClose = () => {
    if (submittedSuccessfully) {
      resetForm();
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Honeypot check
    if (honeypot) {
      setSubmittedToolName(name.trim() || 'Tool');
      setSubmittedEmail(contactEmail.trim());
      setSubmittedSuccessfully(true);
      onSubmitted(name);
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

    if (!tagline.trim()) errs.tagline = 'Add a one-line summary.';
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      errs.contactEmail = 'Enter an email address we can reach you at.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          website_url: normalizedUrl,
          stage_id: stageId === 0 ? null : stageId,
          category_name: categoryName || 'Other / Not sure',
          pricing_model: pricing === 'Free plan' ? 'free_plan' : pricing === 'Paid' ? 'paid' : 'custom_quote',
          tagline: tagline.trim(),
          description: description.trim() || tagline.trim(),
          contact_email: contactEmail.trim(),
          is_vendor: isVendor,
          hp_field: honeypot,
        }),
      });

      trackEvent('submit_tool', { tool: name.trim() });
      onSubmitted(name.trim());
      setSubmittedToolName(name.trim());
      setSubmittedEmail(contactEmail.trim());
      setSubmittedSuccessfully(true);
    } catch {
      setSubmittedToolName(name.trim());
      setSubmittedEmail(contactEmail.trim());
      setSubmittedSuccessfully(true);
      onSubmitted(name.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="submit"
      aria-labelledby="sb-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
    >
      <div className="sb">
        {submittedSuccessfully ? (
          <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
                border: '1px solid #a7f3d0',
                fontWeight: 700,
              }}
            >
              ✓
            </div>
            <h2 id="sb-title" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)' }}>
              Tool Submitted!
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: 600, margin: '0 0 8px' }}>
              Thank you for submitting <span style={{ color: 'var(--color-primary, #2F45E0)' }}>{submittedToolName}</span>.
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
              We review every listing against vendor documentation. Our editorial team will review your submission and get back to you{submittedEmail ? <> at <strong style={{ color: 'var(--ink)' }}>{submittedEmail}</strong></> : null} within 1 business day.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClose}
                style={{ minWidth: '120px' }}
              >
                Done
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSubmittedSuccessfully(false);
                  resetForm();
                }}
              >
                Submit Another Tool
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="sb-title">Submit a tool</h2>
            <p className="sub">
              Suggest an AI tool for sales or marketing. We review every tool against its own documentation before adding it.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot field */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="f-website-verify">Do not fill this</label>
                <input
                  id="f-website-verify"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="field">
                <label htmlFor="f-name">Tool name</label>
                <input
                  id="f-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Clay"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'e-name' : undefined}
                />
                {errors.name && (
                  <p className="err" id="e-name">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="f-url">Website URL</label>
                <input
                  id="f-url"
                  type="text"
                  placeholder="example.com or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-invalid={Boolean(errors.url)}
                  aria-describedby={errors.url ? 'e-url' : undefined}
                />
                {errors.url && (
                  <p className="err" id="e-url">
                    {errors.url}
                  </p>
                )}
              </div>

              <div className="two">
                <div className="field">
                  <label htmlFor="f-stage">Funnel stage</label>
                  <select
                    id="f-stage"
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
                        {s.id}. {s.name}
                      </option>
                    ))}
                    <option value={0}>Other / Not sure</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="f-cat">Category</label>
                  <select
                    id="f-cat"
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
                <label htmlFor="f-price">Pricing model</label>
                <select
                  id="f-price"
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                >
                  <option value="Free plan">Free plan</option>
                  <option value="Paid">Paid</option>
                  <option value="Custom quote">Custom quote</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="f-tag">One-line summary</label>
                <span className="hint">Max 90 characters</span>
                <input
                  id="f-tag"
                  type="text"
                  maxLength={90}
                  placeholder="What does it do in one sentence?"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  aria-invalid={Boolean(errors.tagline)}
                  aria-describedby={errors.tagline ? 'e-tag' : undefined}
                />
                {errors.tagline && (
                  <p className="err" id="e-tag">
                    {errors.tagline}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="f-desc">Description (optional)</label>
                <textarea
                  id="f-desc"
                  rows={3}
                  placeholder="More details on workflows or features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="f-email">Your email</label>
                <span className="hint">We only contact you if we have a question about this listing.</span>
                <input
                  id="f-email"
                  type="email"
                  placeholder="you@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  aria-invalid={Boolean(errors.contactEmail)}
                  aria-describedby={errors.contactEmail ? 'e-email' : undefined}
                />
                {errors.contactEmail && (
                  <p className="err" id="e-email">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div className="field" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input
                  id="f-vendor"
                  type="checkbox"
                  checked={isVendor}
                  onChange={(e) => setIsVendor(e.target.checked)}
                  style={{ width: '18px', height: '18px', margin: 0 }}
                />
                <label htmlFor="f-vendor" style={{ fontWeight: 400 }}>
                  I represent this vendor
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit tool'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
