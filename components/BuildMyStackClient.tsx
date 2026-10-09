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
    sampleCategories: ['Content writing', 'GTM AI workflows', 'SEO', 'Ad creative', 'Social media'],
  },
  {
    id: 'outbound',
    label: 'Outbound',
    desc: 'Cold email sequencing, verified contact data, and multi-channel prospecting.',
    sampleCategories: ['Email outreach', 'LinkedIn outreach', 'Lead data', 'AI SDR agents'],
  },
  {
    id: 'lead_capture',
    label: 'Lead Capture',
    desc: 'Conversational chat conversion, website visitor intent, and automated meeting booking.',
    sampleCategories: ['Chat and conversion', 'Intent signals', 'Meeting notes', 'Meeting scheduling'],
  },
  {
    id: 'data_orchestration',
    label: 'Data & Orchestration',
    desc: 'CRM hygiene, waterfall enrichment, automated pipeline data, and lifecycle sync.',
    sampleCategories: ['CRM', 'Workflow automation', 'Revenue forecasting', 'Customer success', 'Document automation', 'Email and lifecycle'],
  },
  {
    id: 'agentic_ops',
    label: 'Agentic Operations',
    desc: 'Autonomous call transcription, AI meeting assistants, and deal co-pilots.',
    sampleCategories: ['Call intelligence', 'Meeting notes', 'AI SDR agents', 'Workflow automation'],
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

const REGIONS = [
  { id: 'global', label: 'Global / North America (US, CA, Worldwide)' },
  { id: 'eu', label: 'European Union & UK (GDPR & EMEA compliance focus)' },
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
  const [selectedRegion, setSelectedRegion] = useState<string>(initialParams.region || 'global');
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

  // Active Use Case context if linked from /use-cases/[slug]
  const [useCaseSlug] = useState<string | undefined>(initialParams.use_case);
  const [useCaseData, setUseCaseData] = useState<{ title: string; slug: string; bucket: string; mini_preview?: { label: string }[]; short_summary?: string } | null>(null);

  useEffect(() => {
    if (!useCaseSlug) return;
    import('@/data/use-cases.json').then((mod) => {
      const list = (mod.default || mod) as any[];
      const found = list.find((u) => u.slug === useCaseSlug);
      if (found) {
        setUseCaseData({
          title: found.title,
          slug: found.slug,
          bucket: found.bucket,
          mini_preview: found.mini_preview,
          short_summary: found.short_summary,
        });
      }
    }).catch(() => {});
  }, [useCaseSlug]);

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

    let totalEstMin = 0;
    let totalEstMax = 0;
    let hasEnterpriseQuote = false;

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
        alternativesConsidered: string[];
      }[];
    }[] = [];

    effectiveBuckets.forEach((bucketId) => {
      const bucketDef = BUCKET_DEFINITIONS.find((b) => b.id === bucketId)!;
      // Filter tools matching bucket categories and strictly exclude discontinued/sunsetting products
      const candidateTools = tools.filter((t) => {
        if (t.lifecycle_status === 'discontinued' || t.lifecycle_status === 'sunsetting') return false;
        if (t.classification === 'discontinued' || t.classification === 'sunsetting') return false;
        if (t.id === 'koala' || t.id === 'drift') return false;

        // Disqualify secondary CRM platforms from workflow automation / data orchestration if primary CRM chosen
        if (bucketId === 'data_orchestration' && ['hubspot-sales-hub', 'salesforce-sales-cloud', 'pipedrive', 'close-crm'].includes(t.id)) {
          return false;
        }
        // Exclude standalone CRM from raw outbound sequencers
        if (bucketId === 'outbound' && ['hubspot-sales-hub', 'salesforce-sales-cloud', 'pipedrive', 'close-crm'].includes(t.id)) {
          return false;
        }

        // Geographic compliance filter (e.g., RB2B is strictly US-only; disqualify for EU buyers)
        if (selectedRegion === 'eu' && t.geographic_coverage === 'us_only') {
          return false;
        }

        const matchesBucket =
          t.gtm_buckets && t.gtm_buckets.length > 0
            ? t.gtm_buckets.some((b) => b.toLowerCase().replace(/[^a-z]/g, '') === bucketId.replace(/[^a-z]/g, ''))
            : false;

        return matchesBucket || bucketDef.sampleCategories.includes(t.category_name);
      });

      // Score tools based on objective outcome, CRM compatibility, budget alignment, team size, and region
      const scored = candidateTools.map((t) => {
        let score = 0;
        // Core architecture stability
        if (t.classification === 'core') score += 5;

        // Native CRM compatibility (High weight)
        const hasDirectCrmSync =
          selectedCrm !== 'None / Other' &&
          t.integrations.some((i) => i.toLowerCase().includes(selectedCrm.toLowerCase().split(' ')[0]));
        if (hasDirectCrmSync) score += 10;

        // Existing tool retention
        const isExisting = Array.from(existingTools).some(
          (et) => et.toLowerCase() === t.name.toLowerCase() || et.toLowerCase() === t.id.toLowerCase() || (et.toLowerCase().includes('apollo') && t.id === 'apollo')
        );
        if (isExisting) score += 35;

        // Budget alignment
        if (selectedBudget === 'free') {
          if (t.pricing_model === 'free_plan') score += 25;
          if (t.pricing_model === 'custom_quote') score -= 35;
          if (t.pricing_model === 'paid') score -= 35;
        } else if (selectedBudget === 'starter') {
          if (t.pricing_model === 'free_plan') score += 10;
          if (t.pricing_model === 'paid') score += 8;
          if (t.pricing_model === 'custom_quote') score -= 20;
          if (t.setup_effort === 1) score += 4;
        } else if (selectedBudget === 'growth') {
          if (t.pricing_model === 'paid') score += 12;
          if (t.pricing_model === 'free_plan') score += 4;
          if (t.pricing_model === 'custom_quote') score -= 10;
        } else if (selectedBudget === 'scale' || selectedBudget === 'enterprise') {
          if (t.pricing_model === 'custom_quote') score += 15;
          if (t.pricing_model === 'paid') score += 8;
          if (t.setup_effort === 3) score += 4;
        }

        // Team size & operational complexity alignment
        if (selectedTeamSize === 'solo') {
          if (t.setup_effort === 1) score += 5;
        } else if (selectedTeamSize === 'enterprise') {
          if (t.classification === 'core') score += 4;
          if (t.integrations.includes('Salesforce')) score += 5;
        }

        // Objective alignment (Primary Job to be Done)
        if (bucketId === 'outbound') {
          if (selectedObjective === 'outbound_pipeline') {
            if (t.id === 'apollo') score += 12;
            if (t.id === 'instantly' || t.id === 'smartlead') score += 8;
            if (t.id === 'clay') score += 7;
          }
        }
        if (bucketId === 'inbound') {
          if (selectedObjective === 'inbound_demand') {
            if (t.id === 'copy-ai') score += 10;
            if (t.id === 'surfer') score += 8;
          }
        }
        if (bucketId === 'lead_capture') {
          if (selectedObjective === 'outbound_pipeline' || selectedBudget === 'free') {
            if (t.id === 'calendly') score += 14;
          }
          if (selectedRegion === 'eu' && t.id === '6sense') score += 10;
        }
        if (bucketId === 'data_orchestration') {
          if (t.category_name === 'Workflow automation') score += 10;
        }

        // Redundancy suppression: If existing tools already include Apollo, suppress redundant sequencers and standalone databases
        if (Array.from(existingTools).some((et) => et.toLowerCase().includes('apollo'))) {
          if (['instantly', 'smartlead', 'lemlist', 'lusha', 'seamless-ai', 'hunter'].includes(t.id)) {
            score -= 30;
          }
          if (['heyreach', 'clay'].includes(t.id)) {
            score += 15;
          }
        }

        return { tool: t, score };
      });

      scored.sort((a, b) => b.score - a.score);

      const chosenCount = bucketId === 'outbound' || bucketId === 'inbound' ? 2 : 1;
      const topPicks = scored.slice(0, chosenCount);

      // Select top tools per bucket
      const chosen = topPicks.map(({ tool }, idx) => {
        const isExisting = Array.from(existingTools).some(
          (et) => et.toLowerCase() === tool.name.toLowerCase() || et.toLowerCase() === tool.id.toLowerCase() || (et.toLowerCase().includes('apollo') && tool.id === 'apollo')
        );
        const hasDirectCrmSync =
          selectedCrm !== 'None / Other' &&
          tool.integrations.some((i) => i.toLowerCase().includes(selectedCrm.toLowerCase().split(' ')[0]));

        let priceText = tool.min_plan ? `Verified: ${tool.min_plan}` : tool.price_note ? `Verified: ${tool.price_note}` : 'Estimated: $49 – $99 / mo';
        let priceType: 'verified' | 'estimated' = tool.min_plan || tool.price_note ? 'verified' : 'estimated';

        if (tool.pricing_model === 'custom_quote' || tool.price_note?.toLowerCase().includes('custom quote') || tool.price_note?.toLowerCase().includes('contact sales')) {
          priceText = tool.min_plan ? `Verified: ${tool.min_plan}` : 'Verified: Custom quote / enterprise contract';
          priceType = 'verified';
          hasEnterpriseQuote = true;
        } else if (selectedBudget === 'free') {
          priceText = tool.min_plan ? `Verified: ${tool.min_plan}` : 'Verified: Free tier available';
          priceType = 'verified';
        } else {
          const text = `${tool.min_plan || ''} ${tool.price_note || ''}`;
          const match = text.match(/[\$€]([0-9]+(?:\.[0-9]+)?)/);
          if (match) {
            const num = Math.round(parseFloat(match[1]));
            totalEstMin += num;
            totalEstMax += Math.round(num * 1.35);
          } else {
            totalEstMin += 49;
            totalEstMax += 99;
          }
        }

        const altNames = scored
          .slice(chosenCount, chosenCount + 2)
          .map((s) => s.tool.name)
          .filter((n) => n !== tool.name);

        const whyReason = hasDirectCrmSync
          ? `Selected for ${bucketDef.label.toLowerCase()} outcomes with direct native synchronization into ${selectedCrm}.`
          : `High-leverage tool for ${bucketDef.label.toLowerCase()} operations, connecting flexibly via Webhook or Zapier.`;

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
          alternativesConsidered: altNames,
        };
      });

      if (chosen.length > 0) {
        bucketPicks.push({
          bucket: bucketDef,
          tools: chosen,
        });
      }
    });

    // Detect potential software overlaps and provide replacement guidance
    const toolIds = bucketPicks.flatMap((b) => b.tools.map((t) => t.tool.id.toLowerCase()));
    const overlaps: string[] = [];

    if (toolIds.includes('apollo') && (toolIds.includes('instantly') || toolIds.includes('smartlead') || toolIds.includes('lemlist'))) {
      overlaps.push(
        'Dual Outbound Sending Engines: Apollo includes native email sequencing. If you do not require specialized high-volume multi-inbox rotation, you can run sequences directly in Apollo to avoid dual subscription fees. Alternatively, use Apollo strictly for B2B data search and route sending through dedicated secondary domains in Instantly/Smartlead.'
      );
    }
    if (toolIds.includes('clay') && toolIds.includes('apollo')) {
      overlaps.push(
        'Enrichment Layering: Clay connects to Apollo as one of its data waterfall providers. Recommended pattern: use Apollo for initial search filtering, and Clay for multi-source waterfall enrichment and AI personalization.'
      );
    }
    if (toolIds.includes('make') && toolIds.includes('zapier')) {
      overlaps.push(
        'Redundant Orchestration Tools: Both Make and Zapier serve as core integration backbones. Standardize on Make (more cost-effective for complex logic) or Zapier (broader pre-built catalog) to avoid paying two monthly subscription tiers.'
      );
    }
    if ((toolIds.includes('fathom') && toolIds.includes('tl-dv')) || (toolIds.includes('fathom') && toolIds.includes('meetgeek'))) {
      overlaps.push(
        'Meeting Recorder Overlap: Multiple AI meeting transcription tools detected in your stack. Consolidate your revenue team onto a single recorder to eliminate duplicate per-seat licensing.'
      );
    }
    if (toolIds.includes('hubspot-sales-hub') && (toolIds.includes('pipedrive') || toolIds.includes('close-crm') || toolIds.includes('salesforce-sales-cloud'))) {
      overlaps.push(
        'Multiple Primary CRMs: You have selected more than one primary CRM. Standardize on one central customer database to prevent fragmented customer records and pipeline attribution errors.'
      );
    }

    let totalCostDisplay = '';
    if (selectedBudget === 'free' || (totalEstMin === 0 && totalEstMax === 0)) {
      totalCostDisplay = hasEnterpriseQuote
        ? 'Free tiers + Custom quote for enterprise tools'
        : 'Free tier ($0/mo base software)';
    } else {
      totalCostDisplay = hasEnterpriseQuote
        ? `$${totalEstMin} – $${totalEstMax} / mo + Custom quote for enterprise tools`
        : `$${totalEstMin} – $${totalEstMax} / mo`;
    }

    return {
      bucketPicks,
      overlaps,
      totalCostRange: totalCostDisplay,
    };
  }, [tools, selectedObjective, selectedBuckets, selectedCrm, selectedBudget, selectedTeamSize, selectedRegion, existingTools]);

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
    params.set('region', selectedRegion);
    if (selectedRegion !== 'global') {
      params.set('region', selectedRegion);
    }
    if (existingTools.size > 0) {
      params.set('existing', Array.from(existingTools).join(','));
    }
    if (useCaseSlug) {
      params.set('use_case', useCaseSlug);
    }
    return `${window.location.origin}/build-my-stack?${params.toString()}`;
  }, [selectedObjective, selectedBuckets, selectedCrm, selectedBudget, selectedTeamSize, selectedRegion, existingTools, useCaseSlug]);

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
        {/* Use-Case Context Banner if arriving from a Blueprint */}
        {useCaseData && (
          <div
            style={{
              marginBottom: '24px',
              padding: '16px 20px',
              borderRadius: '12px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#1e40af', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Operational Blueprint Integration
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e3a8a' }}>
                Configured to operationalize: {useCaseData.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#3b82f6', marginTop: '2px' }}>
                Each recommended tool below directly fulfills one step in this workflow blueprint.
              </div>
            </div>
            <Link
              href={`/use-cases/${useCaseData.slug}`}
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#1d4ed8',
                textDecoration: 'none',
                padding: '6px 12px',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              View Full Blueprint Workflow →
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'var(--brand-soft)', border: '1px solid var(--line)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand)' }}>
              Stack Architecture Configured
            </div>
            <h1 style={{ font: '800 clamp(1.8rem, 3.5vw, 2.5rem)/1.15 var(--display)', letterSpacing: '-0.02em', margin: '12px 0 6px', color: 'var(--ink)' }}>
              Your Tailored GTM Architecture
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0 }}>
              Tailored for <strong>{OBJECTIVES.find((o) => o.id === selectedObjective)?.title}</strong> with CRM integration for <strong>{selectedCrm}</strong> ({selectedRegion === 'eu' ? 'EU/EMEA compliant' : 'Global coverage'}).
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
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
              + ~$24–$48/mo infrastructure (secondary domains &amp; inboxes)
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
                {bTools.map(({ tool, role, why, pricingDisplay, pricingType, integrationNote, isRetainedExisting, alternativesConsidered }) => {
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

                        {alternativesConsidered.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                            <strong style={{ color: 'var(--ink)' }}>Alternatives evaluated:</strong> {alternativesConsidered.join(', ')}
                          </div>
                        )}

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
          {STANDARD_AFFILIATE_DISCLOSURE} Pricing estimates reflect verified base software plans. Quote-based enterprise vendors require custom contracts.
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

      {/* Blueprint context banner if arriving from a Use-Case Blueprint */}
      {useCaseData && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            fontSize: '0.875rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span>
            <b>Target Blueprint:</b> {useCaseData.title}
          </span>
          <Link
            href={`/use-cases/${useCaseData.slug}`}
            style={{ color: '#1d4ed8', fontWeight: 600, fontSize: '0.8125rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View Blueprint ↗
          </Link>
        </div>
      )}

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

      {/* Step 5: Team Size & Regional Compliance */}
      {step === 5 && (
        <>
          <h1 className="qh">What is your team size and operating region?</h1>
          <p className="help">Calibrates operational complexity, seat licensing, and geographic compliance (e.g. EU GDPR vs US data graphs).</p>
          
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Team Size
            </span>
            <div className="choices">
              {TEAM_SIZES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`choice ${selectedTeamSize === t.id ? 'active' : ''}`}
                  style={{ textAlign: 'left', fontWeight: 600, padding: '14px 20px', border: selectedTeamSize === t.id ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                  onClick={() => setSelectedTeamSize(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Operating Region &amp; Data Compliance
            </span>
            <div className="choices">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`choice ${selectedRegion === r.id ? 'active' : ''}`}
                  style={{ textAlign: 'left', fontWeight: 600, padding: '14px 20px', border: selectedRegion === r.id ? '2px solid var(--brand)' : '1px solid var(--line)' }}
                  onClick={() => setSelectedRegion(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="qnav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(4)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(6)}
            >
              Continue to Existing Tools →
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
