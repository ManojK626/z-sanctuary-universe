import {
  IMPLEMENTATION_VERSION as PW_IMPL,
  PROJECTION_ID as PW_ID,
  SCHEMA_VERSION as PW_SCHEMA,
} from '../z_composed_awareness_read_model/constants.mjs';
import {
  IMPLEMENTATION_VERSION as DNA_IMPL,
  PROJECTION_ID as DNA_ID,
  SCHEMA_VERSION as DNA_SCHEMA,
} from '../z_composed_awareness_crystal_dna/constants.mjs';
import {
  IMPLEMENTATION_VERSION as AI_IMPL,
  PROJECTION_ID as AI_ID,
  SCHEMA_VERSION as AI_SCHEMA,
} from '../z_composed_awareness_ai_ecosphere/constants.mjs';

export const SUPPORTED = {
  project_world: { projection_id: PW_ID, schema_version: PW_SCHEMA, implementation_version: PW_IMPL },
  crystal_dna: { projection_id: DNA_ID, schema_version: DNA_SCHEMA, implementation_version: DNA_IMPL },
  ai_ecosphere: { projection_id: AI_ID, schema_version: AI_SCHEMA, projection_version: AI_IMPL },
};

export function gateProjectWorldVersion(p) {
  if (
    !p ||
    p.projection_id !== SUPPORTED.project_world.projection_id ||
    p.schema_version !== SUPPORTED.project_world.schema_version ||
    p.implementation_version !== SUPPORTED.project_world.implementation_version
  ) {
    return { ok: false, hard_stop: 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION' };
  }
  return { ok: true };
}

export function gateCrystalDnaVersion(p) {
  if (
    !p ||
    p.projection_id !== SUPPORTED.crystal_dna.projection_id ||
    p.schema_version !== SUPPORTED.crystal_dna.schema_version ||
    p.implementation_version !== SUPPORTED.crystal_dna.implementation_version
  ) {
    return { ok: false, hard_stop: 'THREE_LENS_UNSUPPORTED_CRYSTAL_DNA_VERSION' };
  }
  return { ok: true };
}

export function gateAiEcosphereVersion(p) {
  if (
    !p ||
    p.projection_id !== SUPPORTED.ai_ecosphere.projection_id ||
    p.schema_version !== SUPPORTED.ai_ecosphere.schema_version ||
    p.projection_version !== SUPPORTED.ai_ecosphere.projection_version
  ) {
    return { ok: false, hard_stop: 'THREE_LENS_UNSUPPORTED_AI_ECOSPHERE_VERSION' };
  }
  return { ok: true };
}

export function gateChildVersions(projectWorld, crystalDna, aiEcosphere) {
  const pw = gateProjectWorldVersion(projectWorld);
  if (!pw.ok) return pw;
  const dna = gateCrystalDnaVersion(crystalDna);
  if (!dna.ok) return dna;
  const ai = gateAiEcosphereVersion(aiEcosphere);
  if (!ai.ok) return ai;
  return { ok: true };
}
