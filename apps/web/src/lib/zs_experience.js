/**
 * Optional signed “experience profile” (lane preference + consent) — not OEM telemetry; replace with
 * server persistence + DPA when you have a real product.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { getHmacSecret } from './zs_web_session.js';

const COOKIE = 'zs_experience';
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

/** @type {ReadonlyArray<{ value: string; label: string }>} */
export const LANE_CHOICES = [
  { value: 'any', label: 'No default (show neutral first)' },
  { value: 'ios', label: 'Prefer Apple / iOS style lanes (illustration)' },
  { value: 'android', label: 'Prefer Android / Google-style lanes (illustration)' },
  { value: 'windows', label: 'Prefer Windows / PC-first lanes (illustration)' },
  { value: 'neutral', label: 'Platform-neutral only' },
];

/**
 * @param {boolean} consented
 * @param {string} primaryLane
 * @returns {string | null}
 */
export function createExperienceValue(consented, primaryLane) {
  const s = getSecret();
  if (!s) return null;
  const allowed = new Set(LANE_CHOICES.map((c) => c.value));
  const p = allowed.has(String(primaryLane)) ? String(primaryLane) : 'any';
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = JSON.stringify({ c: Boolean(consented), p, exp });
  const b64 = Buffer.from(payload, 'utf8').toString('base64url');
  const h = createHmac('sha256', s).update(b64, 'utf8').digest();
  const sig = Buffer.from(h).toString('base64url');
  return `${b64}.${sig}`;
}

/**
 * @param {string | undefined} value
 * @returns {{ c: boolean, p: string, exp: number } | null}
 */
export function readExperienceValue(value) {
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const secret = getHmacSecret();
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
  let o;
  try {
    o = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof o.exp !== 'number' || Date.now() > o.exp) return null;
  if (typeof o.c !== 'boolean' || typeof o.p !== 'string') return null;
  return { c: o.c, p: o.p, exp: o.exp };
}

export { COOKIE, MAX_AGE_SEC };
