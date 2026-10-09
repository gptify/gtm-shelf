'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ToolPublic } from '@/lib/types';
import { ToolDrawer } from '@/components/ToolDrawer';
import { trackEvent } from '@/lib/analytics';
import { getOutboundLinkInfo, STANDARD_AFFILIATE_DISCLOSURE } from '@/lib/affiliates';

interface BuildMyStackClientProps {
  tools: ToolPublic[];
  initialParams?: Record<string, string | undefined>;
}

export type CapabilityBucket =
  | 'inbound'
  | 'outbound'
  | 'lead_capture'
  | 'data_orchestration'
  | 'agentic_ops';

const BUCKET_DEFINITIONS: { id: CapabilityBucket; label: string; desc: string; sampleCategories: string[] }[] = [
  {
    id: 'inbound',
    label: 'Inbound',
    desc: 'Content generation, organic SEO, ad creative, and social media syndication.',
    sampleCategories: ['Content writing', 'SEO', 'Ad creative', 'Social media'],
  },
  {
    id: 'outbound',
    label: 'Outbound',
    desc: 'Cold email sequencing, verified contact data, and multi-channel prospecting.',
    sampleCategories: ['Email outreach', 'Lead data', 'AI SDR agents'],
  },
  {
    id: 'lead_capture',
    label: 'Lead Capture',
    desc: 'Conversational chat conversion, website visitor intent, and automated meeting booking.',
    sampleCategories: ['Chat and conversion', 'Intent signals'],
  },
  {
    id: 'data_orchestration',
    label: 'Data & Orchestration',
    desc: 'CRM hygiene, waterfall enrichment, automated pipeline data, and lifecycle sync.',
    sampleCategories: ['CRM', 'Revenue forecasting', 'Email and lifecycle'],
  },
  {
    id: 'agentic_ops',
    label: 'Agentic Operations',
    desc: 'Autonomous call transcription, AI meeting assistants, and deal co-pilots.',
    sampleCategories: ['Call intelligence', 'Meeting notes', 'AI SDR agents'],
  },
];

const OBJECTIVES = [
  {
    id: 'outbound_pipeline',
    title: 'Outbound Pipeline Generation',
    desc: 'Scale outbound prospecting, verify B2B emails, and book qualified sales meetings.',
    defaultBuckets: ['outbound', 'data_orchestration'] as CapabilityBucket[],
  },
  {
    id: 'inbound_demand',
    title: 'Inbound Demand & Content Engine',
    desc: 'Drive organic search traffic, generate marketing collateral, and convert site visitors.',
    defaultBuckets: ['inbound', 'lead_capture'] as CapabilityBucket[],
  },
  {
    id: 'full_funnel',
    title: 'Full-Funnel GTM Modernization',
    desc: 'Connect marketing, sales development, call coaching, and customer retention into one AI workflow.',
    defaultBuckets: ['inbound', 'outbound', 'lead_capture', 'data_orchestration', 'agentic_ops'] as CapabilityBucket[],
  },
  {
    id: 'call_intelligence',
    title: 'Call Intelligence & Deal Closing',
    desc: 'Auto-record discovery calls, populate CRM fields, and surface deal risks.',
    defaultBuckets: ['agentic_ops', 'data_orchestration'] as CapabilityBucket[],
  },
  {
    id: 'customer_retention',
    title: 'Customer Retention & Expansion',
    desc: 'Monitor account health, lifecycle signals, and prevent churn before renewals.',
    defaultBuckets: ['data_orchestration', 'inbound'] as CapabilityBucket[],
  },
];

const CRMS = ['HubSpot', 'Salesforce', 'Pipedrive', 'Notion / Google Sheets', 'None / Other'];
const BUDGETS = [
  { id: 'free', label: 'Free tier only ($0/mo)' },
  { id: 'starter', label: 'Bootstrapped (Under $200/mo)' },
  { id: 'growth', label: 'Growth ($200 – $600/mo)' },
  { id: 'scale', label: 'Scaling ($600 – $1,500/mo)' },
  { id: 'enterprise', label: 'Enterprise ($1,500+/mo)' },
];

const TEAM_SIZES = [
  { id: 'solo', label: 'Solo founder / 1 person' },
  { id: 'early', label: '2–10 people' },
  { id: 'growth', label: '11–50 people' },
  { id: 'enterprise', label: '50+ people' },
];

const COMMON_EXISTING_TOOLS = [
  'Apollo.io',
  'Clay',
  'HubSpot',
  'Instantly',
  'lemlist',
  'Smartlead',
  'Fathom',
  'Fireflies.ai',
  'MeetGeek',
  'Copy.ai',
  'Jasper',
  'Manychat',
  'Salesforce',
  'Seamless.AI',
];

export function BuildMyStackClient({ tools, initialParams = {} }: BuildMyStackClientProps) {
  // Wizard state
  const [step, setStep] = useState<number>(initialParams.shared ? 7 : 1);
  const [selectedObjective, setSelectedObjective] = useState<string>(initialParams.goal || 'outbound_pipeline');
  const [selectedBuckets, setSelectedBuckets] = useState<Set<CapabilityBucket>>(() => {
    if (initialParams.buckets) {
      return new Set(initialParams.buckets.split(',') as CapabilityBucket[]);
    }
    return new Set(['outbound', 'data_orchestration']);
  });
  const [selectedCrm, setSelectedCrm] = useState<string>(initialParams.crm || 'HubSpot');
  const [selectedBudget, setSelectedBudget] = useState<string>(initialParams.budget || 'growth');
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>(initialParams.size || 'early');
  const [existingTools, setExistingTools] = useState<Set<string>>(() => {
    if (initialParams.existing) {
      return new Set(initialParams.existing.split(','));
    }
    return new Set();
  });

  // UI state
  const [activeDrawerTool, setActiveDrawerTool] = useState<ToolPublic | null>(null);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fi-saved');
      if (stored) setSavedTools(new Set(JSON.parse(stored)));
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

  const handleToggleBucket = (bucketId: CapabilityBucket) => {
    setSelectedBuckets((prev) => {
      const next = new Set(prev);
      if (next.has(bucketId)) next.delete(bucketId);
      else next.add(bucketId);
      return next;
    });
  };

  const handleToggleExistingTool = (toolName: string) => {
    setExistingTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) next.delete(toolName);
      else next.add(toolName);
      return next;
    });
  };

  // Stack calculation based on user selections
  const stackRecommendation = useMemo(() => {
    const activeBucketsList = Array.from(selectedBuckets);
    const effectiveBuckets =
      activeBucketsList.length > 0
        ? activeBucketsList
        : OBJECTIVES.find((o) => o.id === selectedObjective)?.defaultBuckets || ['outbound'];

    const bucketPicks: {
      bucket: (typeof BUCKET_DEFINITIONS)[0];
      tools: {
        tool: ToolPublic;
        role: string;
        why: string;
        pricingDisplay: string;
        pricingType: 'verified' | 'estimated';
        integrationNote: string;
        isRetainedExisting: boolean;
      }[];
    }[] = [];

    let totalEstMin = 0;
    let totalEstMax = 0;

    effectiveBuckets.forEach((bucketId) => {
      const bucketDef = BUCKET_DEFINITIONS.find((b) => b.id === bucketId)!;
      // Filter tools matching bucket categories
      const candidateTools = tools.filter((t) => bucketDef.sampleCategories.includes(t.category_name));

      // Prioritize tools that integrate with chosen CRM and respect budget
      const scored = candidateTools.map((t) => {
        let score = 0;
        if (t.featured) score += 3;
        if (selectedCrm !== 'None / Other' && t.integrations.some((i) => i.toLowerCase().includes(selectedCrm.toLowerCase().split(' ')[0]))) {
          score += 5;
        }
        if (selectedBudget === 'free' && t.pricing_model === 'free_plan') score += 10;
        if (selectedBudget === 'starter' && t.pricing_model !== 'custom_quote') score += 4;
        return { tool: t, score };
      });

      scored.sort((a, b) => b.score - a.score);

      // Select top 1-2 tools per bucket
      const chosen = scored.slice(0, bucketId === 'outbound' || bucketId === 'inbound' ? 2 : 1).map(({ tool }) => {
        const isExisting = Array.from(existingTools).some((et) => et.toLowerCase() === tool.name.toLowerCase());
        const hasDirectCrmSync =
          selectedCrm !== 'None / Other' &&
          tool.integrations.some((i) => i.toLowerCase().includes(selectedCrm.toLowerCase().split(' ')[0]));

        let priceText = 'Estimated: $49 – $99 / mo';
        let priceType: 'verified' | 'estimated' = 'estimated';
        if (tool.pricing_model === 'free_plan') {
          priceText = 'Verified: Free tier available';
          priceType = 'verified';
        } else if (tool.pricing_model === 'custom_quote') {
          priceText = 'Estimated: Custom quote ($500+ / mo)';
        } else {
          totalEstMin += 49;
          totalEstMax += 99;
        }

        const whyReason = hasDirectCrmSync
          ? `Engineered for ${bucketDef.label.toLowerCase()} workflows with direct native synchronization into ${selectedCrm}.`
          : `High-leverage tool for ${bucketDef.label.toLowerCase()} operations, connecting easily via Webhook or Zapier.`;

        return {
          tool,
          role: `${bucketDef.label} Engine`,
          why: whyReason,
          pricingDisplay: priceText,
          pricingType: priceType,
          integrationNote: hasDirectCrmSync
            ? `✓ Direct native integration with ${selectedCrm}`
            : `Syncs via Zapier / Webhooks`,
          isRetainedExisting: isExisting,
        };
      });

      if (chosen.length > 0) {
        bucketPicks.push({
          bucket: bucketDef,
          tools: chosen,
        });
      }
    });

    // Detect potential software overlap
    const toolNames = bucketPicks.flatMap((b) => b.tools.map((t) => t.tool.name));
    const overlaps: string[] = [];
    if (toolNames.includes('Apollo.io') && (toolNames.includes('Instantly') || toolNames.includes('lemlist'))) {
      overlaps.push(
        'Dual Email Engine: Apollo.io and Instantly/lemlist both support email sending. Recommended best practice: use Apollo strictly for prospect data sourcing, and route cold deliverability through dedicated inboxes in Instantly to preserve primary domain reputation.'
      );
    }
    if (toolNames.includes('Clay') && toolNames.includes('Apollo.io')) {
      overlaps.push(
        'Enrichment Layering: Clay connects to Apollo as one of its data providers. Use Apollo for foundational search and Clay for waterfall multi-source enrichment.'
      );
    }

    return {
      bucketPicks,
      overlaps,
      totalCostRange:
        totalEstMin === 0 && totalEstMax === 0
          ? 'Free / Starter Tiers'
          : `$${totalEstMin} – $${totalEstMax} / mo`,
    };
  }, [tools, selectedObjective, selectedBuckets, selectedCrm, selectedBudget, selectedTeamSize, existingTools]);

  // Construct shareable link URL
  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams();
    params.set('shared', '1');
    params.set('goal', selectedObjective);
    params.set('buckets', Array.from(selectedBuckets).join(','));
    params.set('crm', selectedCrm);
    params.set('budget', selectedBudget);
    params.set('size', selectedTeamSize);
    if (existingTools.size > 0) {
      params.set('existing', Array.from(existingTools).join(','));
    }
    return `${window.location.origin}/build-my-stack?${params.toString()}`;
  }, [selectedObjective, selectedBuckets, selectedCrm, selectedBudget, selectedTeamSize, existingTools]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopyFeedback(true);
      trackEvent('stack_shared', { method: 'copy_link' });
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const handleShareLinkedIn = () => {
    trackEvent('stack_shared', { method: 'linkedin' });
    const text = encodeURIComponent(
      `I just configured my AI Go-To-Market stack on GTMShelf: ${OBJECTIVES.find((o) => o.id === selectedObjective)?.title}. Check it out here: ${shareableUrl}`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`, '_blank');
  };

  // Step 7: Completed Stack Results View
  if (step === 7) {
    return (
      <main className="page" id="main-content" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'var(--brand-soft)', border: '1px solid var(--line)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand)' }}>
              Stack Architecture Configured
            </div>
            <h1 style={{ font: '800 clamp(1.8rem, 3.5vw, 2.5rem)/1.15 var(--display)', letterSpacing: '-0.02em', margin: '12px 0 6px', color: 'var(--ink)' }}>
              Your Tailored GTM Architecture
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0 }}>
              Tailored for <strong>{OBJECTIVES.find((o) => o.id === selectedObjective)?.title}</strong> with CRM integration for <strong>{selectedCrm}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(1)}
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
            >
              ← Edit Answers
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCopyLink}
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
            >
              {copyFeedback ? 'Copied to Clipboard' : 'Copy Shareable Link'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleShareLinkedIn}
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              title="Share on LinkedIn"
            >
              Share on LinkedIn
            </button>
          </div>
        </div>

        {/* Stack Overview Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Active Capabilities</span>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', marginTop: '4px', color: 'var(--ink)' }}>
              {stackRecommendation.bucketPicks.length} {stackRecommendation.bucketPicks.length === 1 ? 'capability' : 'capabilities'} configured
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Connected CRM</span>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', marginTop: '4px', color: 'var(--ink)' }}>
              {selectedCrm}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Est. Software Overhead</span>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', marginTop: '4px', color: 'var(--brand)' }}>
              {stackRecommendation.totalCostRange}
            </div>
          </div>
        </div>

        {/* Overlap warnings if any */}
        {stackRecommendation.overlaps.length > 0 && (
          <div style={{ padding: '16px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#92400e', margin: '0 0 8px' }}>
              Software Overlap &amp; Workflow Advisory
            </h3>
            {stackRecommendation.overlaps.map((overlap, idx) => (
              <p key={idx} style={{ fontSize: '0.875rem', color: '#78350f', margin: idx === 0 ? 0 : '8px 0 0', lineHeight: 1.5 }}>
                {overlap}
              </p>
            ))}
          </div>
        )}

        {/* Capability Buckets & Recommended Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {stackRecommendation.bucketPicks.map(({ bucket, tools: bTools }) => (
            <section key={bucket.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                    {bucket.label}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '4px 0 0' }}>
                    {bucket.desc}
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                  {bTools.length} tool{bTools.length > 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {bTools.map(({ tool, role, why, pricingDisplay, pricingType, integrationNote, isRetainedExisting }) => {
                  const outbound = getOutboundLinkInfo(tool.slug, tool.website_url);
                  return (
                    <div
                      key={tool.id}
                      style={{
                        border: '1px solid var(--line)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>
                            <button
                              type="button"
                              onClick={() => setActiveDrawerTool(tool)}
                              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--ink)', cursor: 'pointer', textAlign: 'left', textDecoration: 'underline' }}
                            >
                              {tool.name}
                            </button>
                          </h3>
                          {isRetainedExisting && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                              Already in use
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '6px 0 12px', lineHeight: 1.4 }}>
                          {tool.tagline}
                        </p>

                        <div style={{ fontSize: '0.8125rem', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>Role: {role}</div>
                          <div style={{ color: 'var(--muted)', lineHeight: 1.4 }}>{why}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '16px' }}>
                          <span style={{ fontWeight: 600, color: pricingType === 'verified' ? 'var(--brand)' : 'inherit' }}>
                            {pricingDisplay}
                          </span>
                          <span style={{ color: '#059669', fontWeight: 500 }}>{integrationNote}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                        <a
                          href={`/out/${tool.slug}`}
                          target="_blank"
                          rel={outbound.rel}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '7px 12px', fontSize: '0.8125rem', textAlign: 'center', textDecoration: 'none' }}
                          onClick={() => {
                            if (outbound.isAffiliate) {
                              trackEvent('affiliate_clicked', { tool_id: tool.id, tool: tool.slug });
                            } else {
                              trackEvent('vendor_clicked', { tool_id: tool.id, tool: tool.slug });
                            }
                          }}
                        >
                          Visit {tool.domain}
                        </a>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: '7px 12px', fontSize: '0.8125rem' }}
                          onClick={() => setActiveDrawerTool(tool)}
                        >
                          Specs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Affiliate Disclosure Notice */}
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', margin: '36px 0 20px', lineHeight: 1.5 }}>
          {STANDARD_AFFILIATE_DISCLOSURE} Pricing estimates are approximate and may change based on vendor plans.
        </p>

        {/* Share & Actions Banner */}
        <div
          style={{
            marginTop: '36px',
            padding: '24px 28px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--ink)' }}>
              Save or share this architecture
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
              Use your tailored link to revisit this stack anytime or share it directly with your team.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCopyLink}
              style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              {copyFeedback ? 'Copied to Clipboard' : 'Copy Shareable Link'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleShareLinkedIn}
              style={{ padding: '10px 18px', fontSize: '0.875rem' }}
            >
              Share on LinkedIn
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(1)}
              style={{ padding: '10px 18px', fontSize: '0.875rem' }}
            >
              Edit Answers
            </button>
          </div>
        </div>

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
      </main>
    );
  }

  // Wizard Questions Flow (Steps 1 to 6)
  return (
    <main className="page finder" id="main-content" style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Progress Bar */}
      <div className="progress" role="progressbar" aria-label="Build My Stack Progress" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step}>
        <i style={{ width: `${Math.round((step / 6) * 100)}%` }}></i>
      </div>

      <p className="qmeta">Step {step} of 6</p>

      {/* Step 1: Objective */}
      {step === 1 && (
        <>
          <h1 className="qh">What is your primary GTM objective?</h1>
          <p className="help">Select the main business outcome you are optimizing this AI stack to achieve.</p>
          <div className="choices">
            {OBJECTIVES.map((obj) => (
              <button
                key={obj.id}
                type="button"
                className={`choice ${selectedObjective === obj.id ? 'active' : ''}`}
                style={{ textAlign: 'left', display: 'block', padding: '16px 20px', border: selectedObjective === obj.id ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                onClick={() => {
                  setSelectedObjective(obj.id);
                  setSelectedBuckets(new Set(obj.defaultBuckets));
                  trackEvent('stack_started', { objective: obj.id });
                  setStep(2);
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '4px', color: 'var(--ink)' }}>{obj.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>{obj.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Modern Capability Buckets (Multi-select, All Optional!) */}
      {step === 2 && (
        <>
          <h1 className="qh">Which GTM capabilities do you need?</h1>
          <p className="help">All 5 buckets are optional. We only recommend tools for capabilities you choose.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
            {BUCKET_DEFINITIONS.map((bucket) => {
              const isChecked = selectedBuckets.has(bucket.id);
              return (
                <div
                  key={bucket.id}
                  onClick={() => handleToggleBucket(bucket.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: isChecked ? '2px solid var(--brand)' : '1px solid var(--line)',
                    background: isChecked ? 'var(--brand-soft)' : 'var(--surface)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent onClick
                    style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>{bucket.label}</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {bucket.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="qnav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={selectedBuckets.size === 0}
              onClick={() => setStep(3)}
              style={selectedBuckets.size === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {selectedBuckets.size === 0 ? 'Select at least 1 capability' : `Continue (${selectedBuckets.size} selected) →`}
            </button>
          </div>
        </>
      )}

      {/* Step 3: Current CRM */}
      {step === 3 && (
        <>
          <h1 className="qh">What CRM or data core do you use?</h1>
          <p className="help">We prioritize tools with certified native 2-way sync to avoid fragile workarounds.</p>
          <div className="choices">
            {CRMS.map((crm) => (
              <button
                key={crm}
                type="button"
                className={`choice ${selectedCrm === crm ? 'active' : ''}`}
                style={{ textAlign: 'left', fontWeight: 600, padding: '14px 20px', border: selectedCrm === crm ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                onClick={() => {
                  setSelectedCrm(crm);
                  setStep(4);
                }}
              >
                {crm}
              </button>
            ))}
          </div>
          <div className="qnav">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
          </div>
        </>
      )}

      {/* Step 4: Monthly Budget */}
      {step === 4 && (
        <>
          <h1 className="qh">What is your monthly software budget?</h1>
          <p className="help">Estimated cost limits to ensure we do not recommend enterprise-tier tools to bootstrapped teams.</p>
          <div className="choices">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`choice ${selectedBudget === b.id ? 'active' : ''}`}
                style={{ textAlign: 'left', fontWeight: 600, padding: '14px 20px', border: selectedBudget === b.id ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                onClick={() => {
                  setSelectedBudget(b.id);
                  setStep(5);
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="qnav">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
              Back
            </button>
          </div>
        </>
      )}

      {/* Step 5: Team Size & Stage */}
      {step === 5 && (
        <>
          <h1 className="qh">What is your team size or stage?</h1>
          <p className="help">Helps us calibrate setup complexity and seat management capabilities.</p>
          <div className="choices">
            {TEAM_SIZES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`choice ${selectedTeamSize === t.id ? 'active' : ''}`}
                style={{ textAlign: 'left', fontWeight: 600, padding: '14px 20px', border: selectedTeamSize === t.id ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                onClick={() => {
                  setSelectedTeamSize(t.id);
                  setStep(6);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="qnav">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(4)}>
              Back
            </button>
          </div>
        </>
      )}

      {/* Step 6: Existing Tools In Use */}
      {step === 6 && (
        <>
          <h1 className="qh">Which tools are you already using?</h1>
          <p className="help">Optional. We will prevent redundant recommendations and build around what you already have.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0' }}>
            {COMMON_EXISTING_TOOLS.map((toolName) => {
              const active = existingTools.has(toolName);
              return (
                <button
                  key={toolName}
                  type="button"
                  onClick={() => handleToggleExistingTool(toolName)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: active ? '2px solid var(--brand)' : '1px solid var(--line)',
                    background: active ? 'var(--brand-soft)' : 'var(--surface)',
                    color: active ? 'var(--brand)' : 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  {active ? `✓ ${toolName}` : `+ ${toolName}`}
                </button>
              );
            })}
          </div>
          <div className="qnav" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(5)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                trackEvent('stack_completed', {
                  objective: selectedObjective,
                  crm: selectedCrm,
                  budget: selectedBudget,
                  buckets_count: selectedBuckets.size,
                });
                setStep(7);
              }}
            >
              Generate Stack Recommendation →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
