import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/data';
import { hashIp, checkRateLimit } from '@/lib/security';
import { sendEnquiryEmail } from '@/lib/email';
import { sendTelegramEnquiry } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      what,
      tools_used,
      team_size,
      budget,
      timing,
      language,
      name,
      email,
      hp_field,
      source = 'direct',
      prefill = null,
    } = body;

    // Honeypot check: silently succeed without storing if bot filled the hidden honeypot
    if (hp_field) {
      return NextResponse.json({ success: true });
    }

    // IP rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const ipHash = hashIp(ip);
    const rateCheck = checkRateLimit(ipHash, 'custom_request', 5, 3600000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a bit before submitting another custom build request.' },
        { status: 429 }
      );
    }

    // Validation
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanWhat = (what || '').trim();

    if (!cleanName) {
      return NextResponse.json(
        { error: 'Please provide your name.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid work email address.' },
        { status: 400 }
      );
    }

    if (cleanWhat.length < 15 || cleanWhat.length > 800) {
      return NextResponse.json(
        { error: 'Please describe what you want the system to do (between 15 and 800 characters).' },
        { status: 400 }
      );
    }

    const validLanguages = ['English', 'Uzbek'];
    const chosenLanguage = validLanguages.includes(language) ? language : 'English';

    // Postgres enum request_source: ('finder', 'search', 'guide', 'direct')
    const validSources = ['finder', 'search', 'guide', 'direct'];
    const normalizedSource = validSources.includes(source) ? source : 'direct';

    // If source was a specific page (e.g. roi-calculator, ai-readiness), preserve in prefill metadata
    const detailedPrefill = prefill || (source && !validSources.includes(source) ? { origin: source } : null);

    // Store in Supabase if configured
    if (supabase) {
      try {
        const { error: insertError } = await supabase.from('custom_requests').insert([
          {
            name: cleanName,
            email: cleanEmail,
            what: cleanWhat,
            tools_used: tools_used ? String(tools_used).slice(0, 500) : null,
            team_size: team_size ? String(team_size).slice(0, 50) : null,
            budget: budget ? String(budget).slice(0, 50) : null,
            timing: timing ? String(timing).slice(0, 50) : null,
            language: chosenLanguage,
            source: normalizedSource,
            prefill: detailedPrefill,
            ip_hash: ipHash,
            status: 'new',
          },
        ]);
        if (insertError) {
          console.error('Supabase custom_request insert error:', insertError);
        }
      } catch (err) {
        console.error('Failed to store custom request in database:', err);
      }
    }

    // Dispatch Telegram notification
    sendTelegramEnquiry({
      name: cleanName,
      email: cleanEmail,
      what: cleanWhat,
      source: source || 'direct',
      tools_used,
      team_size,
      budget,
    }).catch((err) => console.error('Enquiry Telegram dispatch failed:', err));

    // Dispatch email notification to team@gptify.co / gptify.co@gmail.com
    sendEnquiryEmail({
      name: cleanName,
      email: cleanEmail,
      what: cleanWhat,
      source: source || 'direct',
      tools_used,
      team_size,
      budget,
    }).catch((err) => console.error('Enquiry email dispatch failed:', err));

    return NextResponse.json({
      success: true,
      message: 'Request received. We will get back to you within 1 business day.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid submission data.' },
      { status: 400 }
    );
  }
}
