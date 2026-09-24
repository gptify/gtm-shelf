import sampleTools from '@/starter/finder/fixtures/tools.json';
import taxonomy from '@/starter/content/taxonomy.json';
import guidesData from '@/starter/content/guides.json';
import { ToolStatus, PricingModel, Guide } from '@/lib/types';

export interface ToolSource {
  id?: string;
  url: string;
  label?: string;
}

export interface AdminTool {
  id: string;
  slug: string;
  name: string;
  domain: string;
  website_url: string;
  tagline: string;
  description: string;
  best_for?: string | null;
  stage_id: number;
  stage_name: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  pricing_model: PricingModel;
  price_note?: string | null;
  setup_effort: 1 | 2 | 3;
  featured: boolean;
  featured_until?: string | null;
  sponsored: boolean;
  logo_path?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  status: ToolStatus;
  integrations: string[];
  sources: ToolSource[];
}

export interface AdminSubmission {
  id: string;
  name: string;
  website_url: string;
  stage_id?: number | null;
  category_id?: number | null;
  category_name?: string | null;
  pricing_model: string;
  tagline: string;
  description?: string | null;
  contact_email: string;
  is_vendor: boolean;
  status: 'new' | 'accepted' | 'rejected' | 'spam';
  tool_id?: string | null;
  created_at: string;
}

export interface AdminCustomRequest {
  id: string;
  name: string;
  email: string;
  what: string;
  tools_used?: string | null;
  team_size?: string | null;
  budget?: string | null;
  timing?: string | null;
  language?: string | null;
  source: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'declined' | 'spam';
  internal_note?: string | null;
  created_at: string;
}

// Initial in-memory admin state
function initTools(): AdminTool[] {
  return sampleTools.map((t) => {
    const stage = taxonomy.stages.find((s) => s.id === t.stage) || taxonomy.stages[0];
    const category = taxonomy.categories.find((c) => c.name === t.cat) || taxonomy.categories[0];
    let pricing: PricingModel = 'free_plan';
    if (t.price === 'Paid') pricing = 'paid';
    if (t.price === 'Custom quote') pricing = 'custom_quote';

    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      domain: t.domain,
      website_url: `https://${t.domain}`,
      tagline: t.tagline,
      description: t.description,
      best_for: t.best,
      stage_id: t.stage,
      stage_name: stage.name,
      category_id: category.stage_id,
      category_name: category.name,
      category_slug: category.slug,
      pricing_model: pricing,
      price_note: t.price,
      setup_effort: (t.setup || 1) as 1 | 2 | 3,
      featured: Boolean(t.feat),
      sponsored: false,
      logo_path: null,
      verified_at: null, // Note: sample tools are unverified draft tools per brief
      verified_by: null,
      status: 'draft',
      integrations: t.ints,
      sources: [],
    };
  });
}

function initSubmissions(): AdminSubmission[] {
  return [
    {
      id: 'sub-1',
      name: 'Amplemarket',
      website_url: 'https://amplemarket.com',
      stage_id: 3,
      category_name: 'AI SDR agents',
      pricing_model: 'Custom quote',
      tagline: 'AI sales platform for lead generation, multichannel outreach, and email deliverability',
      description: 'Provides B2B data, buying signals, email warmup, and AI-assisted sequences.',
      contact_email: 'growth@amplemarket.com',
      is_vendor: true,
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'sub-2',
      name: 'Unspam Email Checker',
      website_url: 'https://unspam.email',
      stage_id: 3,
      category_name: 'Email outreach',
      pricing_model: 'Free plan',
      tagline: 'Free spam checker and email deliverability tester for sales outbound',
      description: 'Analyzes SPF, DKIM, DMARC, IP blacklists, and spam word triggers.',
      contact_email: 'team@unspam.email',
      is_vendor: false,
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];
}

function initCustomRequests(): AdminCustomRequest[] {
  return [
    {
      id: 'req-1',
      name: 'Michael Scott',
      email: 'mscott@dundermifflin.com',
      what: 'We need an automated AI enrichment workflow that extracts verified emails and company size from LinkedIn and pushes them directly into our HubSpot CRM pipeline.',
      tools_used: 'HubSpot, Slack',
      team_size: 'Growing team (11–50)',
      budget: '$5,000 – $15,000',
      timing: 'Immediately',
      language: 'English',
      source: 'finder',
      status: 'new',
      internal_note: 'Initial review scheduled with tech lead.',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}

function initGuides(): (Guide & { published: boolean })[] {
  return guidesData.map((g) => ({
    ...g,
    type: g.type as 'best' | 'vs',
    published: true,
  }));
}

// Global persistent stores across requests in server process
declare global {
  var __gtm_admin_tools: AdminTool[] | undefined;
  var __gtm_admin_submissions: AdminSubmission[] | undefined;
  var __gtm_admin_custom_requests: AdminCustomRequest[] | undefined;
  var __gtm_admin_guides: (Guide & { published: boolean })[] | undefined;
}

export function getAdminTools(): AdminTool[] {
  if (!global.__gtm_admin_tools) {
    global.__gtm_admin_tools = initTools();
  }
  return global.__gtm_admin_tools;
}

export function getAdminSubmissions(): AdminSubmission[] {
  if (!global.__gtm_admin_submissions) {
    global.__gtm_admin_submissions = initSubmissions();
  }
  return global.__gtm_admin_submissions;
}

export function getAdminCustomRequests(): AdminCustomRequest[] {
  if (!global.__gtm_admin_custom_requests) {
    global.__gtm_admin_custom_requests = initCustomRequests();
  }
  return global.__gtm_admin_custom_requests;
}

export function getAdminGuides(): (Guide & { published: boolean })[] {
  if (!global.__gtm_admin_guides) {
    global.__gtm_admin_guides = initGuides();
  }
  return global.__gtm_admin_guides;
}
