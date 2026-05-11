#!/usr/bin/env node
/**
 * z-mini-bot-decision — guidance from guardian + alerts; merges lifecycle from JSONL history.
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, readJsonl, writeJson } from '../_lib/io.mjs';
import {
  DECISION_IDS,
  eventsForDecision,
  historyPath,
  statusFromHistory
} from '../_lib/decision_history.mjs';

const ROOT = hubRoot(import.meta.url);
const GUARD = path.join(ROOT, 'data', 'reports', 'z_bot_guardian.json');
const HEALTH = path.join(ROOT, 'data', 'reports', 'z_bot_health.json');
const ALERTS = path.join(ROOT, 'data', 'reports', 'z_bot_alerts.json');
const PATTERNS = path.join(ROOT, 'data', 'reports', 'z_bot_patterns.json');
const ROOTCAUSE = path.join(ROOT, 'data', 'reports', 'z_bot_rootcause.json');
const PREDICT = path.join(ROOT, 'data', 'reports', 'z_bot_predictions.json');
const ADAPTIVE = path.join(ROOT, 'data', 'reports', 'z_bot_adaptive.json');
const EXEC = path.join(ROOT, 'data', 'reports', 'z_bot_execution_plans.json');
const STRAT = path.join(ROOT, 'data', 'reports', 'z_bot_strategy.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_decisions.json');
const LOG = historyPath(import.meta.url);

const guardian = readJson(GUARD);
const health = readJson(HEALTH);
const alerts = readJson(ALERTS);
const patterns = readJson(PATTERNS);
const rootcause = readJson(ROOTCAUSE);
const predictions = readJson(PREDICT);
const adaptive = readJson(ADAPTIVE);
const executionPlans = readJson(EXEC);
const strategy = readJson(STRAT);

const history = readJsonl(LOG);
const missingRows = (guardian?.results || []).filter((r) => r.status === 'missing');

const decisions = [];
if (missingRows.length > 0) {
  const id = DECISION_IDS.investigateMissing;
  const ev = eventsForDecision(history, id);
  const status = statusFromHistory(ev, { stillMissing: true });
  const similar = [];
  for (const r of missingRows) {
    if (Array.isArray(r.similar_names)) similar.push(...r.similar_names);
  }
  decisions.push({
    id,
    title: 'One or more registered project paths are missing on disk',
    priority: 'HIGH',
    status,
    updated_at: new Date().toISOString(),
    context: {
      missing_projects: missingRows.map((r) => ({
        id: r.id,
        name: r.name,
        path_relative: r.path_relative,
        absolute: r.absolute
      })),
      similar_names: [...new Set(similar)].slice(0, 8)
    }
  });
}

const payload = {
  schema_version: 2,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-decision',
  advisory: true,
  drp_note:
    'Guidance only. Does not run shell, move files, or change registry. Use bot:decision:act or decision:bridge to update lifecycle. Human/Overseer authority for all actions.',
  input_sources: {
    guardian_present: Boolean(guardian),
    health_present: Boolean(health),
    alerts_present: Boolean(alerts),
    patterns_report_present: Boolean(patterns),
    rootcause_report_present: Boolean(rootcause),
    predictions_report_present: Boolean(predictions),
    adaptive_report_present: Boolean(adaptive),
    execution_plans_present: Boolean(executionPlans),
    strategy_report_present: Boolean(strategy)
  },
  total_decisions: decisions.length,
  decisions
};

writeJson(OUT, payload);
console.log(`✅ Decision bot: ${OUT} (${decisions.length} decision(s))`);
