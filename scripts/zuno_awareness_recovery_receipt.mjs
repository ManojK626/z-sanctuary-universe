#!/usr/bin/env node
/**
 * ZUNO-A3R — Awareness recovery receipt (read-only gate).
 * Reads last A3 / Z-Traffic receipts (or optionally --live refresh) and states whether
 * A4 (Guardian Loop) is eligible. Does not mutate sources, auto-fix, or open A4.
 *
 * Rule: A4 must not open while A3 band is RED (or while Z-Traffic chief is RED).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCHEMA = 'zuno_awareness_recovery_receipt_v1';
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'zuno_awareness_recovery_receipt.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'zuno_awareness_recovery_receipt.md');
const A3 = path.join(ROOT, 'data', 'reports', 'zuno_awareness_score.json');
const TRAFFIC = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function wantsLive(argv) {
  return argv.includes('--live');
}

function runLive() {
  spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'z_traffic_minibots_status.mjs')], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 24 * 1024 * 1024,
  });
  spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'zuno_awareness_score.mjs')], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 24 * 1024 * 1024,
  });
}

/** @param {Record<string, unknown>} payload */
function writeMarkdown(payload) {
  const b = payload.a4_guardian_loop_blocked;
  const lines = [
    '# Zuno awareness recovery receipt (A3-R)',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| Mode | ${payload.mode} |`,
    `| A3 band (last) | ${payload.a3_band} |`,
    `| Z-Traffic chief | ${payload.z_traffic_overall_signal} |`,
    `| Recovery status | ${payload.recovery_status} |`,
    `| A4 Guardian Loop eligible | **${payload.a4_guardian_loop_eligible ? 'yes' : 'no'}** |`,
    `| A4 blocked | **${b ? 'yes' : 'no'}** |`,
    '',
    '## Gate rule',
    '',
    'Do **not** open **A4 (Guardian Loop)** while **A3 is RED** or **Z-Traffic chief is RED**. Use this receipt after fixes.',
    '',
    '## Correct recovery order',
    '',
    '1. `npm run z:traffic` — fix whatever makes Z-Traffic RED **first**.',
    '2. After intentional snapshot-shape changes are accepted:',
    '',
    '```bash',
    'npm run zuno:snapshot',
    'npm run zuno:snapshot:diff',
    'npm run zuno:snapshot:truth-align',
    'npm run zuno:awareness-score',
    'npm run zuno:a3r:receipt',
    '```',
    '',
    'Use `npm run zuno:a3r:receipt -- --live` for the last step only when you want a fresh traffic + A3 pass before reading.',
    '',
    '## Block / eligibility detail',
    '',
    payload.a4_block_reason,
    '',
    '---',
    '',
    '*Read-only receipt — no auto-fix, no A4 execution.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const live = wantsLive(process.argv);
  if (live) runLive();

  const a3 = readJson(A3);
  const traffic = readJson(TRAFFIC);

  const a3Band = typeof a3?.band === 'string' ? a3.band : 'unknown';
  const trafficSig =
    typeof traffic?.traffic_chief?.overall_signal === 'string'
      ? traffic.traffic_chief.overall_signal
      : 'unknown';

  const a3Red = a3Band === 'RED';
  const trafficRed = trafficSig === 'RED';
  const a3Blue = a3Band === 'BLUE';
  const trafficBlue = trafficSig === 'BLUE';
  const a4Blocked = a3Red || trafficRed || a3Blue || trafficBlue;

  /** Strict: only full GREEN on both gates allows A4 eligibility. */
  const a4Eligible = a3Band === 'GREEN' && trafficSig === 'GREEN';

  let recoveryStatus = 'caution';
  if (a3Red || trafficRed) recoveryStatus = 'blocked';
  else if (a3Band === 'GREEN' && trafficSig === 'GREEN') recoveryStatus = 'clear';
  else if (a3Band === 'unknown' || trafficSig === 'unknown') recoveryStatus = 'incomplete_receipts';

  const blockParts = [];
  if (a3Red) blockParts.push('A3 band is RED');
  if (trafficRed) blockParts.push('Z-Traffic chief is RED');
  if (a3Blue) blockParts.push('A3 band is BLUE (human decision)');
  if (trafficBlue) blockParts.push('Z-Traffic chief is BLUE (human decision)');
  if (!blockParts.length && !a4Eligible) {
    blockParts.push('A3 or Traffic not fully GREEN — A4 remains closed until strict GREEN.');
  }

  const a4BlockReason = a4Blocked
    ? `${blockParts.join('; ')}. Do not open A4.`
    : a4Eligible
      ? 'A3 GREEN and Z-Traffic GREEN — A4 may be considered only under separate charter (A4 is not implemented by this script).'
      : 'Posture is not RED but not dual-GREEN; keep A4 closed until traffic and A3 are both GREEN.';

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    mode: live ? 'live_refresh_then_read' : 'read_last_receipts',
    a3_band: a3Band,
    a3_score: typeof a3?.score === 'number' ? a3.score : null,
    z_traffic_overall_signal: trafficSig,
    recovery_status: recoveryStatus,
    a4_guardian_loop_eligible: a4Eligible,
    a4_guardian_loop_blocked: !a4Eligible,
    a4_block_reason: a4BlockReason,
    dominant_drivers_from_a3: Array.isArray(a3?.dominant_drivers) ? a3.dominant_drivers : [],
    references: {
      awareness_score: path.relative(ROOT, A3).replace(/\\/g, '/'),
      traffic_status: path.relative(ROOT, TRAFFIC).replace(/\\/g, '/'),
    },
    cli: {
      pass_through: 'npm run zuno:a3r:receipt -- --live',
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMarkdown(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        recovery_status: payload.recovery_status,
        a4_guardian_loop_eligible: payload.a4_guardian_loop_eligible,
        a4_guardian_loop_blocked: payload.a4_guardian_loop_blocked,
        out_json: path.relative(ROOT, OUT_JSON).replace(/\\/g, '/'),
        out_md: path.relative(ROOT, OUT_MD).replace(/\\/g, '/'),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main();
