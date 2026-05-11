import fs from 'node:fs';
import path from 'node:path';
import { resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function trustFromCount(count) {
  return Math.min(100, 50 + Math.min(45, Math.floor(count * 1.2)));
}

function parseEntries(file, userId) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((r) => r && r.user_id === userId);
}

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
  const userId = String(body?.user_id || '').trim();
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'user_id required', code: 'VALIDATION' }),
      { status: 400, headers: HEADERS }
    );
  }

  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const entryFile = path.join(hubRoot, 'data', 'mirrorSoul', 'entries.jsonl');
  const entries = parseEntries(entryFile, userId);
  const count = entries.length;
  const trust = trustFromCount(count);
  const now = new Date().toISOString();

  const zesFile = path.join(hubRoot, 'data', 'mirrorsoul', 'zes_state.json');
  let state = { users: {} };
  try {
    if (fs.existsSync(zesFile)) {
      state = JSON.parse(fs.readFileSync(zesFile, 'utf8'));
    }
  } catch {
    state = { users: {} };
  }
  if (!state || typeof state !== 'object') state = { users: {} };
  if (!state.users || typeof state.users !== 'object') state.users = {};
  state.users[userId] = {
    user_id: userId,
    trust_score: trust,
    entry_count: count,
    last_updated: now,
  };
  state.last_global_update = now;
  state.note = 'ZES stub: trust from mirrorSoul entry consistency only. Advisory.';

  fs.mkdirSync(path.dirname(zesFile), { recursive: true });
  fs.writeFileSync(zesFile, JSON.stringify(state, null, 2), 'utf8');

  return new Response(
    JSON.stringify({
      ok: true,
      advisory: true,
      user_id: userId,
      zes: state.users[userId],
    }),
    { status: 200, headers: HEADERS }
  );
}
