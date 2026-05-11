#!/usr/bin/env node
/**
 * z-mini-bot-adaptive — merge predictions + alerts into ranked advisory list.
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const PRED = path.join(ROOT, 'data', 'reports', 'z_bot_predictions.json');
const ALT = path.join(ROOT, 'data', 'reports', 'z_bot_alerts.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_adaptive.json');

const pred = readJson(PRED);
const alerts = readJson(ALT);
const ranked = [];

const riskScore = { high: 90, medium: 60, low: 30 };
for (const p of pred?.predictions || []) {
  const r = String(p.risk || 'low').toLowerCase();
  ranked.push({
    topic: `decision:${p.decision_id}`,
    score: riskScore[r] ?? 20,
    reason: `prediction_risk_${r}`,
    detail: p
  });
}

if ((alerts?.total_alerts || 0) > 0) {
  ranked.push({
    topic: 'alerts:rollup',
    score: 55,
    reason: 'open_alerts',
    detail: { overall: alerts.overall, total: alerts.total_alerts }
  });
}

ranked.sort((a, b) => b.score - a.score);

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-adaptive',
  advisory: true,
  drp_note:
    'Suggested priority is advisory only. Does not change decision.priority in this report; context.adaptive on decisions is merged for dashboard/Zuno.',
  ranked
};

writeJson(OUT, payload);
console.log(`✅ Adaptive bot: ${OUT} (${ranked.length} ranked row(s))`);
