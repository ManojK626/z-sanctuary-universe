#!/usr/bin/env node
/**
 * Three-lens P0 composition. Writes only the three-lens report.
 * Does not write child reports. Does not refresh ledger or DNA drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { acquireThreeChildProjections } from './z_composed_awareness_project_dna_ai/acquire.mjs';
import { composeProjectDnaAi } from './z_composed_awareness_project_dna_ai/composition.mjs';
import { deepClone, deepFreeze, stableStringify } from './z_composed_awareness_project_dna/canonical_json.mjs';
import { OUTPUT_PATH } from './z_composed_awareness_project_dna_ai/constants.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function runThreeLensComposition(root = ROOT) {
  const acq = acquireThreeChildProjections(root);
  if (!acq.ok) return acq;
  const snapPw = deepClone(acq.projectWorld);
  const snapDna = deepClone(acq.crystalDna);
  const snapAi = deepClone(acq.aiEcosphere);
  const frozenPw = deepFreeze(deepClone(acq.projectWorld));
  const frozenDna = deepFreeze(deepClone(acq.crystalDna));
  const frozenAi = deepFreeze(deepClone(acq.aiEcosphere));
  const composed = composeProjectDnaAi(frozenPw, frozenDna, frozenAi, acq.inputMeta);
  if (composed.hard_stop) return { ok: false, hard_stop: composed };
  return { ok: true, composed, snapPw, snapDna, snapAi, acq };
}

function main() {
  const result = runThreeLensComposition();
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  const outAbs = path.join(ROOT, OUTPUT_PATH.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, stableStringify(result.composed), 'utf8');
  const s = result.composed.summary;
  console.log(`
Z COMPOSED AWARENESS
PROJECT WORLD + CRYSTAL DNA + AI ECOSPHERE P0

PROJECT WORLD
PROJECTS                         ${s.project_count}

CRYSTAL DNA
SHARDS                           ${s.dna_shard_count}
DEPENDENCIES                     ${s.dna_dependency_count}
DRIFT FINDINGS                   ${s.dna_drift_finding_count}
PROJECT-DNA VERIFIED LINKS       ${s.project_dna_verified_link_count}

AI ECOSPHERE
RINGS                            ${s.ai_ring_count}
TOWER AGENTS                     ${s.ai_tower_agent_count}
MINIBOTS                         ${s.ai_minibot_count}
LEDGER ENTRIES                   ${s.ai_ledger_entry_count}
VERIFIED ACTIVE                  ${s.ai_verified_active_runtime_count}
AI-PROJECT ASSOCIATIONS          ${s.ai_project_verified_association_count}
AI INTERNAL CONFLICTS            ${s.ai_internal_conflict_count}
AI UNMATCHED                     ${s.ai_unmatched_record_count}

THREE-LENS
CROSS-LENS CONFLICTS             ${s.cross_lens_conflict_count}

wrote ${OUTPUT_PATH}
`);
}

const isDirect =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
