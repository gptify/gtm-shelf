interface TelegramEnquiryParams {
  name: string;
  email: string;
  what: string;
  source: string;
  tools_used?: string | null;
  team_size?: string | null;
  budget?: string | null;
}

interface TelegramToolSubmissionParams {
  name: string;
  website_url: string;
  tagline: string;
  pricing_model: string;
  contact_email: string;
  category_name?: string | null;
  is_vendor: boolean;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8963343666:AAGjYSSdEv65OQcc6mPoJI3p6LUJgUtX07w';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '327216340';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[Telegram Alert] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('[Telegram Alert Error]', data);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Telegram Alert Request Failed]', err);
    return false;
  }
}

export async function sendTelegramEnquiry(params: TelegramEnquiryParams): Promise<boolean> {
  const lines: string[] = [
    '🔔 <b>Yangi So\'rov / Lead (GTM Shelf)</b>\n',
    `👤 <b>Ism:</b> ${escapeHtml(params.name)}`,
    `✉️ <b>Email:</b> <a href="mailto:${escapeHtml(params.email)}">${escapeHtml(params.email)}</a>`,
    `📍 <b>Manba:</b> <code>${escapeHtml(params.source)}</code>`,
  ];

  if (params.team_size) {
    lines.push(`👥 <b>Jamoa:</b> ${escapeHtml(params.team_size)}`);
  }
  if (params.tools_used) {
    lines.push(`🛠 <b>Stack:</b> ${escapeHtml(params.tools_used)}`);
  }
  if (params.budget) {
    lines.push(`💰 <b>Byudjet:</b> ${escapeHtml(params.budget)}`);
  }

  lines.push('\n💬 <b>Xabar:</b>');
  lines.push(`<i>${escapeHtml(params.what)}</i>`);
  lines.push('\n👉 <a href="https://www.gtmshelf.com/admin/custom-requests">Admin Panelda Ko\'rish</a>');

  return sendTelegramMessage(lines.join('\n'));
}

export async function sendTelegramToolSubmission(params: TelegramToolSubmissionParams): Promise<boolean> {
  const lines: string[] = [
    '🚀 <b>Yangi Tool Taqdimoti (GTM Shelf)</b>\n',
    `🛠 <b>Dastur:</b> <b>${escapeHtml(params.name)}</b>`,
    `🌐 <b>Sayt:</b> <a href="${escapeHtml(params.website_url)}">${escapeHtml(params.website_url)}</a>`,
    `🏷 <b>Tagline:</b> ${escapeHtml(params.tagline)}`,
    `💰 <b>Narx:</b> <code>${escapeHtml(params.pricing_model)}</code>`,
    `✉️ <b>Aloqa:</b> <a href="mailto:${escapeHtml(params.contact_email)}">${escapeHtml(params.contact_email)}</a> (${params.is_vendor ? 'Vendor' : 'Community'})`,
  ];

  if (params.category_name) {
    lines.push(`📂 <b>Kategoriya:</b> ${escapeHtml(params.category_name)}`);
  }

  lines.push('\n👉 <a href="https://www.gtmshelf.com/admin/submissions">Navbatda Ko\'rish</a>');

  return sendTelegramMessage(lines.join('\n'));
}
