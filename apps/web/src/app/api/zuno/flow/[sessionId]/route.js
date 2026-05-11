import { getSessionView, resolveHubForChildWorkspace } from 'z-sanctuary-zuno-transformation-slice';

const H = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

export async function GET(_request, context) {
  const sessionId = context?.params?.sessionId;
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'missing_session' }), { status: 400, headers: H });
  }
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const v = getSessionView(hubRoot, sessionId);
  if (!v) {
    return new Response(JSON.stringify({ error: 'session_not_found' }), { status: 404, headers: H });
  }
  return new Response(JSON.stringify({ ok: true, ...v }), { status: 200, headers: H });
}
