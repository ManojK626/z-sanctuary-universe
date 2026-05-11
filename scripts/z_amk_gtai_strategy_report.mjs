#!/usr/bin/env node
/**
 * Z-AMK-GTAI-1 — Strategy council decision report (read-only).
 * Aggregates existing hub report JSON; does not mutate sources, call providers, deploy, or auto-fix.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COUNCIL = path.join(ROOT, 'data', 'z_amk_gtai_strategy_council.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_amk_gtai_strategy_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_amk_gtai_strategy_report.md');
const SCHEMA = 'z_amk_gtai_strategy_report_v1';

const ORDER = { RED: 5, BLUE: 4, YELLOW: 3, GREEN: 2, GOLD: 1, UNKNOWN: 0 };

function rank(s) {
  return ORDER[String(s || 'UNKNOWN').toUpperCase()] ?? 0;
}

function maxSig(a, b) {
  return rank(a) >= rank(b) ? a : b;
}

function getNested(obj, dotted) {
  if (!obj || !dotted) return undefined;
  const parts = String(dotted).split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function readJsonSafe(rel) {
  const p = path.join(ROOT, rel);
  try {
    if (!fs.existsSync(p)) return { ok: false, path: rel, data: null };
    return { ok: true, path: rel, data: JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch {
    return { ok: false, path: rel, data: null };
  }
}

function extractSignals(data, paths) {
  if (!data) return [];
  const out = [];
  const tryList = Array.isArray(paths) ? paths : [];
  for (const dotted of tryList) {
    const v = getNested(data, dotted);
    if (v != null && v !== '') out.push(String(v).toUpperCase());
  }
  return out;
}

function car2Advisory(data) {
  if (!data?.summary) return { signal: 'UNKNOWN', note: '' };
  const line = String(data.summary.risk_histogram_line || '');
  const win = String(data.summary.risk_histogram_window || '');
  const re = /(RED|BLACK):\s*(\d+)/gi;
  let maxRed = 0;
  let maxBlack = 0;
  let m;
  const s = `${line} ${win}`;
  while ((m = re.exec(s)) !== null) {
    const n = parseInt(m[2], 10) || 0;
    if (m[1].toUpperCase() === 'RED') maxRed = Math.max(maxRed, n);
    if (m[1].toUpperCase() === 'BLACK') maxBlack = Math.max(maxBlack, n);
  }
  if (maxRed > 0) return { signal: 'YELLOW', note: `CAR² histogram shows RED count ${maxRed} (advisory).` };
  if (maxBlack > 0) return { signal: 'YELLOW', note: `CAR² histogram shows BLACK count ${maxBlack} (advisory).` };
  return { signal: 'GREEN', note: 'CAR² histogram within advisory tolerance for council.' };
}

function main() {
  const generated_at = new Date().toISOString();
  let council;
  try {
    council = JSON.parse(fs.readFileSync(COUNCIL, 'utf8'));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const sources = council.report_sources || [];
  const ingest = [];
  let trafficChief = 'UNKNOWN';
  let trafficMissing = false;

  for (const src of sources) {
    const rel = src.path;
    const r = readJsonSafe(rel);
    let sigs = [];
    if (r.ok && r.data) {
      if (src.id === 'car2') {
        const adv = car2Advisory(r.data);
        sigs = [adv.signal];
        ingest.push({
          id: src.id,
          path: rel,
          status: 'ok',
          signals: sigs,
          required: Boolean(src.required),
          note: adv.note,
        });
      } else {
        sigs = extractSignals(r.data, src.signal_paths);
        ingest.push({
          id: src.id,
          path: rel,
          status: 'ok',
          signals: sigs.length ? sigs : ['UNKNOWN'],
          required: Boolean(src.required),
        });
      }
      if (src.id === 'traffic' && r.data?.traffic_chief?.overall_signal) {
        trafficChief = String(r.data.traffic_chief.overall_signal).toUpperCase();
      }
    } else {
      ingest.push({
        id: src.id,
        path: rel,
        status: 'missing',
        signals: ['UNKNOWN'],
        required: Boolean(src.required),
      });
      if (src.id === 'traffic') trafficMissing = true;
    }
  }

  let rollup = 'UNKNOWN';
  for (const row of ingest) {
    for (const s of row.signals || []) {
      if (s === 'UNKNOWN') continue;
      rollup = rollup === 'UNKNOWN' ? s : maxSig(rollup, s);
    }
  }
  if (trafficMissing) rollup = maxSig(rollup, 'YELLOW');
  if (rollup === 'UNKNOWN') rollup = 'GREEN';

  const overall = rollup;
  const exitCode = overall === 'RED' ? 1 : 0;

  const redFindings = [];
  const blueDecisions = [];
  const yellowObs = [];
  const greenBaseline = [];

  for (const row of ingest) {
    for (const s of row.signals || []) {
      if (s === 'RED') redFindings.push({ source: row.id, path: row.path, note: row.note || 'Signal RED in report.' });
      else if (s === 'BLUE') blueDecisions.push({ source: row.id, path: row.path, note: row.note || 'BLUE posture — AMK decision.' });
      else if (s === 'YELLOW') yellowObs.push({ source: row.id, path: row.path, note: row.note || 'YELLOW advisory.' });
      else if (s === 'GREEN' || s === 'GOLD') greenBaseline.push({ source: row.id, signal: s });
    }
  }
  if (trafficMissing) {
    yellowObs.push({
      source: 'traffic',
      path: 'data/reports/z_traffic_minibots_status.json',
      note: 'Traffic report missing — run npm run z:traffic before trusting council rollup.',
    });
  }

  const notificationCandidates = [];
  for (const f of redFindings) {
    notificationCandidates.push({ class: 'RED', source: f.source, summary: f.note });
  }
  for (const f of blueDecisions) {
    notificationCandidates.push({ class: 'BLUE', source: f.source, summary: f.note });
  }

  let recommended =
    overall === 'RED'
      ? 'Stop: inspect failing minibots in z_traffic_minibots_status.md; restore required evidence before a new lane.'
      : overall === 'BLUE'
        ? 'Hold sacred lanes; read BLUE sources and sign off before deploy/billing/bridge/provider work.'
        : overall === 'YELLOW'
          ? 'Observe; schedule small cleanup or re-run generators when convenient.'
          : 'Baseline acceptable for normal read-only work; continue 7-day observation strip if in upgrade window.';

  const smallestReversible =
    overall === 'RED'
      ? 'Run failing npm scripts individually (see traffic report); md:table-compact on docs if MD060; rollback = revert last doc batch.'
      : 'Re-run npm run z:amk:strategy after refreshing upstream reports; no repo mutation from this script.';

  const amkRequired = overall === 'RED' || overall === 'BLUE';
  const autoLaneOk = overall !== 'RED' && overall !== 'BLUE';
  const holdBaseline = overall === 'BLUE' || overall === 'YELLOW';

  const requiredTrafficRed = trafficChief === 'RED';

  const payload = {
    schema: SCHEMA,
    generated_at,
    council: council.council_name,
    phase: council.phase,
    mode: council.mode,
    overall_signal: overall,
    traffic_chief_signal: trafficChief,
    required_traffic_red: requiredTrafficRed,
    traffic_report_missing: trafficMissing,
    rollup_note:
      'Exit 1 when overall_signal is RED (rollup across ingested report signals; missing optional reports contribute UNKNOWN only).',
    ingest_summary: ingest,
    red_findings: redFindings.slice(0, 24),
    blue_decisions_required: blueDecisions.slice(0, 24),
    yellow_observations: yellowObs.slice(0, 24),
    green_gold_baselines: greenBaseline.slice(0, 24),
    notification_candidates_red_blue_only: notificationCandidates.slice(0, 40),
    conclusion: {
      overall_signal: overall,
      recommended_move: recommended,
      amk_required: amkRequired,
      can_auto_lane_proceed_read_only: autoLaneOk,
      blocked_lanes: overall === 'RED' ? ['new_feature_lane', 'deploy', 'merge_without_fix'] : [],
      smallest_safe_next_action: smallestReversible,
      hold_baseline: holdBaseline,
    },
    laws: council.laws || [],
    exit_hint: exitCode,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  const md = [
    '# Z-AMK-GTAI Strategy Council Report',
    '',
    `**Generated:** ${generated_at}`,
    '',
    `**Overall signal:** ${overall}`,
    '',
    '## Executive summary',
    '',
    recommended,
    '',
    '## RED findings',
    '',
    redFindings.length ? redFindings.map((x) => `- **${x.source}:** ${x.note}`).join('\n') : '- None listed (check ingest if traffic is RED).',
    '',
    '## BLUE — AMK decisions',
    '',
    blueDecisions.length ? blueDecisions.map((x) => `- **${x.source}:** ${x.note}`).join('\n') : '- None from aggregated signals.',
    '',
    '## YELLOW — observe',
    '',
    yellowObs.length ? yellowObs.map((x) => `- **${x.source}:** ${x.note}`).join('\n') : '- None.',
    '',
    '## GREEN / GOLD baselines',
    '',
    greenBaseline.length ? greenBaseline.map((x) => `- **${x.source}:** ${x.signal}`).join('\n') : '- (See ingest for per-source signals.)',
    '',
    '## Z-AMK-GTAI conclusion',
    '',
    '```text',
    `Overall signal: ${overall}`,
    `Recommended move: ${recommended}`,
    `AMK required: ${amkRequired ? 'yes' : 'no'}`,
    `Can auto-lane proceed (read-only): ${autoLaneOk ? 'yes' : 'no'}`,
    `Blocked lanes: ${payload.conclusion.blocked_lanes.join(', ') || 'none'}`,
    `Smallest safe next action: ${smallestReversible}`,
    `Hold baseline? ${holdBaseline ? 'yes' : 'no'}`,
    '```',
    '',
    '## Law',
    '',
    'Strategy report ≠ execution. Recommendation ≠ permission. AMK-Goku owns sacred moves.',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');
  console.log(JSON.stringify({ ok: true, overall_signal: overall, exit: exitCode, out_json: OUT_JSON, out_md: OUT_MD }));
  process.exit(exitCode);
}

main();
