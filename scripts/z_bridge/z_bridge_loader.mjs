import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repository root (parent of `scripts/`). */
export const Z_BRIDGE_REPO_ROOT = path.resolve(__dirname, '..', '..');

export const zBridgePaths = (root = Z_BRIDGE_REPO_ROOT) => ({
  pool: path.join(root, 'data', 'z_bridge', 'pool.json'),
  users: path.join(root, 'data', 'z_bridge', 'users.json'),
  allocationHistory: path.join(root, 'data', 'z_bridge', 'allocation_history.json'),
  logs: path.join(root, 'data', 'z_bridge', 'logs.json'),
  rules: path.join(root, 'config', 'z_bridge', 'z_bridge_rules.json')
});

/**
 * Read one JSON file. Does not throw; returns structured result.
 * @param {string} filePath
 * @returns {{ ok: true, data: unknown } | { ok: false, error: string }}
 */
export function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) {
    return { ok: false, error: `missing_file:${filePath}` };
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `read_or_parse_failed:${filePath}:${msg}` };
  }
}

/**
 * Load all Z-Bridge JSON stores. Observational only — no writes.
 * @param {string} [root]
 * @returns {{ ok: true, errors: string[], bundle: object } | { ok: false, errors: string[], bundle: null }}
 */
export function loadZBridge(root = Z_BRIDGE_REPO_ROOT) {
  const paths = zBridgePaths(root);
  const errors = [];
  /** @type {Record<string, unknown>} */
  const bundle = {};

  const required = [
    ['pool', paths.pool],
    ['users', paths.users],
    ['allocationHistory', paths.allocationHistory],
    ['logs', paths.logs],
    ['rules', paths.rules]
  ];

  for (const [key, filePath] of required) {
    const r = readJsonSafe(filePath);
    if (!r.ok) {
      errors.push(r.error);
      continue;
    }
    bundle[key] = r.data;
  }

  if (errors.length > 0) {
    return { ok: false, errors, bundle: null };
  }

  return { ok: true, errors: [], bundle };
}

async function main() {
  const loaded = loadZBridge();
  if (!loaded.ok) {
    console.error(JSON.stringify({ ok: false, phase: 'load', errors: loaded.errors }, null, 2));
    process.exitCode = 1;
    return;
  }

  const { pool, users, allocationHistory, logs, rules } = loaded.bundle;
  const summary = {
    ok: true,
    phase: 'load',
    pool_status: typeof pool === 'object' && pool !== null && 'status' in pool ? pool.status : null,
    users_count: Array.isArray(users?.users) ? users.users.length : null,
    allocations_count: Array.isArray(allocationHistory?.allocations)
      ? allocationHistory.allocations.length
      : null,
    events_count: Array.isArray(logs?.events) ? logs.events.length : null,
    rules_modes: Array.isArray(rules?.system_modes) ? rules.system_modes.length : null
  };

  console.log(JSON.stringify(summary, null, 2));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((e) => {
    console.error(JSON.stringify({ ok: false, phase: 'load', errors: [String(e)] }, null, 2));
    process.exitCode = 1;
  });
}
