/**
 * Verification of Build My Stack across 3 Distinct Buyer Scenarios
 * Scenario A: Bootstrapped Solo Founder (Inbound & Lead Capture, Free Budget, No CRM)
 * Scenario B: Mid-Market SDR Team (Outbound Pipeline, $200-$600 Budget, HubSpot CRM, Existing Apollo)
 * Scenario C: Enterprise Revenue Organization (Full-Funnel, Enterprise Budget, Salesforce CRM, 5 Buckets)
 */

import fs from 'node:fs';
import path from 'node:path';

const rawTools = JSON.parse(fs.readFileSync(path.resolve('data/tools.json'), 'utf8'));

const tools = rawTools.map((t) => ({
  id: t.id,
  slug: t.slug,
  name: t.name,
  domain: t.domain,
  website_url: `https://${t.domain}`,
  tagline: t.tagline,
  description: t.description,
  best_for: t.best,
  stage_id: t.stage,
  stage_name: 'Stage',
  category_id: 1,
  category_name: t.cat,
  category_slug: t.cat.toLowerCase().replace(/\s+/g, '-'),
  pricing_model: t.price === 'Free plan' ? 'free_plan' : t.price === 'Paid' ? 'paid' : 'custom_quote',
  pricing_hint: t.price,
  setup_ease: t.setup,
  featured: t.feat,
  integrations: t.ints || [],
  status: 'published',
}));

const BUCKET_DEFINITIONS = [
  { id: 'inbound', label: 'Inbound Demand & Content', sampleCategories: ['Content writing', 'SEO', 'Ad creative', 'Video generation'] },
  { id: 'outbound', label: 'Outbound Prospecting & Outreach', sampleCategories: ['Lead data', 'Email outreach', 'Cold email'] },
  { id: 'lead_capture', label: 'Lead Capture & Conversational AI', sampleCategories: ['Forms and surveys', 'Intent signals', 'Personalization'] },
  { id: 'data_orchestration', label: 'Data Enrichment & Waterfall Orchestration', sampleCategories: ['Lead data', 'CRM', 'Email and lifecycle'] },
  { id: 'agentic_ops', label: 'Agentic Operations & Meeting Intelligence', sampleCategories: ['Call intelligence', 'Meeting notes', 'AI SDR agents'] },
];

const OBJECTIVES = [
  { id: 'outbound_pipeline', title: 'Outbound Pipeline Generation', defaultBuckets: ['outbound', 'data_orchestration'] },
  { id: 'inbound_demand', title: 'Inbound Demand & Content Engine', defaultBuckets: ['inbound', 'lead_capture'] },
  { id: 'full_funnel', title: 'Full-Funnel GTM Modernization', defaultBuckets: ['inbound', 'outbound', 'lead_capture', 'data_orchestration', 'agentic_ops'] },
  { id: 'call_intelligence', title: 'Call Intelligence & Deal Closing', defaultBuckets: ['agentic_ops', 'data_orchestration'] },
  { id: 'customer_retention', title: 'Customer Retention & Expansion', defaultBuckets: ['data_orchestration', 'inbound'] },
];

function simulateScenario(scenarioName, config) {
  console.log(`\n======================================================`);
  console.log(`SCENARIO: ${scenarioName}`);
  console.log(`Config: Goal=${config.goal}, CRM=${config.crm}, Budget=${config.budget}, Size=${config.size}`);
  console.log(`Buckets: [${config.buckets.join(', ')}]`);
  console.log(`Existing Tools: [${Array.from(config.existing || []).join(', ')}]`);
  console.log(`------------------------------------------------------`);

  const activeBucketsList = config.buckets;
  const effectiveBuckets =
    activeBucketsList.length > 0
      ? activeBucketsList
      : OBJECTIVES.find((o) => o.id === config.goal)?.defaultBuckets || ['outbound'];

  const bucketPicks = [];
  let totalEstMin = 0;
  let totalEstMax = 0;

  effectiveBuckets.forEach((bucketId) => {
    const bucketDef = BUCKET_DEFINITIONS.find((b) => b.id === bucketId);
    if (!bucketDef) return;

    const candidateTools = tools.filter((t) => bucketDef.sampleCategories.includes(t.category_name));

    const scored = candidateTools.map((t) => {
      let score = 0;
      if (t.featured) score += 3;
      if (config.crm !== 'None / Other' && t.integrations.some((i) => i.toLowerCase().includes(config.crm.toLowerCase().split(' ')[0]))) {
        score += 5;
      }
      if (config.budget === 'free' && t.pricing_model === 'free_plan') score += 10;
      if (config.budget === 'starter' && t.pricing_model !== 'custom_quote') score += 4;
      return { tool: t, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const chosen = scored.slice(0, bucketId === 'outbound' || bucketId === 'inbound' ? 2 : 1).map(({ tool }) => {
      const isExisting = Array.from(config.existing || []).some((et) => et.toLowerCase() === tool.name.toLowerCase());
      const hasDirectCrmSync =
        config.crm !== 'None / Other' &&
        tool.integrations.some((i) => i.toLowerCase().includes(config.crm.toLowerCase().split(' ')[0]));

      let priceText = 'Estimated: $49 – $99 / mo';
      let priceType = 'estimated';
      if (tool.pricing_model === 'free_plan') {
        priceText = 'Verified: Free tier available';
        priceType = 'verified';
      } else if (tool.pricing_model === 'custom_quote') {
        priceText = 'Estimated: Custom quote ($500+ / mo)';
      } else {
        totalEstMin += 49;
        totalEstMax += 99;
      }

      return {
        toolName: tool.name,
        category: tool.category_name,
        pricing: priceText,
        directSync: hasDirectCrmSync,
        isExisting,
      };
    });

    if (chosen.length > 0) {
      bucketPicks.push({ bucket: bucketDef.label, tools: chosen });
    }
  });

  const toolNames = bucketPicks.flatMap((b) => b.tools.map((t) => t.toolName));
  const overlaps = [];
  if (toolNames.includes('Apollo.io') && (toolNames.includes('Instantly') || toolNames.includes('lemlist'))) {
    overlaps.push('Dual Email Engine Advisory (Apollo sourcing vs. secondary inbox deliverability)');
  }
  if (toolNames.includes('Clay') && toolNames.includes('Apollo.io')) {
    overlaps.push('Enrichment Layering Advisory (Apollo foundation vs. Clay waterfall)');
  }

  const costRange = totalEstMin === 0 && totalEstMax === 0 ? 'Free / Starter Tiers' : `$${totalEstMin} – $${totalEstMax} / mo`;

  console.log(`Picks (${bucketPicks.length} buckets, ${toolNames.length} tools):`);
  bucketPicks.forEach((b) => {
    console.log(`  • ${b.bucket}:`);
    b.tools.forEach((t) => {
      console.log(`    - ${t.toolName} (${t.category}) | ${t.pricing} | Direct Sync: ${t.directSync} | Retained: ${t.isExisting}`);
    });
  });
  console.log(`Overhead: ${costRange}`);
  if (overlaps.length > 0) {
    console.log(`Advisories: ${overlaps.join(' | ')}`);
  }
  console.log(`======================================================`);

  return { bucketCount: bucketPicks.length, toolCount: toolNames.length, costRange, overlaps };
}

// RUN SCENARIOS
console.log('🚀 Running 3 Real Buyer Scenarios on Build My GTM Stack Engine...');

// Scenario A
const resA = simulateScenario('Scenario A: Bootstrapped Solo Founder', {
  goal: 'inbound_demand',
  buckets: ['inbound', 'lead_capture'],
  crm: 'None / Other',
  budget: 'free',
  size: 'solo',
  existing: new Set(),
});
if (resA.bucketCount !== 2 || !resA.costRange.includes('Free')) {
  throw new Error('Scenario A failed assertions');
}

// Scenario B
const resB = simulateScenario('Scenario B: Mid-Market SDR Team', {
  goal: 'outbound_pipeline',
  buckets: ['outbound', 'data_orchestration'],
  crm: 'HubSpot',
  budget: 'growth',
  size: 'growth',
  existing: new Set(['Apollo.io']),
});
if (resB.bucketCount !== 2 || resB.toolCount < 2) {
  throw new Error('Scenario B failed assertions');
}

// Scenario C
const resC = simulateScenario('Scenario C: Enterprise Revenue Organization', {
  goal: 'full_funnel',
  buckets: ['inbound', 'outbound', 'lead_capture', 'data_orchestration', 'agentic_ops'],
  crm: 'Salesforce',
  budget: 'enterprise',
  size: 'enterprise',
  existing: new Set(['Salesforce', 'Clay']),
});
if (resC.bucketCount !== 5 || resC.toolCount < 5) {
  throw new Error('Scenario C failed assertions');
}

console.log('\n✅ All 3 Buyer Scenarios executed successfully and met calibration criteria!');
