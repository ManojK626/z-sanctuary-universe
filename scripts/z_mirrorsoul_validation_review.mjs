#!/usr/bin/env node
/**
 * Summarize MirrorSoul prediction validation log (append-only jsonl).
 * Run from hub root: node scripts/z_mirrorsoul_validation_review.mjs [--json] [--path data/logs/z_prediction_validation.jsonl]
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const wantJson = argv.includes('--json');
const pathIdx = argv.findIndex((a) => a === '--path');
const fileArg = pathIdx >= 0 && argv[pathIdx + 1] ? argv[pathIdx + 1] : null;
const logPath = fileArg
  ? path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg)
  : path.join(process.cwd(), 'data', 'logs', 'z_prediction_validation.jsonl');

if (!fs.existsSync(logPath)) {
  if (wantJson) {
    console.log(JSON.stringify({ file: logPath, pending: 0, resolutions: 0, rows: [] }, null, 2));
  } else {
    console.log(`No file yet: ${logPath}`);
  }
  process.exit(0);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const rows = [];
for (const l of lines) {
  try {
    rows.push(JSON.parse(l));
  } catch {
    rows.push({ _parse_error: true, line: l.slice(0, 200) });
  }
}

const pending = rows.filter((r) => r.type === 'pending' && r.status === 'pending');
const resolved = rows.filter((r) => r.type === 'resolution' && r.resolves_id);
const resolvedSet = new Set(resolved.map((r) => r.resolves_id));
const stillOpen = pending.filter((p) => !resolvedSet.has(p.id));
const out = {
  file: logPath,
  line_count: rows.length,
  pending_in_log: stillOpen.length,
  resolution_events: resolved.length,
  last_rows: rows.slice(-15),
};

if (wantJson) {
  console.log(JSON.stringify(out, null, 2));
} else {
  console.log(
    `Validation log: ${out.file}\n` +
    `  lines: ${out.line_count}\n` +
    `  open pending (unresolved by id): ${out.pending_in_log}\n` +
    `  resolution appends: ${out.resolution_events}\n` +
    `  last ${out.last_rows.length} rows:`
  );
  for (const r of out.last_rows) {
    const s = r.type === 'resolution' ? `resolves ${r.resolves_id} -> ${r.outcome}` : `${r.id} pending conf=${r.confidence}`;
    console.log(`  - [${r.ts || '?'}] ${s}`);
  }
}
