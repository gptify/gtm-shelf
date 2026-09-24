import { createClient } from '@supabase/supabase-js';
import { Stage, Category, Integration, ToolPublic, PricingModel } from '@/lib/types';
import taxonomy from '@/starter/content/taxonomy.json';
import sampleTools from '@/starter/finder/fixtures/tools.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const STAGES: Stage[] = taxonomy.stages.map((s, i) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  hint: s.hint,
  sort: i + 1,
}));

export const CATEGORIES: Category[] = taxonomy.categories.map((c, i) => ({
  id: i + 1,
  stage_id: c.stage_id,
  slug: c.slug,
  name: c.name,
  phrase: c.phrase,
  sort: c.sort || i + 1,
}));

export const INTEGRATIONS: Integration[] = [
  { id: 1, slug: 'hubspot', name: 'HubSpot' },
  { id: 2, slug: 'salesforce', name: 'Salesforce' },
  { id: 3, slug: 'slack', name: 'Slack' },
  { id: 4, slug: 'zapier', name: 'Zapier' },
  { id: 5, slug: 'google-workspace', name: 'Google Workspace' },
];

function mapPricing(price: string): PricingModel {
  if (price === 'Free plan') return 'free_plan';
  if (price === 'Paid') return 'paid';
  return 'custom_quote';
}

function mapSampleTools(): ToolPublic[] {
  return sampleTools.map((t) => {
    const stage = STAGES.find((s) => s.id === t.stage) || STAGES[0];
    const category = CATEGORIES.find((c) => c.name === t.cat) || CATEGORIES[0];
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
      category_id: category.id,
      category_name: category.name,
      category_slug: category.slug,
      pricing_model: mapPricing(t.price),
      price_note: t.price,
      setup_effort: (t.setup || 1) as 1 | 2 | 3,
      featured: Boolean(t.feat),
      sponsored: false,
      logo_path: null,
      verified_at: null,
      integrations: t.ints,
    };
  });
}

export async function getTools(): Promise<ToolPublic[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tools_public')
        .select('*')
        .order('featured', { ascending: false })
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as ToolPublic[];
      }
    } catch {
      // fallback to sample tools
    }
  }

  // Staging / local fallback (using the 42 sample draft tools)
  return mapSampleTools();
}

export function getStageBySlug(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
