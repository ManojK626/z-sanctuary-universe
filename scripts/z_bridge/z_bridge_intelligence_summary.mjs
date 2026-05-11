#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const USERS_PATH = path.join(ROOT, 'data', 'z_bridge', 'users.json');
const LOGS_PATH = path.join(ROOT, 'data', 'z_bridge', 'logs.json');
const OUT_PATH = path.join(ROOT, 'data', 'reports', 'z_bridge_intelligence_summary.json');

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function avg(values) {
  if (!values.length) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

const usersDoc = readJson(USERS_PATH, { users: [] });
const logsDoc = readJson(LOGS_PATH, { events: [] });

const users = Array.isArray(usersDoc.users) ? usersDoc.users : [];
const events = Array.isArray(logsDoc.events) ? logsDoc.events : [];

const intelligenceEvents = events.filter(
  (e) =>
    e?.action === 'z_bridge_request' &&
    (e?.detail === 'allocation_success' || e?.detail === 'reduced_fairness' || e?.detail === 'blocked_fairness')
);

const priorityScores = intelligenceEvents
  .map((e) => Number(e?.meta?.priority_score))
  .filter((n) => Number.isFinite(n));

const payload = {
  generated_at: new Date().toISOString(),
  users_total: users.length,
  users_flagged: users.filter((u) => u?.flagged).length,
  users_heavy_daily: users.filter((u) => Number(u?.daily_allocated || 0) > 10).length,
  intelligence_events_total: intelligenceEvents.length,
  allocations_success: intelligenceEvents.filter((e) => e?.detail === 'allocation_success').length,
  allocations_reduced: intelligenceEvents.filter((e) => e?.detail === 'reduced_fairness').length,
  allocations_blocked: intelligenceEvents.filter((e) => e?.detail === 'blocked_fairness').length,
  priority_score_avg: avg(priorityScores),
  priority_score_min: priorityScores.length ? Math.min(...priorityScores) : null,
  priority_score_max: priorityScores.length ? Math.max(...priorityScores) : null,
  last_event_at: intelligenceEvents.length ? intelligenceEvents[intelligenceEvents.length - 1].ts : null,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`[z_bridge_intelligence_summary] wrote ${OUT_PATH}`);
