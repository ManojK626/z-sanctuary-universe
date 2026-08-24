import fs from 'node:fs';
import path from 'node:path';
import { projectWorldP0 } from '../z_composed_awareness_read_model/project_world_projection.mjs';
import {
  deepClone as pwClone,
  deepFreeze as pwFreeze,
  loadConfiguredSources,
} from '../z_composed_awareness_read_model/source_loader.mjs';
import { SOURCE_PATHS as PW_SOURCE_PATHS } from '../z_composed_awareness_read_model/constants.mjs';
import { projectCrystalDnaP0 } from '../z_composed_awareness_crystal_dna/crystal_dna_projection.mjs';
import {
  deepClone as dnaClone,
  deepFreeze as dnaFreeze,
  loadConfigured as loadDnaSources,
} from '../z_composed_awareness_crystal_dna/source_loader.mjs';
import { SOURCE_PATHS as DNA_SOURCE_PATHS } from '../z_composed_awareness_crystal_dna/constants.mjs';
import { canonicalJsonSha, sha256Bytes, stableStringify } from './canonical_json.mjs';
import {
  DNA_REPORT,
  EXPECTED_DNA_PROJECTION,
  EXPECTED_PW_PROJECTION,
  PW_REPORT,
} from './constants.mjs';

function repoRel(root, rel) {
  return path.join(root, rel.split('/').join(path.sep));
}

export function acquireChildProjections(root) {
  const pwLoaded = loadConfiguredSources(root, PW_SOURCE_PATHS);
  if (pwLoaded.errors.length) {
    return { ok: false, hard_stop: 'COMPOSITION_PROJECT_WORLD_INPUT_INVALID', errors: pwLoaded.errors };
  }
  const pwFrozen = {
    pc: { ...pwLoaded.pc, data: pwFreeze(pwClone(pwLoaded.pc.data)) },
    identity: { ...pwLoaded.identity, data: pwLoaded.identity.data },
    eco: { ...pwLoaded.eco, data: pwFreeze(pwClone(pwLoaded.eco.data)) },
  };
  const projectWorld = projectWorldP0(root, pwFrozen);
  if (projectWorld.hard_stop) {
    return { ok: false, hard_stop: 'COMPOSITION_PROJECT_WORLD_INPUT_INVALID', child: projectWorld };
  }

  const dnaLoaded = loadDnaSources(root, DNA_SOURCE_PATHS);
  if (dnaLoaded.errors.length) {
    return { ok: false, hard_stop: 'COMPOSITION_CRYSTAL_DNA_INPUT_INVALID', errors: dnaLoaded.errors };
  }
  const dnaFrozen = {
    manifest: { ...dnaLoaded.manifest, data: dnaFreeze(dnaClone(dnaLoaded.manifest.data)) },
    drift: { ...dnaLoaded.drift, data: dnaFreeze(dnaClone(dnaLoaded.drift.data)) },
    pc_root: { ...dnaLoaded.pc_root, data: dnaFreeze(dnaClone(dnaLoaded.pc_root.data)) },
  };
  const crystalDna = projectCrystalDnaP0(dnaFrozen);
  if (crystalDna.hard_stop) {
    return { ok: false, hard_stop: 'COMPOSITION_CRYSTAL_DNA_INPUT_INVALID', child: crystalDna };
  }

  if (projectWorld.projection_id !== EXPECTED_PW_PROJECTION) {
    return { ok: false, hard_stop: 'COMPOSITION_PROJECT_WORLD_INPUT_INVALID' };
  }
  if (crystalDna.projection_id !== EXPECTED_DNA_PROJECTION) {
    return { ok: false, hard_stop: 'COMPOSITION_CRYSTAL_DNA_INPUT_INVALID' };
  }

  const pwReportBuf = fs.readFileSync(repoRel(root, PW_REPORT));
  const dnaReportBuf = fs.readFileSync(repoRel(root, DNA_REPORT));
  const pwTracked = JSON.parse(pwReportBuf.toString('utf8'));
  const dnaTracked = JSON.parse(dnaReportBuf.toString('utf8'));
  if (stableStringify(pwTracked) !== stableStringify(projectWorld)) {
    return { ok: false, hard_stop: 'COMPOSITION_PROJECT_WORLD_REPORT_DIVERGENCE' };
  }
  if (stableStringify(dnaTracked) !== stableStringify(crystalDna)) {
    return { ok: false, hard_stop: 'COMPOSITION_CRYSTAL_DNA_REPORT_DIVERGENCE' };
  }

  const inputMeta = {
    project_world: {
      strategy: 'PURE_BUILDER',
      projection_id: projectWorld.projection_id,
      schema_version: projectWorld.schema_version,
      implementation_version: projectWorld.implementation_version,
      tracked_report: PW_REPORT,
      tracked_report_sha256: sha256Bytes(pwReportBuf),
      canonical_json_sha256: canonicalJsonSha(projectWorld),
      note: 'TRACKED CHILD REPORT = DERIVED EVIDENCE, not system of record',
    },
    crystal_dna: {
      strategy: 'PURE_BUILDER',
      projection_id: crystalDna.projection_id,
      schema_version: crystalDna.schema_version,
      implementation_version: crystalDna.implementation_version,
      tracked_report: DNA_REPORT,
      tracked_report_sha256: sha256Bytes(dnaReportBuf),
      canonical_json_sha256: canonicalJsonSha(crystalDna),
      source_custody: 'CLEAN',
      note: 'TRACKED CHILD REPORT = DERIVED EVIDENCE, not system of record',
    },
  };

  return { ok: true, projectWorld, crystalDna, inputMeta, pwReportBuf, dnaReportBuf };
}
