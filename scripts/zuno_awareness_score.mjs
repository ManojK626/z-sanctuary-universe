#!/usr/bin/env node
/**
 * ZUNO-A3 — Read-only awareness score: aggregates Monster verify, snapshot presence,
 * A2a temporal diff (when baseline exists), A2b truth alignment, Z-Traffic chief signal,
 * and explicit non-claims / autonomy posture from the ingested snapshot.
 *
 * Writes data/reports/zuno_awareness_score.{json,md}. No auto-fix, no phase advancement.
 * Exit 0 after a successful write (band is advisory; read JSON for RED/YELLOW/BLUE/GREEN).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCHEMA = 'zuno_awareness_score_v1';
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'zuno_awareness_score.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'zuno_awareness_score.md');

const PATHS = {
  snap: path.join(ROOT, 'data', 'zuno_state_snapshot.json'),
  monsterReceipt: path.join(ROOT, 'data', 'reports', 'z_monster_project_registry_verify.json'),
  a2a: path.join(ROOT, 'data', 'reports', 'zuno_snapshot_diff.json'),
  a2b: path.join(ROOT, 'data', 'reports', 'zuno_truth_layer_alignment.json'),
  traffic: path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json'),
};

const RANK = { GREEN: 1, YELLOW: 2, BLUE: 3, RED: 4 };

/** @param {string} a @param {string} b */
function maxBand(a, b) {
  return RANK[a] >= RANK[b] ? a : b;
}

/** @param {string} p */
function readJsonSafe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

/** @param {string} scriptRel */
function runNode(scriptRel) {
  const script = path.join(ROOT, scriptRel);
  const res = spawnSync(process.execPath, [script], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 12 * 1024 * 1024,
  });
  return {
    exitCode: res.status === null ? -1 : res.status,
    ok: res.status === 0,
    stderr_tail: String(res.stderr || '').slice(-2000),
  };
}

/**
 * @param {Record<string, unknown>|null} snap
 * @param {string[]} reasons
 * @returns {string}
 */
function postureBand(snap, reasons) {
  if (!snap || typeof snap !== 'object') return 'GREEN';
  const id = snap.identity && typeof snap.identity === 'object' ? snap.identity : {};
  const aut = String(id['Autonomy level'] || '');
  const posture = String(id.Posture || '');
  const integrity = String(id.Integrity || '');
  const blob = `${aut}\n${posture}\n${integrity}`;

  if (/\bL[3-9]\b/i.test(aut)) {
    reasons.push('autonomy_tier_L3_plus_documented');
    return 'BLUE';
  }
  if (/unconstrained|daemon\s*executor|self[\s-]*modif|auto[\s-]*merge|production\s*gate\s*bypass/i.test(blob)) {
    reasons.push('posture_language_requires_human_gate');
    return 'BLUE';
  }
  if (/amber|hold|manual\s*release|pending\s*human/i.test(blob)) {
    reasons.push('integrity_or_posture_mentions_hold_or_manual');
    return 'BLUE';
  }
  return 'GREEN';
}

/**
 * @param {Record<string, unknown>|null} snap
 * @param {string[]} reasons
 * @returns {string}
 */
function nonClaimsBand(snap, reasons) {
  if (!snap) return 'GREEN';
  const raw = snap?.explicit_non_claims;
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (s.length < 40) {
    reasons.push('explicit_non_claims_thin_or_missing');
    return 'YELLOW';
  }
  return 'GREEN';
}

/** @param {Record<string, unknown>} payload */
function writeMarkdown(payload) {
  const sig = payload.signals;
  const lines = [
    '# Zuno awareness score (A3)',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| **Band** | **${payload.band}** |`,
    `| Score | ${payload.score} |`,
    `| Dominant drivers | ${payload.dominant_drivers.length ? payload.dominant_drivers.join('; ') : '—'} |`,
    '',
    '## Band meanings',
    '',
    '| Band | Meaning |',
    '| ---- | ------- |',
    '| GREEN | Stable, aligned, no blocking drift. |',
    '| YELLOW | Known drift, symbolic gaps, optional baseline missing, or advisory minibots. |',
    '| BLUE | Human / AMK decision required before treating posture as proceed. |',
    '| RED | Broken required evidence (e.g. registry or snapshot integrity failed). |',
    '',
    '## Signals (summary)',
    '',
    '| Source | Summary |',
    '| ---- | ---- |',
    `| Monster registry verify | ${JSON.stringify(sig.monster_registry_verify).replace(/\|/g, '\\|')} |`,
    `| Snapshot ingest | ${JSON.stringify(sig.snapshot_ingest).replace(/\|/g, '\\|')} |`,
    `| A2a temporal | ${JSON.stringify(sig.a2a_temporal).replace(/\|/g, '\\|')} |`,
    `| A2b truth layer | ${JSON.stringify(sig.a2b_truth_layer).replace(/\|/g, '\\|')} |`,
    `| Z-Traffic chief | ${JSON.stringify(sig.z_traffic_chief).replace(/\|/g, '\\|')} |`,
    `| Non-claims | ${JSON.stringify(sig.non_claims).replace(/\|/g, '\\|')} |`,
    `| Posture language | ${JSON.stringify(sig.posture_language).replace(/\|/g, '\\|')} |`,
    '',
    '## Rationale',
    '',
    payload.rationale,
    '',
    '---',
    '',
    '*Read-only receipt — no auto-fix or phase advancement.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const generatedAt = new Date().toISOString();
  /** @type {string[]} */
  const reasons = [];

  const monsterRun = runNode('scripts/z_monster_project_registry_verify.mjs');
  const monsterReceipt = readJsonSafe(PATHS.monsterReceipt);
  const monsterPass = Boolean(monsterReceipt?.pass) && monsterRun.ok;

  if (!monsterPass) {
    reasons.push('monster_registry_verify_failed_or_receipt_absent');
  }

  const diffRun = runNode('scripts/zuno_snapshot_diff.mjs');
  const alignRun = runNode('scripts/zuno_truth_layer_alignment.mjs');
  const trafficRun = runNode('scripts/z_traffic_minibots_status.mjs');

  let snap = null;
  try {
    if (fs.existsSync(PATHS.snap)) {
      snap = JSON.parse(fs.readFileSync(PATHS.snap, 'utf8'));
    }
  } catch {
    snap = null;
    reasons.push('snapshot_json_invalid');
  }

  const a2a = readJsonSafe(PATHS.a2a);
  const a2b = readJsonSafe(PATHS.a2b);
  const traffic = readJsonSafe(PATHS.traffic);

  const truthRef = snap?.truth_alignment_ref;
  const snapshotPresent = Boolean(snap);
  const truthRefOk =
    truthRef &&
    typeof truthRef === 'object' &&
    truthRef.present === true &&
    typeof truthRef.monster_required_ids_sha256 === 'string';

  /** @type {Record<string, unknown>} */
  const signals = {
    monster_registry_verify: {
      script_exit_code: monsterRun.exitCode,
      receipt_pass: monsterReceipt?.pass ?? null,
      receipt_path: path.relative(ROOT, PATHS.monsterReceipt).replace(/\\/g, '/'),
    },
    snapshot_ingest: {
      snapshot_present: snapshotPresent,
      truth_alignment_ref_ok: truthRefOk,
      snapshot_id: snap?.identity?.['Snapshot ID'] ?? null,
    },
    a2a_temporal: {
      script_exit_code: diffRun.exitCode,
      status: a2a?.status ?? 'unknown',
      baseline_path: a2a?.baseline_path ?? null,
      summary: a2a?.summary ?? null,
      note: diffRun.ok ? null : diffRun.stderr_tail?.slice(0, 400) || 'zuno_snapshot_diff exited non-zero',
    },
    a2b_truth_layer: {
      script_exit_code: alignRun.exitCode,
      status: a2b?.status ?? 'unknown',
      echo_in_sync: a2b?.registry_vs_snapshot_echo?.echo_in_sync ?? null,
      narrative_missing_count: a2b?.narrative_presence?.missing_ids?.length ?? null,
    },
    z_traffic_chief: {
      script_exit_code: trafficRun.exitCode,
      overall_signal: traffic?.traffic_chief?.overall_signal ?? 'unknown',
      human_decision_required: traffic?.traffic_chief?.human_decision_required ?? null,
    },
    non_claims: {
      band: nonClaimsBand(snap, reasons),
    },
    posture_language: {
      band: postureBand(snap, reasons),
    },
  };

  let band = 'GREEN';
  let score = 100;

  if (!monsterPass || !snapshotPresent) {
    band = maxBand(band, 'RED');
    score = Math.min(score, 0);
    if (!snapshotPresent) reasons.push('snapshot_missing');
  }

  if (diffRun.exitCode !== 0 && diffRun.exitCode !== null) {
    band = maxBand(band, 'RED');
    score = Math.min(score, 15);
    reasons.push('a2a_script_failed');
  }

  if (alignRun.exitCode !== 0 && alignRun.exitCode !== null) {
    band = maxBand(band, 'RED');
    score = Math.min(score, 15);
    reasons.push('a2b_script_failed');
  }

  if (trafficRun.exitCode !== 0 && traffic?.traffic_chief?.overall_signal !== 'RED') {
    band = maxBand(band, 'YELLOW');
    score = Math.min(score, 55);
    reasons.push('traffic_script_nonzero_but_read_receipt');
  }

  const ncBand = /** @type {string} */ (signals.non_claims.band);
  const postureLangBand = /** @type {string} */ (signals.posture_language.band);
  band = maxBand(band, ncBand);
  band = maxBand(band, postureLangBand);
  if (ncBand === 'YELLOW') score = Math.min(score, 78);
  if (postureLangBand === 'BLUE') score = Math.min(score, 62);

  const trafficSig = String(traffic?.traffic_chief?.overall_signal || 'unknown').toUpperCase();
  if (trafficSig === 'RED') {
    band = maxBand(band, 'RED');
    score = Math.min(score, 10);
    reasons.push('z_traffic_RED');
  } else if (trafficSig === 'BLUE') {
    band = maxBand(band, 'BLUE');
    score = Math.min(score, 58);
    reasons.push('z_traffic_BLUE');
  } else if (trafficSig === 'YELLOW') {
    band = maxBand(band, 'YELLOW');
    score = Math.min(score, 72);
    reasons.push('z_traffic_YELLOW');
  }

  const a2aStatus = String(a2a?.status || '');
  if (a2aStatus === 'no_baseline') {
    band = maxBand(band, 'YELLOW');
    score = Math.min(score, 85);
    reasons.push('a2a_no_baseline_optional');
  } else if (a2aStatus === 'ok' && a2a?.summary) {
    const s = a2a.summary;
    const deltas =
      (s.added || 0) +
      (s.removed || 0) +
      (s.changed || 0) +
      (s.non_claim_changed || 0) +
      (s.posture_changed || 0);
    if (deltas > 0) {
      band = maxBand(band, 'YELLOW');
      score = Math.min(score, 70);
      reasons.push('a2a_temporal_deltas_present');
    }
  }

  const a2bStatus = String(a2b?.status || '').toUpperCase();
  if (a2bStatus === 'YELLOW') {
    band = maxBand(band, 'YELLOW');
    score = Math.min(score, 75);
    reasons.push('a2b_truth_layer_YELLOW');
  }

  if (snapshotPresent && !truthRefOk) {
    band = maxBand(band, 'YELLOW');
    score = Math.min(score, 80);
    reasons.push('truth_alignment_ref_missing_stale_ingest');
  }

  const uniqueReasons = [...new Set(reasons)];
  const dominantDrivers = uniqueReasons.slice(0, 8);
  const rationale =
    dominantDrivers.length > 0
      ? dominantDrivers.map((r) => `- ${r}`).join('\n')
      : '- No blocking drivers; posture matches GREEN criteria for this run.';

  const payload = {
    schema: SCHEMA,
    generated_at: generatedAt,
    band,
    score,
    dominant_drivers: dominantDrivers,
    rationale,
    signals,
    note: 'Score is heuristic and receipt-backed. YELLOW narrative gaps are expected until the technology snapshot names more Monster roster items.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMarkdown(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        band,
        score,
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
