#!/usr/bin/env node
/**
 * Compose Project World P0 + Crystal DNA P0. Writes only the composed report.
 * Does not write child reports. Does not run drift producer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { composeProjectWorldAndDna } from './z_composed_awareness_project_dna/composition.mjs';
import { acquireChildProjections } from './z_composed_awareness_project_dna/input_adapter.mjs';
import { deepClone, deepFreeze, stableStringify } from './z_composed_awareness_project_dna/canonical_json.mjs';
import { OUTPUT_PATH } from './z_composed_awareness_project_dna/constants.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function runComposition(root = ROOT) {
  const acq = acquireChildProjections(root);
  if (!acq.ok) return acq;
  const snapPw = deepClone(acq.projectWorld);
  const snapDna = deepClone(acq.crystalDna);
  const frozenPw = deepFreeze(deepClone(acq.projectWorld));
  const frozenDna = deepFreeze(deepClone(acq.crystalDna));
  const composed = composeProjectWorldAndDna(frozenPw, frozenDna, acq.inputMeta);
  if (composed.hard_stop) return { ok: false, hard_stop: composed };
  return { ok: true, composed, snapPw, snapDna, acq };
}

function main() {
  const result = runComposition();
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
PROJECT WORLD + CRYSTAL DNA P0

INPUT STRATEGY
PROJECT WORLD: PURE_BUILDER
CRYSTAL DNA: PURE_BUILDER

PROJECTS: ${s.project_count}
DNA SHARDS: ${s.dna_shard_count}
DNA DEPENDENCIES: ${s.dna_dependency_count}
DNA DRIFT FINDINGS: ${s.dna_drift_finding_count}
PROJECT-DNA COVERAGE ROWS: ${s.coverage_row_count}
VERIFIED SHARD LINKS: ${s.verified_project_dna_link_count}
PROJECTS WITH VERIFIED DNA: ${s.projects_with_dna_count}
PROJECTS MISSING DNA: ${s.projects_missing_dna_count}
DNA SHARDS WITHOUT PROJECT JOIN: ${s.dna_assets_without_project_join_count}
CROSS-LENS CONFLICTS: ${s.cross_lens_conflict_count}

wrote ${OUTPUT_PATH}
`);
}

const isDirect =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
