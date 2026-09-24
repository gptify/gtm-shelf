import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads';
import { hashIp, checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = 'finder', finder_answers, pick_tool_ids, hp_field } = body;

    // Honeypot check
    if (hp_field) {
      return NextResponse.json({ success: true });
    }

    // IP rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const ipHash = hashIp(ip);
    const rateCheck = checkRateLimit(ipHash, 'lead_capture', 5, 3600000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const consentText =
      'Send me weekly updates on new AI tools for sales and marketing. Double opt-in: we will send a confirmation link first.';

    const { token } = await createLead({
      email: cleanEmail,
      source,
      finder_answers,
      pick_tool_ids,
      consent_text: consentText,
    });

    return NextResponse.json({
      success: true,
      confirm_url: `/confirm?token=${token}`,
      message: 'Confirmation email sent. Please check your inbox to confirm your picks.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process lead capture.' },
      { status: 500 }
    );
  }
}
