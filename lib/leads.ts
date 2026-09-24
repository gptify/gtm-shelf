import crypto from 'crypto';
import { supabase } from '@/lib/db/data';

export interface LeadRecord {
  id: string;
  email: string;
  source: string;
  finder_answers?: Record<string, unknown> | null;
  pick_tool_ids?: string[];
  consent_text: string;
  consent_at: string;
  confirm_token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

// In-memory token store for local dev / staging fallback
const localLeadStore = new Map<string, LeadRecord>();

export function generateToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function createLead(params: {
  email: string;
  source?: string;
  finder_answers?: Record<string, unknown> | null;
  pick_tool_ids?: string[];
  consent_text: string;
}): Promise<{ token: string; id: string }> {
  const token = generateToken();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record: LeadRecord = {
    id,
    email: params.email.trim().toLowerCase(),
    source: params.source || 'finder',
    finder_answers: params.finder_answers || null,
    pick_tool_ids: params.pick_tool_ids || [],
    consent_text: params.consent_text,
    consent_at: now,
    confirm_token: token,
    confirmed_at: null,
    unsubscribed_at: null,
    created_at: now,
  };

  // Always keep in local store for rapid validation / testing
  localLeadStore.set(token, record);

  // If Supabase is available, insert or update
  if (supabase) {
    try {
      await supabase.from('leads').upsert(
        {
          email: record.email,
          source: record.source,
          finder_answers: record.finder_answers,
          pick_tool_ids: record.pick_tool_ids,
          consent_text: record.consent_text,
          consent_at: record.consent_at,
          confirm_token: record.confirm_token,
          confirmed_at: null,
        },
        { onConflict: 'email,source' }
      );
    } catch (err) {
      console.error('Supabase lead create error:', err);
    }
  }

  return { token, id };
}

export async function confirmLead(token: string): Promise<boolean> {
  const now = new Date().toISOString();
  let found = false;

  const localRecord = localLeadStore.get(token);
  if (localRecord) {
    localRecord.confirmed_at = now;
    found = true;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ confirmed_at: now })
        .eq('confirm_token', token)
        .select();

      if (!error && data && data.length > 0) {
        found = true;
      }
    } catch (err) {
      console.error('Supabase lead confirm error:', err);
    }
  }

  return found;
}

export async function unsubscribeLead(tokenOrEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  let found = false;

  for (const record of localLeadStore.values()) {
    if (record.confirm_token === tokenOrEmail || record.email === tokenOrEmail) {
      record.unsubscribed_at = now;
      found = true;
    }
  }

  if (supabase) {
    try {
      const isEmail = tokenOrEmail.includes('@');
      const query = supabase.from('leads').update({ unsubscribed_at: now });
      if (isEmail) {
        await query.eq('email', tokenOrEmail);
      } else {
        await query.eq('confirm_token', tokenOrEmail);
      }
      found = true;
    } catch (err) {
      console.error('Supabase lead unsubscribe error:', err);
    }
  }

  return found;
}

export async function getLeads(): Promise<LeadRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as LeadRecord[];
      }
    } catch (err) {
      console.error('Supabase getLeads error:', err);
    }
  }

  return Array.from(localLeadStore.values());
}
