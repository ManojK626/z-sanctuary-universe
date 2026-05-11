import { reflectV2, resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

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
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  try {
    const out = await reflectV2({ ...body, hubRoot });
    return new Response(
      JSON.stringify({
        reflection: out.reflection,
        signals: out.signals,
        suggestion: out.suggestion,
        confidence: out.confidence,
        id: out.id,
        user_id: out.user_id,
        ts: out.ts,
        reflection_id: out.reflection_id,
        prediction_id: out.prediction_id,
        validation_status: out.validation_status,
        remind_in_hours: out.remind_in_hours,
      }),
      { status: 200, headers: HEADERS }
    );
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return new Response(
        JSON.stringify({ error: e.message, code: 'VALIDATION' }),
        { status: 400, headers: HEADERS }
      );
    }
    return new Response(
      JSON.stringify({ error: 'reflect_failed', message: e?.message || String(e) }),
      { status: 500, headers: HEADERS }
    );
  }
}
