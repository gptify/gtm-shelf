import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads';
import { hashIp, checkRateLimit } from '@/lib/security';
import { sendLeadNotificationEmail } from '@/lib/email';
import { sendTelegramLeadNotification } from '@/lib/telegram';

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

    const consentText = 'Email me my curated tool recommendations from the GTM Shelf Finder.';

    const { token } = await createLead({
      email: cleanEmail,
      source,
      finder_answers,
      pick_tool_ids,
      consent_text: consentText,
    });

    // Dispatch instant Telegram alert
    sendTelegramLeadNotification({
      email: cleanEmail,
      source,
      finder_answers,
    }).catch((err) => console.error('Telegram lead alert failed:', err));

    // Dispatch email alert to gptify.co@gmail.com
    await sendLeadNotificationEmail({
      email: cleanEmail,
      source,
      finder_answers,
      pick_tool_ids,
    }).catch((err) => console.error('Lead email notification failed:', err));

    return NextResponse.json({
      success: true,
      confirm_url: `/confirm?token=${token}`,
      message: 'Request received. Recommendations saved.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process lead capture.' },
      { status: 500 }
    );
  }
}
