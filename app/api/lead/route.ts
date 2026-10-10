import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads';
import { hashIp, checkRateLimit } from '@/lib/security';
import { sendLeadNotificationEmail, sendPicksEmailToUser } from '@/lib/email';
import { sendTelegramLeadNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = 'finder', finder_answers, pick_tool_ids, picks, hp_field } = body;

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

    // 1. Dispatch automated picks email directly to user's inbox
    if (Array.isArray(picks) && picks.length > 0) {
      sendPicksEmailToUser({
        email: cleanEmail,
        picks,
      }).catch((err) => console.error('Automated user picks email dispatch failed:', err));
    }

    // 2. Dispatch instant Telegram alert with tool names and user email
    sendTelegramLeadNotification({
      email: cleanEmail,
      source,
      finder_answers,
      pick_tool_ids,
      pick_tools: Array.isArray(picks) ? picks : undefined,
    }).catch((err) => console.error('Telegram lead alert failed:', err));

    // 3. Dispatch internal admin alert
    await sendLeadNotificationEmail({
      email: cleanEmail,
      source,
      finder_answers,
      pick_tool_ids,
    }).catch((err) => console.error('Lead email notification failed:', err));

    return NextResponse.json({
      success: true,
      confirm_url: `/confirm?token=${token}`,
      message: 'Picks emailed successfully. Recommendations saved.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process lead capture.' },
      { status: 500 }
    );
  }
}
