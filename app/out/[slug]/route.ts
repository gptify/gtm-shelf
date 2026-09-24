import { NextRequest, NextResponse } from 'next/server';
import { getToolBySlug, supabase } from '@/lib/db/data';

interface RouteProps {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Record outbound click event in background if Supabase is connected
  if (supabase) {
    try {
      await supabase.from('tool_events').insert([
        {
          tool_id: tool.id,
          kind: 'visit',
          source: req.nextUrl.searchParams.get('source') || 'direct',
        },
      ]);
    } catch (err) {
      console.error('Failed to log tool visit event:', err);
    }
  }

  const destination = tool.website_url;
  return NextResponse.redirect(destination, 302);
}
