import { getHistoryV2, resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'user_id required', code: 'VALIDATION' }),
      { status: 400, headers: HEADERS }
    );
  }
  const limit = Number(searchParams.get('limit')) || 50;
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const entries = getHistoryV2(String(userId), hubRoot, limit);
  return new Response(
    JSON.stringify({ user_id: userId, entries }),
    { status: 200, headers: HEADERS }
  );
}
