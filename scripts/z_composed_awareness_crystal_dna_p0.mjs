#!/usr/bin/env node
/**
 * Crystal DNA P0 shard-level read projection. Writes only the authorized report.
 * Does not run drift collection. GARE executor not present.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OUTPUT_PATH, SOURCE_PATHS } from './z_composed_awareness_crystal_dna/constants.mjs';
import { projectCrystalDnaP0 } from './z_composed_awareness_crystal_dna/crystal_dna_projection.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfigured,
  repoRel,
  stableStringify,
} from './z_composed_awareness_crystal_dna/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function runCrystalDnaP0(root = ROOT) {
  const loaded = loadConfigured(root, SOURCE_PATHS);
  if (loaded.errors.length) return { ok: false, errors: loaded.errors };
  const frozen = {
    manifest: { ...loaded.manifest, data: deepFreeze(deepClone(loaded.manifest.data)) },
    drift: { ...loaded.drift, data: deepFreeze(deepClone(loaded.drift.data)) },
    pc_root: { ...loaded.pc_root, data: deepFreeze(deepClone(loaded.pc_root.data)) },
  };
  const projection = projectCrystalDnaP0(frozen);
  if (projection.hard_stop) return { ok: false, hard_stop: projection };
  return { ok: true, projection, loaded };
}

function main() {
  const result = runCrystalDnaP0();
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  const outAbs = repoRel(ROOT, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, stableStringify(result.projection), 'utf8');
  const s = result.projection.summary;
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`shards ${s.shard_count} deps ${s.dependency_edge_count} drift ${s.drift_finding_count}`);
}

const isDirect =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
