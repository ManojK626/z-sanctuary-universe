#!/usr/bin/env node
/**
 * Z-SANCTUARY-COMPOSED-AWARENESS-READ-MODEL-P0 — generator
 * Writes only data/reports/z_composed_awareness_project_world_p0.json
 * AUTONOMOUS AUTHORITY = NONE
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OUTPUT_PATH, SOURCE_PATHS } from './z_composed_awareness_read_model/constants.mjs';
import { projectWorldP0 } from './z_composed_awareness_read_model/project_world_projection.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfiguredSources,
  repoRel,
  stableStringify,
} from './z_composed_awareness_read_model/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function runProjection(root = ROOT) {
  const loaded = loadConfiguredSources(root, SOURCE_PATHS);
  if (loaded.errors.length) {
    return { ok: false, errors: loaded.errors };
  }
  const frozen = {
    pc: { ...loaded.pc, data: deepFreeze(deepClone(loaded.pc.data)) },
    identity: { ...loaded.identity, data: loaded.identity.data },
    eco: { ...loaded.eco, data: deepFreeze(deepClone(loaded.eco.data)) },
  };
  const projection = projectWorldP0(root, frozen);
  if (projection.hard_stop) {
    return { ok: false, hard_stop: projection };
  }
  return { ok: true, projection, loaded };
}

function main() {
  const result = runProjection();
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  const outAbs = repoRel(ROOT, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, stableStringify(result.projection), 'utf8');
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`projects ${result.projection.summary.project_count}`);
}

const isDirect =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
