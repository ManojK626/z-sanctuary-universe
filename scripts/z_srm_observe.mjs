#!/usr/bin/env node
/**
 * Z-SRM-OBSERVE-1 — Read-only shared-roots observer.
 * READ → ANALYZE → REPORT → EXIT
 * Writes only data/reports/z_srm_observe_status.{json,md}.
 * Never extracts, canonicalises, mutates projects, Atlas, SEIF, Crystal DNA,
 * identity registries, dashboards, legal workstation, PID/CLDO, or Z-VUE.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const REGISTRY = path.join(ROOT, 'data', 'z_shared_roots_registry.json');
const SCHEMA = path.join(ROOT, 'schemas', 'z_shared_roots_registry.schema.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_srm_observe_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_srm_observe_status.md');
const REPORT_SCHEMA = 'z_srm_observe_status_v1';

const INPUTS = [
  { id: 'atlas_registry', rel: 'data/z_atlas/z_atlas_registry_v0_5.json', kind: 'json' },
  { id: 'atlas_constitution', rel: 'docs/z_atlas/Z_ATLAS_CONSTITUTION.md', kind: 'file' },
  { id: 'seif_constitution', rel: 'docs/z_seif/Z_SEIF_CONSTITUTION.md', kind: 'file' },
  { id: 'seif_capability_atlas', rel: 'docs/z_seif/Z_SEIF_PLATFORM_CAPABILITY_ATLAS.md', kind: 'file' },
  { id: 'seif_capability_reconciliation', rel: 'docs/z_seif/Z_SEIF_EXISTING_CAPABILITY_RECONCILIATION.md', kind: 'file' },
  { id: 'crystal_manifest', rel: 'data/z_crystal_dna_asset_manifest.json', kind: 'json' },
  { id: 'crystal_drift_report', rel: 'data/reports/z_crystal_dna_drift_report.json', kind: 'json_optional' },
  { id: 'pc_root_projects', rel: 'data/z_pc_root_projects.json', kind: 'json' },
  { id: 'module_manifest', rel: 'data/z_module_manifest.json', kind: 'json' },
  { id: 'legal_ops_registry', rel: 'data/z_legal_ops_registry.json', kind: 'json' },
  { id: 'zsx_capability_index', rel: 'data/z_cross_project_capability_index.json', kind: 'json' },
  { id: 'otf_overlap_matrix', rel: 'docs/z_otf/Z_OTF_REUSE_AND_OVERLAP_MATRIX.md', kind: 'file' },
  { id: 'duplicates_audit', rel: 'docs/root-discovery-audit/DUPLICATES_AND_OVERLAPS.md', kind: 'file' },
  { id: 'eirmind_alignment', rel: 'docs/root-discovery-audit/EIRMIND_ALIGNMENT_DECISION.md', kind: 'file' },
  { id: 'traffic_minibots', rel: 'docs/Z_TRAFFIC_MINIBOTS.md', kind: 'file' },
  { id: 'universe_project_registry', rel: 'data/z_universe_project_registry.json', kind: 'json_optional' },
  { id: 'pid_identity_contract', rel: 'docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md', kind: 'file_optional' },
  { id: 'pid_cldo_lineage', rel: 'docs/Z_PID_1B_LOGICAL_ASSET_LINEAGE.md', kind: 'file_optional' },
  { id: 'rns_foundation_doc', rel: 'docs/Z_RNS_FOUNDATION.md', kind: 'file_optional' },
  { id: 'casegraph_doc', rel: 'docs/Z_JUSTICE_CASEGRAPH.md', kind: 'file_optional' },
];

function relAbs(rel) {
  return path.join(ROOT, ...String(rel || '').replace(/\\/g, '/').split('/').filter(Boolean));
}

function existsRel(rel) {
  try {
    return fs.existsSync(relAbs(rel));
  } catch {
    return false;
  }
}

function readJsonSafe(abs) {
  try {
    return { ok: true, path: abs, data: JSON.parse(fs.readFileSync(abs, 'utf8')) };
  } catch (e) {
    return { ok: false, path: abs, error: String(e?.message || e) };
  }
}

function validateSchema(schema, data, pointer = '') {
  const errors = [];
  const loc = pointer || '/';
  if (!schema || typeof schema !== 'object') return errors;
  if (schema.type === 'object') {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`${loc} must be object`);
      return errors;
    }
    const props = schema.properties || {};
    for (const key of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        errors.push(`${loc} missing required property ${key}`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(data)) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
          errors.push(`${loc} additional property not allowed: ${key}`);
        }
      }
    }
    for (const [key, sub] of Object.entries(props)) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      errors.push(...validateSchema(sub, data[key], `${pointer}/${key}`));
    }
    return errors;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`${loc} must be array`);
      return errors;
    }
    if (schema.items) {
      data.forEach((item, i) => {
        errors.push(...validateSchema(schema.items, item, `${pointer}/${i}`));
      });
    }
    return errors;
  }
  if (schema.type === 'string') {
    if (typeof data !== 'string') {
      errors.push(`${loc} must be string`);
      return errors;
    }
    if (schema.minLength != null && data.length < schema.minLength) {
      errors.push(`${loc} shorter than minLength ${schema.minLength}`);
    }
    if (schema.maxLength != null && data.length > schema.maxLength) {
      errors.push(`${loc} longer than maxLength ${schema.maxLength}`);
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`${loc} not in enum`);
    }
    return errors;
  }
  if (schema.type === 'boolean') {
    if (typeof data !== 'boolean') errors.push(`${loc} must be boolean`);
    return errors;
  }
  return errors;
}

function probeInputs() {
  return INPUTS.map((spec) => {
    const abs = relAbs(spec.rel);
    const present = existsRel(spec.rel);
    const optional = /optional$/.test(spec.kind);
    const row = {
      id: spec.id,
      rel: spec.rel,
      present,
      availability: present ? 'AVAILABLE' : optional ? 'SOURCE_NOT_AVAILABLE' : 'SOURCE_NOT_AVAILABLE',
    };
    if (spec.kind.startsWith('json') && present) {
      const r = readJsonSafe(abs);
      row.json_ok = r.ok;
      if (!r.ok) {
        row.availability = 'UNKNOWN';
        row.error = r.error;
      }
    }
    if (!present && !optional) row.required_missing = true;
    return row;
  });
}

function pcRootIds(pc) {
  const projects = pc?.projects || pc?.entries || [];
  if (!Array.isArray(projects)) return [];
  return projects.map((p) => String(p.id || '')).filter(Boolean);
}

function atlasNodeIds(atlas) {
  const nodes = atlas?.nodes;
  if (!Array.isArray(nodes)) return [];
  return nodes.map((n) => String(n.nodeId || '')).filter(Boolean);
}

function pathTokens(evidenceStr) {
  return String(evidenceStr || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((t) => /^(docs|data|scripts|dashboard|schemas)\//.test(t.replace(/\\/g, '/')));
}

function evaluateObservation(hyp, ctx) {
  const evaluated = {
    ...hyp,
    last_observed_at: ctx.generated_at,
    missing_evidence_paths: [],
    distinction_reminder:
      'DUPLICATE_BYTES ≠ DUPLICATE_PATH ≠ DUPLICATE_NAME ≠ SIMILAR_STRUCTURE ≠ COMMON_LINEAGE ≠ SEMANTIC_SIMILARITY ≠ SHARED_DOCTRINE ≠ SHARED_CONTRACT ≠ SHARED_CAPABILITY_CANDIDATE',
  };

  for (const ev of hyp.evidence || []) {
    if (ev.path && !existsRel(ev.path)) evaluated.missing_evidence_paths.push(ev.path);
  }

  if (evaluated.missing_evidence_paths.length && hyp.status === 'OBSERVED') {
    evaluated.status = 'SOURCE_NOT_AVAILABLE';
    evaluated.confidence_basis = 'INSUFFICIENT_EVIDENCE';
    evaluated.human_review = true;
  }

  if (hyp.capability_id === 'srm.project-identity-consumption') {
    const hasEir = ctx.pcIds.includes('eirmind-ireland-projects-missing');
    const hasAisling = ctx.pcIds.includes('sister-aisling-sol');
    const atlasEir = ctx.atlasIds.includes('pointer.missing.eirmind-ireland-projects');
    const atlasAisling = ctx.atlasIds.includes('root.z-sister-aisling-sol');
    evaluated.identity_flags = {
      pc_root_eirmind_row: hasEir,
      pc_root_aisling_row: hasAisling,
      atlas_eirmind_missing_pointer: atlasEir,
      atlas_aisling_root: atlasAisling,
    };
    if (hasEir && hasAisling) {
      evaluated.status = 'IDENTITY_RECONCILIATION_REQUIRED';
      evaluated.classification = 'HUMAN_REVIEW_REQUIRED';
      evaluated.confidence_basis = 'CONFLICTING_EVIDENCE';
      evaluated.human_review = true;
    }
  }

  if (hyp.capability_id === 'srm.pid-cldo-engine') {
    evaluated.pid_cldo_canonical_status = 'NOT_ON_BASE';
    evaluated.pid_contract_present = ctx.inputById.pid_identity_contract?.present === true;
    evaluated.pid_cldo_lineage_present = ctx.inputById.pid_cldo_lineage?.present === true;
    if (evaluated.pid_contract_present || evaluated.pid_cldo_lineage_present) {
      evaluated.confidence_basis = 'CONFLICTING_EVIDENCE';
      evaluated.human_review = true;
    } else {
      evaluated.status = 'SOURCE_NOT_AVAILABLE';
      evaluated.classification = 'UNKNOWN';
      evaluated.confidence_basis = 'INSUFFICIENT_EVIDENCE';
      evaluated.human_review = true;
    }
  }

  if (hyp.capability_id === 'srm.rns-foundation') {
    evaluated.status = ctx.inputById.rns_foundation_doc?.present ? 'OBSERVED' : 'SOURCE_NOT_AVAILABLE';
    if (!ctx.inputById.rns_foundation_doc?.present) {
      evaluated.classification = 'UNKNOWN';
      evaluated.confidence_basis = 'UNKNOWN';
      evaluated.human_review = true;
    }
  }

  if (hyp.capability_id === 'srm.seif-capability-inventory') {
    const pidClaimedMissing = ctx.inputById.pid_identity_contract?.present !== true;
    const universeMissing = ctx.inputById.universe_project_registry?.present !== true;
    if (pidClaimedMissing || universeMissing) {
      evaluated.confidence_basis = 'PARTIAL_EVIDENCE';
      evaluated.human_review = true;
      evaluated.seif_citation_drift = {
        pid_contract_cited_existing_but_absent: pidClaimedMissing,
        universe_project_registry_cited_existing_but_absent: universeMissing,
      };
    }
  }

  if (hyp.capability_id === 'srm.graph-display-capability') {
    if (ctx.inputById.casegraph_doc?.present) {
      evaluated.confidence_basis = 'CONFLICTING_EVIDENCE';
      evaluated.divergence =
        'CaseGraph file present on base but CASEGRAPH gate is CLOSED for this slice — human review; do not treat as authorization.';
      evaluated.human_review = true;
    }
  }

  if (evaluated.classification === 'SHARED_CANONICAL') {
    evaluated.classification = 'HUMAN_REVIEW_REQUIRED';
    evaluated.status = 'HUMAN_REVIEW_REQUIRED';
    evaluated.confidence_basis = 'CONFLICTING_EVIDENCE';
    evaluated.human_review = true;
    evaluated.blocked_transition = 'SHARED_CANONICAL is not authorized in Z-SRM-OBSERVE-1';
  }

  return evaluated;
}

function evaluateRoles(roles) {
  return (roles || []).map((role) => {
    const paths = pathTokens(role.evidence);
    const missing = paths.filter((p) => !existsRel(p));
    const out = { ...role, missing_evidence_paths: missing };
    if (missing.length && role.existing_class === 'EXISTING_CAPABILITY') {
      out.existing_class = 'PARTIAL_EXISTING_CAPABILITY';
    }
    if (missing.length && paths.length === missing.length) {
      out.existing_class = 'NO_EXISTING_CAPABILITY';
    }
    return out;
  });
}

function overallSignal(evaluated, schemaErrors) {
  if (schemaErrors.length) return 'RED';
  const flags = evaluated.flatMap((o) => [o.status, o.confidence_basis, o.classification]);
  const needsBlue = evaluated.some(
    (o) =>
      o.human_review ||
      o.status === 'UNKNOWN' ||
      o.status === 'SOURCE_NOT_AVAILABLE' ||
      o.status === 'IDENTITY_RECONCILIATION_REQUIRED' ||
      o.status === 'HUMAN_REVIEW_REQUIRED' ||
      o.confidence_basis === 'UNKNOWN' ||
      o.confidence_basis === 'INSUFFICIENT_EVIDENCE' ||
      o.confidence_basis === 'CONFLICTING_EVIDENCE' ||
      o.classification === 'UNKNOWN'
  );
  if (needsBlue || flags.includes('UNKNOWN')) return 'BLUE';
  return 'BLUE';
}

function renderMd(report) {
  const lines = [
    '# Z-SRM observe status',
    '',
    `**Phase:** ${report.phase}`,
    `**Generated:** ${report.generated_at}`,
    `**overall_observer_signal:** ${report.overall_observer_signal}`,
    '',
    'GREEN on this report would mean observations are settled. This observer stays **BLUE** while UNKNOWN, SOURCE_NOT_AVAILABLE, identity conflict, or human review remain. A separate phase receipt may be GREEN for *implementation* only.',
    '',
    '## Law',
    '',
    report.law,
    '',
    '## Gates',
    '',
    `| Gate | State |`,
    `| --- | --- |`,
    ...Object.entries(report.gates).map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Inputs',
    '',
    `| Id | Path | Availability |`,
    `| --- | --- | --- |`,
    ...report.inputs.map((i) => `| ${i.id} | \`${i.rel}\` | ${i.availability} |`),
    '',
    '## Shared-root observations',
    '',
    `| Id | Classification | Evidence | Status | Human review |`,
    `| --- | --- | --- | --- | --- |`,
    ...report.observations.map(
      (o) =>
        `| \`${o.capability_id}\` | ${o.classification} | ${o.confidence_basis} | ${o.status} | ${o.human_review ? 'YES' : 'no'} |`
    ),
    '',
    '## MiniBot role map',
    '',
    `| Role | Existing class | Maps to |`,
    `| --- | --- | --- |`,
    ...report.role_map.map((r) => `| ${r.role} | ${r.existing_class} | ${r.maps_to.replace(/\|/g, '/')} |`),
    '',
    '## Write boundaries',
    '',
    `- Permitted this run: ${report.write_boundaries.permitted.join(', ')}`,
    `- Extraction: FORBIDDEN`,
    `- Canonicalisation: FORBIDDEN`,
    `- Project mutation: FORBIDDEN`,
    '',
    '## Distinction law',
    '',
    report.distinction_law,
    '',
  ];
  for (const o of report.observations) {
    lines.push(`### ${o.display_name}`, '');
    lines.push(`- classification: ${o.classification}`);
    lines.push(`- confidence_basis: ${o.confidence_basis}`);
    lines.push(`- status: ${o.status}`);
    lines.push(`- divergence: ${o.divergence}`);
    if (o.missing_evidence_paths?.length) {
      lines.push(`- missing_evidence_paths: ${o.missing_evidence_paths.join(', ')}`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const generated_at = new Date().toISOString();
  const schemaR = readJsonSafe(SCHEMA);
  const regR = readJsonSafe(REGISTRY);
  const schemaErrors = [];
  if (!schemaR.ok) schemaErrors.push(`schema unreadable: ${schemaR.error}`);
  if (!regR.ok) schemaErrors.push(`registry unreadable: ${regR.error}`);
  if (schemaR.ok && regR.ok) schemaErrors.push(...validateSchema(schemaR.data, regR.data));

  const inputs = probeInputs();
  const inputById = Object.fromEntries(inputs.map((i) => [i.id, i]));
  const atlas = inputById.atlas_registry?.present ? readJsonSafe(relAbs(inputById.atlas_registry.rel)) : { ok: false };
  const pc = inputById.pc_root_projects?.present ? readJsonSafe(relAbs(inputById.pc_root_projects.rel)) : { ok: false };
  const ctx = {
    generated_at,
    inputById,
    atlasIds: atlas.ok ? atlasNodeIds(atlas.data) : [],
    pcIds: pc.ok ? pcRootIds(pc.data) : [],
  };

  const hypotheses = regR.ok && Array.isArray(regR.data.observations) ? regR.data.observations : [];
  const evaluated = hypotheses.map((h) => evaluateObservation(h, ctx));
  const roles = evaluateRoles(regR.ok ? regR.data.role_map : []);

  const zVuePresent = existsRel('docs/Z_VUE.md') || existsRel('docs/z-vue/README.md');

  const report = {
    schema: REPORT_SCHEMA,
    phase: 'Z-SRM-OBSERVE-1',
    generated_at,
    overall_observer_signal: overallSignal(evaluated, schemaErrors),
    law:
      (regR.ok && regR.data.law) ||
      'Similarity is observation. Sharing requires evidence. Canonicalisation requires authority.',
    distinction_law:
      'DUPLICATE_BYTES ≠ DUPLICATE_PATH ≠ DUPLICATE_NAME ≠ SIMILAR_STRUCTURE ≠ COMMON_LINEAGE ≠ SEMANTIC_SIMILARITY ≠ SHARED_DOCTRINE ≠ SHARED_CONTRACT ≠ SHARED_CAPABILITY_CANDIDATE',
    atlas_boundary: {
      atlas: 'Maps what exists.',
      srm: 'Observes potential sharing relationships between what exists.',
      srm_redefines_atlas: false,
    },
    seif_boundary: {
      seif: 'Capability-awareness so we do not duplicate organs.',
      srm_forks_seif_ontology: false,
    },
    gates: {
      CASEGRAPH: 'CLOSED',
      RNS_FOUNDATION: 'CLOSED',
      SHARED_ROOT_EXTRACTION: 'CLOSED',
      CANONICALISATION: 'CLOSED',
      DEPLOYMENT: 'NONE',
      PID_CLDO_CANONICAL_STATUS: 'NOT_ON_BASE',
      Z_VUE_CANONICAL_STATUS: zVuePresent ? 'PRESENT_ON_BASE' : 'NOT_ON_BASE',
    },
    schema_errors: schemaErrors,
    inputs,
    observations: evaluated,
    role_map: roles,
    write_boundaries: {
      permitted: ['data/reports/z_srm_observe_status.json', 'data/reports/z_srm_observe_status.md'],
      forbidden: [
        'project files',
        'Atlas registry',
        'SEIF docs',
        'Crystal DNA',
        'pc_root / module manifests',
        'dashboards',
        'legal workstation',
        'PID/CLDO',
        'Z-VUE',
        'extract/refactor',
        'shared runtime',
      ],
    },
    forbidden_functions: {
      extract: false,
      canonicalize: false,
      mutate_projects: false,
      shared_runtime_service: false,
    },
  };

  if (report.overall_observer_signal === 'GREEN' && evaluated.some((o) => o.classification === 'UNKNOWN' || o.status === 'UNKNOWN')) {
    report.overall_observer_signal = 'BLUE';
    report.unknown_never_green = true;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, renderMd(report), 'utf8');

  const summary = `Z-SRM-OBSERVE-1 ${report.overall_observer_signal} observations=${evaluated.length} schema_errors=${schemaErrors.length}`;
  console.log(summary);
  console.log(`wrote ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`wrote ${path.relative(ROOT, OUT_MD)}`);
  if (schemaErrors.length) {
    for (const e of schemaErrors) console.error(`schema: ${e}`);
    process.exit(1);
  }
}

main();
