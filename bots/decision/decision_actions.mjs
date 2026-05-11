#!/usr/bin/env node
/**
 * Append one lifecycle row to data/logs/z_decision_history.jsonl (human / operator authority).
 *
 * Usage (from hub root):
 *   npm run bot:decision:act -- investigate_missing_project ack
 *   npm run bot:decision:act -- investigate_missing_project resolve
 * Actions: ack | resolve | dismiss | reopened
 */
import { appendJsonl } from '../_lib/io.mjs';
import { historyPath, normalizeAction } from '../_lib/decision_history.mjs';

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
  console.log(`Usage: npm run bot:decision:act -- <decision_id> <action>

Actions (aliases accepted): ack | acknowledged | resolve | resolved | dismiss | dismissed | reopened | reopen

Example:
  npm run bot:decision:act -- investigate_missing_project ack
  npm run bot:decision:act -- investigate_missing_project resolve
`);
  process.exit(0);
}

const decisionId = String(argv[0] || '').trim();
const actionRaw = String(argv[1] || '').trim();
const action = normalizeAction(actionRaw);

if (!decisionId || !action) {
  console.error('decision_actions: need <decision_id> <action>. Run with --help.');
  process.exit(1);
}

const LOG = historyPath(import.meta.url);
const entry = {
  ts: new Date().toISOString(),
  decision_id: decisionId,
  action,
  source: 'cli',
  operator: process.env.Z_OPERATOR || null
};

appendJsonl(LOG, entry);
console.log(`✅ Appended to ${LOG}: ${decisionId} → ${action}`);
