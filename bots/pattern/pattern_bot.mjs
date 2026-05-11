#!/usr/bin/env node
/**
 * z-mini-bot-patterns — roll up decision_history.jsonl by decision_id (advisory).
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, readJsonl, writeJson } from '../_lib/io.mjs';
import { historyPath, normalizeAction } from '../_lib/decision_history.mjs';

const ROOT = hubRoot(import.meta.url);
const LOG = historyPath(import.meta.url);
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_patterns.json');
const SPI_JSON = path.join(ROOT, 'data', 'reports', 'z_structural_patterns.json');

function num(v, fb = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
}

const entries = readJsonl(LOG);
const byId = new Map();

for (const e of entries) {
  const id = e?.decision_id;
  if (!id) continue;
  if (!byId.has(id)) byId.set(id, []);
  byId.get(id).push(e);
}

const patterns = [];
for (const [id, evs] of byId) {
  const sorted = evs.sort((a, b) => String(a.ts || '').localeCompare(String(b.ts || '')));
  let reopenCount = 0;
  let lastResolved = false;
  for (const e of sorted) {
    const a = normalizeAction(e.action);
    if (!a) continue;
    if (a === 'reopened') {
      reopenCount += 1;
      lastResolved = false;
      continue;
    }
    if (a === 'ack' && lastResolved) {
      reopenCount += 1;
      lastResolved = false;
    }
    if (a === 'resolve') lastResolved = true;
    if (a === 'dismiss') lastResolved = false;
  }

  const total_events = sorted.length;
  let pattern_severity = 'LOW';
  if (reopenCount >= 4 || total_events >= 12) pattern_severity = 'HIGH';
  else if (reopenCount >= 2 || total_events >= 5) pattern_severity = 'MEDIUM';

  patterns.push({
    id,
    total_events,
    reopen_count: reopenCount,
    pattern_severity,
    last_event_at: sorted[sorted.length - 1]?.ts || null
  });
}

patterns.sort((a, b) => String(b.pattern_severity).localeCompare(String(a.pattern_severity)));

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-patterns',
  advisory: true,
  drp_note:
    'Pattern summary from local decision history. Does not run fixes or change priorities outside bot:decision (which reads this file).',
  log_file: 'data/logs/z_decision_history.jsonl',
  total_log_entries: entries.length,
  total_patterns: patterns.length,
  patterns
};

const spi = readJson(SPI_JSON);
const structuralDelta = num(spi?.inputs?.structural_delta, 0);
if (spi?.schema_version) {
  payload.spi_context = {
    structural_phase: spi.system_phase ?? null,
    evolution_phase: spi.evolution_phase ?? null,
    drift_detected: structuralDelta > 0,
    structural_patterns_score: typeof spi.structural_patterns_score === 'number' ? spi.structural_patterns_score : null,
  };
}

writeJson(OUT, payload);
console.log(`✅ Pattern bot: ${OUT} (${patterns.length} pattern(s), ${entries.length} log line(s))`);
