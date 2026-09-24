import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getAdminCustomRequests } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status') || 'all';

  let requests = getAdminCustomRequests();
  if (statusFilter !== 'all') {
    requests = requests.filter((r) => r.status === statusFilter);
  }

  return NextResponse.json({ requests });
}

export async function PUT(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated || auth.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized: editor or admin role required' }, { status: 403 });
  }

  try {
    const { id, status, internal_note } = await req.json();
    const requests = getAdminCustomRequests();
    const reqItem = requests.find((r) => r.id === id);

    if (!reqItem) {
      return NextResponse.json({ error: 'Custom request not found' }, { status: 404 });
    }

    if (status !== undefined) reqItem.status = status;
    if (internal_note !== undefined) reqItem.internal_note = internal_note;

    return NextResponse.json({ success: true, request: reqItem });
  } catch {
    return NextResponse.json({ error: 'Failed to update custom request' }, { status: 500 });
  }
}
