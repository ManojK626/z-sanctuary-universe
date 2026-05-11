/**
 * Signed session cookie (HMAC) for web-first /account shell — not OAuth; replace with IdP when product-ready.
 * Gate only active when ZS_WEB_AUTH=1 and ZS_SESSION_SECRET is set.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'zs_session';
const MAX_AGE_SEC = 7 * 24 * 60 * 60; // 7d

function getSecret() {
  const s = process.env.ZS_SESSION_SECRET;
  if (!s || s.length < 32) {
    return null;
  }
  return s;
}

/** @returns {string | null} shared with zs_experience (same HMAC key). */
export function getHmacSecret() {
  return getSecret();
}

/**
 * @param {string} userLabel
 * @returns {string | null} cookie value
 */
export function createSessionValue(userLabel) {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = JSON.stringify({ u: String(userLabel).slice(0, 200), exp });
  const b64 = Buffer.from(payload, 'utf8').toString('base64url');
  const h = createHmac('sha256', secret).update(b64, 'utf8').digest();
  const sig = Buffer.from(h).toString('base64url');
  return `${b64}.${sig}`;
}

/**
 * @param {string | undefined} value
 * @returns {{ u: string, exp: number } | null}
 */
export function readSessionValue(value) {
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const secret = getSecret();
  if (!secret) return null;
  const expected = createHmac('sha256', secret).update(b64, 'utf8').digest();
  let got;
  try {
    got = Buffer.from(sig, 'base64url');
  } catch {
    return null;
  }
  if (got.length !== expected.length) return null;
  if (!timingSafeEqual(got, expected)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
  if (typeof payload.u !== 'string') return null;
  return { u: payload.u, exp: payload.exp };
}

export { COOKIE, MAX_AGE_SEC };

/** Nonsecret marker that login token was checked (avoids re-reading env in every layout). */
export function authGateConfigured() {
  return process.env.ZS_WEB_AUTH === '1' || process.env.ZS_WEB_AUTH === 'on';
}

export function isSecretReady() {
  return !!getSecret() && String(process.env.ZS_WEB_LOGIN_TOKEN || '').length >= 16;
}
