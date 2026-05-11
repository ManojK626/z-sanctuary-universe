#!/usr/bin/env node
// Z: scripts/z_soundscape_posture.mjs
// Builds z_soundscape_posture.json from existing sanctuary reports (passive + active metaphor).
// Run: node scripts/z_soundscape_posture.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_soundscape_posture.json');
const OUT_MD = path.join(REPORTS, 'z_soundscape_posture.md');

function readJson(rel) {
  try {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function main() {
  const generatedAt = new Date().toISOString();

  const indicator = readJson('data/reports/z_indicator_watchdog.json') || {};
  const cycle = readJson('data/reports/z_cycle_indicator.json') || {};
  const sentinel = readJson('data/reports/z_security_sentinel.json') || {};
  const slo = readJson('data/reports/z_slo_guard.json') || {};
  const zuno = readJson('data/reports/zuno_system_state_report.json') || {};
  const hygiene = readJson('data/reports/z_hygiene_status.json') || {};
  const anyDev = readJson('data/reports/z_anydevices_analyzer.json') || {};

  const attitude = String(indicator.attitude || 'unknown').toLowerCase();
  const integrity = Number(indicator.integrity_score ?? 0);
  const latestAttitude = String(cycle.latest_cycle?.attitude || cycle.attitude || 'unknown').toLowerCase();
  const sentStatus = String(sentinel.status || 'unknown').toLowerCase();
  const sloStatus = String(slo.status || 'unknown').toLowerCase();
  const zunoOps = String(zuno.executive_status?.internal_operations || 'unknown').toLowerCase();
  const hygieneSt = String(hygiene.status || 'unknown').toLowerCase();
  const anyStatus = String(anyDev.status || 'unknown').toLowerCase();

  let vitality = 50;
  if (attitude === 'calm') vitality += 15;
  if (integrity >= 90) vitality += 10;
  if (latestAttitude === 'calm') vitality += 10;
  if (sentStatus === 'green') vitality += 10;
  if (sloStatus === 'green') vitality += 5;
  if (hygieneSt === 'green') vitality += 5;
  if (zunoOps === 'stable-green') vitality += 5;

  if (attitude === 'caution' || attitude === 'drift') vitality -= 12;
  if (sentStatus === 'critical') vitality -= 35;
  else if (sentStatus === 'warn') vitality -= 15;
  if (sloStatus === 'hold') vitality -= 8;
  if (hygieneSt === 'hold') vitality -= 10;
  if (anyStatus === 'amber' || anyStatus === 'hold') vitality -= 5;

  vitality = clamp(Math.round(vitality), 0, 100);

  let organism_posture = 'alive_calm';
  if (vitality >= 85) organism_posture = 'alive_calm';
  else if (vitality >= 55) organism_posture = 'alive_focus';
  else organism_posture = 'alive_alert';

  const acoustic_mode =
    sloStatus === 'green' && sentStatus === 'green' ? 'hybrid' : 'passive_bias';

  const soundscape_tier =
    organism_posture === 'alive_alert' ? 'silent' : vitality >= 70 ? 'ambient' : 'expressive';

  const neon =
    organism_posture === 'alive_calm'
      ? { primary: 'rgba(0, 212, 255, 0.45)', secondary: 'rgba(127, 209, 185, 0.35)' }
      : organism_posture === 'alive_focus'
        ? { primary: 'rgba(180, 120, 255, 0.4)', secondary: 'rgba(0, 212, 255, 0.3)' }
        : { primary: 'rgba(255, 120, 90, 0.5)', secondary: 'rgba(255, 200, 80, 0.35)' };

  const pulsePeriodSec = clamp(3.6 - vitality / 35, 0.9, 4.2);

  const sources = {
    indicator_watchdog: indicator.generated_at || null,
    cycle_indicator: cycle.generated_at || null,
    security_sentinel: sentinel.ts || null,
    slo_guard: slo.generated_at || null,
    zuno_report: zuno.generated_at || null,
    hygiene_status: hygiene.generated_at || null,
    anydevices_analyzer: anyDev.generated_at || null,
  };

  const proposed_next_steps = [];
  if (sloStatus !== 'green') proposed_next_steps.push('Run Z: Workspace Auto Sweep and Z: SLO Guard until SLO is green.');
  if (hygieneSt !== 'green') proposed_next_steps.push('Run node scripts/z_hygiene_cycle.mjs and refresh privacy scan if needed.');
  if (sentStatus !== 'green') proposed_next_steps.push('Run node scripts/z_security_sentinel.mjs after hygiene/proof refresh.');
  if (anyStatus === 'amber') proposed_next_steps.push('Review AnyDevices analyzer (TPM/capabilities); optional re-run z_anydevices_analyzer.mjs.');
  if (proposed_next_steps.length === 0) {
    proposed_next_steps.push('Optional: extend Z-ACG with real audio features under consent (see architecture doc).');
  }

  const payload = {
    generated_at: generatedAt,
    gene: 'Z-ACG',
    version: '0.1.0',
    status: vitality >= 55 ? 'green' : vitality >= 35 ? 'hold' : 'red',
    vitality_score: vitality,
    organism_posture,
    acoustic_mode,
    soundscape_tier,
    metaphor: {
      passive_owl: 'Transient and drift detection from reports (no raw audio in this build).',
      active_dolphin: 'Echo-like checks via SLO / readiness / sweep reports.',
    },
    inputs: {
      indicator_attitude: attitude,
      indicator_integrity: integrity,
      cycle_attitude: latestAttitude,
      security_sentinel: sentStatus,
      slo_guard: sloStatus,
      zuno_internal_operations: zunoOps,
      hygiene: hygieneSt,
      anydevices_analyzer: anyStatus,
    },
    visual: {
      neon_glow: neon,
      pulse_period_sec: Number(pulsePeriodSec.toFixed(2)),
      note: 'Applied softly by dashboard panel; disabled when prefers-reduced-motion.',
    },
    sources,
    proposed_next_steps,
    links: {
      architecture: 'docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md',
      living_pulse_spec: 'docs/Z-LIVING-PULSE.md',
    },
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Soundscape Posture (Z-ACG)',
    '',
    `- Generated: ${generatedAt}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Vitality: ${vitality}/100`,
    `- Posture: ${organism_posture}`,
    `- Acoustic mode: ${acoustic_mode}`,
    `- Soundscape tier: ${soundscape_tier}`,
    '',
    '## Next steps',
    ...payload.proposed_next_steps.map((s) => `- ${s}`),
    '',
    'JSON: data/reports/z_soundscape_posture.json',
    '',
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(`Z-Soundscape posture written: ${OUT_JSON}`);
}

main();
