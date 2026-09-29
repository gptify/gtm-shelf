export interface StackToolItem {
  toolSlug: string;
  toolName: string;
  role: string;
  whyChosen: string;
  estimatedCost: string;
  replaces: string;
  categoryName: string;
}

export interface StackWorkflowStep {
  step: number;
  name: string;
  description: string;
  toolSlugs: string[];
}

export interface StackTradeoff {
  point: string;
  mitigation: string;
}

export interface StackAlternative {
  role: string;
  alternativeSlug: string;
  alternativeName: string;
  reason: string;
}

export interface GTMStack {
  id: string;
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  category: string;
  targetTeam: string;
  monthlyCostEstimate: string;
  annualSavingsEstimate: string;
  setupTime: string;
  summary: string;
  description: string[];
  workflowPipeline: StackWorkflowStep[];
  tools: StackToolItem[];
  tradeoffs: StackTradeoff[];
  alternatives: StackAlternative[];
  featured: boolean;
}

export const GTM_STACKS: GTMStack[] = [
  {
    id: 'modern-outbound-stack',
    slug: 'modern-outbound-stack-under-500',
    title: 'The $500/mo Modern Outbound Stack',
    badge: 'Most Popular for SDR Teams',
    subtitle: 'Full outbound pipeline generation engine with AI enrichment and safe multichannel delivery for high-velocity teams under $500/mo.',
    category: 'Outbound & Prospecting',
    targetTeam: '1–3 SDRs, B2B founders, or growth agencies',
    monthlyCostEstimate: '$424 – $474 / mo',
    annualSavingsEstimate: '$18,000+ / yr vs. ZoomInfo + SalesLoft',
    setupTime: '2–3 days',
    summary: 'A modular, high-deliverability outbound engine that decouples data sourcing from deliverability. Avoid multi-thousand dollar annual lock-ins while getting superior enrichment depth.',
    description: [
      'Legacy sales stacks force organizations into rigid annual contracts with ZoomInfo, SalesLoft, or Outreach that easily cost $15,000 to $30,000 per year before sending a single email. In contrast, the modern outbound architecture decouples raw prospect data, table enrichment, and sending infrastructure.',
      'By pairing Apollo for raw discovery with Clay for waterfall enrichment, you verify emails across multiple data providers rather than relying on a single stale vendor. Instantly handles dedicated secondary domain rotation to protect your primary domain reputation, while HeyReach scales multi-account LinkedIn touchpoints without risking account bans.',
      'The result is a resilient outbound system that can generate 40–80 qualified meetings per month with under $500 in total software overhead.'
    ],
    workflowPipeline: [
      {
        step: 1,
        name: 'List Building & Account Filtering',
        description: 'Filter verified ICP accounts and buyer personas by headcounts, funding, technology tags, and job openings.',
        toolSlugs: ['apollo', 'cognism']
      },
      {
        step: 2,
        name: 'Waterfall Enrichment & AI Personalization',
        description: 'Enrich records through Clay across multiple data vendors, scrape LinkedIn profiles, and generate context-driven first lines.',
        toolSlugs: ['clay']
      },
      {
        step: 3,
        name: 'Cold Email Sequenced at Scale',
        description: 'Distribute personalized cold email campaigns across 10+ secondary inboxes with automated warmup and unibox inbox management.',
        toolSlugs: ['instantly']
      },
      {
        step: 4,
        name: 'Multichannel LinkedIn Touchpoints',
        description: 'Sync enriched prospects to automated LinkedIn connection requests, profile visits, and follow-ups with smart sender rotation.',
        toolSlugs: ['heyreach']
      }
    ],
    tools: [
      {
        toolSlug: 'apollo',
        toolName: 'Apollo.io',
        role: 'Raw B2B Lead Sourcing & Intent Data',
        whyChosen: 'Massive database of 275M+ contacts with built-in intent signals at an accessible entry price point.',
        estimatedCost: '$99 / user / mo',
        replaces: 'ZoomInfo ($15,000/yr minimum)',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'clay',
        toolName: 'Clay',
        role: 'Waterfall Enrichment & AI Research',
        whyChosen: 'Chains 50+ data providers in real time so you only pay for verified emails; writes custom AI research snippets.',
        estimatedCost: '$149 / mo (Explorer Plan)',
        replaces: 'Manual SDR research & expensive custom scrapers',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'instantly',
        toolName: 'Instantly',
        role: 'Cold Email Warmup & Unlimited Senders',
        whyChosen: 'Flat-fee pricing with unlimited email account connections, automated deliverability monitoring, and unibox management.',
        estimatedCost: '$97 / mo (Hypergrowth)',
        replaces: 'SalesLoft / Outreach ($125+/seat/mo with inbox limits)',
        categoryName: 'Email outreach'
      },
      {
        toolSlug: 'heyreach',
        toolName: 'HeyReach',
        role: 'Safe Multi-Account LinkedIn Automation',
        whyChosen: 'Allows rotating multiple LinkedIn profiles within unified campaigns to safely scale social touchpoints.',
        estimatedCost: '$79 / mo',
        replaces: 'Single-account manual LinkedIn prospecting',
        categoryName: 'Email outreach'
      }
    ],
    tradeoffs: [
      {
        point: 'Requires secondary domain setup',
        mitigation: 'Purchase 2–3 dedicated sending domains on Google Workspace or Outlook and warm up for 14 days before launching.'
      },
      {
        point: 'Clay credit consumption needs monitoring',
        mitigation: 'Implement condition filters in Clay so credits are only spent on contacts that pass strict ICP criteria.'
      }
    ],
    alternatives: [
      {
        role: 'Lead Data (EU Focus)',
        alternativeSlug: 'cognism',
        alternativeName: 'Cognism',
        reason: 'Swap Apollo for Cognism if targeting European enterprise prospects requiring GDPR-compliant direct dials.'
      },
      {
        role: 'Cold Email Infrastructure',
        alternativeSlug: 'smartlead',
        alternativeName: 'Smartlead',
        reason: 'Direct substitute for Instantly with granular API capabilities and white-label agency client portals.'
      }
    ],
    featured: true
  },
  {
    id: 'founder-led-sales-stack',
    slug: 'founder-led-sales-stack',
    title: 'The Founder-Led B2B Sales Stack',
    badge: 'Best for 0 to 1 Startups',
    subtitle: 'Zero-admin sales stack designed for founders closing their first 50 customers without getting bogged down in CRM busywork.',
    category: 'Founder-Led Sales',
    targetTeam: 'Technical founders, early CEOs, and 1–2 person commercial teams',
    monthlyCostEstimate: '$67 – $317 / mo',
    annualSavingsEstimate: 'Saves 12+ hours per week of manual data entry',
    setupTime: '1 afternoon',
    summary: 'A frictionless sales operations stack that captures high-intent website visitors, auto-records meetings with AI action items, and turns calls into signed contracts with minimal effort.',
    description: [
      'Early-stage founders cannot afford to spend 2 hours a day logging call notes, manually updating deal stages, and copying fields into complex CRMs like Salesforce. You need software that works for you in the background while you focus on pitch delivery and customer discovery.',
      'This stack combines Koala for deanonymizing companies visiting your website with Folk for lightweight, high-speed relationship management. When a prospective buyer books a demo, Fathom sits in on the call, auto-generates structured notes, and syncs key pain points directly into your CRM.',
      'Once a verbal commitment is secured, PandaDoc enables instant quote generation with interactive CPQ calculations and legally binding e-signatures from any device.'
    ],
    workflowPipeline: [
      {
        step: 1,
        name: 'Website Visitor Deanonymization',
        description: 'Detect high-intent accounts browsing your pricing or docs before they even fill out a form.',
        toolSlugs: ['koala']
      },
      {
        step: 2,
        name: 'Lightweight Relationship Tracking',
        description: 'Track deals, investors, and advisor relationships in a clean Notion-like CRM interface.',
        toolSlugs: ['folk']
      },
      {
        step: 3,
        name: 'Automated Call Recording & Action Items',
        description: 'Record discovery demos with zero bot lag, generate executive summaries, and sync next steps to the deal record.',
        toolSlugs: ['fathom']
      },
      {
        step: 4,
        name: 'Proposal Generation & One-Click Signing',
        description: 'Send professional, interactive sales proposals and collect e-signatures in minutes.',
        toolSlugs: ['pandadoc']
      }
    ],
    tools: [
      {
        toolSlug: 'koala',
        toolName: 'Koala',
        role: 'Intent-Driven Visitor Deanonymization',
        whyChosen: 'Identifies anonymous companies visiting your website and sends instant Slack notifications with enriched buyer context.',
        estimatedCost: 'Free tier / $250/mo (Professional)',
        replaces: 'Clearbit Reveal ($12,000/yr)',
        categoryName: 'Intent signals'
      },
      {
        toolSlug: 'folk',
        toolName: 'Folk CRM',
        role: 'Lightweight Modern Deal & Contact CRM',
        whyChosen: 'Combines Notion simplicity with dedicated pipeline workflows, contact deduplication, and automated LinkedIn sync.',
        estimatedCost: '$24 / user / mo',
        replaces: 'Complex, bloated enterprise CRM instances',
        categoryName: 'CRM'
      },
      {
        toolSlug: 'fathom',
        toolName: 'Fathom',
        role: 'AI Notetaker & Call Intelligence',
        whyChosen: 'Completely free for solo use (or $24/mo team) with best-in-class meeting transcription accuracy and zero awkward bot latency.',
        estimatedCost: 'Free / $24 / user / mo',
        replaces: 'Gong ($1,400/user/yr + platform fees)',
        categoryName: 'Meeting notes'
      },
      {
        toolSlug: 'pandadoc',
        toolName: 'PandaDoc',
        role: 'Proposals, Quotes & E-Signatures',
        whyChosen: 'Pre-built proposal templates, dynamic quote pricing tables, and legal e-signatures in one unified dashboard.',
        estimatedCost: 'Free / $19 / user / mo',
        replaces: 'DocuSign ($40/mo) + manual PDF generation',
        categoryName: 'CRM'
      }
    ],
    tradeoffs: [
      {
        point: 'Folk is not suited for 50+ sales rep organizations',
        mitigation: 'Ideal for 1–10 person teams. When scaling beyond 10 dedicated reps, migrate to HubSpot or Attio.'
      },
      {
        point: 'Koala free tier limits monthly visitors',
        mitigation: 'Start on the generous 250 deanonymized account free tier, then upgrade once pipeline revenue justifies it.'
      }
    ],
    alternatives: [
      {
        role: 'CRM Platform',
        alternativeSlug: 'attio',
        alternativeName: 'Attio',
        reason: 'Choose Attio if your product requires complex custom data models and real-time product-led usage attributes.'
      },
      {
        role: 'Meeting Intelligence',
        alternativeSlug: 'fireflies-ai',
        alternativeName: 'Fireflies.ai',
        reason: 'Great alternative to Fathom if you require multi-language transcriptions or self-hosted audio storage.'
      }
    ],
    featured: true
  },
  {
    id: 'hubspot-ai-native-stack',
    slug: 'hubspot-ai-native-stack',
    title: 'The HubSpot AI-Native Stack',
    badge: 'Best for Scaleups on HubSpot',
    subtitle: 'Supercharge your HubSpot CRM with modern AI enrichment, multichannel social outreach, and proactive customer retention.',
    category: 'HubSpot Ecosystem',
    targetTeam: 'Mid-market B2B teams (10–100 employees) built around HubSpot',
    monthlyCostEstimate: '$590 – $680 / mo base',
    annualSavingsEstimate: '$30,000+ saved vs. moving to Salesforce enterprise',
    setupTime: '3–5 days',
    summary: 'A unified revenue architecture that keeps HubSpot as your single source of truth while unlocking modern AI waterfall enrichment and automated retention alerts.',
    description: [
      'Many growing B2B companies consider abandoning HubSpot for Salesforce simply to gain access to complex data pipelines and enterprise revenue intelligence. That migration typically costs $50,000+ in consultant fees and months of downtime.',
      'The modern alternative is an AI-native layer surrounding your existing HubSpot instance. By syncing Clay directly into HubSpot custom properties, your sales reps get 50+ data sources without leaving their CRM views.',
      'Add HeyReach for multi-account LinkedIn sequencing and Vitally for customer success health scores, and you get an enterprise-grade revenue engine at a fraction of the implementation complexity.'
    ],
    workflowPipeline: [
      {
        step: 1,
        name: 'HubSpot CRM as Single Source of Truth',
        description: 'Maintain clean pipeline stages, automated email sequences, and deal stages in HubSpot Sales Hub.',
        toolSlugs: ['hubspot-sales-hub']
      },
      {
        step: 2,
        name: 'Two-Way AI Waterfall Enrichment',
        description: 'Automatically enrich inbound HubSpot leads with tech stacks, headcounts, and verified phone numbers.',
        toolSlugs: ['clay']
      },
      {
        step: 3,
        name: 'Omnichannel LinkedIn Prospecting',
        description: 'Execute coordinated LinkedIn touches that automatically sync activity and replies back into HubSpot contacts.',
        toolSlugs: ['heyreach']
      },
      {
        step: 4,
        name: 'Proactive Health Scoring & Expansion',
        description: 'Track customer product health, usage milestones, and renewal risks with two-way HubSpot deal sync.',
        toolSlugs: ['vitally']
      }
    ],
    tools: [
      {
        toolSlug: 'hubspot-sales-hub',
        toolName: 'HubSpot Sales Hub',
        role: 'Core CRM & Revenue Execution Hub',
        whyChosen: 'Native Breeze AI features, seamless UI adoption, and world-class API ecosystem for mid-market teams.',
        estimatedCost: '$90 – $150 / user / mo',
        replaces: 'Salesforce Sales Cloud + 3rd party sync connectors',
        categoryName: 'CRM'
      },
      {
        toolSlug: 'clay',
        toolName: 'Clay',
        role: 'Two-Way HubSpot Data Enrichment',
        whyChosen: 'Automatically refreshes stale CRM records and enriches newly created inbound leads in real time.',
        estimatedCost: '$149 / mo',
        replaces: 'ZoomInfo Enrich ($10,000/yr add-on)',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'heyreach',
        toolName: 'HeyReach',
        role: 'LinkedIn Prospecting Synced to HubSpot',
        whyChosen: 'Connects sales reps LinkedIn outreach directly to HubSpot contact records without manual CSV uploads.',
        estimatedCost: '$79 / mo',
        replaces: 'Manual social selling workflows',
        categoryName: 'Email outreach'
      },
      {
        toolSlug: 'vitally',
        toolName: 'Vitally',
        role: 'Customer Health Scoring & CS Automation',
        whyChosen: 'Bi-directional HubSpot sync connects post-sale customer onboarding, health scores, and renewal tracking.',
        estimatedCost: '$299 / mo base',
        replaces: 'Gainsight ($25,000/yr enterprise contracts)',
        categoryName: 'Email and lifecycle'
      }
    ],
    tradeoffs: [
      {
        point: 'Requires webhook and API configuration in Clay',
        mitigation: 'Use Clay pre-built HubSpot templates to set up the two-way sync in under 30 minutes.'
      },
      {
        point: 'Vitally requires clean customer identification keys',
        mitigation: 'Ensure every HubSpot company record contains either a domain name or internal company ID.'
      }
    ],
    alternatives: [
      {
        role: 'Customer Success & Retention',
        alternativeSlug: 'churnzero',
        alternativeName: 'ChurnZero',
        reason: 'Opt for ChurnZero if your company requires deeply customized in-app walkthroughs and enterprise health formulas.'
      }
    ],
    featured: true
  },
  {
    id: 'modern-retention-expansion-stack',
    slug: 'modern-retention-expansion-stack',
    title: 'The Modern Retention & Expansion Stack',
    badge: 'Net Revenue Retention (NRR)',
    subtitle: 'Turn reactive customer success firefighting into proactive churn prevention and account expansion with automated AI alerts.',
    category: 'Customer Success & Growth',
    targetTeam: 'CS leaders, account managers, and growth product managers',
    monthlyCostEstimate: '$423 – $650 / mo',
    annualSavingsEstimate: 'Reduces preventable churn by 15–25%',
    setupTime: '3–5 days',
    summary: 'A proactive retention engine that unifies product telemetry, executive check-in summaries, and automated lifecycle messaging to maximize Net Revenue Retention.',
    description: [
      'Customer churn is rarely a surprise on renewal day—it begins weeks or months earlier when user activity declines, key champions leave, or support tickets escalate without resolution.',
      'This retention stack bridges the gap between raw product telemetry and high-touch account management. Vitally unifies account health scores, while Fathom records customer quarterly business reviews (QBRs) and surfaces unaddressed objections.',
      'When user activity dips below critical thresholds, Customer.io automatically fires personalized re-engagement campaigns to users, prompting them to unlock maximum product value before churn occurs.'
    ],
    workflowPipeline: [
      {
        step: 1,
        name: 'Account Health Scoring & Churn Signals',
        description: 'Aggregate login frequency, feature usage, and support tickets into an automated 0–100 health score.',
        toolSlugs: ['vitally', 'churnzero']
      },
      {
        step: 2,
        name: 'Executive QBR Recording & Sentiment Analysis',
        description: 'Record customer check-in calls with Fathom, automatically extracting feature requests, risks, and sentiment.',
        toolSlugs: ['fathom']
      },
      {
        step: 3,
        name: 'Behavior-Triggered Re-Engagement',
        description: 'Trigger targeted automated emails and in-app messages to users whose activity has slowed down.',
        toolSlugs: ['customer-io']
      },
      {
        step: 4,
        name: 'Expansion Pipeline Identification',
        description: 'Flag power accounts nearing license capacity or hitting usage limits for account executive expansion.',
        toolSlugs: ['vitally']
      }
    ],
    tools: [
      {
        toolSlug: 'vitally',
        toolName: 'Vitally',
        role: 'Unified Customer 360 & Health Scoring',
        whyChosen: 'Real-time account health scoring, intuitive CS playbooks, and modern integrations with Segment, Mixpanel, and CRMs.',
        estimatedCost: '$299 / mo base',
        replaces: 'Gainsight / Totango ($20k+ implementations)',
        categoryName: 'Email and lifecycle'
      },
      {
        toolSlug: 'churnzero',
        toolName: 'ChurnZero',
        role: 'Customer Success AI & Churn Prevention',
        whyChosen: 'Predictive churn intelligence with native Customer Success AI that drafts tailored renewal strategies.',
        estimatedCost: 'Custom quote',
        replaces: 'Spreadsheet-based renewal tracking',
        categoryName: 'Revenue forecasting'
      },
      {
        toolSlug: 'fathom',
        toolName: 'Fathom',
        role: 'CS Meeting Notes & Objection Tracking',
        whyChosen: 'Transcribes customer meetings, highlights churn risks and customer complaints, and updates CRM deal notes.',
        estimatedCost: '$24 / user / mo',
        replaces: 'Manual CS call note taking',
        categoryName: 'Meeting notes'
      },
      {
        toolSlug: 'customer-io',
        toolName: 'Customer.io',
        role: 'Behavior-Driven Lifecycle Engagement',
        whyChosen: 'Powerful event-driven automation engine that sends targeted emails when user milestones are missed.',
        estimatedCost: '$100 / mo base',
        replaces: 'Generic batch-and-blast marketing newsletters',
        categoryName: 'Email and lifecycle'
      }
    ],
    tradeoffs: [
      {
        point: 'Requires tracking key product analytics events',
        mitigation: 'Implement 3–5 core telemetry events (e.g. user_logged_in, export_created, invite_sent) via Segment or direct webhook.'
      }
    ],
    alternatives: [
      {
        role: 'Lifecycle Messaging',
        alternativeSlug: 'userlist',
        alternativeName: 'Userlist',
        reason: 'Simpler, purpose-built lifecycle email automation tailored specifically for early-stage B2B SaaS founders.'
      }
    ],
    featured: true
  }
];

export function getStackBySlug(slug: string): GTMStack | undefined {
  return GTM_STACKS.find((s) => s.slug === slug || s.id === slug);
}

export function getAllStacks(): GTMStack[] {
  return GTM_STACKS;
}
