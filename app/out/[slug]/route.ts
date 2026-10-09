import { NextRequest, NextResponse } from 'next/server';
import { getToolBySlug, supabase } from '@/lib/db/data';
import { getOutboundLinkInfo } from '@/lib/affiliates';

interface RouteProps {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const outbound = getOutboundLinkInfo(tool.slug, tool.website_url);

  // Record outbound click event in background if Supabase is connected
  if (supabase) {
    try {
      await supabase.from('tool_events').insert([
        {
          tool_id: tool.id,
          kind: outbound.isAffiliate ? 'affiliate_click' : 'vendor_click',
          source: req.nextUrl.searchParams.get('source') || 'direct',
        },
      ]);
    } catch (err) {
      console.error('Failed to log tool visit event:', err);
    }
  }

  return NextResponse.redirect(outbound.targetUrl, 302);
}

