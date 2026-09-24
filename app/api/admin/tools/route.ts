import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getAdminTools, AdminTool } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status') || 'all';
  const query = (searchParams.get('q') || '').toLowerCase().trim();

  let tools = getAdminTools();

  if (statusFilter !== 'all') {
    tools = tools.filter((t) => t.status === statusFilter);
  }

  if (query) {
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.domain.toLowerCase().includes(query) ||
        t.tagline.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ tools });
}

export async function PUT(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    const tools = getAdminTools();
    const index = tools.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const currentTool = tools[index];
    const newStatus = updates.status !== undefined ? updates.status : currentTool.status;
    const newVerifiedAt = updates.verified_at !== undefined ? updates.verified_at : currentTool.verified_at;
    const newSources = updates.sources !== undefined ? updates.sources : currentTool.sources;

    // Strict Enforcement of Acceptance Criterion 10 & DB constraint:
    // "Cannot publish without verified_at and at least one source URL"
    if (newStatus === 'published') {
      if (!newVerifiedAt) {
        return NextResponse.json(
          {
            error:
              'Cannot publish tool: A tool requires verified_at and at least one source URL before it can be published.',
          },
          { status: 400 }
        );
      }
      if (!newSources || newSources.length === 0 || !newSources.some((s: { url?: string }) => s.url?.trim())) {
        return NextResponse.json(
          {
            error:
              'Cannot publish tool: A tool requires verified_at and at least one source URL before it can be published.',
          },
          { status: 400 }
        );
      }
    }

    // Apply updates
    const updatedTool: AdminTool = {
      ...currentTool,
      ...updates,
      id: currentTool.id,
      status: newStatus,
      verified_at: newVerifiedAt,
      sources: newSources,
    };

    tools[index] = updatedTool;

    return NextResponse.json({ success: true, tool: updatedTool });
  } catch {
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const tools = getAdminTools();

    // Check duplicate
    if (tools.some((t) => t.name.toLowerCase() === body.name.toLowerCase() || t.slug === body.slug)) {
      return NextResponse.json({ error: 'Tool with this name or slug already exists' }, { status: 409 });
    }

    const newTool: AdminTool = {
      id: body.id || body.slug || `tool-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      domain: body.domain || new URL(body.website_url).hostname.replace(/^www\./, ''),
      website_url: body.website_url,
      tagline: body.tagline || '',
      description: body.description || '',
      best_for: body.best_for || null,
      stage_id: Number(body.stage_id) || 1,
      stage_name: body.stage_name || 'Attract',
      category_id: Number(body.category_id) || 1,
      category_name: body.category_name || 'Content writing',
      category_slug: body.category_slug || 'content-writing',
      pricing_model: body.pricing_model || 'free_plan',
      price_note: body.price_note || null,
      setup_effort: (body.setup_effort || 1) as 1 | 2 | 3,
      featured: Boolean(body.featured),
      sponsored: Boolean(body.sponsored),
      logo_path: null,
      verified_at: null,
      verified_by: null,
      status: 'draft', // Always draft initially per brief
      integrations: body.integrations || [],
      sources: body.sources || [],
    };

    tools.unshift(newTool);
    return NextResponse.json({ success: true, tool: newTool });
  } catch {
    return NextResponse.json({ error: 'Invalid tool data' }, { status: 400 });
  }
}
