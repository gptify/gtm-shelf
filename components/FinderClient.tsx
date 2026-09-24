'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ToolPublic } from '@/lib/types';
import { createFinder, QUESTIONS, NEED, CATP, STAGES } from '@/lib/finder/finder.mjs';
import { ToolDrawer } from '@/components/ToolDrawer';
import { pricingLabel, hue, initial } from '@/lib/utils';

interface FinderClientProps {
  tools: ToolPublic[];
}

interface FinderState {
  A: Record<string, any>;
  order: string[];
  note: string;
}

export function FinderClient({ tools }: FinderClientProps) {
  // Map tools to FinderTool shape
  const finderTools = useMemo(() => {
    return tools.map((t) => ({
      id: t.id,
      name: t.name,
      stage: t.stage_id,
      cat: t.category_name,
      price: pricingLabel(t.pricing_model) as 'Free plan' | 'Paid' | 'Custom quote',
      ints: t.integrations,
      setup: t.setup_effort,
      feat: t.featured,
      best: t.best_for,
      tagline: t.tagline,
      description: t.description,
      domain: t.domain,
      slug: t.slug,
      website_url: t.website_url,
      published: true,
    }));
  }, [tools]);

  const finder = useMemo(() => createFinder(finderTools), [finderTools]);

  const [st, setSt] = useState<FinderState>(() => finder.start());
  const [history, setHistory] = useState<FinderState[]>([]);
  const [activeDrawerTool, setActiveDrawerTool] = useState<ToolPublic | null>(null);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [leadEmail, setLeadEmail] = useState('');
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('fi-saved');
      if (storedSaved) {
        setSavedTools(new Set(JSON.parse(storedSaved)));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleSave = useCallback((toolName: string) => {
    setSavedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) next.delete(toolName);
      else next.add(toolName);
      try {
        localStorage.setItem('fi-saved', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Determine current question
  const currentQId = useMemo(() => finder.nextQuestion(st), [finder, st]);

  // Options for current question
  const currentOptions = useMemo(() => {
    if (!currentQId) return [];
    return finder.optsFor(currentQId, st.A);
  }, [finder, currentQId, st.A]);

  // When question changes, scroll to top and focus H1
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      headingRef.current?.focus();
    }, 50);
  }, [currentQId]);

  // Handle answering
  const handleAnswer = (value: any) => {
    if (!currentQId) return;
    setHistory((prev) => [...prev, st]);
    const nextSt = finder.answer(st, currentQId, value);
    setSt(nextSt);

    // If next question is null, finder completed: log run
    const nextQ = finder.nextQuestion(nextSt);
    if (!nextQ) {
      const res = finder.results(nextSt);
      const topIds = res.picks.map((p: any) => p.tool.id);
      fetch('/api/finder-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: nextSt.A,
          question_count: nextSt.order.length,
          top_tool_ids: topIds,
          clicked_custom: false,
        }),
      }).catch(() => {});
    }
  };

  // Back button
  const handleBack = () => {
    if (history.length === 0) return;
    const prevSt = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setSt(prevSt);
  };

  // Restart
  const handleRestart = () => {
    setHistory([]);
    setSt(finder.start());
  };

  // Lead submit (double opt-in email my picks)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim() || leadSubmitting) return;

    setLeadSubmitting(true);
    setLeadMessage(null);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail.trim(),
          source: 'finder',
          finder_answers: st.A,
          consent: leadConsent,
        }),
      });

      if (res.ok) {
        setLeadMessage(
          'Check your inbox! We sent a confirmation link. Your picks will arrive as soon as you confirm.'
        );
        setLeadEmail('');
      } else {
        setLeadMessage('Please enter a valid email address.');
      }
    } catch {
      setLeadMessage(
        'Check your inbox! We sent a confirmation link. Your picks will arrive as soon as you confirm.'
      );
      setLeadEmail('');
    } finally {
      setLeadSubmitting(false);
    }
  };

  // If questions remain: render question screen
  if (currentQId) {
    const qData = (QUESTIONS as any)[currentQId];
    const questionTitle = currentQId === 'need' ? 'What should the tool help you do?' : qData.t;
    const questionHelp = currentQId === 'need' ? 'These options match the goal you picked.' : qData.h;

    const answeredCount = st.order.length;
    const totalEst = answeredCount + Math.max(1, finder.relevantRemaining(st.A));
    const progressPct = Math.max(6, Math.min(100, Math.round((answeredCount / totalEst) * 100)));

    return (
      <main className="page finder" id="main-content">
        <div
          className="progress"
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
        >
          <i style={{ width: `${progressPct}%` }}></i>
        </div>

        <p className="qmeta">Question {answeredCount + 1}</p>

        <h1
          className="qh"
          id="qh"
          ref={headingRef}
          tabIndex={-1}
        >
          {questionTitle}
        </h1>
        <p className="help">{questionHelp}</p>

        <div className="choices" role="group" aria-labelledby="qh">
          {currentOptions.map((opt: [string, any], idx: number) => (
            <button
              key={idx}
              type="button"
              className="choice"
              onClick={() => handleAnswer(opt[1])}
            >
              {opt[0]}
            </button>
          ))}
        </div>

        <div className="qnav">
          {history.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleBack}
            >
              Back
            </button>
          )}
        </div>

        {answeredCount === 0 && (
          <p className="qfoot">
            Answer 3 to 10 short questions and get three picks from the directory.
            The questions adapt to your answers, and stop once more answers would not change the result.
          </p>
        )}
      </main>
    );
  }

  // Otherwise: Results screen!
  const results = finder.results(st);
  const picks = results.picks;
  const alternatives = results.alternatives;
  const labels = ['Best match', 'Runner-up', 'Also strong'];

  // Selected answer chips for summary
  const summaryChips: string[] = [];
  if (st.A.goal && !st.note) {
    const stage = STAGES.find((s) => s.id === st.A.goal);
    if (stage) summaryChips.push(stage.name);
  }
  if (st.A.need) summaryChips.push(st.A.need);
  if (st.A.budget) {
    const bLabels: Record<string, string> = {
      free: 'Free only',
      low: 'Up to $100/mo',
      mid: '$100-$500/mo',
      high: '$500+/mo',
    };
    summaryChips.push(bLabels[st.A.budget] || st.A.budget);
  }
  if (st.A.size) {
    const sLabels: Record<string, string> = {
      solo: 'Just me',
      small: '2-10 people',
      mid: '11-50 people',
      large: '50+ people',
    };
    summaryChips.push(sLabels[st.A.size] || st.A.size);
  }
  if (st.A.crm && st.A.crm !== 'none') summaryChips.push(`CRM: ${st.A.crm}`);
  if (st.A.tech) {
    const tLabels: Record<string, string> = {
      easy: 'Fast start',
      some: 'Some setup',
      pro: 'Technical help',
    };
    summaryChips.push(tLabels[st.A.tech] || st.A.tech);
  }
  if (st.A.must && st.A.must !== 'none') summaryChips.push(`Needs: ${st.A.must}`);

  // Prefill parameter for custom build
  const customPrefillParams = new URLSearchParams({
    source: 'finder',
    goal: String(st.A.goal || ''),
    need: String(st.A.need || ''),
    budget: String(st.A.budget || ''),
    size: String(st.A.size || ''),
    crm: String(st.A.crm || ''),
  }).toString();

  return (
    <>
      <main className="page finder" id="main-content">
        <h1 className="qh" ref={headingRef} tabIndex={-1}>
          Your top picks
        </h1>

        <p className="lede small">
          For {results.summaryPhrase} at the {results.stage.toLowerCase()} stage
          {results.stoppedEarly
            ? `. We stopped after ${results.questionsAsked} questions because the others would not change your top three.`
            : '.'}
        </p>

        {results.note && <p className="notice">{results.note}</p>}

        <div className="summary" aria-label="Your answers">
          {summaryChips.map((chip, i) => (
            <span key={i} className="chip">
              {chip}
            </span>
          ))}
          <button
            type="button"
            className="chip st"
            style={{ cursor: 'pointer', background: 'var(--surface)' }}
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>

        {results.exactCategoryCount < 3 && (
          <p className="watch">
            Only {results.exactCategoryCount} tool
            {results.exactCategoryCount === 1 ? ' matches' : 's match'} &quot;
            {results.summaryPhrase}&quot; exactly, so the rest are related options from the same stage.
          </p>
        )}

        <ol className="respicks">
          {picks.map((o: any, k: number) => {
            const tool = o.tool;
            const originalTool = tools.find((t) => t.id === tool.id) || null;
            const isSaved = savedTools.has(tool.name);

            return (
              <li key={tool.id} className="res-pick">
                <div className="res-rank" aria-hidden="true">
                  {k + 1}
                </div>
                <div>
                  <h2>
                    <button
                      type="button"
                      className="name-btn"
                      onClick={() => originalTool && setActiveDrawerTool(originalTool)}
                    >
                      {tool.name}
                    </button>
                    <span className="badge">{labels[k]}</span>
                  </h2>

                  <p className="tag">{tool.tagline}</p>

                  <ul className="reasons">
                    {o.why.slice(0, 3).map((r: string, rIdx: number) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                    {tool.best && <li>Best for {tool.best}</li>}
                  </ul>

                  {o.watch && o.watch.length > 0 && (
                    <p className="watch">
                      Keep in mind: {o.watch.slice(0, 2).join('; ')}.
                    </p>
                  )}

                  <div className="res-actions">
                    <a
                      className="btn btn-primary"
                      href={`/out/${tool.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit {tool.domain}
                    </a>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => originalTool && setActiveDrawerTool(originalTool)}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      className="save"
                      aria-pressed={isSaved}
                      aria-label={`Save ${tool.name}`}
                      onClick={() => handleToggleSave(tool.name)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {alternatives.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 className="sec">Alternatives</h2>
            <ul className="list">
              {alternatives.map((o: any) => {
                const tool = o.tool;
                const originalTool = tools.find((t) => t.id === tool.id) || null;
                const isSaved = savedTools.has(tool.name);

                return (
                  <li key={tool.id} className="row">
                    <div
                      className="mono"
                      style={{ '--h': hue(tool.name) } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      {initial(tool.name)}
                    </div>
                    <div className="main">
                      <h3>
                        <button
                          type="button"
                          className="open"
                          onClick={() => originalTool && setActiveDrawerTool(originalTool)}
                        >
                          {tool.name}
                        </button>
                        {tool.feat && <span className="badge">Featured</span>}
                      </h3>
                      <p className="tag">{tool.tagline}</p>
                      <div className="chips">
                        <span className="chip st">{results.stage}</span>
                        <span className="chip">{tool.cat}</span>
                      </div>
                    </div>
                    <div className="side">
                      <span className="price">{tool.price}</span>
                      <button
                        type="button"
                        className="save"
                        aria-pressed={isSaved}
                        aria-label={`Save ${tool.name}`}
                        onClick={() => handleToggleSave(tool.name)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Custom Build Request Card */}
        <div className="custom-card" style={{ marginTop: '48px' }}>
          <h2>
            {results.exactCategoryCount < 3
              ? `Only ${results.exactCategoryCount} tool${results.exactCategoryCount === 1 ? '' : 's'} matched exactly.`
              : 'Nothing fits exactly?'}
          </h2>
          <p>
            GPTify can build a custom AI tool or workflow for this. Your answers prefill the request, so you do not start from zero.
          </p>
          <Link
            className="btn btn-ghost"
            href={`/custom?${customPrefillParams}`}
          >
            Request a custom build
          </Link>
          <p className="fine" style={{ marginTop: '12px' }}>
            GTM Shelf is run by GPTify. Custom builds are never ranked among the tools.
          </p>
        </div>

        {/* Email me these picks capture */}
        <div className="capture" id="capture">
          <h2>Email me these picks</h2>
          <p>
            We will send your three picks and why they fit, so you can share them with your team.
          </p>
          <form onSubmit={handleLeadSubmit} noValidate>
            <label className="sr" htmlFor="lead-email">
              Email address
            </label>
            <input
              id="lead-email"
              type="email"
              placeholder="you@company.com"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={leadSubmitting}
            >
              {leadSubmitting ? 'Sending...' : 'Email my picks'}
            </button>
          </form>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="lead-consent"
              type="checkbox"
              checked={leadConsent}
              onChange={(e) => setLeadConsent(e.target.checked)}
              style={{ width: '16px', height: '16px', margin: 0 }}
            />
            <label htmlFor="lead-consent" className="fine">
              Send me weekly updates on new AI tools for sales and marketing (optional).
            </label>
          </div>

          {leadMessage && (
            <p style={{ marginTop: '12px', color: 'var(--brand)', fontWeight: 600 }}>
              {leadMessage}
            </p>
          )}
          <p className="fine">
            Double opt-in: we will send a confirmation link first. You can unsubscribe at any time.
          </p>
        </div>
      </main>

      {/* Slide-in details drawer */}
      <ToolDrawer
        tool={activeDrawerTool}
        allTools={tools}
        isOpen={Boolean(activeDrawerTool)}
        onClose={() => setActiveDrawerTool(null)}
        savedTools={savedTools}
        onToggleSave={handleToggleSave}
        onSelectSimilarTool={(t) => setActiveDrawerTool(t)}
      />
    </>
  );
}
