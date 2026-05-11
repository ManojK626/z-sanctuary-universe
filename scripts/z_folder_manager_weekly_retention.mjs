import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SNAPSHOT_ROOT = path.join(
  ROOT,
  'safe_pack',
  'z_sanctuary_vault',
  'folder_manager',
  'snapshots'
);
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_folder_manager_retention.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_folder_manager_retention.md');
const STATE_JSON = path.join(REPORTS_DIR, 'z_folder_manager_retention_state.json');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function parseArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return fallback;
  const v = process.argv[idx + 1];
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function runRetention({ keep, days }) {
  const now = new Date();
  const state = readJson(STATE_JSON, {});
  const lastRun = state?.last_run ? new Date(state.last_run) : null;
  const elapsedMs = lastRun ? now.getTime() - lastRun.getTime() : Number.POSITIVE_INFINITY;
  const minMs = days * 24 * 60 * 60 * 1000;

  if (elapsedMs < minMs) {
    return {
      generated_at: now.toISOString(),
      mode: 'weekly_skip',
      keep,
      cadence_days: days,
      removed_count: 0,
      removed: [],
      snapshots_total: fs.existsSync(SNAPSHOT_ROOT)
        ? fs.readdirSync(SNAPSHOT_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).length
        : 0,
      note: `Skipped; cadence not reached (${Math.floor(elapsedMs / 3600000)}h since last run).`
    };
  }

  if (!fs.existsSync(SNAPSHOT_ROOT)) {
    return {
      generated_at: now.toISOString(),
      mode: 'weekly_run',
      keep,
      cadence_days: days,
      removed_count: 0,
      removed: [],
      snapshots_total: 0,
      note: 'No snapshot root found.'
    };
  }

  const dirs = fs
    .readdirSync(SNAPSHOT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const remove = dirs.length > keep ? dirs.slice(0, dirs.length - keep) : [];
  for (const dir of remove) {
    fs.rmSync(path.join(SNAPSHOT_ROOT, dir), { recursive: true, force: true });
  }

  const payload = {
    generated_at: now.toISOString(),
    mode: 'weekly_run',
    keep,
    cadence_days: days,
    removed_count: remove.length,
    removed: remove,
    snapshots_total: Math.max(0, dirs.length - remove.length),
    note: remove.length ? 'Old snapshots pruned.' : 'No pruning needed.'
  };

  writeJson(STATE_JSON, { last_run: now.toISOString() });
  return payload;
}

function writeReport(payload) {
  writeJson(OUT_JSON, payload);
  const md = [
    '# Z Folder Manager Retention',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    `Keep: ${payload.keep}`,
    `Cadence days: ${payload.cadence_days}`,
    `Removed count: ${payload.removed_count}`,
    `Snapshots total: ${payload.snapshots_total}`,
    '',
    '## Note',
    payload.note || 'n/a',
    '',
    '## Removed',
    ...(payload.removed?.length ? payload.removed.map((x) => `- ${x}`) : ['- none']),
    ''
  ];
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
}

function main() {
  const keep = parseArg('--keep', 30);
  const days = parseArg('--days', 7);
  const payload = runRetention({ keep, days });
  writeReport(payload);
  console.log(`Z Folder Manager retention: ${payload.mode}.`);
}

main();

