import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'gtm_admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'gtm-shelf-admin-secret-key-2026';
export const DEFAULT_ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'gtmshelf-admin';

export function createAdminToken(role = 'admin'): string {
  const payload = JSON.stringify({ role, exp: Date.now() + 86400000 * 7 }); // 7 days
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}.${hmac}`).toString('base64url');
}

export function verifyAdminToken(token: string): { valid: boolean; role: string | null } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [payloadStr, hmac] = decoded.split('.');
    if (!payloadStr || !hmac) return { valid: false, role: null };

    const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('hex');
    if (hmac !== expectedHmac) return { valid: false, role: null };

    const payload = JSON.parse(payloadStr);
    if (payload.exp && payload.exp < Date.now()) {
      return { valid: false, role: null };
    }

    return { valid: true, role: payload.role || 'admin' };
  } catch {
    return { valid: false, role: null };
  }
}

export function checkAdminAuth(req: NextRequest): { authenticated: boolean; role: string | null } {
  // Check cookie
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie) {
    const verified = verifyAdminToken(cookie);
    if (verified.valid) return { authenticated: true, role: verified.role };
  }

  // Check authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const verified = verifyAdminToken(token);
    if (verified.valid) return { authenticated: true, role: verified.role };
  }

  return { authenticated: false, role: null };
}
