import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getAdminSubmissions, getAdminTools, AdminTool } from '@/lib/admin-store';
import taxonomy from '@/starter/content/taxonomy.json';
import { PricingModel } from '@/lib/types';

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status') || 'all';

  let submissions = getAdminSubmissions();
  if (statusFilter !== 'all') {
    submissions = submissions.filter((s) => s.status === statusFilter);
  }

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const { id, action } = await req.json();
    const submissions = getAdminSubmissions();
    const sub = submissions.find((s) => s.id === id);

    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'reject') {
      sub.status = 'rejected';
      return NextResponse.json({ success: true, submission: sub });
    }

    if (action === 'spam') {
      sub.status = 'spam';
      return NextResponse.json({ success: true, submission: sub });
    }

    if (action === 'accept') {
      // Create draft tool from submission
      const tools = getAdminTools();
      const slug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const domain = new URL(sub.website_url).hostname.replace(/^www\./, '');

      const stage = taxonomy.stages.find((s) => s.id === (sub.stage_id || 1)) || taxonomy.stages[0];
      const category = taxonomy.categories.find(
        (c) => c.name.toLowerCase() === (sub.category_name || '').toLowerCase()
      ) || taxonomy.categories[0];

      let pricing: PricingModel = 'free_plan';
      if (sub.pricing_model === 'Paid' || sub.pricing_model === 'paid') pricing = 'paid';
      if (sub.pricing_model === 'Custom quote' || sub.pricing_model === 'custom_quote') pricing = 'custom_quote';

      const newTool: AdminTool = {
        id: `tool-${Date.now()}`,
        slug,
        name: sub.name,
        domain,
        website_url: sub.website_url,
        tagline: sub.tagline,
        description: sub.description || sub.tagline,
        best_for: null,
        stage_id: stage.id,
        stage_name: stage.name,
        category_id: category.stage_id,
        category_name: category.name,
        category_slug: category.slug,
        pricing_model: pricing,
        price_note: sub.pricing_model,
        setup_effort: 2,
        featured: false,
        sponsored: false,
        logo_path: null,
        verified_at: null, // Draft and unverified initially
        verified_by: null,
        status: 'draft',
        integrations: [],
        sources: [
          {
            url: sub.website_url,
            label: 'Vendor submission website',
          },
        ],
      };

      tools.unshift(newTool);
      sub.status = 'accepted';
      sub.tool_id = newTool.id;

      return NextResponse.json({ success: true, submission: sub, tool: newTool });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
