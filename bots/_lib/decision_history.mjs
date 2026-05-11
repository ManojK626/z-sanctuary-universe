import path from 'node:path';
import { hubRoot } from './hub_root.mjs';

export const DECISION_IDS = {
  investigateMissing: 'investigate_missing_project'
};

export function normalizeAction(raw) {
  const a = String(raw || '')
    .trim()
    .toLowerCase();
  if (a === 'ack' || a === 'acknowledged') return 'ack';
  if (a === 'resolve' || a === 'resolved') return 'resolve';
  if (a === 'dismiss' || a === 'dismissed') return 'dismiss';
  if (a === 'reopened' || a === 'reopen') return 'reopened';
  return '';
}

export function historyPath(importMetaUrl) {
  const ROOT = hubRoot(importMetaUrl);
  return path.join(ROOT, 'data', 'logs', 'z_decision_history.jsonl');
}

export function eventsForDecision(entries, decisionId) {
  return entries
    .filter((e) => e && String(e.decision_id) === decisionId)
    .sort((a, b) => String(a.ts || '').localeCompare(String(b.ts || '')));
}

/**
 * Current lifecycle status for Zuno (`pending` | `acknowledged` | `resolved` | `dismissed`).
 * When paths are still missing but last mark was `resolve`, surface as `pending` again.
 */
export function statusFromHistory(events, { stillMissing } = {}) {
  let status = 'pending';
  for (const e of events) {
    const a = normalizeAction(e.action);
    if (!a) continue;
    if (a === 'ack') status = 'acknowledged';
    if (a === 'resolve') status = 'resolved';
    if (a === 'dismiss') status = 'dismissed';
    if (a === 'reopened') status = 'pending';
  }
  if (stillMissing && status === 'resolved') return 'pending';
  return status;
}
