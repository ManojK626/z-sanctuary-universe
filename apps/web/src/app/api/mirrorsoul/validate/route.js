import {
  resolveValidationV2,
  validateFromUser,
  resolveHubForChildWorkspace,
} from 'z-sanctuary-mirrorsoul-slice';

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
    if (body?.user_feedback != null && String(body.user_feedback).trim() !== '') {
      const out = validateFromUser(hubRoot, {
        prediction_id: body?.prediction_id,
        user_feedback: body?.user_feedback,
        notes: body?.notes,
      });
      return new Response(JSON.stringify(out), { status: 200, headers: HEADERS });
    }
    const row = resolveValidationV2(hubRoot, {
      prediction_id: body?.prediction_id,
      outcome: body?.outcome,
      notes: body?.notes,
      actor: body?.actor,
    });
    return new Response(JSON.stringify({ ok: true, resolution: row }), { status: 200, headers: HEADERS });
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return new Response(
        JSON.stringify({ error: e.message, code: 'VALIDATION' }),
        { status: 400, headers: HEADERS }
      );
    }
    return new Response(
      JSON.stringify({ error: 'validate_failed', message: e?.message || String(e) }),
      { status: 500, headers: HEADERS }
    );
  }
}
