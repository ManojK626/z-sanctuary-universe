import { NextResponse } from 'next/server';
import { COOKIE } from '../../../../lib/zs_web_session.js';
import { COOKIE as EXP_COOKIE } from '../../../../lib/zs_experience.js';

const H = { 'content-type': 'application/json' };

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200, headers: H });
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  res.cookies.set(EXP_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
