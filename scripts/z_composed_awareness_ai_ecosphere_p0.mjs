#!/usr/bin/env node
/**
 * AI Ecosphere P0 typed read projection. Writes only the authorized report.
 * Does not run ledger refresh. Does not invoke models.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OUTPUT_PATH, SOURCE_PATHS } from './z_composed_awareness_ai_ecosphere/constants.mjs';
import { projectAiEcosphereP0 } from './z_composed_awareness_ai_ecosphere/projection.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfigured,
  repoRel,
  stableStringify,
} from './z_composed_awareness_ai_ecosphere/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function runAiEcosphereP0(root = ROOT) {
  const loaded = loadConfigured(root, SOURCE_PATHS);
  if (loaded.errors.length) {
    return { ok: false, hard_stop: 'AI_ECOSPHERE_P0_REQUIRED_SOURCE_UNRESOLVED', errors: loaded.errors };
  }
  const frozen = {
    config: { ...loaded.config, data: deepFreeze(deepClone(loaded.config.data)) },
    ledger: { ...loaded.ledger, data: deepFreeze(deepClone(loaded.ledger.data)) },
    status: { ...loaded.status, data: deepFreeze(deepClone(loaded.status.data)) },
  };
  const projection = projectAiEcosphereP0(frozen);
  if (projection.hard_stop) return { ok: false, hard_stop: projection };
  return { ok: true, projection, loaded };
}

function main() {
  const result = runAiEcosphereP0();
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  const outAbs = repoRel(ROOT, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, stableStringify(result.projection), 'utf8');
  const s = result.projection.summary;
  console.log(`
Z COMPOSED AWARENESS
AI ECOSPHERE P0

SOURCES: 3
ECOSPHERE RINGS: ${s.ecosphere_ring_count}
TOWER AGENTS: ${s.tower_agent_count}
MINIBOTS: ${s.minibot_count}
LEDGER ENTRIES: ${s.ledger_entry_count}
VERIFIED ACTIVE RUNTIMES: ${s.verified_active_runtime_count}
UNVERIFIED RUNTIME RECORDS: ${s.unverified_runtime_evidence_count}
VERIFIED PROJECT ASSOCIATIONS: ${s.verified_project_association_count}
CONFLICTS: ${s.conflict_count}
UNMATCHED: ${s.unmatched_record_count}

wrote ${OUTPUT_PATH}
`);
}

const isDirect =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
