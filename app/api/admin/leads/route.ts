import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getLeads } from '@/lib/leads';

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads });
}
