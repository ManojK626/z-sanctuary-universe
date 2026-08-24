/** P0 composed awareness — sealed paths and versions. No runtime source scan. */
export const IMPLEMENTATION_VERSION = 'z-composed-awareness-read-model-p0-1.0.0';
export const ADAPTER_VERSION = 'p0-project-world-1';
export const SCHEMA_VERSION = 1;
export const PROJECTION_ID = 'z_composed_awareness_project_world_p0';

export const SOURCE_PATHS = {
  pc_root: 'data/z_pc_root_projects.json',
  identity_reconciliation: 'docs/PROJECT_IDENTITY_RECONCILIATION.md',
  ecosystem_awareness: 'data/z_ecosystem_awareness_registry.json',
};

export const OUTPUT_PATH = 'data/reports/z_composed_awareness_project_world_p0.json';

/** Sealed facts copied from docs/PROJECT_IDENTITY_RECONCILIATION.md — not inferred at runtime. */
export const SEALED_IDENTITY_FACTS = {
  'replit-roulette-z-amk-goku-mdcp': {
    identity_relation: 'SEPARATE_PROJECT',
    vs: ['z-sanctuary-replit'],
    note: 'External Replit hosting; related as local-mirror candidate only. CONNECTED ≠ MERGED.',
  },
  'z-sanctuary-replit': {
    identity_relation: 'SEPARATE_PROJECT',
    vs: ['replit-roulette-z-amk-goku-mdcp'],
    note: 'Local folder citizen; not the Replit hosting identity.',
  },
  'amk-goku-dashboards-2': {
    identity_relation: 'UNRESOLVED',
    vs: ['hub Main Control', 'replit-roulette-z-amk-goku-mdcp'],
    note: 'UNRESOLVED ≠ SAME_PROJECT. Steward HOLD.',
  },
  'sister-aisling-sol': {
    identity_relation: 'SUBSYSTEM',
    vs: ['eirmind nested monorepo / indicator'],
    note: 'SUBSYSTEM ≠ SEPARATE_PROJECT merge. Do not auto-merge registry rows with eirmind-ireland-projects-missing.',
  },
  'eirmind-ireland-projects-missing': {
    identity_relation: 'UNRESOLVED',
    vs: ['sister-aisling-sol'],
    note: 'Lineage candidate pending Steward; not auto-merged.',
  },
};

export const ROULETTE_PC_ROOT_ID = 'replit-roulette-z-amk-goku-mdcp';
