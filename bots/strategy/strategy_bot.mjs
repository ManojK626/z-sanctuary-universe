#!/usr/bin/env node
/**
 * z-mini-bot-strategy — synthesize advisory strategies from upstream mini-bot JSON (no execution).
 */
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const DEC = path.join(ROOT, 'data', 'reports', 'z_bot_decisions.json');
const PAT = path.join(ROOT, 'data', 'reports', 'z_bot_patterns.json');
const RC = path.join(ROOT, 'data', 'reports', 'z_bot_rootcause.json');
const PR = path.join(ROOT, 'data', 'reports', 'z_bot_predictions.json');
const AD = path.join(ROOT, 'data', 'reports', 'z_bot_adaptive.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_strategy.json');

const decisions = readJson(DEC);
const patterns = readJson(PAT);
const rootcause = readJson(RC);
const predictions = readJson(PR);
const adaptive = readJson(AD);

const strategies = [];
const dlist = decisions?.decisions || [];
const pending = dlist.filter((d) => String(d.status) === 'pending');
const patternsList = patterns?.patterns || [];
const highPattern = patternsList.find((p) => p.pattern_severity === 'HIGH');

if (pending.length > 0 || highPattern) {
  strategies.push({
    type: 'stabilize_registry',
    priority: highPattern ? 'HIGH' : 'MEDIUM',
    steps: [
      'Verify data/z_pc_root_projects.json paths against PC root folders',
      'Run npm run bot:guardian after edits',
      'Prefer small reversible renames; avoid duplicate near-names (Copilot vs Copitol)'
    ]
  });
}

if ((patternsList.length > 0 && patternsList.some((p) => p.reopen_count >= 2)) || highPattern) {
  strategies.push({
    type: 'prevention',
    priority: 'MEDIUM',
    steps: [
      'Add a human checklist before registry updates',
      'Consider npm run bot:awareness:plus in CI or weekly operator ritual'
    ]
  });
}

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-strategy',
  advisory: true,
  drp_note: 'Strategy proposals only. No execution. Human/Overseer authority required for any change.',
  input_sources: {
    decisions_present: dlist.length > 0,
    patterns_present: patternsList.length > 0,
    rootcause_present: Boolean(rootcause?.results?.length),
    predictions_present: Boolean(predictions?.predictions?.length),
    adaptive_present: Boolean(adaptive?.ranked?.length)
  },
  strategy_count: strategies.length,
  top_priority: strategies[0]?.type || null,
  strategies
};

writeJson(OUT, payload);
console.log(`✅ Strategy bot: ${OUT} (${strategies.length} strateg(ies))`);
