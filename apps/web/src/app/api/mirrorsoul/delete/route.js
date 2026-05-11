import fs from 'node:fs';
import path from 'node:path';
import { resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function parseJsonlLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
}

function keepOthers(lines, userId) {
  let removed = 0;
  const kept = [];
  for (const line of lines) {
    try {
      const row = JSON.parse(line);
      if (row?.user_id === userId) {
        removed += 1;
      } else {
        kept.push(JSON.stringify(row));
      }
    } catch {
      kept.push(line);
    }
  }
  return { kept, removed };
}

function rewriteJsonl(file, rows) {
  const body = rows.length ? `${rows.join('\n')}\n` : '';
  fs.writeFileSync(file, body, 'utf8');
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
  const confirm = body?.confirm === true;
  if (!userId || !confirm) {
    return new Response(
      JSON.stringify({ error: 'user_id + confirm=true required', code: 'VALIDATION' }),
      { status: 400, headers: HEADERS }
    );
  }

  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const dataRoot = path.join(hubRoot, 'data', 'mirrorSoul');
  fs.mkdirSync(dataRoot, { recursive: true });

  const entriesFile = path.join(dataRoot, 'entries.jsonl');
  const reflectionsFile = path.join(dataRoot, 'reflections.jsonl');

  const e = keepOthers(parseJsonlLines(entriesFile), userId);
  const r = keepOthers(parseJsonlLines(reflectionsFile), userId);

  rewriteJsonl(entriesFile, e.kept);
  rewriteJsonl(reflectionsFile, r.kept);

  return new Response(
    JSON.stringify({
      ok: true,
      advisory: true,
      user_id: userId,
      removed: {
        entries: e.removed,
        reflections: r.removed,
      },
      note: 'This controls local MirrorSoul data in this workspace. It may not delete backups, exported files, or future cloud copies.',
    }),
    { status: 200, headers: HEADERS }
  );
}
