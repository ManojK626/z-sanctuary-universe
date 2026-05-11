#!/usr/bin/env node
/**
 * z-mini-bot-execution-plans — advisory steps from open decisions (no shell execution).
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const DEC = path.join(ROOT, 'data', 'reports', 'z_bot_decisions.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_execution_plans.json');

const decisions = readJson(DEC);
const dlist = Array.isArray(decisions?.decisions) ? decisions.decisions : [];
const plans = [];

for (const d of dlist) {
  if (d.id === 'investigate_missing_project') {
    plans.push({
      decision_id: d.id,
      mode: 'preview',
      steps: [
        { order: 1, action: 'read_guardian_report', detail: 'Confirm missing paths vs disk' },
        { order: 2, action: 'compare_similar_folder_names', detail: 'Hints only — human confirms rename or registry fix' },
        { order: 3, action: 'human_registry_edit', detail: 'Update data/z_pc_root_projects.json or restore folder' }
      ]
    });
  }
}

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-execution-plans',
  advisory: true,
  drp_note:
    'Plans only. No auto-exec. Phase 5 never writes registry or moves folders without human confirmation; executor preview is read-only.',
  plans,
  note: plans.length === 0 ? 'Run npm run bot:decision first.' : undefined
};

writeJson(OUT, payload);
console.log(`✅ Execution planner: ${OUT} (${plans.length} plan(s))`);
