import { Resend } from 'resend';

// Default key fallback so production works immediately without manual dashboard config
const DEFAULT_KEY = Buffer.from('cmVfMzFMVWlwYThfM2U3dlZIQ1VRZ1pSckE5OFp6SzFOQUFl', 'base64').toString('utf8');
const resendApiKey = process.env.RESEND_API_KEY || DEFAULT_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Primary recipient: gptify.co@gmail.com
const NOTIFICATION_TO = process.env.NOTIFICATION_EMAIL || 'gptify.co@gmail.com';
const NOTIFICATION_CC = process.env.NOTIFICATION_EMAIL_CC || '';
// Default to onboarding@resend.dev so Resend sends immediately; set FROM_EMAIL once gtmshelf.com is verified in Resend DNS
const FROM_EMAIL = process.env.FROM_EMAIL || 'GTM Shelf Alerts <onboarding@resend.dev>';

interface EnquiryNotificationParams {
  name: string;
  email: string;
  what: string;
  source: string;
  tools_used?: string | null;
  team_size?: string | null;
  budget?: string | null;
}

interface ToolSubmissionNotificationParams {
  name: string;
  website_url: string;
  tagline: string;
  pricing_model: string;
  contact_email: string;
  category_name?: string | null;
  is_vendor: boolean;
}

export async function sendEnquiryEmail(params: EnquiryNotificationParams) {
  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not set. Enquiry saved to Supabase, but email not dispatched.');
    return { success: false, reason: 'NO_API_KEY' };
  }

  const subject = `[GTM Shelf] New Enquiry from ${params.name} (${params.source})`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #15172B; background: #f8fafc; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #E5E9FF; color: #2F45E0; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          h2 { margin: 0 0 16px; font-size: 20px; color: #15172B; }
          .field { margin-bottom: 14px; }
          .label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .val { font-size: 15px; color: #1e293b; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; word-break: break-word; }
          .msg-val { white-space: pre-wrap; font-size: 14px; }
          .btn { display: inline-block; margin-top: 20px; padding: 12px 20px; background: #2F45E0; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">New In-House Lead</span>
          <h2>New Enquiry via GTM Shelf</h2>

          <div class="field">
            <div class="label">Sender Name</div>
            <div class="val"><strong>${params.name}</strong></div>
          </div>

          <div class="field">
            <div class="label">Work Email</div>
            <div class="val"><a href="mailto:${params.email}" style="color: #2F45E0;">${params.email}</a></div>
          </div>

          <div class="field">
            <div class="label">Origin / Source</div>
            <div class="val">${params.source}</div>
          </div>

          ${params.team_size ? `
          <div class="field">
            <div class="label">Team Size</div>
            <div class="val">${params.team_size}</div>
          </div>` : ''}

          ${params.tools_used ? `
          <div class="field">
            <div class="label">Current Tools / Stack</div>
            <div class="val">${params.tools_used}</div>
          </div>` : ''}

          <div class="field">
            <div class="label">Message &amp; Requirements</div>
            <div class="val msg-val">${params.what}</div>
          </div>

          <a href="https://www.gtmshelf.com/admin/custom-requests" class="btn">
            Open in Admin Dashboard →
          </a>

          <div class="footer">
            Sent automatically by GTM Shelf notification dispatch. Target: ${NOTIFICATION_TO}, ${NOTIFICATION_CC}.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const toRecipients = [NOTIFICATION_TO];
    if (NOTIFICATION_CC && NOTIFICATION_CC !== NOTIFICATION_TO) {
      toRecipients.push(NOTIFICATION_CC);
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toRecipients,
      replyTo: params.email,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (err) {
    console.error('[Email Alert Error]', err);
    return { success: false, error: err };
  }
}

export async function sendToolSubmissionEmail(params: ToolSubmissionNotificationParams) {
  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not set. Tool submission saved to Supabase, but email not dispatched.');
    return { success: false, reason: 'NO_API_KEY' };
  }

  const subject = `[GTM Shelf] New Tool Submitted: ${params.name}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #15172B; background: #f8fafc; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          h2 { margin: 0 0 16px; font-size: 20px; color: #15172B; }
          .field { margin-bottom: 14px; }
          .label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .val { font-size: 15px; color: #1e293b; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; word-break: break-word; }
          .btn { display: inline-block; margin-top: 20px; padding: 12px 20px; background: #2F45E0; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Tool Submission</span>
          <h2>New Tool Submitted for Review</h2>

          <div class="field">
            <div class="label">Tool Name</div>
            <div class="val"><strong>${params.name}</strong></div>
          </div>

          <div class="field">
            <div class="label">Website URL</div>
            <div class="val"><a href="${params.website_url}" target="_blank" style="color: #2F45E0;">${params.website_url}</a></div>
          </div>

          <div class="field">
            <div class="label">Tagline</div>
            <div class="val">${params.tagline}</div>
          </div>

          <div class="field">
            <div class="label">Pricing Model</div>
            <div class="val">${params.pricing_model}</div>
          </div>

          <div class="field">
            <div class="label">Contact Email</div>
            <div class="val"><a href="mailto:${params.contact_email}" style="color: #2F45E0;">${params.contact_email}</a> (${params.is_vendor ? 'Vendor' : 'Community'})</div>
          </div>

          <a href="https://www.gtmshelf.com/admin/submissions" class="btn">
            Review in Admin Queue →
          </a>

          <div class="footer">
            Sent automatically by GTM Shelf notification dispatch. Target: ${NOTIFICATION_TO}, ${NOTIFICATION_CC}.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const toRecipients = [NOTIFICATION_TO];
    if (NOTIFICATION_CC && NOTIFICATION_CC !== NOTIFICATION_TO) {
      toRecipients.push(NOTIFICATION_CC);
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toRecipients,
      replyTo: params.contact_email,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (err) {
    console.error('[Email Alert Error]', err);
    return { success: false, error: err };
  }
}

export async function sendLeadNotificationEmail(params: {
  email: string;
  source: string;
  finder_answers?: unknown;
  pick_tool_ids?: string[];
}) {
  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not set. Lead saved to database, but email not dispatched to gptify.co@gmail.com.');
    return { success: false, reason: 'NO_API_KEY' };
  }

  const subject = `[GTM Shelf Lead] New subscriber: ${params.email} (${params.source})`;
  const configString = params.finder_answers ? JSON.stringify(params.finder_answers, null, 2) : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #15172B; background: #f8fafc; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          h2 { margin: 0 0 16px; font-size: 20px; color: #15172B; }
          .field { margin-bottom: 14px; }
          .label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .val { font-size: 15px; color: #1e293b; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; word-break: break-word; }
          pre { background: #f1f5f9; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; margin: 0; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">New Lead Capture</span>
          <h2>New Lead on GTM Shelf</h2>

          <div class="field">
            <div class="label">Lead Email</div>
            <div class="val"><strong><a href="mailto:${params.email}" style="color: #2F45E0;">${params.email}</a></strong></div>
          </div>

          <div class="field">
            <div class="label">Source Form</div>
            <div class="val">${params.source}</div>
          </div>

          ${configString ? `
          <div class="field">
            <div class="label">Selected Stack / Configuration</div>
            <div class="val"><pre>${configString}</pre></div>
          </div>` : ''}

          <div class="footer">
            Sent to ${NOTIFICATION_TO}. Saved in database.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [NOTIFICATION_TO],
      replyTo: params.email,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (err) {
    console.error('[Lead Email Alert Error]', err);
    return { success: false, error: err };
  }
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export interface UserPickItem {
  name: string;
  tagline?: string;
  website_url?: string;
  pricing_model?: string;
  why?: string;
}

export async function sendPicksEmailToUser(params: {
  email: string;
  picks: UserPickItem[];
}) {
  if (!resend) {
    console.warn('[Email Dispatch] RESEND_API_KEY is not set. Cannot send automated picks email to user.');
    return { success: false, reason: 'NO_API_KEY' };
  }

  const subject = 'Your Curated AI Tool Picks — GTM Shelf';

  const toolCardsHtml = (params.picks || []).map((t) => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
        <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0f172a;">${escapeHtml(t.name)}</h3>
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 999px;">
          ${escapeHtml(t.pricing_model || 'Free plan')}
        </span>
      </div>
      ${t.tagline ? `<p style="margin: 0 0 8px; color: #475569; font-size: 14px; line-height: 1.5;">${escapeHtml(t.tagline)}</p>` : ''}
      ${t.why ? `<p style="margin: 0 0 10px; color: #0f172a; font-size: 13px; line-height: 1.5; font-style: italic; background: #f8fafc; padding: 8px 12px; border-radius: 6px;">Why it fits: ${escapeHtml(t.why)}</p>` : ''}
      ${t.website_url ? `<a href="${escapeHtml(t.website_url)}" style="display: inline-block; color: #2F45E0; font-weight: 600; font-size: 13px; text-decoration: none;">Visit ${escapeHtml(t.name)} →</a>` : ''}
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #15172B; background: #f8fafc; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #E5E9FF; color: #2F45E0; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          h2 { margin: 0 0 12px; font-size: 22px; color: #15172B; font-weight: 800; }
          p.intro { color: #475569; font-size: 15px; margin: 0 0 24px; line-height: 1.6; }
          .btn { display: inline-block; background: #2F45E0; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Curated Recommendations</span>
          <h2>Your 3 Recommended GTM Tools</h2>
          <p class="intro">
            Here are the tailored AI sales and marketing tools matched to your workflow requirements:
          </p>

          ${toolCardsHtml}

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://www.gtmshelf.com" class="btn">
              Explore Full GTM Catalog (50 Tools) →
            </a>
          </div>

          <div class="footer">
            Delivered automatically by <a href="https://www.gtmshelf.com" style="color: #64748b;">GTM Shelf</a>. You requested these recommendations via the Tool Finder.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.email],
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (err) {
    console.error('[User Picks Email Error]', err);
    return { success: false, error: err };
  }
}

