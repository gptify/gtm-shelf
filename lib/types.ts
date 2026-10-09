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
  is_public?: boolean;
  status?: string;
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

export interface UseCaseStep {
  step: number;
  title: string;
  description: string;
  recommended_action: string;
}

export interface UseCaseHumanCheckpoint {
  checkpoint: string;
  why_required: string;
}

export interface WorkflowStepData {
  id?: string;
  step_id?: string;
  step_number: number;
  label: string;
  action_type: 'trigger' | 'enrich' | 'action' | 'approval' | 'deliver' | 'sync';
  description: string;
  tool_slugs: string[];
  tool_role?: string;
  is_optional?: boolean;
  is_required?: boolean;
  is_human_gate?: boolean;
  gate_reason?: string;
}

export interface MiniStepPreview {
  label: string;
  icon: 'search' | 'database' | 'mail' | 'chat' | 'user' | 'calendar' | 'check' | 'bell' | 'file' | 'trending';
}

export interface StackToolItem {
  slug: string;
  name: string;
  role: string;
}

export interface StackOption {
  tier: 'lean' | 'advanced';
  title: string;
  description: string;
  target_profile: string;
  estimated_cost: string;
  required_tools: StackToolItem[];
  choose_one_alternatives?: {
    role: string;
    description: string;
    options: StackToolItem[];
  }[];
  optional_upgrades?: StackToolItem[];
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  short_summary: string;
  bucket: GtmBucket;
  stage_id: number;
  buyer: string;
  intended_outcome: string;
  business_problem: string;
  prerequisites: string[];
  mini_preview: MiniStepPreview[];
  workflow_diagram: WorkflowStepData[];
  workflow_steps: UseCaseStep[];
  human_checkpoints: UseCaseHumanCheckpoint[];
  stack_options: {
    lean: StackOption;
    advanced?: StackOption;
  };
  primary_tool_slugs: string[];
  alternative_tool_slugs: string[];
  cost_note: string;
  effort_level: 1 | 2 | 3;
  time_to_value: string;
  privacy_security_considerations: string[];
  builder_query: {
    goal: string;
    buckets: string;
    use_case: string;
  };
  gptify_resource_url?: string;
}

