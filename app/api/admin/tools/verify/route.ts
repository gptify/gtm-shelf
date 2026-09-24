import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getAdminTools } from '@/lib/admin-store';

export async function POST(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    const tools = getAdminTools();
    const tool = tools.find((t) => t.id === id);

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    tool.verified_at = new Date().toISOString();
    tool.verified_by = auth.role || 'admin';

    return NextResponse.json({ success: true, tool });
  } catch {
    return NextResponse.json({ error: 'Failed to verify tool' }, { status: 500 });
  }
}
