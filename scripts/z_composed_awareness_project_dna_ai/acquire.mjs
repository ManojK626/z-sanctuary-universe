import fs from 'node:fs';
import path from 'node:path';
import { acquireChildProjections } from '../z_composed_awareness_project_dna/input_adapter.mjs';
import { canonicalJsonSha, sha256Bytes, stableStringify } from '../z_composed_awareness_project_dna/canonical_json.mjs';
import { projectAiEcosphereP0 } from '../z_composed_awareness_ai_ecosphere/projection.mjs';
import {
  deepClone as aiClone,
  deepFreeze as aiFreeze,
  loadConfigured as loadAiSources,
} from '../z_composed_awareness_ai_ecosphere/source_loader.mjs';
import { SOURCE_PATHS as AI_SOURCE_PATHS } from '../z_composed_awareness_ai_ecosphere/constants.mjs';
import { AI_REPORT } from './constants.mjs';
import { gateChildVersions } from './version_gate.mjs';

function repoRel(root, rel) {
  return path.join(root, rel.split('/').join(path.sep));
}

function mapTwoLensStop(acq) {
  if (acq.ok) return null;
  const hs = acq.hard_stop;
  if (hs === 'COMPOSITION_PROJECT_WORLD_INPUT_INVALID' || hs === 'COMPOSITION_PROJECT_WORLD_REPORT_DIVERGENCE') {
    return { ok: false, hard_stop: 'THREE_LENS_PROJECT_WORLD_INVALID', child: acq };
  }
  if (hs === 'COMPOSITION_CRYSTAL_DNA_INPUT_INVALID' || hs === 'COMPOSITION_CRYSTAL_DNA_REPORT_DIVERGENCE') {
    return { ok: false, hard_stop: 'THREE_LENS_CRYSTAL_DNA_INVALID', child: acq };
  }
  return { ok: false, hard_stop: hs, child: acq };
}

export function acquireThreeChildProjections(root) {
  const two = acquireChildProjections(root);
  const mapped = mapTwoLensStop(two);
  if (mapped) return mapped;

  const aiLoaded = loadAiSources(root, AI_SOURCE_PATHS);
  if (aiLoaded.errors.length) {
    return { ok: false, hard_stop: 'THREE_LENS_AI_ECOSPHERE_INVALID', errors: aiLoaded.errors };
  }
  const aiFrozen = {
    config: { ...aiLoaded.config, data: aiFreeze(aiClone(aiLoaded.config.data)) },
    ledger: { ...aiLoaded.ledger, data: aiFreeze(aiClone(aiLoaded.ledger.data)) },
    status: { ...aiLoaded.status, data: aiFreeze(aiClone(aiLoaded.status.data)) },
  };
  const aiEcosphere = projectAiEcosphereP0(aiFrozen);
  if (aiEcosphere.hard_stop) {
    return { ok: false, hard_stop: 'THREE_LENS_AI_ECOSPHERE_INVALID', child: aiEcosphere };
  }

  const aiReportBuf = fs.readFileSync(repoRel(root, AI_REPORT));
  const aiTracked = JSON.parse(aiReportBuf.toString('utf8'));
  if (stableStringify(aiTracked) !== stableStringify(aiEcosphere)) {
    return { ok: false, hard_stop: 'THREE_LENS_AI_ECOSPHERE_INVALID' };
  }

  const gated = gateChildVersions(two.projectWorld, two.crystalDna, aiEcosphere);
  if (!gated.ok) return gated;

  const inputMeta = {
    project_world: {
      ...two.inputMeta.project_world,
      strategy: 'PURE_BUILDER',
    },
    crystal_dna: {
      ...two.inputMeta.crystal_dna,
      strategy: 'PURE_BUILDER',
    },
    ai_ecosphere: {
      strategy: 'PURE_BUILDER',
      projection_id: aiEcosphere.projection_id,
      schema_version: aiEcosphere.schema_version,
      projection_version: aiEcosphere.projection_version,
      tracked_report: AI_REPORT,
      tracked_report_sha256: sha256Bytes(aiReportBuf),
      canonical_json_sha256: canonicalJsonSha(aiEcosphere),
      note: 'TRACKED CHILD REPORT = DERIVED EVIDENCE, not system of record',
    },
    two_lens_input: two.inputMeta,
    comparable_cross_lens_claims: [],
  };

  return {
    ok: true,
    projectWorld: two.projectWorld,
    crystalDna: two.crystalDna,
    aiEcosphere,
    inputMeta,
    twoLensAcquire: two,
  };
}
