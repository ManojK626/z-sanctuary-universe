import { postAnxiety, resolveHubForChildWorkspace } from 'z-sanctuary-zuno-transformation-slice';

const H = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

export async function POST(request, context) {
  const sessionId = context?.params?.sessionId;
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'missing_session' }), { status: 400, headers: H });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: H });
  }
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  try {
    const out = postAnxiety(hubRoot, sessionId, body);
    return new Response(JSON.stringify({ ok: true, ...out }), { status: 200, headers: H });
  } catch (e) {
    if (e?.code === 'NOT_FOUND') {
      return new Response(JSON.stringify({ error: e.message }), { status: 404, headers: H });
    }
    if (e?.code === 'VALIDATION') {
      return new Response(
        JSON.stringify({ error: e.message, code: 'VALIDATION' }),
        { status: 400, headers: H }
      );
    }
    return new Response(
      JSON.stringify({ error: e?.message || String(e) }),
      { status: 500, headers: H }
    );
  }
}
