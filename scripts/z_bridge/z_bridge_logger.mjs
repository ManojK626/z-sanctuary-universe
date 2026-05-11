import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Z_BRIDGE_REPO_ROOT = path.resolve(__dirname, '..', '..');
const LOGS_PATH = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'z_bridge', 'logs.json');

/**
 * Append one event to `logs.json` events array. Preserves existing events and other keys.
 * Never truncates history; on parse/structure failure returns without writing.
 *
 * @param {{ level?: string, action: string, detail?: string, meta?: Record<string, unknown> }} entry action required
 * @returns {{ ok: true, eventsLength: number } | { ok: false, error: string }}
 */
export function appendZBridgeLog(entry) {
  if (!entry || typeof entry !== 'object' || typeof entry.action !== 'string' || entry.action.length === 0) {
    return { ok: false, error: 'logger_invalid_entry' };
  }

  if (!fs.existsSync(LOGS_PATH)) {
    return { ok: false, error: `missing_file:${LOGS_PATH}` };
  }

  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf8'));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `logs_parse_failed:${msg}` };
  }

  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    return { ok: false, error: 'logs_root_not_object' };
  }

  if (!Array.isArray(doc.events)) {
    return { ok: false, error: 'logs_events_not_array' };
  }

  const ts = new Date().toISOString();
  const event = {
    ts,
    level: typeof entry.level === 'string' && entry.level.length > 0 ? entry.level : 'info',
    action: entry.action,
    ...(entry.detail !== undefined ? { detail: entry.detail } : {}),
    ...(entry.meta !== undefined && entry.meta !== null && typeof entry.meta === 'object'
      ? { meta: entry.meta }
      : {})
  };

  const next = { ...doc, events: [...doc.events, event] };

  try {
    fs.writeFileSync(LOGS_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `logs_write_failed:${msg}` };
  }

  return { ok: true, eventsLength: next.events.length };
}
