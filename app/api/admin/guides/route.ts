import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getAdminGuides } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const guides = getAdminGuides();
  return NextResponse.json({ guides });
}

export async function PUT(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const { slug, ...updates } = await req.json();
    const guides = getAdminGuides();
    const guide = guides.find((g) => g.slug === slug);

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    Object.assign(guide, updates);
    return NextResponse.json({ success: true, guide });
  } catch {
    return NextResponse.json({ error: 'Failed to update guide' }, { status: 500 });
  }
}
