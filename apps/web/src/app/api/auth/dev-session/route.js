import { NextResponse } from 'next/server';
import { createSessionValue, MAX_AGE_SEC, COOKIE } from '../../../../lib/zs_web_session.js';

const H = { 'content-type': 'application/json' };

/**
 * POST: dev-only shared-token login. Body: { "token": "<ZS_WEB_LOGIN_TOKEN>", "userLabel"?: "display name" }
 * Replaces with OAuth/OIDC before production.
 */
export async function POST(request) {
  if (process.env.ZS_WEB_AUTH !== '1' && process.env.ZS_WEB_AUTH !== 'on') {
    return new Response(
      JSON.stringify({ error: 'auth_gate_disabled', hint: 'set ZS_WEB_AUTH=1' }),
      { status: 400, headers: H }
    );
  }
  const expect = String(process.env.ZS_WEB_LOGIN_TOKEN || '');
  if (expect.length < 16) {
    return new Response(
      JSON.stringify({ error: 'server_misconfig', hint: 'ZS_WEB_LOGIN_TOKEN (min 16 chars)' }),
      { status: 500, headers: H }
    );
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: H });
  }
  const token = String(body?.token || '').trim();
  if (token !== expect) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: H });
  }
  const userLabel = String(body?.userLabel || 'user').trim().slice(0, 200) || 'user';
  const v = createSessionValue(userLabel);
  if (!v) {
    return new Response(
      JSON.stringify({ error: 'server_misconfig', hint: 'ZS_SESSION_SECRET (min 32 chars)' }),
      { status: 500, headers: H }
    );
  }
  const res = NextResponse.json(
    { ok: true, user: userLabel, cookie: COOKIE },
    { status: 200, headers: H }
  );
  res.cookies.set(COOKIE, v, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SEC,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
