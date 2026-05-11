import { createSession, resolveHubForChildWorkspace } from 'z-sanctuary-zuno-transformation-slice';

const H = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: H });
  }
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  try {
    const out = createSession(hubRoot, {
      user_id: body.user_id,
      mirrorsoul_note: body.mirrorsoul_note,
    });
    return new Response(JSON.stringify({ ok: true, ...out }), { status: 200, headers: H });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      { status: 500, headers: H }
    );
  }
}
