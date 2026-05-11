/**
 * ZUNO-A1 — Read-only awareness bundle from ingested snapshot JSON.
 * Hub root: no HTTP server here; consumers import this module or run as CLI.
 *
 * After `npm run zuno:snapshot`, reads `data/zuno_state_snapshot.json`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @param {string} [root] */
export function resolveSnapshotPath(root = process.cwd()) {
  return path.join(root, 'data', 'zuno_state_snapshot.json');
}

/**
 * @param {string} [root]
 * @returns {{ status: string, snapshot_id?: string, posture?: string, autonomy_level?: string, generated_at?: string, inference_hints?: string, error?: string }}
 */
export function readZunoAwareness(root = process.cwd()) {
  const fp = resolveSnapshotPath(root);
  if (!fs.existsSync(fp)) {
    return {
      status: 'missing',
      error: 'No ingested snapshot — run npm run zuno:snapshot from hub root.',
    };
  }
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    const data = JSON.parse(raw);
    const id = data.identity?.['Snapshot ID'];
    return {
      status: 'ok',
      schema: data.schema,
      snapshot_id: id,
      posture: data.identity?.Posture,
      autonomy_level: data.identity?.['Autonomy level'],
      integrity: data.identity?.Integrity,
      source: data.identity?.Source,
      generated_at: data.generated_at,
      inference_hints: data.inference_hints,
    };
  } catch (e) {
    return {
      status: 'error',
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/** Full parsed snapshot (read-only). */
export function readZunoStateSnapshot(root = process.cwd()) {
  const fp = resolveSnapshotPath(root);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

const isMain =
  typeof process.argv[1] === 'string' &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const root = path.join(__dirname, '..', '..');
  console.log(JSON.stringify(readZunoAwareness(root), null, 2));
}
