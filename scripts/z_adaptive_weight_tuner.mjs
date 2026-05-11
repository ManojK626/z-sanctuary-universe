#!/usr/bin/env node
/**
 * Z-Adaptive weight tuner (Phase 3, bounded). Reads z_learning_history.jsonl, nudges per-signal multipliers, writes
 * data/reports/z_adaptive_learning_state.json. Reversible: delete state file to reset.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOGS = path.join(ROOT, 'data', 'logs');
const LEARNING_LOG = path.join(LOGS, 'z_learning_history.jsonl');
const OUT_STATE = path.join(ROOT, 'data', 'reports', 'z_adaptive_learning_state.json');

const MAX_SHIFT = 0.1;
const W_MIN = 0.5;
const W_MAX = 1.5;

const KEYS = ['rename_instability', 'silent_drift', 'stability_convergence', 'phantom_project', 'over_control'];

function num(v, fb = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8').trim();
  if (!raw) return [];
  const out = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      /* skip */
    }
  }
  return out;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function main() {
  const defaultWeights = {
    rename_instability: 1.0,
    silent_drift: 1.0,
    stability_convergence: 1.0,
    phantom_project: 1.0,
    over_control: 1.0,
  };
  const prev = readJson(OUT_STATE) || { weights: { ...defaultWeights } };
  let weights = { ...defaultWeights, ...prev.weights };
  for (const k of KEYS) {
    if (typeof weights[k] !== 'number' || !Number.isFinite(weights[k])) weights[k] = 1.0;
  }

  const lines = readJsonl(LEARNING_LOG);
  /** @type {Record<string, { s: number; f: number; p: number }>} */
  const acc = {};
  for (const k of KEYS) acc[k] = { s: 0, f: 0, p: 0 };

  for (const row of lines) {
    const out = String(row.outcome || '').toLowerCase();
    const sigs = Array.isArray(row.spi_context?.signals) ? row.spi_context.signals : [];
    for (const sig of sigs) {
      if (!acc[sig]) continue;
      if (out === 'success') acc[sig].s += 1;
      else if (out === 'failure') acc[sig].f += 1;
      else acc[sig].p += 1;
    }
  }

  const newWeights = { ...weights };
  for (const k of KEYS) {
    const { s, f, p } = acc[k];
    const total = s + f + p;
    if (total === 0) continue;
    const rate = (s + 0.5 * p) / total;
    const nudge = clamp(0.08 * (2 * rate - 1), -MAX_SHIFT, MAX_SHIFT);
    newWeights[k] = clamp(newWeights[k] + nudge, W_MIN, W_MAX);
  }

  const cycles = lines.length > 0 ? num(prev.learning_cycles, 0) + 1 : num(prev.learning_cycles, 0);
  const payload = {
    schema_version: 1,
    advisory_only: true,
    drp_note:
      'Bounded weight multipliers (0.5–1.5). Tuner uses data/logs/z_learning_history.jsonl. Run learning:eval then learning:tune. Remove this file to reset.',
    last_updated: new Date().toISOString(),
    learning_cycles: cycles,
    weights: newWeights,
    last_aggregate: acc,
  };

  fs.writeFileSync(OUT_STATE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `Z-Adaptive weight tuner: cycles=${cycles} weights=${Object.entries(newWeights)
      .map(([a, b]) => `${a}=${b.toFixed(2)}`)
      .join(' ')} → ${OUT_STATE}`
  );
}

main();
