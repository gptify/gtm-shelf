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
  integrations: string[];
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

