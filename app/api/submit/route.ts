import { NextRequest, NextResponse } from 'next/server';
import { supabase, getTools, CATEGORIES } from '@/lib/db/data';
import { hashIp, checkRateLimit } from '@/lib/security';

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

    // Honeypot check: if filled, quietly return 200 without saving (QA item 11)
    if (hp_field) {
      return NextResponse.json({ success: true, message: 'Tool submitted successfully.' });
    }

    // IP rate limiting (5 per hour per IP hash)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const ipHash = hashIp(ip);
    const rateCheck = checkRateLimit(ipHash, 'submit_tool', 5, 3600000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before submitting another tool.' },
        { status: 429 }
      );
    }

    const cleanName = (name || '').trim();
    const cleanUrl = (website_url || '').trim();
    const cleanTagline = (tagline || '').trim();
    const cleanEmail = (contact_email || '').trim().toLowerCase();

    if (!cleanName || !cleanUrl || !cleanTagline || !cleanEmail) {
      return NextResponse.json(
        { error: 'Missing required fields (Name, Website URL, Summary, and Contact Email).' },
        { status: 400 }
      );
    }

    if (cleanTagline.length > 90) {
      return NextResponse.json(
        { error: 'One-line summary must be 90 characters or fewer.' },
        { status: 400 }
      );
    }

    // URL validation
    let hostname = '';
    try {
      const parsedUrl = new URL(cleanUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json(
          { error: 'Website URL must begin with http:// or https://' },
          { status: 400 }
        );
      }
      hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL format.' },
        { status: 400 }
      );
    }

    // Duplicate check on name and domain
    const existingTools = await getTools();
    const isDuplicate = existingTools.some(
      (t) =>
        t.name.toLowerCase() === cleanName.toLowerCase() ||
        t.domain.toLowerCase() === hostname
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: `"${cleanName}" or the domain "${hostname}" is already listed on GTM Shelf.` },
        { status: 409 }
      );
    }

    // Map category
    const cat = CATEGORIES.find((c) => c.name.toLowerCase() === (category_name || '').toLowerCase());
    const categoryId = cat ? cat.id : null;

    // Map pricing model
    let normalizedPricing = 'free_plan';
    if (pricing_model === 'Paid' || pricing_model === 'paid') normalizedPricing = 'paid';
    if (pricing_model === 'Custom quote' || pricing_model === 'custom_quote') normalizedPricing = 'custom_quote';

    // Store in Supabase if available
    if (supabase) {
      try {
        await supabase.from('submissions').insert([
          {
            name: cleanName,
            website_url: cleanUrl,
            stage_id: stage_id ? Number(stage_id) : null,
            category_id: categoryId,
            pricing_model: normalizedPricing,
            tagline: cleanTagline,
            description: description ? String(description).slice(0, 1000) : null,
            contact_email: cleanEmail,
            is_vendor: Boolean(is_vendor),
            status: 'new',
            ip_hash: ipHash,
          },
        ]);
      } catch (err) {
        console.error('Supabase submission insert error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tool submitted successfully. Our team will review your submission before publishing.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid submission data.' },
      { status: 500 }
    );
  }
}
