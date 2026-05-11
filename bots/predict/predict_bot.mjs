#!/usr/bin/env node
/**
 * z-mini-bot-predict — lightweight risk hints from patterns (advisory).
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const PAT = path.join(ROOT, 'data', 'reports', 'z_bot_patterns.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_predictions.json');

const patterns = readJson(PAT);
const plist = Array.isArray(patterns?.patterns) ? patterns.patterns : [];
const predictions = [];

for (const p of plist) {
  let risk = 'low';
  if (p.pattern_severity === 'HIGH' || p.reopen_count >= 3) risk = 'high';
  else if (p.pattern_severity === 'MEDIUM' || p.reopen_count >= 1) risk = 'medium';

  predictions.push({
    decision_id: p.id,
    risk,
    prediction: risk === 'high' ? 'likely_to_reoccur' : risk === 'medium' ? 'may_reoccur' : 'uncertain',
    basis: { total_events: p.total_events, reopen_count: p.reopen_count, pattern_severity: p.pattern_severity }
  });
}

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-predict',
  advisory: true,
  drp_note: 'Predictions do not trigger actions. Inform human prioritization only.',
  predictions,
  note: predictions.length === 0 ? 'No patterns yet — run bot:pattern after decision history exists.' : undefined
};

writeJson(OUT, payload);
console.log(`✅ Predict bot: ${OUT} (${predictions.length} prediction(s))`);
