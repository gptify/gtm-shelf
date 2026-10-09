const fs = require('fs');
const path = require('path');

const useCases = [
  {
    id: "uc-01",
    slug: "crm-enrichment-waterfall",
    title: "Multi-Vendor Waterfall Email & Phone Enrichment for CRM Records",
    short_summary: "Sequence complementary enrichment APIs to discover missing work emails and direct phone numbers while avoiding duplicate database costs.",
    bucket: "Data & Orchestration",
    stage_id: 2,
    buyer: "RevOps Managers, BDR Leads, Growth Engineers",
    intended_outcome: "Improve contact discovery rates across secondary sources and track verified delivery metrics without manual rep research.",
    business_problem: "No single B2B data provider covers every geography or industry. Relying on one source leaves gaps in contact lists, while manual research takes hours away from selling.",
    prerequisites: [
      "CRM access with write permissions on Leads/Contacts (HubSpot, Salesforce, Pipedrive, or Attio)",
      "API keys for selected lookup providers (Apollo, Hunter, Dropcontact, Findymail)",
      "Clay or automation engine account to orchestrate the cascade"
    ],
    mini_preview: [
      { label: "Ingest Leads", icon: "database" },
      { label: "Cascade APIs", icon: "search" },
      { label: "Sync to CRM", icon: "check" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Ingest Incomplete Record",
        action_type: "trigger",
        description: "Trigger enrichment when a lead or contact is created without a verified work email or direct phone.",
        tool_slugs: ["hubspot-sales-hub", "attio"],
        tool_role: "CRM Record Source",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Primary Low-Cost Lookup",
        action_type: "enrich",
        description: "Query primary directory database for direct work email matching.",
        tool_slugs: ["apollo", "hunter"],
        tool_role: "Directory Lookup",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Fallback Algorithmic Cascade",
        action_type: "enrich",
        description: "If primary lookup yields no deliverable address, query secondary verification APIs.",
        tool_slugs: ["dropcontact", "findymail"],
        tool_role: "Secondary Waterfall",
        is_optional: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Catch-All Verification Gate",
        action_type: "approval",
        description: "Review contacts at accept-all/catch-all domains before adding to cold outreach.",
        tool_slugs: [],
        tool_role: "Human Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Catch-all domains need verification testing to protect sender reputation."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Sync Verified Record to CRM",
        action_type: "sync",
        description: "Write verified email, source metadata, and verification timestamp to CRM fields.",
        tool_slugs: ["hubspot-sales-hub", "attio", "pipedrive"],
        tool_role: "CRM Destination",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Ingest Incomplete Record",
        description: "Trigger an automation webhook upon new lead creation or CSV upload lacking verified email or phone.",
        recommended_action: "Set up real-time CRM webhook filtered on missing 'work_email' or 'phone' properties."
      },
      {
        step: 2,
        title: "Primary Low-Cost Lookup",
        description: "Query Apollo or Hunter for domain pattern validation and direct work email matching.",
        recommended_action: "Execute single credit lookup against primary database; exit cascade if confidence is high."
      },
      {
        step: 3,
        title: "Fallback Waterfall Cascade",
        description: "If primary status is unverifiable or risky, query Dropcontact or Findymail conditionally.",
        recommended_action: "Only invoke subsequent provider APIs when prior step returns empty or status is 'risky'."
      },
      {
        step: 4,
        title: "Catch-All Verification Checkpoint",
        description: "Route accept-all email domains to a holding list for deliverability testing.",
        recommended_action: "Mark status as 'needs_verification' rather than automatically queuing for cold sequencing."
      },
      {
        step: 5,
        title: "CRM Writeback & Timestamp",
        description: "Push validated status, verified email, and enrichment timestamp into CRM; alert owner in Slack.",
        recommended_action: "Write back standardized data fields and set record status to 'Enriched & Verified'."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Review Catch-All Domains",
        why_required: "Leads flagged as 'accept-all/catch-all' should be verified before cold sequencing to protect domain deliverability."
      },
      {
        checkpoint: "Mobile Calling Governance",
        why_required: "Ensure phone numbers are checked against regional do-not-call registries before initiating cold calls."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Minimum Viable Setup",
        description: "A streamlined two-tool setup using a built-in B2B database directly connected to your CRM.",
        target_profile: "Solo founders and small sales teams wanting straightforward lead enrichment without complex API waterfalls.",
        estimated_cost: "$49 - $99/mo",
        required_tools: [
          { slug: "apollo", name: "Apollo", role: "Contact search, email lookup & verification" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Central CRM lead storage & owner assignment" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM Record Storage",
            description: "Choose one CRM to store contact records — do not pay for multiple CRMs.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Marketing & sales CRM" },
              { slug: "pipedrive", name: "Pipedrive", role: "Deal pipeline CRM" },
              { slug: "attio", name: "Attio", role: "Modern data-centric CRM" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Multi-Provider Waterfall Setup",
        description: "An orchestrated cascade using Clay to query multiple specialized providers sequentially.",
        target_profile: "RevOps and outbound teams targeting competitive accounts across multiple countries.",
        estimated_cost: "$199 - $450/mo (pay-as-you-go credits)",
        required_tools: [
          { slug: "clay", name: "Clay", role: "Waterfall orchestration & table automation" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Secondary Verification Engine",
            description: "Select one complementary verification engine based on your geographic focus.",
            options: [
              { slug: "dropcontact", name: "Dropcontact", role: "Algorithmic GDPR-focused contact generation (strong in Europe)" },
              { slug: "findymail", name: "Findymail", role: "High-accuracy B2B email scraper & verifier" },
              { slug: "hunter", name: "Hunter", role: "Domain pattern and email verification" }
            ]
          }
        ],
        optional_upgrades: [
          { slug: "apollo", name: "Apollo", role: "Primary contact directory lookup" }
        ]
      }
    },
    primary_tool_slugs: ["clay", "dropcontact", "findymail", "hunter", "apollo"],
    alternative_tool_slugs: ["n8n", "make", "hubspot-sales-hub"],
    cost_note: "Typically $49-$250/mo depending on lookup credit volume; avoids rigid multi-seat enterprise data minimums.",
    effort_level: 1,
    time_to_value: "1-2 days",
    privacy_security_considerations: [
      "Verify GDPR Article 6 compliance when processing contact data for European prospects; prefer algorithmic generation (Dropcontact) over static database scrapers.",
      "Store opt-out flags in CRM and exclude unsubscribed contacts from subsequent enrichment runs."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "outbound,data_orchestration",
      use_case: "crm-enrichment-waterfall"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-02",
    slug: "webhook-lead-routing",
    title: "Real-Time Webhook Lead Routing & Data Normalization",
    short_summary: "Standardize incoming form fills, webinar attendees, and product signups into normalized CRM records with routing to the appropriate account owner.",
    bucket: "Data & Orchestration",
    stage_id: 1,
    buyer: "RevOps Directors, Marketing Operations Leads",
    intended_outcome: "Reduce speed-to-lead response time and ensure incoming contacts carry consistent firmographic and territory tags.",
    business_problem: "Web forms often collect inconsistent data (freemail domains, varied country spellings, missing titles). High-intent leads can sit unassigned when routing rules fail.",
    prerequisites: [
      "Inbound web form endpoint capable of sending JSON webhooks",
      "n8n, Make, or Zapier instance configured with error retries",
      "Defined territory routing rules and user email map in CRM"
    ],
    mini_preview: [
      { label: "Catch Webhook", icon: "bell" },
      { label: "Normalize Data", icon: "database" },
      { label: "Route to Owner", icon: "user" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Catch Inbound Webhook",
        action_type: "trigger",
        description: "Receive payload from demo request, contact form, or product signup.",
        tool_slugs: ["make", "n8n", "zapier"],
        tool_role: "Webhook Ingestion",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Cleanse & Standardize",
        action_type: "action",
        description: "Filter spam, normalize country codes, strip legal entity suffixes (LLC, Inc).",
        tool_slugs: ["make", "n8n"],
        tool_role: "Data Transformation",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Firmographic Tagging",
        action_type: "enrich",
        description: "Enrich company domain with employee count and industry classification.",
        tool_slugs: ["apollo", "clay"],
        tool_role: "Firmographic Enrichment",
        is_optional: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Territory Assignment & Match",
        action_type: "action",
        description: "Match company against existing CRM accounts or assign via round-robin rules.",
        tool_slugs: ["hubspot-sales-hub", "attio"],
        tool_role: "CRM Owner Routing",
        is_required: true
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Owner Alert & Lead Record",
        action_type: "deliver",
        description: "Create CRM Deal and send direct alert with contact context to assigned rep.",
        tool_slugs: ["hubspot-sales-hub", "attio"],
        tool_role: "Deal Creation",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Catch Inbound Webhook",
        description: "Receive instant payload from form submit, product signup, or demo request.",
        recommended_action: "Deploy secure HTTPS webhook URL with signature verification header."
      },
      {
        step: 2,
        title: "Cleanse & Normalize Data",
        description: "Filter test submissions, convert free email domains, normalize country names, and sanitize company names.",
        recommended_action: "Run standard text transformation regex to strip legal suffixes and lowercase emails."
      },
      {
        step: 3,
        title: "Firmographic Tagging",
        description: "Query company database to infer company employee count and industry category.",
        recommended_action: "Enrich domain with employee range before territory assignment."
      },
      {
        step: 4,
        title: "Round-Robin & Territory Assignment",
        description: "Match against account owner routing matrix (Enterprise vs Mid-Market vs SMB).",
        recommended_action: "Check existing account ownership in CRM first; fall back to round-robin pool if net-new."
      },
      {
        step: 5,
        title: "CRM Deal Creation & Notification",
        description: "Create CRM Lead/Deal and alert assigned account owner with record link.",
        recommended_action: "Post message with contact details, company summary, and direct CRM deep link."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Conflict Resolution Check",
        why_required: "If an account already has an open deal with another AE, alert both reps before changing account ownership."
      },
      {
        checkpoint: "Enterprise Hierarchy Review",
        why_required: "Flag complex corporate hierarchies or conglomerates for manual assignment to prevent territory clashes."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Native CRM Routing Setup",
        description: "Use native CRM forms and workflow routing rules without external automation tools.",
        target_profile: "Small teams with straightforward routing requirements (e.g., 2-5 reps, single geography).",
        estimated_cost: "Included in CRM tier ($0 - $50/user/mo)",
        required_tools: [
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Form capture, automated lead routing & deal creation" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM Platform",
            description: "Select one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Inbound CRM with built-in forms" },
              { slug: "pipedrive", name: "Pipedrive", role: "Pipeline-focused CRM with web forms" },
              { slug: "close-crm", name: "Close CRM", role: "High-velocity sales CRM" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Custom Automation & Normalization Engine",
        description: "A webhook middleware pipeline handling complex deduplication, firmographic lookup, and territory distribution.",
        target_profile: "Growing teams with multiple inbound forms, webinar platforms, and multi-tier SDR/AE territories.",
        estimated_cost: "$20 - $120/mo",
        required_tools: [
          { slug: "make", name: "Make", role: "Multi-branch webhook router & data cleansing" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Automation Platform",
            description: "Choose one automation tool — do not subscribe to both Make and Zapier for routing.",
            options: [
              { slug: "make", name: "Make", role: "Visual multi-branch webhook scenarios with credit-based pricing" },
              { slug: "n8n", name: "n8n", role: "Self-hostable workflow automation with data privacy control" },
              { slug: "zapier", name: "Zapier", role: "Turnkey integrations with broad app support" }
            ]
          }
        ],
        optional_upgrades: [
          { slug: "apollo", name: "Apollo", role: "Firmographic data lookup for unverified domains" }
        ]
      }
    },
    primary_tool_slugs: ["n8n", "make", "zapier", "hubspot-sales-hub", "attio"],
    alternative_tool_slugs: ["pipedrive", "close-crm"],
    cost_note: "Typically $20-$100/mo for automation platform tasks depending on execution volume.",
    effort_level: 2,
    time_to_value: "3-5 days",
    privacy_security_considerations: [
      "Sanitize personal identifiable information (PII) in intermediary workflow execution logs.",
      "Use encrypted HTTPS webhook payloads with signature validation (HMAC tokens)."
    ],
    builder_query: {
      goal: "full_funnel",
      buckets: "data_orchestration,agentic_ops",
      use_case: "webhook-lead-routing"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  },
  {
    id: "uc-03",
    slug: "closed-lost-revival",
    title: "Closed-Lost Opportunity Revival & Job Change Trigger Alerts",
    short_summary: "Monitor previously lost opportunities and former product champions for trigger events—such as job changes or company milestones—to re-engage with context.",
    bucket: "Data & Orchestration",
    stage_id: 4,
    buyer: "VP of Sales, Account Executives, RevOps",
    intended_outcome: "Identify re-engagement opportunities among past contacts who already know your product, reducing cold prospecting overhead.",
    business_problem: "Sales teams frequently abandon closed-lost deals after 30 days. Meanwhile, key decision-makers change roles regularly, creating opportunities at their new companies.",
    prerequisites: [
      "Historic closed-lost deal records with contact LinkedIn URLs or emails in CRM",
      "Apollo or Clay account with contact tracking filters",
      "CRM pipeline with defined lost reason tags"
    ],
    mini_preview: [
      { label: "Sync Lost Deals", icon: "database" },
      { label: "Detect Changes", icon: "bell" },
      { label: "Context Outreach", icon: "mail" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Sync Closed-Lost Cohort",
        action_type: "trigger",
        description: "Filter CRM deals closed >90 days ago with recoverable lost reasons (Budget, Timing, Missing Feature).",
        tool_slugs: ["hubspot-sales-hub", "pipedrive"],
        tool_role: "CRM Opportunity Filter",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Track Champion Job Moves",
        action_type: "enrich",
        description: "Monitor past decision-maker profiles for company transitions or promotions.",
        tool_slugs: ["apollo", "clay"],
        tool_role: "Career Move Detection",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "AE Relationship Verification",
        action_type: "approval",
        description: "Review prior relationship notes and former objections before reaching out.",
        tool_slugs: [],
        tool_role: "Human Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Ensure deal did not close due to product dissatisfaction or payment default."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Stage Contextual Outreach",
        action_type: "deliver",
        description: "Draft personalized re-engagement referencing the previous evaluation and current role.",
        tool_slugs: ["smartlead", "instantly"],
        tool_role: "Outreach Execution",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Sync Closed-Lost Cohort",
        description: "Query CRM for deals marked Closed-Lost >90 days ago with reasons 'Budget', 'Timing', or 'Feature Gap'.",
        recommended_action: "Filter out 'Wrong ICP' or 'Competitor Contract (Long Term)' to preserve rep focus."
      },
      {
        step: 2,
        title: "Continuous Job Change Tracking",
        description: "Check past champion LinkedIn profiles periodically to detect role promotions or moves to new companies.",
        recommended_action: "Run Apollo or Clay person tracking to detect company domain changes."
      },
      {
        step: 3,
        title: "Company Signal Detection",
        description: "Scan company domain for fresh funding announcements, executive hires, or tech stack updates.",
        recommended_action: "Monitor verified public announcements before reaching out."
      },
      {
        step: 4,
        title: "AE Relationship Verification",
        description: "Confirm previous evaluation context with original deal owner before initiating contact.",
        recommended_action: "Include previous deal notes, buyer's new title, and company headcount in the notification."
      },
      {
        step: 5,
        title: "Contextual Re-Engagement Draft",
        description: "Generate personalized draft email referencing prior evaluation and current context.",
        recommended_action: "Stage draft in CRM or sequence tool for rep review before sending."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "AE Relationship Verification",
        why_required: "Ensure rep reviews relationship history and former objections before sending outreach."
      },
      {
        checkpoint: "Account Sentiment Check",
        why_required: "Verify the original deal did not close due to product dissatisfaction or contractual breach."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "CRM + Apollo Tracking Setup",
        description: "Use Apollo saved searches to track job changes among past contacts and manage follow-ups in CRM.",
        target_profile: "Sales teams wanting to revive previous contacts without complex automation middleware.",
        estimated_cost: "$49 - $99/mo",
        required_tools: [
          { slug: "apollo", name: "Apollo", role: "Job change alerts & contact details lookup" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Deal history & task assignment" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Use your existing primary CRM.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Marketing & sales CRM" },
              { slug: "pipedrive", name: "Pipedrive", role: "Deal pipeline CRM" },
              { slug: "attio", name: "Attio", role: "Modern relationship CRM" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Automated Signal Ingestion Pipeline",
        description: "Integrate Clay to continuously scan LinkedIn URLs, trigger Slack alerts, and stage drafts in sequencers.",
        target_profile: "Outbound teams with hundreds of past closed-lost deals seeking systematic re-engagement.",
        estimated_cost: "$180 - $350/mo",
        required_tools: [
          { slug: "clay", name: "Clay", role: "Scheduled person tracking & enrichment" },
          { slug: "apollo", name: "Apollo", role: "New corporate email lookup" },
          { slug: "smartlead", name: "Smartlead", role: "Personalized follow-up sequence execution" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Cold Email Execution",
            description: "Choose one email sender — do not run both Smartlead and Instantly simultaneously.",
            options: [
              { slug: "smartlead", name: "Smartlead", role: "Multi-inbox cold email sequencer" },
              { slug: "instantly", name: "Instantly", role: "Unlimited mailbox outreach platform" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["clay", "apollo", "hubspot-sales-hub", "pipedrive"],
    alternative_tool_slugs: ["smartlead", "close-crm", "attio"],
    cost_note: "Typically $49-$250/mo depending on database tracking volume.",
    effort_level: 1,
    time_to_value: "1 week",
    privacy_security_considerations: [
      "Comply with regional communication rules when reaching out to contacts at their new employers.",
      "Ensure corporate email addresses are verified before staging outbound messages."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "data_orchestration,outbound",
      use_case: "closed-lost-revival"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-04",
    slug: "product-usage-alerting",
    title: "Product Usage Drop Alerting & Proactive Health Scoring",
    short_summary: "Identify declining product activity and license under-utilization to alert customer success teams ahead of renewal milestones.",
    bucket: "Data & Orchestration",
    stage_id: 5,
    buyer: "Customer Success Leaders, Account Managers, VP of Retention",
    intended_outcome: "Surface accounts experiencing adoption friction 60 to 90 days before renewal dates so CSMs can offer enablement.",
    business_problem: "Customer churn frequently catches teams off guard because reviews happen too late. In many cases, seat usage drops weeks before an account formally requests cancellation.",
    prerequisites: [
      "Product telemetry event stream (active users, core action completions)",
      "Customer success platform or CRM with custom health properties",
      "Defined engagement thresholds based on typical customer milestones"
    ],
    mini_preview: [
      { label: "Ingest Telemetry", icon: "database" },
      { label: "Score Health", icon: "trending" },
      { label: "Alert Team", icon: "bell" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Ingest Product Telemetry",
        action_type: "trigger",
        description: "Stream weekly active user counts and key feature events from product database.",
        tool_slugs: ["vitally", "churnzero", "attio"],
        tool_role: "Telemetry Ingestion",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Calculate Account Health Score",
        action_type: "action",
        description: "Evaluate adoption trends against baseline usage thresholds.",
        tool_slugs: ["vitally", "churnzero"],
        tool_role: "Health Scoring Algorithm",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "CSM Qualitative Check",
        action_type: "approval",
        description: "Review account context (e.g., seasonal holidays or known migrations) before reaching out.",
        tool_slugs: [],
        tool_role: "Human Assessment",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Differentiate between natural seasonal slowdowns and genuine product dissatisfaction."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Trigger Retention Workflow",
        action_type: "deliver",
        description: "Create high-priority CSM enablement task and draft targeted check-in note.",
        tool_slugs: ["hubspot-sales-hub", "vitally", "churnzero"],
        tool_role: "Task Assignment",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Telemetry Ingestion",
        description: "Stream product activity metrics (weekly logins, seat utilization, key feature events) into CS platform.",
        recommended_action: "Push aggregated weekly usage counts per account via webhook or database sync."
      },
      {
        step: 2,
        title: "Health Score Calculation",
        description: "Calculate account health scores factoring usage velocity, support ticket frequency, and feedback.",
        recommended_action: "Weight login frequency, core action completions, and support inquiries appropriately."
      },
      {
        step: 3,
        title: "Anomaly Detection Alert",
        description: "Trigger alert when core feature usage drops significantly week-over-week or when primary users stop logging in.",
        recommended_action: "Post high-priority alert into customer success Slack channel with account link."
      },
      {
        step: 4,
        title: "CSM Qualitative Assessment",
        description: "CSM verifies whether low activity is seasonal or related to an unresolved support ticket.",
        recommended_action: "Create CS task with 48-hour SLA to review account engagement history."
      },
      {
        step: 5,
        title: "Proactive Enablement Outreach",
        description: "Send personalized check-in offering enablement resources or workflow optimization.",
        recommended_action: "Stage helpful playbook email from assigned CSM focusing on adoption bottlenecks."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "CSM Account Assessment",
        why_required: "Confirm whether low usage is seasonal (e.g., holiday shutdowns) or genuine friction before customer outreach."
      },
      {
        checkpoint: "Contract Terms & Sponsorship Review",
        why_required: "Explicitly review renewal timelines and champion contact status before proposing plan adjustments."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "CRM-Native Health Tracking",
        description: "Track account health metrics directly in your CRM using custom properties and automated alerts.",
        target_profile: "Early-stage SaaS businesses with fewer than 100 paying accounts seeking simple retention monitoring.",
        estimated_cost: "Included in CRM tier ($0 - $50/user/mo)",
        required_tools: [
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Account tracking, health properties & task assignment" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Select one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Sales & customer record tracking" },
              { slug: "attio", name: "Attio", role: "Flexible data-driven customer model" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Dedicated Customer Success Platform",
        description: "Deploy a specialized CS platform connected to your product database and CRM for continuous health monitoring.",
        target_profile: "Scaling B2B companies with dedicated CSM teams and complex multi-seat enterprise contracts.",
        estimated_cost: "$300 - $800/mo",
        required_tools: [
          { slug: "vitally", name: "Vitally", role: "Product-led customer success & health scoring" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Customer Success Platform",
            description: "Choose one dedicated customer success platform.",
            options: [
              { slug: "vitally", name: "Vitally", role: "Modern CS platform built for B2B product-led teams" },
              { slug: "churnzero", name: "ChurnZero", role: "Established customer success platform for scaling SaaS" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["vitally", "churnzero", "attio", "hubspot-sales-hub"],
    alternative_tool_slugs: ["n8n", "customer-io"],
    cost_note: "From $0 on CRM-native properties up to $300-$800/mo for dedicated CS platform suites.",
    effort_level: 2,
    time_to_value: "1-2 weeks",
    privacy_security_considerations: [
      "Aggregate user activity to evaluate overall account adoption without collecting unnecessary individual employee surveillance data.",
      "Ensure customer telemetry storage complies with your corporate data retention policies."
    ],
    builder_query: {
      goal: "customer_retention",
      buckets: "data_orchestration,inbound",
      use_case: "product-usage-alerting"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  },
  {
    id: "uc-05",
    slug: "high-intent-deanonymization",
    title: "High-Intent Website Visitor De-anonymization & Account Routing",
    short_summary: "Identify corporate accounts visiting pricing and documentation pages to alert sales representatives for timely follow-up.",
    bucket: "Lead Capture",
    stage_id: 1,
    buyer: "Demand Gen Managers, BDR Directors, Growth Leads",
    intended_outcome: "Identify visiting accounts that fit your ideal customer profile and alert sales reps while buyer interest is active.",
    business_problem: "Most B2B website visitors research solutions without submitting a form. Sales teams often reach out blindly while active prospects are reading comparison pages unnoticed.",
    prerequisites: [
      "Website analytics or pixel snippet installed on high-intent URLs (Pricing, Integrations, Enterprise)",
      "Visitor resolution service (e.g., RB2B for US visitors or IP firmographic matching)",
      "CRM integration with existing pipeline checking rules"
    ],
    mini_preview: [
      { label: "Detect Visit", icon: "search" },
      { label: "Filter ICP", icon: "database" },
      { label: "Alert Team", icon: "bell" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "High-Intent URL Visit",
        action_type: "trigger",
        description: "Detect page visits on key conversion paths (/pricing, /compare, /enterprise).",
        tool_slugs: ["rb2b"],
        tool_role: "Visitor Resolution Pixel",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Company / Profile Resolution",
        action_type: "enrich",
        description: "Match visiting session to corporate domain or US business profile.",
        tool_slugs: ["rb2b", "clay"],
        tool_role: "Identity Resolution",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Pipeline & ICP Filter",
        action_type: "action",
        description: "Filter out non-ICP traffic, job seekers, and accounts with open opportunities.",
        tool_slugs: ["hubspot-sales-hub", "attio"],
        tool_role: "CRM Account Filter",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Tone & Timing Verification",
        action_type: "approval",
        description: "Allow a sensible delay before outreach; avoid referencing real-time website tracking directly.",
        tool_slugs: [],
        tool_role: "Outreach Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Aggressive instant messaging ('I saw you on our site 2 minutes ago') damages buyer rapport."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Route Context to Sales Rep",
        action_type: "deliver",
        description: "Send alert with visited pages to account owner for relevant follow-up.",
        tool_slugs: ["hubspot-sales-hub", "attio"],
        tool_role: "SDR Notification",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Pixel Trigger on Key URLs",
        description: "Detect visits specifically to high-intent paths (e.g. /pricing, /integrations, /enterprise).",
        recommended_action: "Exclude low-intent pages (e.g. /careers, /blog home) to maintain high lead signal quality."
      },
      {
        step: 2,
        title: "Identity Resolution",
        description: "Resolve visitor profile (US business profile via RB2B, or firmographic IP lookup via enrichment).",
        recommended_action: "Parse company domain, visitor title, and location from identification payload."
      },
      {
        step: 3,
        title: "ICP Verification",
        description: "Filter out non-target industries, competitors, and accounts that already have an active CRM deal.",
        recommended_action: "Run automated filter checking company headcount and existing open CRM pipeline."
      },
      {
        step: 4,
        title: "Outreach Timing & Tone Check",
        description: "Stage follow-up after a sensible delay, focusing on relevant industry problems rather than tracking.",
        recommended_action: "Avoid 'I saw you browsing our site' messaging; focus on relevant workflow challenges."
      },
      {
        step: 5,
        title: "Sales Notification & Follow-Up",
        description: "Route account details to assigned rep showing visited topics for relevant outreach.",
        recommended_action: "Provide SDR with viewed topics to inform a personalized value proposition."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Outreach Timing & Tone Delay",
        why_required: "Avoid intrusive 'I saw you on our site 30 seconds ago' phrasing; frame messages around industry challenges."
      },
      {
        checkpoint: "Regional Privacy Compliance",
        why_required: "Restrict individual-level person identification to US traffic in accordance with applicable privacy regulations."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Direct Visitor Alerts Setup",
        description: "Connect RB2B directly to Slack and your CRM to alert reps when target US accounts visit key pages.",
        target_profile: "US-focused startups and sales teams wanting immediate visibility into pricing page traffic.",
        estimated_cost: "Free - $99/mo (RB2B free tier available for US profiles)",
        required_tools: [
          { slug: "rb2b", name: "RB2B", role: "Person-level visitor resolution for US traffic" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Lead capture & account owner matching" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Select one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Primary sales CRM" },
              { slug: "attio", name: "Attio", role: "Modern relationship CRM" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Enriched Account Routing Pipeline",
        description: "Route identified visitor domains through Clay to check open deals, enrich buying committee members, and notify account executives.",
        target_profile: "B2B teams running coordinated account-based marketing and sales development.",
        estimated_cost: "$150 - $350/mo",
        required_tools: [
          { slug: "rb2b", name: "RB2B", role: "Visitor identification" },
          { slug: "clay", name: "Clay", role: "Account qualification & committee enrichment" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        optional_upgrades: [
          { slug: "smartlead", name: "Smartlead", role: "Outbound sequence delivery for identified accounts" }
        ]
      }
    },
    primary_tool_slugs: ["rb2b", "clay", "hubspot-sales-hub", "attio"],
    alternative_tool_slugs: ["apollo", "smartlead"],
    cost_note: "RB2B offers a free tier for US profiles; supplementary enrichment tools range from $50-$150/mo.",
    effort_level: 1,
    time_to_value: "1-2 days",
    privacy_security_considerations: [
      "Maintain clear website privacy policy disclosures regarding visitor analytics and tracking pixels.",
      "Respect regional legal requirements: do not apply individual person-level resolution to EU/UK visitors without prior explicit consent."
    ],
    builder_query: {
      goal: "inbound_demand",
      buckets: "lead_capture,data_orchestration",
      use_case: "high-intent-deanonymization"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-06",
    slug: "conversational-qualification",
    title: "24/7 Inbound Conversational Qualification & Automated Meeting Booking",
    short_summary: "Deploy an intelligent conversational assistant on high-intent pages to answer buyer questions, qualify criteria, and book discovery meetings.",
    bucket: "Lead Capture",
    stage_id: 1,
    buyer: "Inbound Marketing Leads, Sales Development Leaders",
    intended_outcome: "Engage website prospects during off-hours, qualify buying criteria, and reduce drop-off on inbound demo requests.",
    business_problem: "High-intent prospects visiting outside normal business hours often leave without booking if they cannot get answers to basic product questions.",
    prerequisites: [
      "Central product documentation or pricing FAQs",
      "Intercom messenger or chat widget on site",
      "Connected sales representative Calendly scheduling links"
    ],
    mini_preview: [
      { label: "Greet Visitor", icon: "chat" },
      { label: "Qualify Lead", icon: "check" },
      { label: "Book Meeting", icon: "calendar" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Contextual Chat Trigger",
        action_type: "trigger",
        description: "Engage visitor when session duration exceeds 45 seconds on product or pricing pages.",
        tool_slugs: ["intercom"],
        tool_role: "Conversational Messenger",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "AI Answer from Knowledge Base",
        action_type: "action",
        description: "Provide grounded answers to visitor queries based strictly on verified documentation.",
        tool_slugs: ["intercom"],
        tool_role: "AI Answer Bot",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Qualification Prompts",
        action_type: "enrich",
        description: "Ask concise qualification questions (team size, current CRM, implementation timeline).",
        tool_slugs: ["intercom"],
        tool_role: "Lead Qualification",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Instant Calendar Booking",
        action_type: "deliver",
        description: "Embed live representative calendar slot picker directly inside the chat interface.",
        tool_slugs: ["calendly"],
        tool_role: "Meeting Scheduling",
        is_required: true
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Sync Transcript & Deal to CRM",
        action_type: "sync",
        description: "Create or update CRM contact record with chat transcript, answers, and calendar meeting.",
        tool_slugs: ["hubspot-sales-hub", "close-crm"],
        tool_role: "CRM Deal Sync",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Visitor Engagement Trigger",
        description: "Trigger contextual chat prompt when high-intent visitor spends >45s on product or pricing page.",
        recommended_action: "Display friendly prompt referencing current page context without interrupting reading."
      },
      {
        step: 2,
        title: "Knowledge Base Answering",
        description: "AI bot parses visitor inquiries using verified product docs and pricing rules.",
        recommended_action: "Ground answers in verified product documentation to prevent unsupported commitments."
      },
      {
        step: 3,
        title: "Qualification Questions",
        description: "Ask qualifying questions (team size, current tech stack, implementation timeline).",
        recommended_action: "Collect team size and CRM in 2 concise conversational prompts."
      },
      {
        step: 4,
        title: "Tier-Based Meeting Routing",
        description: "If qualified, present interactive calendar picker for instant booking; if unqualified, offer self-serve guide.",
        recommended_action: "Embed calendar selector directly in chat for instant time-slot reservation."
      },
      {
        step: 5,
        title: "CRM Lead Record Sync",
        description: "Push transcript, qualification answers, and calendar meeting record into CRM.",
        recommended_action: "Create or update CRM contact and assign meeting to booked representative."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Live SDR Handoff",
        why_required: "Permit available human SDRs to take over chat sessions in real-time when VIP accounts initiate conversations."
      },
      {
        checkpoint: "Knowledge Base Audit",
        why_required: "Conduct periodic reviews of unanswered bot queries to keep product documentation accurate."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "CRM Chat + Scheduling Setup",
        description: "Use your CRM's built-in chat widget paired with Calendly for direct lead qualification and booking.",
        target_profile: "Early-stage teams wanting low-maintenance website qualification without dedicated AI chatbot fees.",
        estimated_cost: "$12 - $60/mo",
        required_tools: [
          { slug: "calendly", name: "Calendly", role: "Meeting scheduling & calendar coordination" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Website chat widget, contact capture & deal pipeline" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Choose one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Inbound CRM with live chat" },
              { slug: "close-crm", name: "Close CRM", role: "Sales CRM with built-in calling & email" },
              { slug: "pipedrive", name: "Pipedrive", role: "Pipeline CRM with Leadbooster chat" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "AI Conversational Agent Platform",
        description: "Deploy Intercom with AI answers trained on your knowledge base, automated routing, and CRM synchronization.",
        target_profile: "Companies with high website traffic receiving repetitive pre-sales inquiries across time zones.",
        estimated_cost: "$75 - $180/seat/mo",
        required_tools: [
          { slug: "intercom", name: "Intercom", role: "Conversational AI messenger & qualification" },
          { slug: "calendly", name: "Calendly", role: "Representative calendar booking" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      }
    },
    primary_tool_slugs: ["intercom", "calendly", "hubspot-sales-hub", "close-crm"],
    alternative_tool_slugs: ["pipedrive", "attio"],
    cost_note: "From $12/mo using native scheduling widgets up to $75-$180/seat/mo for AI conversational platforms.",
    effort_level: 1,
    time_to_value: "2-3 days",
    privacy_security_considerations: [
      "Display clear notification indicating that chat conversations are assisted by AI.",
      "Collect explicit consent before storing email addresses and phone numbers."
    ],
    builder_query: {
      goal: "inbound_demand",
      buckets: "lead_capture,inbound",
      use_case: "conversational-qualification"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  },
  {
    id: "uc-07",
    slug: "interactive-social-funnels",
    title: "Automated Social DM Lead Capture & Instant Resource Delivery",
    short_summary: "Capture leads from social media comments and direct messages, distributing templates and scheduling links automatically.",
    bucket: "Lead Capture",
    stage_id: 1,
    buyer: "Social Media Managers, Growth Marketers, Founder-Led Sales",
    intended_outcome: "Distribute gated resources to engaged social media users instantly while collecting verified contact details for CRM follow-up.",
    business_problem: "Directing social media followers to an external link-in-bio introduces friction, resulting in drop-off before visitors reach your landing page form.",
    prerequisites: [
      "Connected professional Instagram or LinkedIn company channel",
      "Manychat account with keyword triggers configured",
      "Hosted downloadable asset or template"
    ],
    mini_preview: [
      { label: "Comment Trigger", icon: "chat" },
      { label: "Deliver Resource", icon: "file" },
      { label: "Sync to CRM", icon: "database" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Keyword Comment on Post",
        action_type: "trigger",
        description: "Follower comments specific keyword (e.g., 'PLAYBOOK') on a post.",
        tool_slugs: ["manychat"],
        tool_role: "Social Trigger Monitor",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Instant DM Resource Link",
        action_type: "deliver",
        description: "Send direct message with resource link within seconds of comment.",
        tool_slugs: ["manychat"],
        tool_role: "DM Dispatcher",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Work Email Capture",
        action_type: "enrich",
        description: "Prompt user conversationally for work email to receive full spreadsheet/template.",
        tool_slugs: ["manychat"],
        tool_role: "Conversational Form",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "CRM Sync via Webhook",
        action_type: "sync",
        description: "Send verified email and social handle to CRM lead list.",
        tool_slugs: ["zapier", "make", "hubspot-sales-hub"],
        tool_role: "Webhook Sync to CRM",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Comment Keyword Trigger",
        description: "User comments specific keyword (e.g. 'STACK' or 'PLAYBOOK') on post.",
        recommended_action: "Set Manychat automation trigger to monitor public comments on designated post."
      },
      {
        step: 2,
        title: "Instant DM Dispatch",
        description: "Manychat automation sends conversational message with deliverable link.",
        recommended_action: "Send direct message with greeting and asset link within 10 seconds of comment."
      },
      {
        step: 3,
        title: "Email Capture Conversational Flow",
        description: "Prompt user for work email to receive full editable spreadsheet or template.",
        recommended_action: "Use quick-reply button asking for work email in exchange for editable version."
      },
      {
        step: 4,
        title: "Verification & CRM Sync",
        description: "Zapier/Make webhook validates email and syncs lead into CRM nurture list.",
        recommended_action: "Trigger webhook to create CRM subscriber and tag with campaign source."
      },
      {
        step: 5,
        title: "Follow-Up Check-in",
        description: "Follow up 2 hours later in DM asking if the resource was helpful, offering a demo link.",
        recommended_action: "Deliver automated soft check-in within the 24-hour conversational window."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Community Manager Oversight",
        why_required: "Maintain human oversight in social inboxes to step in when users ask complex custom enterprise questions."
      },
      {
        checkpoint: "Platform Rate Limit Compliance",
        why_required: "Adhere strictly to platform messaging rate limits and conversational interaction windows."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Social DM to CRM Setup",
        description: "Use Manychat to monitor post comments and Zapier to pass captured emails into your CRM.",
        target_profile: "Founders and marketers sharing educational templates on Instagram and LinkedIn.",
        estimated_cost: "$15 - $35/mo",
        required_tools: [
          { slug: "manychat", name: "Manychat", role: "Social DM automation & conversational capture" },
          { slug: "zapier", name: "Zapier", role: "Webhook bridge to CRM" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Lead storage & nurture" }
        ],
        choose_one_alternatives: [
          {
            role: "Automation Bridge",
            description: "Choose one automation tool to connect social leads to your CRM.",
            options: [
              { slug: "zapier", name: "Zapier", role: "Simple webhook to CRM integration" },
              { slug: "make", name: "Make", role: "Scenario-based data routing with deduplication" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["manychat", "zapier", "hubspot-sales-hub", "pipedrive"],
    alternative_tool_slugs: ["make", "close-crm"],
    cost_note: "Typically $15-$45/mo for social automation and webhook routing.",
    effort_level: 1,
    time_to_value: "1 day",
    privacy_security_considerations: [
      "Disclose privacy policy link in chat; allow user to unsubscribe with a single keyword ('STOP').",
      "Do not send unsolicited marketing messages outside approved platform messaging windows."
    ],
    builder_query: {
      goal: "inbound_demand",
      buckets: "lead_capture,data_orchestration",
      use_case: "interactive-social-funnels"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-08",
    slug: "signal-based-prospecting",
    title: "Signal-Based Outbound Prospecting on Hiring & Funding Events",
    short_summary: "Trigger outbound prospecting sequences based on verified hiring, leadership changes, or funding rounds rather than static buyer lists.",
    bucket: "Outbound",
    stage_id: 2,
    buyer: "Outbound Sales Leaders, Growth Engineers, SDR Managers",
    intended_outcome: "Engage accounts during periods of active operational change when interest in new tools and workflows is highest.",
    business_problem: "Cold outreach to static lists often achieves low reply rates because prospects are not actively evaluating new solutions. Reaching buyers during trigger events improves timing.",
    prerequisites: [
      "Defined Ideal Customer Profile (ICP) criteria (headcount, geography, current tech stack)",
      "Apollo or Clay account with growth signal filters",
      "Dedicated secondary outbound sending domains configured with SPF/DKIM"
    ],
    mini_preview: [
      { label: "Detect Signal", icon: "bell" },
      { label: "Find Decision Maker", icon: "user" },
      { label: "Send Outreach", icon: "mail" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Monitor Growth Signals",
        action_type: "trigger",
        description: "Track verified company hiring (e.g., 'Hiring Head of Sales'), funding rounds, or tech installs.",
        tool_slugs: ["apollo", "clay"],
        tool_role: "Signal Aggregator",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Filter ICP Fit",
        action_type: "action",
        description: "Exclude accounts outside target headcount ranges or non-target regions.",
        tool_slugs: ["apollo", "clay"],
        tool_role: "ICP Filter",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Decision Maker Identification",
        action_type: "enrich",
        description: "Identify the relevant department head or executive and verify corporate email.",
        tool_slugs: ["apollo", "findymail"],
        tool_role: "Contact Verification",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Message Relevance Review",
        action_type: "approval",
        description: "Review personalized drafts to confirm the signal rationale makes business sense.",
        tool_slugs: [],
        tool_role: "Human Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Verify that the identified trigger relates logically to your value proposition."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Execute Cold Sequence",
        action_type: "deliver",
        description: "Deliver timed, rotated email sequence across warmed secondary mailboxes.",
        tool_slugs: ["smartlead", "instantly"],
        tool_role: "Sequence Delivery",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Signal Aggregation",
        description: "Monitor job postings (e.g., 'Hiring Head of RevOps'), technology installs, or funding announcements.",
        recommended_action: "Set up Clay table integrating job board web scrapers and Crunchbase funding webhooks."
      },
      {
        step: 2,
        title: "Account ICP Filter",
        description: "Reject accounts outside target headcount (e.g., 50-500 employees) or non-target geographies.",
        recommended_action: "Filter raw accounts through strict employee count and geography criteria."
      },
      {
        step: 3,
        title: "Decision Maker Identification",
        description: "Identify the exact newly appointed executive or department head on LinkedIn.",
        recommended_action: "Enrich executive contact details using Apollo and Findymail lookup."
      },
      {
        step: 4,
        title: "Contextual Copy Personalization",
        description: "Draft concise email referencing the specific signal and immediate 90-day priorities.",
        recommended_action: "Use formula: [Signal Observation] + [Common Problem] + [Brief Proof Point] + [Low-friction CTA]."
      },
      {
        step: 5,
        title: "Multi-Mailbox Sequence Enrollment",
        description: "Push verified record into Smartlead or Instantly sequence across warmed secondary mailboxes.",
        recommended_action: "Throttle sends to 30 emails/mailbox/day with randomized 15-minute sending intervals."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Relevance & Tone Sanity Check",
        why_required: "Inspect personalized drafts to ensure signal inferences make logical business sense."
      },
      {
        checkpoint: "Sending Cap Guardrails",
        why_required: "Limit cold sends to max 30-50 per mailbox per day to protect domain health."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "All-in-One Apollo Outbound Setup",
        description: "Use Apollo's built-in hiring filters and sequence engine directly connected to your CRM.",
        target_profile: "Small sales teams wanting an integrated prospecting workflow without managing multiple subscriptions.",
        estimated_cost: "$49 - $99/seat/mo",
        required_tools: [
          { slug: "apollo", name: "Apollo", role: "Signal search, contact details & email sequencing" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Clay + Dedicated Cold Email Sequencer",
        description: "Combine Clay for custom signal aggregation with a dedicated multi-inbox cold email engine.",
        target_profile: "High-volume outbound operations requiring secondary domain rotation and custom trigger logic.",
        estimated_cost: "$180 - $350/mo",
        required_tools: [
          { slug: "clay", name: "Clay", role: "Signal ingestion & data normalization" },
          { slug: "apollo", name: "Apollo", role: "Contact directory" },
          { slug: "smartlead", name: "Smartlead", role: "Multi-domain cold email rotation & deliverability" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Cold Email Sequencer",
            description: "Choose one cold email sequencer — do not pay for both Smartlead and Instantly.",
            options: [
              { slug: "smartlead", name: "Smartlead", role: "Multi-inbox cold email sequencer with warm-up" },
              { slug: "instantly", name: "Instantly", role: "Outreach platform with unlimited mailboxes" },
              { slug: "lemlist", name: "lemlist", role: "Multi-channel outreach with personalization" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["clay", "apollo", "smartlead", "instantly"],
    alternative_tool_slugs: ["findymail", "hunter", "lemlist"],
    cost_note: "Typically $49/mo for an all-in-one setup up to $180-$350/mo for advanced multi-mailbox infrastructure.",
    effort_level: 2,
    time_to_value: "3-5 days",
    privacy_security_considerations: [
      "Include functional one-click unsubscribe links and clear business physical address in all commercial emails.",
      "Target verified corporate inboxes only; avoid personal webmail addresses."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "outbound,data_orchestration",
      use_case: "signal-based-prospecting"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-09",
    slug: "multi-channel-cold-sequences",
    title: "Multi-Channel Cold Email & LinkedIn Outreach Sequences",
    short_summary: "Coordinate outbound touches across email and LinkedIn to reach decision-makers across channels without sending overlapping messages.",
    bucket: "Outbound",
    stage_id: 3,
    buyer: "SDR Directors, Account Executives, Agency Owners",
    intended_outcome: "Increase contact coverage by following up on LinkedIn when email goes unopened, while pausing sequences immediately upon reply.",
    business_problem: "Single-channel email campaigns can suffer from spam filtering, while relying exclusively on LinkedIn encounters weekly connection limits.",
    prerequisites: [
      "Verified contact list with corporate emails and LinkedIn profile URLs",
      "Smartlead or Instantly for email delivery",
      "HeyReach for managed LinkedIn account rotation",
      "Stop-on-reply webhook configured between platforms"
    ],
    mini_preview: [
      { label: "Email Touch", icon: "mail" },
      { label: "LinkedIn View", icon: "user" },
      { label: "Stop on Reply", icon: "check" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Contact Channel Segmentation",
        action_type: "trigger",
        description: "Segment contacts by channel activity (active LinkedIn posters vs email-first executives).",
        tool_slugs: ["apollo", "clay"],
        tool_role: "Audience Segmentation",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Touch 1: Concise Cold Email",
        action_type: "action",
        description: "Send short, problem-focused email from rotated secondary domain.",
        tool_slugs: ["smartlead", "instantly"],
        tool_role: "Email Sequencing",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Touch 2: Soft LinkedIn View & Connect",
        action_type: "action",
        description: "If no reply in 48 hours, view profile and send connection request via HeyReach.",
        tool_slugs: ["heyreach"],
        tool_role: "LinkedIn Coordination",
        is_optional: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Stop-on-Reply Webhook Gate",
        action_type: "approval",
        description: "Automatically pause sequences across both channels as soon as the prospect responds.",
        tool_slugs: [],
        tool_role: "Automated Webhook Check",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Cross-channel sequences must halt immediately when a prospect responds to avoid annoying buyers."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Sync Status to CRM",
        action_type: "sync",
        description: "Update CRM contact record with reply status and assign follow-up task to rep.",
        tool_slugs: ["hubspot-sales-hub", "pipedrive"],
        tool_role: "CRM Task Assignment",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Contact Segmentation",
        description: "Split prospects by primary channel likelihood (e.g., tech founders on LinkedIn, finance leaders on email).",
        recommended_action: "Tag contacts based on LinkedIn activity recency (active posters vs inactive)."
      },
      {
        step: 2,
        title: "Touch 1: Cold Email",
        description: "Send tailored, problem-focused 75-word email from rotated secondary domain.",
        recommended_action: "Focus on primary operational challenge with single question CTA."
      },
      {
        step: 3,
        title: "Touch 2: LinkedIn Profile View & Connect",
        description: "If no reply in 48 hours, HeyReach views profile and sends blank or soft connection request.",
        recommended_action: "Rotate connection requests across SDR LinkedIn accounts to stay within weekly limits."
      },
      {
        step: 4,
        title: "Touch 3: Direct Message",
        description: "Upon connection acceptance, deliver follow-up context; if email bounced, switch to InMail.",
        recommended_action: "Deliver conversational message referencing earlier email topic."
      },
      {
        step: 5,
        title: "Stop-on-Reply Automation",
        description: "Automatically pause sequence upon any prospect reply across any channel.",
        recommended_action: "Ensure sequence halts across both email and LinkedIn immediately when prospect responds."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Stop-on-Reply Webhook Audit",
        why_required: "Confirm sequences pause across all channels immediately when a prospect responds on any channel."
      },
      {
        checkpoint: "Connection Note Tone",
        why_required: "Avoid aggressive pitches in connection requests; prioritize professional peer alignment."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Email-First Outbound Setup",
        description: "Start with a dedicated cold email sequencer before introducing complex multi-channel tooling.",
        target_profile: "Small teams mastering core cold email messaging before coordinating multiple channels.",
        estimated_cost: "$39 - $94/mo",
        required_tools: [
          { slug: "smartlead", name: "Smartlead", role: "Multi-mailbox cold email sequencer & warmup" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "CRM record tracking" }
        ],
        choose_one_alternatives: [
          {
            role: "Cold Email Sequencer",
            description: "Choose one email platform.",
            options: [
              { slug: "smartlead", name: "Smartlead", role: "Multi-inbox email infrastructure" },
              { slug: "instantly", name: "Instantly", role: "Outreach platform with unlimited mailboxes" },
              { slug: "lemlist", name: "lemlist", role: "Personalized cold email & LinkedIn touchpoints" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Multi-Channel Coordinated Suite",
        description: "Pair Smartlead with HeyReach to coordinate email touches and LinkedIn profile actions safely.",
        target_profile: "Outbound agencies and sales teams running coordinated cadences across 3+ representatives.",
        estimated_cost: "$120 - $220/mo",
        required_tools: [
          { slug: "smartlead", name: "Smartlead", role: "Cold email sequencer" },
          { slug: "heyreach", name: "HeyReach", role: "LinkedIn account rotation & connection cadence" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      }
    },
    primary_tool_slugs: ["smartlead", "instantly", "heyreach", "lemlist"],
    alternative_tool_slugs: ["apollo", "hubspot-sales-hub"],
    cost_note: "Smartlead ($39-$94/mo) + HeyReach (~$79/mo) for coordinated multi-channel delivery.",
    effort_level: 2,
    time_to_value: "3-4 days",
    privacy_security_considerations: [
      "Adhere strictly to platform terms: maintain conservative daily LinkedIn action limits to protect personal profiles.",
      "Ensure unsubscribed contacts are flagged across all connected channels simultaneously."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "outbound",
      use_case: "multi-channel-cold-sequences"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-10",
    slug: "deliverability-monitoring",
    title: "Domain Warmup & Cold Email Deliverability Guardrails",
    short_summary: "Set up secondary domain infrastructure, SPF/DKIM/DMARC authentication, and deliverability monitoring to protect corporate inbox reputation.",
    bucket: "Outbound",
    stage_id: 2,
    buyer: "Growth Engineers, Outbound Operations, Agency Founders",
    intended_outcome: "Maintain reliable inbox placement and keep your primary corporate domain isolated from cold email deliverability risks.",
    business_problem: "Sending cold emails from a primary corporate domain risks getting Google Workspace or Microsoft 365 tenants flagged, impacting regular company communications.",
    prerequisites: [
      "2-4 dedicated secondary domains configured on Cloudflare or Google Domains",
      "Secondary Google Workspace or Microsoft 365 accounts",
      "Deliverability monitoring tool with warmup network enabled"
    ],
    mini_preview: [
      { label: "Configure DNS", icon: "database" },
      { label: "Warm Inboxes", icon: "mail" },
      { label: "Monitor Health", icon: "bell" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Register Secondary Domains",
        action_type: "trigger",
        description: "Register domain variations (e.g., getbrand.com) and forward web traffic to primary site.",
        tool_slugs: [],
        tool_role: "Domain Registrar",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Configure DNS Records",
        action_type: "action",
        description: "Set up SPF, DKIM (2048-bit), DMARC policy, and custom tracking domain.",
        tool_slugs: [],
        tool_role: "DNS Management",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Automated Warmup Network",
        action_type: "action",
        description: "Ramp sending slowly (2 to 25 emails/day) across peer warmup networks.",
        tool_slugs: ["smartlead", "instantly"],
        tool_role: "Warmup Pool",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Pre-Send List Verification",
        action_type: "enrich",
        description: "Scrub prospective email lists to eliminate invalid, disposable, or spam-trap addresses.",
        tool_slugs: ["findymail", "hunter"],
        tool_role: "Email Verification",
        is_required: true
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Deliverability Health Check Gate",
        action_type: "approval",
        description: "Review mailbox placement scores weekly; rest mailboxes if bounce rate exceeds 2%.",
        tool_slugs: [],
        tool_role: "Human Health Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Pause sending automatically if bounce rates exceed safe operational thresholds."
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Secondary Domain Registration",
        description: "Register variations of brand domain (e.g., getbrand.com, brandhq.com).",
        recommended_action: "Forward all web traffic from secondary domains to your primary marketing website."
      },
      {
        step: 2,
        title: "DNS Authentication Setup",
        description: "Configure SPF, DKIM, DMARC (with p=none moving to p=quarantine), and custom tracking domain.",
        recommended_action: "Generate unique 2048-bit DKIM keys and verify MX records."
      },
      {
        step: 3,
        title: "Automated Warmup Network",
        description: "Enroll inboxes into peer-to-peer warmup networks with slow ramp-up schedule.",
        recommended_action: "Ramp up from 2 to 25 emails/day per inbox over 21 days with 35% reply simulation rate."
      },
      {
        step: 4,
        title: "Pre-Send List Verification",
        description: "Use Findymail or Hunter to pre-clean all lists; set automated alerts if bounce rate exceeds 2%.",
        recommended_action: "Purge all invalid, disposable, or high-risk emails prior to sequence enrollment."
      },
      {
        step: 5,
        title: "Automated Mailbox Resting",
        description: "Automatically pause sending and alert admin if health score dips below safe levels.",
        recommended_action: "Set threshold trigger in Smartlead/Instantly to rest struggling mailboxes for 7 days."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "DMARC Report Review",
        why_required: "Monthly check of DMARC aggregate reports to detect unauthorized domain spoofing attempts."
      },
      {
        checkpoint: "Content Spam Word Audit",
        why_required: "Scan copy for spam trigger words and excessive tracking links before campaign launch."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Deliverability Guardrails Setup",
        description: "Deploy secondary sending accounts in Smartlead or Instantly paired with Findymail list verification.",
        target_profile: "Founders and sales reps beginning cold outbound prospecting.",
        estimated_cost: "$50 - $120/mo (including secondary domain and inbox licenses)",
        required_tools: [
          { slug: "smartlead", name: "Smartlead", role: "Deliverability engine & automated warmup" },
          { slug: "findymail", name: "Findymail", role: "Pre-send email list cleaning & verification" }
        ],
        choose_one_alternatives: [
          {
            role: "Cold Email & Warmup Platform",
            description: "Choose one platform for inbox warmup and sending.",
            options: [
              { slug: "smartlead", name: "Smartlead", role: "Built-in deliverability monitoring & warmup" },
              { slug: "instantly", name: "Instantly", role: "Unlimited mailbox warmup & inbox management" }
            ]
          },
          {
            role: "List Verification Tool",
            description: "Choose one verification tool to clean contact lists.",
            options: [
              { slug: "findymail", name: "Findymail", role: "High-accuracy B2B email verifier" },
              { slug: "hunter", name: "Hunter", role: "Domain pattern and email verifier" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["smartlead", "instantly", "findymail", "hunter"],
    alternative_tool_slugs: ["apollo"],
    cost_note: "Typically $50-$150/mo including secondary domains, Google Workspace/M365 seats, and warmup software.",
    effort_level: 1,
    time_to_value: "14-21 days (warmup ramp period)",
    privacy_security_considerations: [
      "Never send from domains without transparent domain ownership or proper opt-out footers.",
      "Comply with 2024 Google and Yahoo sender guidelines (SPF, DKIM, DMARC, and <0.3% spam rate threshold)."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "outbound,data_orchestration",
      use_case: "deliverability-monitoring"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-11",
    slug: "competitor-displacement",
    title: "Competitor Displacement Outbound Campaigns",
    short_summary: "Identify accounts using rival software with known price adjustments or feature deprecations, delivering relevant migration workflows.",
    bucket: "Outbound",
    stage_id: 2,
    buyer: "Sales Directors, PMMs, Outbound Campaign Managers",
    intended_outcome: "Engage prospects already spending budget on existing category tools who may be experiencing vendor friction.",
    business_problem: "Selling into non-consuming accounts requires budget creation. Targeting satisfied users yields low response unless timed around contract renewals or vendor dissatisfaction.",
    prerequisites: [
      "Target competitor matrix with documented pain points and migration guides",
      "Technographic filtering tool (Apollo or Clay)",
      "Dedicated comparison content or migration checklist"
    ],
    mini_preview: [
      { label: "Filter Tech Stack", icon: "search" },
      { label: "Review Angle", icon: "check" },
      { label: "Migration Offer", icon: "mail" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Technographic Account Discovery",
        action_type: "trigger",
        description: "Filter target accounts verified as running rival software scripts or integrations.",
        tool_slugs: ["apollo", "clay"],
        tool_role: "Technographic Discovery",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Research Friction Points",
        action_type: "enrich",
        description: "Identify common buyer grievances from public reviews and recent pricing tier adjustments.",
        tool_slugs: ["semrush"],
        tool_role: "Competitor Research",
        is_optional: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Comparative Claim Accuracy Gate",
        action_type: "approval",
        description: "Review all outbound messaging to ensure feature comparisons and pricing claims are accurate.",
        tool_slugs: [],
        tool_role: "Legal & Claims Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Ensure comparative claims are strictly accurate and comply with trademark guidelines."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Deliver Migration Campaign",
        action_type: "deliver",
        description: "Deploy personalized outreach highlighting migration assistance and feature differences.",
        tool_slugs: ["smartlead", "instantly"],
        tool_role: "Sequence Delivery",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Technographic Discovery",
        description: "Query Apollo/Clay for companies currently running competitor software scripts or integrations.",
        recommended_action: "Filter for companies with 50-500 employees currently verified as active users of competitor."
      },
      {
        step: 2,
        title: "Dissatisfaction Signal Check",
        description: "Scan review sites or Semrush keyword trends for competitor pricing complaints or feature issues.",
        recommended_action: "Identify the top customer grievances from recent public product reviews."
      },
      {
        step: 3,
        title: "Migration Friction Analysis",
        description: "Determine the exact friction points preventing buyers from switching (data export complexity, retraining).",
        recommended_action: "Draft step-by-step migration blueprint highlighting zero data loss procedures."
      },
      {
        step: 4,
        title: "Targeted Outreach Deployment",
        description: "Send targeted outreach highlighting migration support, feature comparisons, and onboarding assistance.",
        recommended_action: "Enroll decision-makers into Smartlead/Instantly campaign with specific migration offer."
      },
      {
        step: 5,
        title: "Discovery Call Preparation",
        description: "Route interested prospects directly to dedicated competitor battlecard landing pages.",
        recommended_action: "Provide AE with pre-call brief on competitor's recent pricing tier changes."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Legal & Claims Accuracy",
        why_required: "Strictly review all comparative claims against competitor terms to avoid misleading statements."
      },
      {
        checkpoint: "Displaced Rep Alignment",
        why_required: "Equip sales reps with objection handling guidance before live calls take place."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Apollo Technographic Outbound Setup",
        description: "Use Apollo to filter accounts using competitor technology and deliver targeted email cadences.",
        target_profile: "Sales teams with clear product differentiation targeting users of one or two primary competitors.",
        estimated_cost: "$49 - $99/seat/mo",
        required_tools: [
          { slug: "apollo", name: "Apollo", role: "Technographic search & outreach delivery" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Competitive Intelligence + Outbound Pipeline",
        description: "Combine Semrush for search trend monitoring, Clay for custom technographic verification, and Smartlead for sequencing.",
        target_profile: "Mature sales organizations executing targeted displacement campaigns across multiple competitor categories.",
        estimated_cost: "$250 - $450/mo",
        required_tools: [
          { slug: "semrush", name: "Semrush", role: "Keyword intent & competitor trend analysis" },
          { slug: "apollo", name: "Apollo", role: "Account identification & contact discovery" },
          { slug: "smartlead", name: "Smartlead", role: "Dedicated cold email sequence delivery" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      }
    },
    primary_tool_slugs: ["semrush", "apollo", "clay", "smartlead"],
    alternative_tool_slugs: ["instantly", "hubspot-sales-hub"],
    cost_note: "From $49/mo using Apollo built-in technographics up to $250-$450/mo with advanced search intelligence.",
    effort_level: 2,
    time_to_value: "1 week",
    privacy_security_considerations: [
      "Ensure technographic data collection adheres to public web telemetry standards.",
      "Maintain fair-use comparative advertising guidelines and avoid misleading trademark use."
    ],
    builder_query: {
      goal: "outbound_pipeline",
      buckets: "outbound,inbound",
      use_case: "competitor-displacement"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-12",
    slug: "programmatic-seo-engine",
    title: "Programmatic SEO & High-Intent Competitor Comparison Engine",
    short_summary: "Build comparison pages, alternatives roundups, and workflow guides to capture bottom-of-funnel searchers comparing options.",
    bucket: "Inbound",
    stage_id: 1,
    buyer: "Content Directors, SEO Strategists, Head of Growth",
    intended_outcome: "Capture organic search traffic from buyers actively comparing alternatives, providing structured comparisons that convert.",
    business_problem: "Manually researching and writing individual comparison pages is slow and expensive, leaving search demand for competitor alternatives uncaptured.",
    prerequisites: [
      "Keyword research tool (Semrush)",
      "Content optimization tool (Surfer)",
      "CMS or static site generator capable of templated page generation"
    ],
    mini_preview: [
      { label: "Cluster Queries", icon: "search" },
      { label: "Structure Data", icon: "database" },
      { label: "Publish Pages", icon: "file" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Keyword Intent Clustering",
        action_type: "trigger",
        description: "Extract 'X vs Y' and 'X alternatives' keyword clusters with commercial intent.",
        tool_slugs: ["semrush"],
        tool_role: "Keyword Clustering",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Structured Data Modeling",
        action_type: "action",
        description: "Define consistent comparison schema (pricing, features, pros/cons, best-for).",
        tool_slugs: [],
        tool_role: "Data Schema",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "NLP Content Optimization",
        action_type: "enrich",
        description: "Benchmark draft structure and keyword coverage against top ranking search pages.",
        tool_slugs: ["surfer"],
        tool_role: "On-Page Optimization",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Editorial Fact-Check Gate",
        action_type: "approval",
        description: "Review competitor pricing and feature claims for accuracy before publishing.",
        tool_slugs: [],
        tool_role: "Fact-Check Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Outdated competitor pricing or inaccurate feature statements undermine reader trust."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Deploy Static Pages & CTAs",
        action_type: "deliver",
        description: "Render fast comparison pages with contextual stack-building CTAs.",
        tool_slugs: ["hubspot-sales-hub"],
        tool_role: "CMS Publishing",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Keyword Intent Mapping",
        description: "Extract comparison keywords with search volume using Semrush.",
        recommended_action: "Cluster keywords by buyer journey stage (Alternative, Comparison, Pricing)."
      },
      {
        step: 2,
        title: "Structured Data Model",
        description: "Define comparison schema (pricing, key features, best-for, Pros/Cons, integrations).",
        recommended_action: "Create centralized JSON catalog defining verified tool metadata."
      },
      {
        step: 3,
        title: "Content Optimization Score",
        description: "Use Surfer NLP benchmarks to ensure technical depth and heading structures.",
        recommended_action: "Benchmark draft templates against top ranking Google SERP pages."
      },
      {
        step: 4,
        title: "Programmatic Page Generation",
        description: "Render dynamic, fast-loading comparison pages using structured Markdown or JSON templates.",
        recommended_action: "Deploy static pages with automated XML sitemap updates."
      },
      {
        step: 5,
        title: "Direct Conversion Hooks",
        description: "Embed interactive calculators or 'Build My Stack' widgets directly within comparison tables.",
        recommended_action: "Place prefilled CTA buttons leading to relevant stack recommendation workflows."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Editorial Fact Verification",
        why_required: "Double-check all competitor pricing numbers and feature availability before publishing."
      },
      {
        checkpoint: "Brand Fairness Review",
        why_required: "Maintain an objective, neutral comparison tone rather than obvious bias to build genuine buyer trust."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Focused Comparison Content Setup",
        description: "Use Semrush for keyword discovery and Surfer for content optimization to publish high-intent comparison pages.",
        target_profile: "Marketing teams targeting 5-10 core competitor search terms.",
        estimated_cost: "$139 - $228/mo",
        required_tools: [
          { slug: "semrush", name: "Semrush", role: "Search keyword research & competitor tracking" },
          { slug: "surfer", name: "Surfer", role: "NLP content scoring & SERP structure benchmarks" }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Programmatic Content & CMS Suite",
        description: "Add AI workflow engines (Copy.ai) to assemble structured comparison drafts before editorial review.",
        target_profile: "Content teams publishing dozens of alternative and category comparison pages.",
        estimated_cost: "$250 - $400/mo",
        required_tools: [
          { slug: "semrush", name: "Semrush", role: "Keyword clustering" },
          { slug: "surfer", name: "Surfer", role: "Content optimization" },
          { slug: "copy-ai", name: "Copy.ai", role: "Structured draft assembly via workflow templates" },
          { slug: "hubspot-sales-hub", name: "HubSpot", role: "CMS publishing & lead capture" }
        ]
      }
    },
    primary_tool_slugs: ["semrush", "surfer", "hubspot-sales-hub"],
    alternative_tool_slugs: ["copy-ai", "gamma"],
    cost_note: "Semrush ($139/mo) + Surfer ($89/mo) = ~$228/mo.",
    effort_level: 2,
    time_to_value: "4-8 weeks (SEO indexation timeline)",
    privacy_security_considerations: [
      "Ensure all competitor trademarks and comparative product statements comply with trademark guidelines.",
      "Disclose editorial methodology and commercial affiliate relationships transparently."
    ],
    builder_query: {
      goal: "inbound_demand",
      buckets: "inbound",
      use_case: "programmatic-seo-engine"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  },
  {
    id: "uc-13",
    slug: "behavioral-lifecycle-onboarding",
    title: "Automated Product Lifecycle Onboarding & Behavioral Email Nurture",
    short_summary: "Trigger onboarding messages based on user product milestones rather than fixed calendar schedules to support activation.",
    bucket: "Inbound",
    stage_id: 5,
    buyer: "Product Marketers, Lifecycle Marketing Managers, Head of Growth",
    intended_outcome: "Guide users through key setup milestones by sending relevant tips when users stall, while avoiding unnecessary emails to active users.",
    business_problem: "Fixed time-based drip campaigns treat all users identically. Users who finish setup receive beginner tips, while users who get stuck receive premature sales pitches.",
    prerequisites: [
      "In-app telemetry event stream (e.g., project_created, team_invited)",
      "Customer.io, Klaviyo, or HubSpot connected to product database",
      "Authenticated sending domain with SPF and DKIM"
    ],
    mini_preview: [
      { label: "Track Milestone", icon: "database" },
      { label: "Branch Logic", icon: "check" },
      { label: "Send Nurture", icon: "mail" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Track Activation Events",
        action_type: "trigger",
        description: "Monitor product events (workspace created, first export, team invite).",
        tool_slugs: ["customer-io", "klaviyo"],
        tool_role: "Event Telemetry Ingestion",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Behavioral Branching Engine",
        action_type: "action",
        description: "Branch users dynamically: advanced tips if active, 2-minute video guide if stuck.",
        tool_slugs: ["customer-io", "klaviyo"],
        tool_role: "Campaign Branching",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Frequency Capping Gate",
        action_type: "approval",
        description: "Ensure users receive no more than one marketing or onboarding message per 48 hours.",
        tool_slugs: [],
        tool_role: "Automated Frequency Limit",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Prevent overlapping marketing messages from overwhelming newly onboarded users."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Sales Rep Handoff Trigger",
        action_type: "deliver",
        description: "Alert assigned AE when an account hits high usage thresholds or multiple active seats.",
        tool_slugs: ["hubspot-sales-hub"],
        tool_role: "CRM Handoff Alert",
        is_optional: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Track Key Milestones",
        description: "Define activation events (e.g. workspace_created, teammate_invited, first_export).",
        recommended_action: "Instrument telemetry events with user and organization IDs."
      },
      {
        step: 2,
        title: "Behavioral Branching",
        description: "If user completes setup early, send advanced tips; if stalled after 48h, send a short walkthrough.",
        recommended_action: "Build campaign branching logic based on boolean event property triggers."
      },
      {
        step: 3,
        title: "Milestone Recognition",
        description: "Send milestone email highlighting hours saved or tasks completed when key outcomes are reached.",
        recommended_action: "Highlight tangible progress metrics in dynamic email templates."
      },
      {
        step: 4,
        title: "Sales Handoff Trigger",
        description: "When an account hits multiple active seats or plan usage limits, notify the account rep.",
        recommended_action: "Post Slack notification to sales team with account product usage summary."
      },
      {
        step: 5,
        title: "Feedback & NPS Loop",
        description: "Solicit feedback automatically from users after 14 days of sustained activity.",
        recommended_action: "Send short survey link to understand user satisfaction."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Frequency Capping Audit",
        why_required: "Ensure users do not receive multiple overlapping marketing and product emails on the same day."
      },
      {
        checkpoint: "Unsubscribe & Preference Handling",
        why_required: "Honor email preference centers: allow opting out of marketing tips while keeping transactional security alerts active."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "CRM-Based Lifecycle Email Setup",
        description: "Use HubSpot's built-in marketing automation to trigger onboarding emails based on form and CRM events.",
        target_profile: "Early B2B startups wanting lifecycle emails managed in their core CRM.",
        estimated_cost: "Included in CRM tier ($0 - $50/user/mo)",
        required_tools: [
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "CRM, list segmentation & automated email workflows" }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Dedicated Event-Driven Lifecycle Platform",
        description: "Deploy Customer.io or Klaviyo for real-time event streaming and behavioral branch campaigns.",
        target_profile: "SaaS products with complex multi-stage user onboarding and product telemetry.",
        estimated_cost: "$100 - $350/mo",
        required_tools: [
          { slug: "customer-io", name: "Customer.io", role: "Real-time behavioral email & in-app messaging" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary sales CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Lifecycle Marketing Engine",
            description: "Choose one dedicated lifecycle platform.",
            options: [
              { slug: "customer-io", name: "Customer.io", role: "Event-driven messaging built for B2B SaaS" },
              { slug: "klaviyo", name: "Klaviyo", role: "Product lifecycle marketing platform" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["customer-io", "klaviyo", "hubspot-sales-hub"],
    alternative_tool_slugs: ["vitally", "make"],
    cost_note: "From $0 on CRM-native workflows up to $100-$350/mo for dedicated behavioral platforms based on contact volume.",
    effort_level: 2,
    time_to_value: "1-2 weeks",
    privacy_security_considerations: [
      "Adhere to CAN-SPAM, CASL, and GDPR guidelines for commercial email communications.",
      "Maintain clear separation between marketing communications and transactional account alerts."
    ],
    builder_query: {
      goal: "customer_retention",
      buckets: "inbound,data_orchestration",
      use_case: "behavioral-lifecycle-onboarding"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  },
  {
    id: "uc-14",
    slug: "frictionless-scheduling",
    title: "Instant Lead-to-Meeting Frictionless Scheduling Engine",
    short_summary: "Embed calendar booking directly into forms, emails, and chatbots with round-robin routing to eliminate scheduling delays.",
    bucket: "Inbound",
    stage_id: 3,
    buyer: "Inbound Sales Managers, RevOps, Demand Gen Leads",
    intended_outcome: "Allow qualified inbound prospects to book demo meetings immediately upon form submission, reducing scheduling friction.",
    business_problem: "Traditional forms asking buyers to wait for representative outreach often lose prospects who fail to reply to follow-up emails.",
    prerequisites: [
      "Google Workspace or Outlook business calendar sync",
      "Calendly account with routing rules",
      "Website form or landing page builder"
    ],
    mini_preview: [
      { label: "Submit Form", icon: "file" },
      { label: "Pick Time", icon: "calendar" },
      { label: "Send Reminder", icon: "bell" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Form Submission & Qualifying",
        action_type: "trigger",
        description: "Prospect submits form with basic qualification fields (team size, goals).",
        tool_slugs: ["hubspot-sales-hub"],
        tool_role: "Lead Form Capture",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Instant Calendar Slot Embed",
        action_type: "action",
        description: "Display live representative availability directly on the confirmation screen.",
        tool_slugs: ["calendly"],
        tool_role: "Interactive Booking",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Calendar Invite & Video Link",
        action_type: "deliver",
        description: "Deliver confirmed calendar event with video link and prep agenda to both parties.",
        tool_slugs: ["calendly"],
        tool_role: "Calendar Coordination",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Automated Reminder Cadence",
        action_type: "action",
        description: "Send automated email reminders 24 hours and 1 hour before scheduled call.",
        tool_slugs: ["calendly"],
        tool_role: "Attendance Protection",
        is_required: true
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Meeting Record in CRM",
        action_type: "sync",
        description: "Log meeting record and assigned owner in CRM pipeline.",
        tool_slugs: ["hubspot-sales-hub", "close-crm"],
        tool_role: "CRM Activity Sync",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "In-Form Booking Display",
        description: "Embed Calendly widget on form submission page immediately after qualifying fields are submitted.",
        recommended_action: "Display real-time rep calendar slots directly on the confirmation screen."
      },
      {
        step: 2,
        title: "Availability Optimization",
        description: "Set buffer times, minimum scheduling notices, and working hour restrictions to protect AE focus time.",
        recommended_action: "Configure 15-minute buffers and minimum 4-hour advance booking window."
      },
      {
        step: 3,
        title: "Automated Meeting Confirmation",
        description: "Instantly send calendar invite with Zoom/Google Meet link and preparation agenda to both parties.",
        recommended_action: "Include custom agenda questionnaire and preparation resources in invite description."
      },
      {
        step: 4,
        title: "Multi-Touch Reminders",
        description: "Send automated reminder 24 hours and 1 hour before scheduled call, reducing no-show rates.",
        recommended_action: "Configure automated email reminder with simple meeting join link."
      },
      {
        step: 5,
        title: "Rescheduling Automation",
        description: "Include self-serve one-click reschedule links in all reminders to prevent cancellations.",
        recommended_action: "Enable frictionless reschedule button to preserve high-intent pipeline."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Capacity Balancing Review",
        why_required: "Regularly monitor representative meeting loads to avoid rep burnout during heavy campaign periods."
      },
      {
        checkpoint: "No-Show Outreach Triage",
        why_required: "Reach out manually within 10 minutes of a missed call with an updated reschedule link."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Calendly + CRM Scheduling Setup",
        description: "Connect Calendly directly to your team's Google or Microsoft calendars and sync appointments to your CRM.",
        target_profile: "Sales teams wanting reliable scheduling with automated reminders and round-robin distribution.",
        estimated_cost: "$10 - $16/seat/mo",
        required_tools: [
          { slug: "calendly", name: "Calendly", role: "Automated booking, reminders & round-robin routing" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "CRM meeting activity sync" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Select one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Inbound sales CRM" },
              { slug: "close-crm", name: "Close CRM", role: "High-velocity sales CRM" },
              { slug: "pipedrive", name: "Pipedrive", role: "Deal pipeline CRM" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["calendly", "hubspot-sales-hub", "close-crm"],
    alternative_tool_slugs: ["pipedrive", "attio"],
    cost_note: "Typically $10-$16/seat/mo for dedicated scheduling platforms.",
    effort_level: 1,
    time_to_value: "1 day",
    privacy_security_considerations: [
      "Ensure calendar integration permissions do not expose private personal calendar details to external prospects.",
      "Collect only necessary contact information on meeting reservation forms."
    ],
    builder_query: {
      goal: "inbound_demand",
      buckets: "lead_capture,inbound",
      use_case: "frictionless-scheduling"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-15",
    slug: "ai-researcher-pre-call-briefs",
    title: "Autonomous B2B Account Research & Pre-Call Intelligence Briefs",
    short_summary: "Gather public company information, recent announcements, and tech stack details to deliver a concise pre-call summary to sales reps.",
    bucket: "Agentic Operations",
    stage_id: 3,
    buyer: "VP of Sales, Account Executives, Commercial SDRs",
    intended_outcome: "Save representatives manual research time and equip them with relevant business context before initial discovery calls.",
    business_problem: "Account executives often enter discovery calls under-prepared or spend 30-45 minutes browsing corporate websites and news releases instead of selling.",
    prerequisites: [
      "Scheduled meeting on calendar with prospect company domain",
      "Copy.ai or Artisan automated research workflow",
      "Slack or CRM integration for brief delivery"
    ],
    mini_preview: [
      { label: "Calendar Trigger", icon: "calendar" },
      { label: "Research Web", icon: "search" },
      { label: "Deliver Brief", icon: "file" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Meeting Calendar Trigger",
        action_type: "trigger",
        description: "Detect upcoming discovery call on sales representative calendar.",
        tool_slugs: [],
        tool_role: "Calendar Webhook",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Public Domain Research",
        action_type: "enrich",
        description: "Crawl public company website, news announcements, and active job postings.",
        tool_slugs: ["copy-ai", "artisan"],
        tool_role: "AI Research Assistant",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Synthesize Business Context",
        action_type: "action",
        description: "Formulate 3 tailored discovery questions based on observed business priorities.",
        tool_slugs: ["copy-ai"],
        tool_role: "Context Synthesis",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Rep Pre-Call Review Gate",
        action_type: "approval",
        description: "Sales representative reviews synthesized points before the call to ensure natural conversational flow.",
        tool_slugs: [],
        tool_role: "Human Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Verify that AI-generated hypotheses align with verified public facts before speaking with clients."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Deliver to Slack & CRM",
        action_type: "deliver",
        description: "Post 1-page summary to rep Slack DM and attach notes to CRM Deal record.",
        tool_slugs: ["hubspot-sales-hub"],
        tool_role: "CRM Record Note",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Calendar Event Trigger",
        description: "Webhook detects new discovery meeting on rep calendar prior to scheduled call.",
        recommended_action: "Trigger research workflow extracting prospect domain and participant names."
      },
      {
        step: 2,
        title: "Account Intelligence Research",
        description: "AI agent crawls company website, recent announcements, and job boards.",
        recommended_action: "Extract strategic initiatives, recent product launches, and key hiring priorities."
      },
      {
        step: 3,
        title: "Pain Hypothesis Formulation",
        description: "Synthesize company business model, probable pain points, and current tech stack into 3 discovery questions.",
        recommended_action: "Generate 3 high-impact questions focused on business outcomes."
      },
      {
        step: 4,
        title: "Representative Review Gate",
        description: "AE reviews brief before joining call to ensure conversational alignment.",
        recommended_action: "Verify financial figures or quotes if referencing specific press statements."
      },
      {
        step: 5,
        title: "Delivery to Slack & CRM",
        description: "Post clean, formatted summary into private Slack DM for AE and attach note to CRM Deal record.",
        recommended_action: "Send 1-page brief 30 minutes before call starts."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "AE Brief Review",
        why_required: "AE spends 2-3 minutes reviewing the brief before entering the call to ensure natural conversational flow."
      },
      {
        checkpoint: "Fact & Metric Verification",
        why_required: "Verify financial figures or specific quotes before referencing them on live prospect calls."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Workflow Prompt Template Setup",
        description: "Use Copy.ai's workflow builder to research prospect domains and format 1-page pre-call summaries.",
        target_profile: "Sales teams wanting automated research briefs without custom engineering.",
        estimated_cost: "$36 - $49/mo",
        required_tools: [
          { slug: "copy-ai", name: "Copy.ai", role: "AI research workflow & question synthesis" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "CRM deal record & note storage" }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Autonomous Researcher Pipeline",
        description: "Deploy Artisan for autonomous account research combined with Clay data enrichment and CRM sync.",
        target_profile: "High-volume commercial sales organizations handling multiple discovery calls daily.",
        estimated_cost: "$150 - $350/mo",
        required_tools: [
          { slug: "artisan", name: "Artisan", role: "Autonomous B2B outbound & research agent" },
          { slug: "clay", name: "Clay", role: "Enrichment & technographic lookup" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Primary CRM" }
        ]
      }
    },
    primary_tool_slugs: ["artisan", "copy-ai", "clay"],
    alternative_tool_slugs: ["apollo", "hubspot-sales-hub"],
    cost_note: "Typically $36-$49/mo for workflow builder subscriptions up to $150-$350/mo for autonomous agent suites.",
    effort_level: 1,
    time_to_value: "2-3 days",
    privacy_security_considerations: [
      "Rely strictly on public corporate information; do not scrape private personal records.",
      "Ensure research workflows do not store confidential client information in shared third-party model prompts."
    ],
    builder_query: {
      goal: "call_intelligence",
      buckets: "agentic_ops,data_orchestration",
      use_case: "ai-researcher-pre-call-briefs"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-16",
    slug: "call-recording-crm-sync",
    title: "Meeting Transcription, Action Item Extraction & CRM Sync",
    short_summary: "Record sales calls, generate executive summaries, and update CRM deal fields without requiring manual note entry from sales reps.",
    bucket: "Agentic Operations",
    stage_id: 3,
    buyer: "Sales Directors, RevOps Managers, Account Executives",
    intended_outcome: "Eliminate manual CRM note-taking after sales calls, keep deal records complete, and track agreed next steps.",
    business_problem: "Sales representatives often postpone CRM data entry; vital customer objections, competitor mentions, and follow-up agreements remain unlogged.",
    prerequisites: [
      "Video conferencing tool (Zoom, Google Meet, or Microsoft Teams)",
      "Meeting recording tool (Fathom, Fireflies.ai, MeetGeek, or Gong)",
      "CRM integration with write permissions on Deals/Opportunities"
    ],
    mini_preview: [
      { label: "Record Call", icon: "user" },
      { label: "Extract Notes", icon: "file" },
      { label: "Sync to CRM", icon: "database" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Auto-Join & Recording Notice",
        action_type: "trigger",
        description: "Assistant joins scheduled call with audio/visual recording notification for attendees.",
        tool_slugs: ["fathom", "fireflies-ai", "meetgeek"],
        tool_role: "Meeting Assistant",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Transcription & Speaker Diarization",
        action_type: "action",
        description: "Transcribe audio with accurate speaker identification.",
        tool_slugs: ["fathom", "fireflies-ai"],
        tool_role: "Transcription Engine",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Structure Action Items & Objections",
        action_type: "enrich",
        description: "Extract summary bullets, agreed next steps, budget cues, and competitor mentions.",
        tool_slugs: ["fathom", "fireflies-ai", "gong"],
        tool_role: "Conversation Intelligence",
        is_required: true
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Follow-Up Draft Review Gate",
        action_type: "approval",
        description: "Rep reviews and adjusts generated follow-up email draft before sending to client.",
        tool_slugs: [],
        tool_role: "Human Approval",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Ensure rep verifies technical commitments and pricing quotes before client send."
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "Field-Level CRM Sync",
        action_type: "sync",
        description: "Update next step dates, summary notes, and deal stage in CRM.",
        tool_slugs: ["hubspot-sales-hub", "salesforce-sales-cloud", "close-crm"],
        tool_role: "CRM Record Update",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Automatic Bot Join",
        description: "Recording assistant automatically joins scheduled client call and transcribes audio with speaker diarization.",
        recommended_action: "Ensure bot joins 1 minute before scheduled start time with clear recording notice."
      },
      {
        step: 2,
        title: "Structured Note Generation",
        description: "AI generates summary: Pain points, Decisions Made, Objections, Agreed Next Steps, and qualification criteria.",
        recommended_action: "Structure output using standard executive bullet format."
      },
      {
        step: 3,
        title: "Field-Level CRM Update",
        description: "Push structured fields (Next Steps date, Competitors mentioned, Budget stated) into CRM.",
        recommended_action: "Sync fields into CRM deal record within 5 minutes of call completion."
      },
      {
        step: 4,
        title: "Follow-Up Email Drafting",
        description: "Automatically draft follow-up email with bulleted next steps ready for rep review.",
        recommended_action: "Stage email in rep's Gmail/Outlook drafts for 1-click review and send."
      },
      {
        step: 5,
        title: "Team Visibility Share",
        description: "Post call highlights into account deal channel for management visibility.",
        recommended_action: "Send Slack alert tagging account team with recording timestamp link."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Rep Email Approval",
        why_required: "Sales rep reviews the draft follow-up email and edits tone before clicking send to client."
      },
      {
        checkpoint: "Confidentiality Audit",
        why_required: "Verify no confidential customer IP or payment details are captured in open CRM notes."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "Fathom + CRM Free/Low-Cost Setup",
        description: "Use Fathom for individual rep recording, automatic summary generation, and direct CRM field synchronization.",
        target_profile: "Individual AEs and small sales teams wanting accurate call notes without high seat minimums.",
        estimated_cost: "Free - $19/user/mo",
        required_tools: [
          { slug: "fathom", name: "Fathom", role: "AI meeting recorder, summary extraction & CRM sync" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Deal tracking & note storage" }
        ],
        choose_one_alternatives: [
          {
            role: "Meeting Assistant",
            description: "Choose one meeting note-taker — do not pay for multiple recording tools for the same reps.",
            options: [
              { slug: "fathom", name: "Fathom", role: "Clean individual rep recorder with fast CRM sync" },
              { slug: "fireflies-ai", name: "Fireflies.ai", role: "Team-wide transcription with audio search" },
              { slug: "meetgeek", name: "MeetGeek", role: "Meeting intelligence with automated summaries" }
            ]
          },
          {
            role: "CRM System",
            description: "Connect to your primary CRM.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Sales CRM" },
              { slug: "close-crm", name: "Close CRM", role: "High-velocity CRM" },
              { slug: "pipedrive", name: "Pipedrive", role: "Pipeline CRM" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Enterprise Revenue Intelligence Suite",
        description: "Deploy Gong for conversation coaching, pipeline risk alerts, and deep CRM opportunity integration.",
        target_profile: "Mid-market and enterprise sales teams with 10+ representatives requiring coaching analytics.",
        estimated_cost: "Custom quote (typically $100-$150/user/mo)",
        required_tools: [
          { slug: "gong", name: "Gong", role: "Conversation intelligence & deal risk coaching" },
          { slug: "salesforce-sales-cloud", name: "Salesforce Sales Cloud", role: "Primary enterprise CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Enterprise CRM",
            description: "Connect to your primary CRM platform.",
            options: [
              { slug: "salesforce-sales-cloud", name: "Salesforce", role: "Enterprise sales cloud" },
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Enterprise Sales Hub" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["fathom", "fireflies-ai", "meetgeek", "gong", "hubspot-sales-hub", "salesforce-sales-cloud"],
    alternative_tool_slugs: ["pipedrive", "close-crm", "attio"],
    cost_note: "From free / $19/user/mo (Fathom, Fireflies) up to custom enterprise contracts (Gong).",
    effort_level: 1,
    time_to_value: "1 day",
    privacy_security_considerations: [
      "Comply with two-party consent recording regulations in relevant jurisdictions (e.g. California, Germany, UK) by enabling explicit visual/audio notices.",
      "Ensure recording storage meets SOC 2 and GDPR standards and allows attendees to request deletion."
    ],
    builder_query: {
      goal: "call_intelligence",
      buckets: "agentic_ops,data_orchestration",
      use_case: "call-recording-crm-sync"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-17",
    slug: "automated-proposals-cpq",
    title: "Deal Proposal Generation & Document Tracking",
    short_summary: "Generate customized proposals and contracts from CRM deal fields, tracking prospect document views and signatures in real-time.",
    bucket: "Agentic Operations",
    stage_id: 4,
    buyer: "Sales Operations, AEs, VP of Sales, Legal",
    intended_outcome: "Reduce the time needed to generate deal quotes, prevent pricing inconsistencies, and track client engagement on pricing tables.",
    business_problem: "Representatives spend hours copy-pasting numbers into slides or Word templates, risking outdated pricing terms, calculation mistakes, and deal momentum delays.",
    prerequisites: [
      "Approved pricing catalog and standard MSA contract template",
      "PandaDoc account connected to CRM",
      "Defined CRM deal stages with product line items"
    ],
    mini_preview: [
      { label: "Stage Trigger", icon: "file" },
      { label: "Track Views", icon: "search" },
      { label: "Sign Contract", icon: "check" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Proposal Stage Trigger",
        action_type: "trigger",
        description: "Move CRM deal to 'Proposal Requested' with line items and contact details.",
        tool_slugs: ["hubspot-sales-hub", "pipedrive"],
        tool_role: "CRM Deal Trigger",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Dynamic Document Assembly",
        action_type: "action",
        description: "Auto-populate customer name, seat counts, discount tier, and billing terms into PandaDoc.",
        tool_slugs: ["pandadoc"],
        tool_role: "CPQ Template Population",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Discount Approval Gate",
        action_type: "approval",
        description: "Route proposals with non-standard terms or discounts >20% to sales leadership for approval.",
        tool_slugs: [],
        tool_role: "Manager Sign-Off",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Ensure contractual margin protection before official proposals reach client inboxes."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Page-by-Page View Tracking",
        action_type: "action",
        description: "Alert representative when client opens proposal or spends time on pricing tables.",
        tool_slugs: ["pandadoc"],
        tool_role: "Engagement Tracking",
        is_required: true
      },
      {
        step_id: "s5",
        step_number: 5,
        label: "E-Signature & Deal Stage Update",
        action_type: "sync",
        description: "Archive signed document PDF in CRM and advance deal stage to Closed-Won.",
        tool_slugs: ["pandadoc", "hubspot-sales-hub"],
        tool_role: "Contract Completion",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "CRM Stage Trigger",
        description: "Rep moves CRM deal to 'Proposal Requested' stage.",
        recommended_action: "Ensure deal has products, seat quantities, and primary contact assigned."
      },
      {
        step: 2,
        title: "Document Assembly",
        description: "PandaDoc auto-populates client name, contact details, selected products, discounts, and terms from CRM fields.",
        recommended_action: "Map CRM fields directly to dynamic PandaDoc template tokens."
      },
      {
        step: 3,
        title: "Discount Approval Review",
        description: "Route proposals with non-standard discounts to sales management before sending.",
        recommended_action: "Set automatic workflow rule for discounts exceeding standard thresholds."
      },
      {
        step: 4,
        title: "Engagement Tracking",
        description: "Sales rep receives alert when client opens proposal and views pricing pages.",
        recommended_action: "Follow up proactively when prospect spends sustained time on pricing tables."
      },
      {
        step: 5,
        title: "E-Signature & CRM Completion",
        description: "Once signed, document PDF is archived in CRM and deal moves to 'Closed-Won'.",
        recommended_action: "Trigger automated webhook updating deal stage to Closed-Won upon completion."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Discount Approval Threshold",
        why_required: "Automated workflow routes proposals with non-standard discounts to sales leadership for approval before send."
      },
      {
        checkpoint: "Legal Clause Review",
        why_required: "Flag modified contractual clauses or custom customer redlines for legal team sign-off."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "PandaDoc + CRM Integration Setup",
        description: "Connect PandaDoc to HubSpot or Pipedrive for 1-click proposal creation, quote tracking, and legally binding e-signatures.",
        target_profile: "Sales teams generating standard SaaS proposals, MSAs, and order forms.",
        estimated_cost: "$19 - $49/seat/mo",
        required_tools: [
          { slug: "pandadoc", name: "PandaDoc", role: "Document template generation, tracking & e-signature" },
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Deal line items & closed-won stage updates" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Connect to your primary CRM.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Sales CRM with deal line items" },
              { slug: "pipedrive", name: "Pipedrive", role: "Pipeline CRM with Smart Docs" },
              { slug: "close-crm", name: "Close CRM", role: "High-velocity sales CRM" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["pandadoc", "hubspot-sales-hub", "pipedrive", "close-crm"],
    alternative_tool_slugs: ["attio", "salesforce-sales-cloud"],
    cost_note: "Typically $19-$49/seat/mo for PandaDoc document automation plans.",
    effort_level: 1,
    time_to_value: "2-3 days",
    privacy_security_considerations: [
      "Maintain encrypted document storage compliant with SOC 2, eIDAS, and UETA electronic signature standards.",
      "Restrict document editing permissions to authorized contract managers."
    ],
    builder_query: {
      goal: "call_intelligence",
      buckets: "agentic_ops,lead_capture",
      use_case: "automated-proposals-cpq"
    },
    gptify_resource_url: "https://gptify.co/ai-use-cases-for-sales-marketing/"
  },
  {
    id: "uc-18",
    slug: "revenue-forecasting-slippage",
    title: "Revenue Forecasting & Deal Slippage Risk Detection",
    short_summary: "Evaluate pipeline engagement, meeting frequency, and email velocity to flag at-risk deals and support quarterly forecasting.",
    bucket: "Agentic Operations",
    stage_id: 4,
    buyer: "CROs, VPs of Sales, RevOps Directors, CFOs",
    intended_outcome: "Replace subjective pipeline forecasts with objective activity metrics, identifying stalls before quarter-end.",
    business_problem: "Sales representatives frequently keep deals in commit status that lack recent customer engagement, leading to unexpected revenue forecast misses.",
    prerequisites: [
      "Active sales team with CRM activity logging (emails, meetings, calls)",
      "Defined sales stages with exit criteria",
      "Revenue intelligence platform (Clari or Gong) or CRM forecasting module"
    ],
    mini_preview: [
      { label: "Log Velocity", icon: "database" },
      { label: "Detect Stalls", icon: "bell" },
      { label: "Forecast Pipeline", icon: "trending" }
    ],
    workflow_diagram: [
      {
        step_id: "s1",
        step_number: 1,
        label: "Omnichannel Activity Logging",
        action_type: "trigger",
        description: "Capture emails, meetings, and proposal views associated with active pipeline opportunities.",
        tool_slugs: ["clari", "gong", "salesforce-sales-cloud"],
        tool_role: "Activity Ingestion",
        is_required: true
      },
      {
        step_id: "s2",
        step_number: 2,
        label: "Engagement Velocity Scoring",
        action_type: "action",
        description: "Analyze response time gaps and flag deals where buyer communication has stalled.",
        tool_slugs: ["clari", "gong"],
        tool_role: "Deal Momentum Analytics",
        is_required: true
      },
      {
        step_id: "s3",
        step_number: 3,
        label: "Executive Pipeline Review Gate",
        action_type: "approval",
        description: "CRO reviews flagged at-risk opportunities with deal owners during weekly pipeline reviews.",
        tool_slugs: [],
        tool_role: "Leadership Review",
        is_required: true,
        is_human_gate: true,
        gate_reason: "Allow reps to clarify offline communication context (e.g. in-person meetings)."
      },
      {
        step_id: "s4",
        step_number: 4,
        label: "Predictive Forecast Simulation",
        action_type: "deliver",
        description: "Project quarterly revenue range based on historic conversion patterns across similar deals.",
        tool_slugs: ["clari", "gong", "salesforce-sales-cloud"],
        tool_role: "Forecast Model",
        is_required: true
      }
    ],
    workflow_steps: [
      {
        step: 1,
        title: "Activity Ingestion",
        description: "Capture all emails, meetings, and proposal views associated with active pipeline opportunities.",
        recommended_action: "Connect rep Google Workspace/Outlook accounts to Clari, Gong, or CRM platform."
      },
      {
        step: 2,
        title: "Engagement Velocity Scoring",
        description: "Analyze time gaps between buyer responses; detect sudden drops in stakeholder participation.",
        recommended_action: "Calculate buyer momentum indicators across last 14 days."
      },
      {
        step: 3,
        title: "Objective Risk Flagging",
        description: "Algorithm flags deals with risk indicators (e.g. no scheduled next meeting, unanswered emails).",
        recommended_action: "Highlight flagged deals during weekly pipeline review dashboards."
      },
      {
        step: 4,
        title: "Executive Opportunity Review",
        description: "Leadership reviews risk alerts with deal owners, focusing coaching on actionable deal rescues.",
        recommended_action: "Assign executive sponsor touchpoint for high-value at-risk deals."
      },
      {
        step: 5,
        title: "Forecast Cadence",
        description: "Project expected quarterly revenue range based on historic conversion rates.",
        recommended_action: "Compare representative commit numbers against activity-based forecast metrics."
      }
    ],
    human_checkpoints: [
      {
        checkpoint: "Executive Opportunity Review",
        why_required: "CRO validates flagged risks with deal owners during weekly 1-on-1 forecast reviews."
      },
      {
        checkpoint: "Exemption & Offline Context",
        why_required: "Allow reps to log offline relationship context (e.g. in-person meetings conducted without calendar sync)."
      }
    ],
    stack_options: {
      lean: {
        tier: "lean",
        title: "CRM-Native Pipeline Forecasting",
        description: "Use your CRM's built-in deal stage aging and forecasting views without adding dedicated revenue intelligence suites.",
        target_profile: "Sales teams with fewer than 8 reps wanting clean pipeline visibility.",
        estimated_cost: "Included in CRM tier ($50 - $100/user/mo)",
        required_tools: [
          { slug: "hubspot-sales-hub", name: "HubSpot Sales Hub", role: "Deal stage aging, activity logging & pipeline forecasting" }
        ],
        choose_one_alternatives: [
          {
            role: "CRM System",
            description: "Select one primary CRM system.",
            options: [
              { slug: "hubspot-sales-hub", name: "HubSpot", role: "Sales Hub Professional/Enterprise forecasting" },
              { slug: "salesforce-sales-cloud", name: "Salesforce", role: "Sales Cloud collaborative forecasting" }
            ]
          }
        ]
      },
      advanced: {
        tier: "advanced",
        title: "Dedicated Revenue Intelligence Platform",
        description: "Deploy Clari or Gong alongside your CRM for automated activity capture and machine-learning forecast simulation.",
        target_profile: "Mid-market and enterprise sales organizations with complex buying committees and multi-tier forecasts.",
        estimated_cost: "Custom quote",
        required_tools: [
          { slug: "clari", name: "Clari", role: "Revenue platform & predictive pipeline analytics" },
          { slug: "salesforce-sales-cloud", name: "Salesforce Sales Cloud", role: "Primary enterprise CRM" }
        ],
        choose_one_alternatives: [
          {
            role: "Revenue Intelligence Platform",
            description: "Choose one platform for revenue intelligence.",
            options: [
              { slug: "clari", name: "Clari", role: "Pipeline governance & predictive forecast simulation" },
              { slug: "gong", name: "Gong", role: "Call-driven deal intelligence & momentum tracking" }
            ]
          }
        ]
      }
    },
    primary_tool_slugs: ["clari", "gong", "salesforce-sales-cloud", "hubspot-sales-hub"],
    alternative_tool_slugs: ["attio"],
    cost_note: "Included in CRM tiers or quote-based enterprise pricing (Clari, Gong).",
    effort_level: 2,
    time_to_value: "2-4 weeks (requires baseline activity telemetry)",
    privacy_security_considerations: [
      "Maintain role-based access control (RBAC) on revenue forecasting and pipeline compensation data.",
      "Ensure customer conversation transcripts are stored securely with appropriate encryption standards."
    ],
    builder_query: {
      goal: "call_intelligence",
      buckets: "agentic_ops,data_orchestration",
      use_case: "revenue-forecasting-slippage"
    },
    gptify_resource_url: "https://gptify.co/ai-use-case-library/"
  }
];

const targetPath = path.join(__dirname, '..', 'data', 'use-cases.json');
fs.writeFileSync(targetPath, JSON.stringify(useCases, null, 2), 'utf-8');
console.log(`Successfully generated ${useCases.length} use cases at: ${targetPath}`);

// Validation
const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.json'), 'utf-8'));
const activeTools = toolsData.filter(t => t.is_public !== false && t.status === 'active');
const activeSlugs = new Set(activeTools.map(t => t.slug));

let invalidSlugs = [];
useCases.forEach(uc => {
  // Check primary and alternative tool slugs
  [...uc.primary_tool_slugs, ...uc.alternative_tool_slugs].forEach(s => {
    if (!activeSlugs.has(s)) invalidSlugs.push({ useCase: uc.slug, slug: s, type: 'primary/alt' });
  });

  // Check stack options
  const leanTools = uc.stack_options.lean.required_tools.map(t => t.slug);
  leanTools.forEach(s => {
    if (!activeSlugs.has(s)) invalidSlugs.push({ useCase: uc.slug, slug: s, type: 'lean required' });
  });

  if (uc.stack_options.lean.choose_one_alternatives) {
    uc.stack_options.lean.choose_one_alternatives.forEach(grp => {
      grp.options.forEach(t => {
        if (!activeSlugs.has(t.slug)) invalidSlugs.push({ useCase: uc.slug, slug: t.slug, type: 'lean choose_one' });
      });
    });
  }

  if (uc.stack_options.advanced) {
    uc.stack_options.advanced.required_tools.forEach(t => {
      if (!activeSlugs.has(t.slug)) invalidSlugs.push({ useCase: uc.slug, slug: t.slug, type: 'adv required' });
    });
    if (uc.stack_options.advanced.choose_one_alternatives) {
      uc.stack_options.advanced.choose_one_alternatives.forEach(grp => {
        grp.options.forEach(t => {
          if (!activeSlugs.has(t.slug)) invalidSlugs.push({ useCase: uc.slug, slug: t.slug, type: 'adv choose_one' });
        });
      });
    }
  }

  // Check workflow diagram
  uc.workflow_diagram.forEach(st => {
    st.tool_slugs.forEach(s => {
      if (!activeSlugs.has(s)) invalidSlugs.push({ useCase: uc.slug, slug: s, type: 'diagram step' });
    });
  });
});

console.log('Invalid tool slugs against 50 active catalog:', invalidSlugs);
if (invalidSlugs.length === 0) {
  console.log('ALL 18 USE CASES 100% VALIDATED AGAINST 50 ACTIVE CATALOG TOOLS!');
}
