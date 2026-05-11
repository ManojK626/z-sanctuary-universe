import { getZesState, resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export async function GET(_req, { params }) {
  const { userId } = params;
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const zes = getZesState(userId, hubRoot);
  return new Response(
    JSON.stringify({ user_id: userId, zes, advisory: true }),
    { status: 200, headers: HEADERS }
  );
}
