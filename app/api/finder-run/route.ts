import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, question_count, top_tool_ids, clicked_custom } = body;

    if (supabase) {
      try {
        await supabase.from('finder_runs').insert([
          {
            answers: answers || {},
            question_count: question_count || 0,
            top_tool_ids: top_tool_ids || [],
            clicked_custom: Boolean(clicked_custom),
          },
        ]);
      } catch (err) {
        console.error('Failed to log finder run:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
