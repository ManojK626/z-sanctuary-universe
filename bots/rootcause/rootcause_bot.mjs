#!/usr/bin/env node
/**
 * z-mini-bot-rootcause — heuristic hints from patterns + guardian (advisory).
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const PAT = path.join(ROOT, 'data', 'reports', 'z_bot_patterns.json');
const GUARD = path.join(ROOT, 'data', 'reports', 'z_bot_guardian.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_rootcause.json');

const patterns = readJson(PAT);
const guardian = readJson(GUARD);
const plist = Array.isArray(patterns?.patterns) ? patterns.patterns : [];
const results = [];

for (const p of plist) {
  if (p.id === 'investigate_missing_project') {
    const missing = guardian?.summary?.missing ?? 0;
    results.push({
      decision_id: p.id,
      cause: 'registry_path_or_folder_rename_drift',
      confidence: p.pattern_severity === 'HIGH' ? 'high' : p.pattern_severity === 'MEDIUM' ? 'medium' : 'low',
      note:
        missing > 0
          ? 'Guardian still reports missing paths; check typos vs disk folder names.'
          : 'Historical repeats suggest naming or registry maintenance habit.',
      evidence: { missing_count: missing, reopen_count: p.reopen_count, total_events: p.total_events }
    });
  }
}

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-rootcause',
  advisory: true,
  drp_note:
    'Heuristic hints from patterns + guardian. Not a root-cause oracle. No auto-fix. Human/Overseer authority.',
  results,
  note:
    results.length === 0
      ? 'Run npm run bot:pattern after history exists, then bot:rootcause.'
      : undefined
};

writeJson(OUT, payload);
console.log(`✅ Root-cause bot: ${OUT} (${results.length} hint(s))`);
