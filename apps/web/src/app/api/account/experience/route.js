import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE as SESSION_COOKIE, readSessionValue } from '../../../../lib/zs_web_session.js';
import {
  COOKIE,
  LANE_CHOICES,
  MAX_AGE_SEC,
  createExperienceValue,
  readExperienceValue,
} from '../../../../lib/zs_experience.js';

const H = { 'content-type': 'application/json' };
const isProd = process.env.NODE_ENV === 'production';

export async function GET() {
  const c = cookies();
  const s = readSessionValue(c.get(SESSION_COOKIE)?.value);
  if (!s) {
    return NextResponse.json(
      { mode: 'guest', choices: LANE_CHOICES },
      { status: 200, headers: H }
    );
  }
  const ex = readExperienceValue(c.get(COOKIE)?.value);
  return NextResponse.json(
    {
      mode: 'authed',
      user: s.u,
      consented: ex ? ex.c : false,
      primaryLane: ex ? ex.p : 'any',
      choices: LANE_CHOICES,
    },
    { status: 200, headers: H }
  );
}

/**
 * Save preference (HMAC httpOnly cookie). Body: { consented, primaryLane }.
 */
export async function POST(request) {
  const c = cookies();
  const s = readSessionValue(c.get(SESSION_COOKIE)?.value);
  if (!s) {
    return NextResponse.json(
      { error: 'no_session', needAuth: true },
      { status: 401, headers: H }
    );
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: H });
  }
  const consented = Boolean(body?.consented);
  const primaryLane = String(body?.primaryLane || 'any');
  const v = createExperienceValue(consented, primaryLane);
  if (!v) {
    return new Response(
      JSON.stringify({ error: 'server_misconfig' }),
      { status: 500, headers: H }
    );
  }
  const res = NextResponse.json(
    { ok: true, consented, primaryLane, stored: 'cookie' },
    { status: 200, headers: H }
  );
  res.cookies.set(COOKIE, v, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SEC,
    secure: isProd,
  });
  return res;
}
