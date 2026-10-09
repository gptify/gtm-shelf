export type PricingModel = 'free_plan' | 'paid' | 'custom_quote';
export type ToolStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived';

export interface Stage {
  id: number;
  slug: string;
  name: string;
  hint: string;
  sort: number;
}

export interface Category {
  id: number;
  stage_id: number;
  slug: string;
  name: string;
  phrase: string;
  sort: number;
}

export interface Integration {
  id: number;
  slug: string;
  name: string;
}

export type ToolClassification = 'core' | 'specialist' | 'review' | 'discontinued' | 'sunsetting';
export type ToolLifecycle = 'active' | 'sunsetting' | 'discontinued';
export type GtmBucket = 'Inbound' | 'Outbound' | 'Lead Capture' | 'Data & Orchestration' | 'Agentic Operations';

export interface ToolPublic {
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
  affiliate_url?: string | null;
  integrations: string[];
  classification?: ToolClassification;
  lifecycle_status?: ToolLifecycle;
  primary_jtbd?: string;
  secondary_capabilities?: string[];
  buyer_segment?: string;
  gtm_buckets?: GtmBucket[];
  overlapping_tools?: string[];
  min_plan?: string;
  pricing_verified_at?: string;
  alternatives_note?: string | null;
  source_url?: string;
  billing_basis?: string;
  geographic_coverage?: string;
}

export interface GuideFilter {
  category?: string;
  exclude_pricing?: string[];
  pricing?: string[];
  integration?: string;
  also_include_tool_named?: string;
}

export interface Guide {
  slug: string;
  type: 'best' | 'vs';
  title: string;
  desc: string;
  cat?: string;
  intro?: string;
  crit?: string;
  choose?: string[];
  filter?: GuideFilter;
  a?: string;
  b?: string;
}

