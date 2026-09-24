import crypto from 'crypto';

// In-memory rate limiting cache for serverless instances
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const SALT = process.env.IP_HASH_SALT || 'gtm-shelf-salt-2026';

export function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(`${SALT}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}

export function checkRateLimit(
  ipHash: string,
  action: string,
  limit = 5,
  windowMs = 3600000 // 1 hour
): { allowed: boolean; remaining: number } {
  const key = `${action}:${ipHash}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
