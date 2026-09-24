import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      website_url,
      stage_id,
      category_name,
      pricing_model,
      tagline,
      description,
      contact_email,
      is_vendor,
      hp_field,
    } = body;

    // Honeypot check: if filled, quietly return 200 without saving
    if (hp_field) {
      return NextResponse.json({ success: true });
    }

    if (!name || !website_url || !tagline || !contact_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If connected to Supabase, save to submissions table
    if (supabase) {
      try {
        await supabase.from('submissions').insert([
          {
            name,
            website_url,
            stage_id,
            pricing_model,
            tagline,
            description,
            contact_email,
            is_vendor: Boolean(is_vendor),
            status: 'new',
          },
        ]);
      } catch (err) {
        console.error('Supabase submission insert error:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid submission data' },
      { status: 500 }
    );
  }
}
