/**
 * MirrorSoul Slice 1 — same handler as apps/api; embeds in Next (no second server required).
 * Boundaries: reflection + advisory context only; entries stored under hub data/mirrorsoul.
 */
import { processMirrorSoulEntry, resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'invalid_json', code: 'VALIDATION' }),
      { status: 400, headers: HEADERS }
    );
  }
  const { text, user_id } = body || {};
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  try {
    const out = await processMirrorSoulEntry({
      text,
      user_id: user_id || 'anonymous',
      hubRoot,
    });
    return new Response(JSON.stringify(out), { status: 200, headers: HEADERS });
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return new Response(
        JSON.stringify({ error: e.message, code: 'VALIDATION' }),
        { status: 400, headers: HEADERS }
      );
    }
    return new Response(
      JSON.stringify({ error: 'process_failed', message: e?.message || String(e) }),
      { status: 500, headers: HEADERS }
    );
  }
}
