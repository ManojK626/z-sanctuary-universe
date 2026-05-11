import fs from 'node:fs';
import path from 'node:path';
import { resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function readJsonl(file) {
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
    .filter(Boolean);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'user_id required', code: 'VALIDATION' }),
      { status: 400, headers: HEADERS }
    );
  }
  const hubRoot = resolveHubForChildWorkspace(process.cwd());
  const dataRoot = path.join(hubRoot, 'data', 'mirrorSoul');
  const entries = readJsonl(path.join(dataRoot, 'entries.jsonl')).filter((r) => r.user_id === userId);
  const reflections = readJsonl(path.join(dataRoot, 'reflections.jsonl')).filter((r) => r.user_id === userId);

  return new Response(
    JSON.stringify(
      {
        advisory: true,
        user_id: userId,
        exported_at: new Date().toISOString(),
        entries_count: entries.length,
        reflections_count: reflections.length,
        note: 'This controls local MirrorSoul data in this workspace. It may not delete backups, exported files, or future cloud copies.',
        entries,
        reflections,
      },
      null,
      2
    ),
    { status: 200, headers: HEADERS }
  );
}
