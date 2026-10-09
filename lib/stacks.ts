export interface StackToolItem {
  toolSlug: string;
  toolName: string;
  role: string;
  whyChosen: string;
  estimatedCost: string;
  planRequirement: string;
  seatBasis: string;
  integrations: string[];
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

export interface InfrastructureCostItem {
  item: string;
  cost: string;
  note: string;
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
  verifiedDate: string;
  summary: string;
  description: string[];
  workflowPipeline: StackWorkflowStep[];
  tools: StackToolItem[];
  infrastructureCosts: InfrastructureCostItem[];
  tradeoffs: StackTradeoff[];
  alternatives: StackAlternative[];
  featured: boolean;
}

export const GTM_STACKS: GTMStack[] = [
  {
    id: 'modern-outbound-stack',
    slug: 'modern-outbound-stack-under-500',
    title: 'The $500/mo Modern Outbound Stack',
    badge: 'Architectural Blueprint',
    subtitle: 'Modular outbound pipeline generation architecture with AI waterfall enrichment and multi-inbox rotation under $500/mo base software cost.',
    category: 'Outbound & Prospecting',
    targetTeam: '1–3 SDRs, B2B founders, or growth agencies',
    monthlyCostEstimate: '$424 – $474 / mo (Base Software)',
    annualSavingsEstimate: 'Lower entry commitment vs. enterprise annual minimums',
    setupTime: '3–5 business days (including DNS warmup)',
    verifiedDate: 'October 2026',
    summary: 'A modular outbound engine that decouples prospect sourcing, data enrichment, and email deliverability. Avoid multi-thousand dollar annual lock-ins while maintaining granular deliverability control.',
    description: [
      'Enterprise sales platforms frequently bundle data and sending infrastructure into multi-seat annual contracts (such as ZoomInfo or legacy sales engagement suites) with substantial upfront commitments. The modern outbound architecture decouples raw prospect discovery, table enrichment, and sending infrastructure.',
      'By pairing Apollo for raw discovery with Clay for waterfall enrichment, you query multiple data providers to maximize verified work email coverage before triggering outreach. Instantly handles dedicated secondary domain rotation to protect primary domain reputation, while HeyReach automates multi-profile LinkedIn touchpoints.',
      'This architecture provides verified contact coverage and scalable inbox rotation under $500/mo in core software licenses. Final pipeline and meeting generation rates will naturally vary based on ICP alignment, offer resonance, copy quality, and market responsiveness.'
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
        whyChosen: 'Extensive database of 275M+ business contacts with built-in intent signals at an accessible entry price point.',
        estimatedCost: '$99 / user / mo',
        planRequirement: 'Basic ($49) or Professional ($99) Tier',
        seatBasis: 'Per paid user seat / month',
        integrations: ['HubSpot', 'Salesforce', 'Zapier', 'CSV Export'],
        replaces: 'Single-source enterprise databases with annual lock-in',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'clay',
        toolName: 'Clay',
        role: 'Waterfall Enrichment & AI Research',
        whyChosen: 'Chains 50+ data providers in sequence so you only pay for verified emails; generates custom AI research snippets.',
        estimatedCost: '$149 / mo (Explorer Plan)',
        planRequirement: 'Explorer Tier (2,000 credits/mo included)',
        seatBasis: 'Workspace fee + credit usage',
        integrations: ['HubSpot', 'Salesforce', 'Apollo', 'Webhook', 'HTTP API'],
        replaces: 'Manual SDR prospect research & one-off scraping scripts',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'instantly',
        toolName: 'Instantly',
        role: 'Cold Email Warmup & Unlimited Senders',
        whyChosen: 'Flat-fee pricing with unlimited email account connections, automated deliverability monitoring, and unibox management.',
        estimatedCost: '$97 / mo (Hypergrowth)',
        planRequirement: 'Hypergrowth Tier',
        seatBasis: 'Flat monthly workspace fee (unlimited email senders)',
        integrations: ['Webhooks', 'Zapier', 'HubSpot (via webhook)'],
        replaces: 'Seat-limited sales engagement tools ($120+/rep/mo)',
        categoryName: 'Email outreach'
      },
      {
        toolSlug: 'heyreach',
        toolName: 'HeyReach',
        role: 'Multi-Account LinkedIn Automation',
        whyChosen: 'Rotates campaign activity across multiple sender profiles to distribute social touchpoints. Note: all third-party social automation carries inherent platform risk; teams must follow conservative daily limits.',
        estimatedCost: '$79 / mo',
        planRequirement: 'Standard Plan (up to 3 LinkedIn accounts)',
        seatBasis: 'Account slot subscription',
        integrations: ['HubSpot', 'Webhooks', 'Zapier'],
        replaces: 'Manual single-profile social prospecting',
        categoryName: 'Email outreach'
      }
    ],
    infrastructureCosts: [
      {
        item: '2–3 Secondary Sending Domains',
        cost: '$10 – $12 / domain / yr',
        note: 'Crucial for isolating cold outreach and protecting primary root domain reputation.'
      },
      {
        item: 'Dedicated Mailbox Licenses (Google / MS 365)',
        cost: '$6 / mailbox / mo',
        note: 'Recommended 4–8 dedicated sender mailboxes (~$24–$48/mo additional overhead).'
      },
      {
        item: 'DNS Authentication (SPF, DKIM, DMARC)',
        cost: '$0',
        note: 'Configured directly in your domain registrar DNS records prior to warmup.'
      },
      {
        item: 'Clay Credit Overages (Optional)',
        cost: 'Variable by volume',
        note: 'Applicable only when monthly prospect enrichment exceeds 2,000 rows.'
      }
    ],
    tradeoffs: [
      {
        point: 'Requires dedicated secondary domain setup and warmup',
        mitigation: 'Purchase 2–3 dedicated sending domains on Google Workspace or Microsoft 365, configure DNS records, and warm up for 14 days before launching campaigns.'
      },
      {
        point: 'Clay credit consumption needs active monitoring',
        mitigation: 'Implement condition filters in Clay so credits are only spent on contacts that pass strict ICP criteria.'
      },
      {
        point: 'Social automation carries platform terms-of-service considerations',
        mitigation: 'Keep daily LinkedIn connection requests within conservative thresholds (15–20 per sender profile) and use randomized delay intervals.'
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
    badge: '0-to-1 Commercial Motion',
    subtitle: 'Streamlined sales operations stack designed for founders closing their initial customer cohorts without CRM configuration complexity.',
    category: 'Founder-Led Sales',
    targetTeam: 'Technical founders, early CEOs, and 1–2 person commercial teams',
    monthlyCostEstimate: '$67 – $317 / mo',
    annualSavingsEstimate: 'Automates call summary generation and CRM note logging',
    setupTime: '1–2 business days',
    verifiedDate: 'October 2026',
    summary: 'A low-admin commercial operations stack that surfaces high-intent website accounts, automatically records discovery calls with structured action items, and generates interactive proposals.',
    description: [
      'Early-stage founders cannot afford several hours each week logging call notes, manually advancing deal stages, and maintaining complex enterprise CRM schemas. Early commercial motions require agile tooling that automates administrative capture in the background.',
      'This stack combines Koala for deanonymizing accounts visiting key website pages with Folk for lightweight, high-speed contact and pipeline management. When prospects schedule discussions, Fathom captures meeting transcripts, generates AI action items, and syncs key takeaways directly into deal records.',
      'When moving to close, PandaDoc supports customized sales quotes and legally binding e-signatures from desktop or mobile devices.'
    ],
    workflowPipeline: [
      {
        step: 1,
        name: 'Website Visitor Deanonymization',
        description: 'Detect high-intent accounts browsing your pricing or documentation pages before they fill out a form.',
        toolSlugs: ['koala']
      },
      {
        step: 2,
        name: 'Lightweight Relationship Tracking',
        description: 'Track deals, investors, and advisor relationships in a clean, high-speed CRM interface.',
        toolSlugs: ['folk']
      },
      {
        step: 3,
        name: 'Automated Call Recording & Action Items',
        description: 'Record discovery demos, generate executive summaries, and sync next steps to the deal record.',
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
        whyChosen: 'Identifies accounts visiting key website pages and delivers instant Slack notifications with enriched buyer context.',
        estimatedCost: 'Free tier / $250/mo (Professional)',
        planRequirement: 'Free Tier (up to 250 identified accounts) / Professional Tier',
        seatBasis: 'Domain traffic and identified account quota',
        integrations: ['Slack', 'HubSpot', 'Salesforce', 'Segment'],
        replaces: 'Complex enterprise IP deanonymization suites',
        categoryName: 'Intent signals'
      },
      {
        toolSlug: 'folk',
        toolName: 'Folk CRM',
        role: 'Lightweight Modern Deal & Contact CRM',
        whyChosen: 'Combines intuitive visual pipeline workflows with contact deduplication and Chrome-extension based contact syncing.',
        estimatedCost: '$24 / user / mo',
        planRequirement: 'Standard Plan',
        seatBasis: 'Per user / month ($24/seat)',
        integrations: ['Gmail', 'Google Calendar', 'LinkedIn (Extension)', 'Zapier'],
        replaces: 'Heavyweight enterprise CRM configurations',
        categoryName: 'CRM'
      },
      {
        toolSlug: 'fathom',
        toolName: 'Fathom',
        role: 'AI Notetaker & Call Intelligence',
        whyChosen: 'Free for individual users ($24/mo per user for Team Edition) with fast transcription and structured AI summary sync directly into CRM deals.',
        estimatedCost: 'Free / $24 / user / mo',
        planRequirement: 'Free for Individuals / Team Edition ($24/user/mo)',
        seatBasis: 'Per user / month',
        integrations: ['HubSpot', 'Salesforce', 'Close', 'Google Meet', 'Zoom'],
        replaces: 'Manual sales call note-taking and manual CRM updates',
        categoryName: 'Meeting notes'
      },
      {
        toolSlug: 'pandadoc',
        toolName: 'PandaDoc',
        role: 'Proposals, Quotes & E-Signatures',
        whyChosen: 'Pre-built proposal templates, dynamic quote pricing tables, and binding e-signatures in one unified dashboard.',
        estimatedCost: '$19 – $49 / user / mo',
        planRequirement: 'Essentials Plan ($19/mo) / Business ($49/mo)',
        seatBasis: 'Per user / month',
        integrations: ['HubSpot', 'Zapier', 'Stripe'],
        replaces: 'Manual PDF proposal preparation and separate e-sign tools',
        categoryName: 'CRM'
      }
    ],
    infrastructureCosts: [
      {
        item: 'Workspace Video Conferencing (Zoom / Google Meet)',
        cost: 'Free / $13 – $15 / mo',
        note: 'Standard host account for hosting client demos.'
      },
      {
        item: 'Domain Business Email',
        cost: '$6 / user / mo',
        note: 'Google Workspace or Microsoft 365 standard business mailbox.'
      }
    ],
    tradeoffs: [
      {
        point: 'Folk is designed for lean pipelines rather than complex enterprise hierarchies',
        mitigation: 'Optimized for 1–10 person teams. When scaling to specialized sales teams (SDRs, AEs, AMs), migrate data into HubSpot or Salesforce.'
      },
      {
        point: 'Koala free tier limits monthly identified accounts',
        mitigation: 'Evaluate traffic conversion on the 250 identified account tier before upgrading to higher monthly visitor quotas.'
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
    badge: 'HubSpot Scaleup Architecture',
    subtitle: 'Augment your HubSpot instance with multi-source waterfall data enrichment, multichannel outreach, and customer retention telemetry.',
    category: 'HubSpot Ecosystem',
    targetTeam: 'Mid-market B2B teams (10–100 employees) built around HubSpot',
    monthlyCostEstimate: '$590 – $680 / mo base software',
    annualSavingsEstimate: 'Avoids complex enterprise CRM migration and consultant overhead',
    setupTime: '1–2 weeks for field mapping and workflow validation',
    verifiedDate: 'October 2026',
    summary: 'A unified revenue architecture that preserves HubSpot as your central system of record while integrating multi-provider AI waterfall enrichment and automated CS health monitoring.',
    description: [
      'Growing B2B organizations often consider migrating from HubSpot to alternative platforms when needing multi-source data enrichment or advanced revenue analytics. However, full CRM migrations frequently introduce substantial consultant expenses, pipeline disruption, and lengthy implementation timelines.',
      'An effective alternative is deploying an AI-native enrichment and engagement layer around your existing HubSpot instance. By configuring Clay to sync directly with HubSpot custom contact and company properties, revenue teams gain access to dozens of data vendors without leaving standard CRM views.',
      'Adding HeyReach for coordinated LinkedIn messaging and Vitally for customer health telemetry creates a comprehensive revenue engine while keeping operational workflows familiar.'
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
        planRequirement: 'Sales Hub Professional ($90–$100/seat/mo) or Enterprise',
        seatBasis: 'Per paid sales seat / month',
        integrations: ['Native HubSpot App Marketplace', 'REST API', 'Webhooks'],
        replaces: 'Disparate point CRM tools with disconnected data',
        categoryName: 'CRM'
      },
      {
        toolSlug: 'clay',
        toolName: 'Clay',
        role: 'Two-Way HubSpot Data Enrichment',
        whyChosen: 'Automatically refreshes stale CRM records and enriches newly created inbound leads across 50+ data sources in real time.',
        estimatedCost: '$149 – $349 / mo',
        planRequirement: 'Explorer / Pro Tier',
        seatBasis: 'Workspace subscription + credit usage',
        integrations: ['HubSpot native two-way sync', 'Salesforce', 'Webhooks'],
        replaces: 'Single-vendor CRM enrichment add-ons',
        categoryName: 'Lead data'
      },
      {
        toolSlug: 'heyreach',
        toolName: 'HeyReach',
        role: 'Multi-Account LinkedIn Automation',
        whyChosen: 'Connects sales reps LinkedIn outreach directly to HubSpot contact records with bi-directional activity logging. Follows conservative daily sending limits.',
        estimatedCost: '$79 / mo',
        planRequirement: 'Standard Plan',
        seatBasis: 'Account slot subscription',
        integrations: ['HubSpot native integration', 'Webhooks'],
        replaces: 'Manual social selling copy-pasting',
        categoryName: 'Email outreach'
      },
      {
        toolSlug: 'vitally',
        toolName: 'Vitally',
        role: 'Customer Health Scoring & CS Automation',
        whyChosen: 'Bi-directional HubSpot sync connects post-sale customer onboarding, health scores, and renewal tracking.',
        estimatedCost: '$299 / mo base',
        planRequirement: 'Base Tier (varies by tracked ARR/customer count)',
        seatBasis: 'Base platform fee + user seats',
        integrations: ['HubSpot native two-way sync', 'Segment', 'Mixpanel', 'Slack'],
        replaces: 'Spreadsheet-based customer retention tracking',
        categoryName: 'Email and lifecycle'
      }
    ],
    infrastructureCosts: [
      {
        item: 'HubSpot API & Custom Properties',
        cost: 'Included with HubSpot Professional',
        note: 'Standard API limits apply per subscription tier.'
      },
      {
        item: 'Webhook Orchestration (Make / Zapier if needed)',
        cost: '$20 – $50 / mo',
        note: 'Optional for bespoke custom endpoint triggers.'
      }
    ],
    tradeoffs: [
      {
        point: 'Two-way CRM syncing requires disciplined property mapping',
        mitigation: 'Define exact property naming standards and test field sync behavior in a HubSpot sandbox or test view prior to bulk enrichment runs.'
      },
      {
        point: 'Vitally requires clean unique customer identifier keys',
        mitigation: 'Ensure every HubSpot company record maintains a verified company domain or unique account ID.'
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
    badge: 'Customer Success & NRR',
    subtitle: 'Transform reactive churn firefighting into proactive account health monitoring and milestone-driven lifecycle messaging.',
    category: 'Customer Success & Growth',
    targetTeam: 'CS leaders, account managers, and growth product managers',
    monthlyCostEstimate: '$423 – $650 / mo base software',
    annualSavingsEstimate: 'Surfaces proactive health risks and declining usage signals before renewals',
    setupTime: '1–2 weeks for telemetry mapping and lifecycle triggers',
    verifiedDate: 'October 2026',
    summary: 'A proactive retention architecture combining product telemetry, call intelligence, and automated lifecycle communication to surface account risks and expansion opportunities.',
    description: [
      'Customer churn rarely occurs without warning—it typically follows weeks of declining login frequency, departure of key internal champions, or unresolved operational bottlenecks.',
      'This retention stack bridges the gap between raw product usage data and relationship management. Vitally aggregates telemetry into composite account health scores, while Fathom records quarterly business reviews (QBRs) and highlights unaddressed customer objections.',
      'When product milestones are missed or key feature adoption stalls, Customer.io triggers targeted lifecycle communication to guide users back into core value workflows before account risk compounds.'
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
        planRequirement: 'Starter / Growth Plan',
        seatBasis: 'Base tier + CS user seats',
        integrations: ['HubSpot', 'Salesforce', 'Segment', 'Mixpanel'],
        replaces: 'Disparate renewal tracking spreadsheets',
        categoryName: 'Email and lifecycle'
      },
      {
        toolSlug: 'churnzero',
        toolName: 'ChurnZero',
        role: 'Customer Success AI & Churn Prevention',
        whyChosen: 'Predictive churn intelligence with native Customer Success AI that drafts tailored renewal strategies.',
        estimatedCost: 'Custom quote',
        planRequirement: 'Custom quote based on customer count',
        seatBasis: 'Platform license',
        integrations: ['Salesforce', 'HubSpot', 'Pendo'],
        replaces: 'Manual renewal risk checklists',
        categoryName: 'Revenue forecasting'
      },
      {
        toolSlug: 'fathom',
        toolName: 'Fathom',
        role: 'CS Meeting Notes & Objection Tracking',
        whyChosen: 'Transcribes customer meetings, highlights churn risks and customer complaints, and updates CRM deal notes.',
        estimatedCost: '$24 / user / mo',
        planRequirement: 'Team Edition ($24/seat/mo)',
        seatBasis: 'Per user / month',
        integrations: ['HubSpot', 'Salesforce', 'Zoom', 'Google Meet'],
        replaces: 'Manual CS call summary documentation',
        categoryName: 'Meeting notes'
      },
      {
        toolSlug: 'customer-io',
        toolName: 'Customer.io',
        role: 'Behavior-Driven Lifecycle Engagement',
        whyChosen: 'Powerful event-driven automation engine that sends targeted emails when user milestones are missed.',
        estimatedCost: '$100 / mo base',
        planRequirement: 'Essentials Plan (starts at 5,000 profiles)',
        seatBasis: 'Profile / monthly active user tier',
        integrations: ['Segment', 'RudderStack', 'Webhooks', 'Zapier'],
        replaces: 'Non-contextual batch email newsletters',
        categoryName: 'Email and lifecycle'
      }
    ],
    infrastructureCosts: [
      {
        item: 'Product Telemetry Pipeline (Segment / RudderStack)',
        cost: 'Free tier / usage-based',
        note: 'Transmits product events to Vitally and Customer.io.'
      },
      {
        item: 'Custom Transactional Email Domain',
        cost: '$10 – $15 / domain / yr',
        note: 'Configured with SPF, DKIM, and DMARC for lifecycle deliverability.'
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
