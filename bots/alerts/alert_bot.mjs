#!/usr/bin/env node
/**
 * z-mini-bot-alerts — notify-only rollup from guardian + health.
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const GUARD = path.join(ROOT, 'data', 'reports', 'z_bot_guardian.json');
const HEALTH = path.join(ROOT, 'data', 'reports', 'z_bot_health.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_alerts.json');

const g = readJson(GUARD);
const h = readJson(HEALTH);
const alerts = [];

// PC-root drift is already authoritative in z_bot_guardian.json (summary + results).
// Emitting the same signal here produced duplicate red rails ("GUARDIAN" + "ALERTS") for one issue.
const foldedRegistryPathsAlert =
  g?.summary?.missing > 0
    ? {
        level: 'HIGH',
        source: 'guardian',
        code: 'registry_paths_missing',
        message: `${g.summary.missing} registered project path(s) missing on disk under pc_root.`,
        detail: { missing: g.summary.missing, highest_severity: g.summary?.highest_severity }
      }
    : null;

const memPct = Number(h?.memory?.used_pct);
if (Number.isFinite(memPct) && memPct >= 92) {
  alerts.push({
    level: 'MEDIUM',
    source: 'health',
    code: 'memory_pressure',
    message: `Host memory used ~${memPct}%.`,
    detail: { used_pct: memPct }
  });
}

const by = { HIGH: 0, MEDIUM: 0 };
for (const a of alerts) {
  if (a.level === 'HIGH') by.HIGH += 1;
  if (a.level === 'MEDIUM') by.MEDIUM += 1;
}

const overall = by.HIGH > 0 ? 'attention' : by.MEDIUM > 0 ? 'watch' : 'clear';

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-alerts',
  advisory: true,
  drp_note: 'Notify-only. No auto-fix. Human/Overseer authority for structural changes.',
  overall,
  total_alerts: alerts.length,
  by_level: by,
  sources: {
    guardian: Boolean(g),
    health: Boolean(h)
  },
  input_notes: foldedRegistryPathsAlert
    ? [
        'registry_paths_missing folded into z_bot_guardian.json; see guardian.summary / results and folded_registry_paths_alert.'
      ]
    : null,
  folded_registry_paths_alert: foldedRegistryPathsAlert,
  alerts
};

writeJson(OUT, payload);
console.log(`✅ Alerts bot: ${OUT} (${alerts.length} alert(s), overall ${overall})`);
