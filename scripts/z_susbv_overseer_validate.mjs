#!/usr/bin/env node
/**
 * Z-SUSBV-O1 — Benchmark Overseer (read-only).
 * Validates project capsules + hub index against registry, module map, validation JSON, entitlements.
 * No web research, APIs, pricing changes, billing, or deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG = path.join(ROOT, 'data', 'z_susbv_benchmark_registry.json');
const VAL = path.join(ROOT, 'data', 'z_susbv_service_price_validation.json');
const MOD = path.join(ROOT, 'data', 'z_susbv_module_to_service_map.json');
const INDEX = path.join(ROOT, 'data', 'z_susbv_project_benchmark_index.json');
const POLICY = path.join(ROOT, 'data', 'z_susbv_overseer_policy.json');
const GLOBAL = path.join(ROOT, 'data', 'z_susbv_global_market_comparison_registry.json');
const ENT = path.join(ROOT, 'data', 'z_service_entitlement_catalog.json');
const CROSS = path.join(ROOT, 'data', 'z_cross_project_capability_index.json');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_susbv_overseer_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_susbv_overseer_report.md');

const SCHEMA_REPORT = 'z_susbv_overseer_report_v1';

const RISKY_CLAIM_RE = /\b(best|guaranteed|certified|#\s*1|number\s*one|world[\s-]*leading|best\s+in\s+class)\b/i;
const BLUE_SEGMENTS = new Set(['school', 'children', 'partner', 'donation', 'crisis', 'health', 'legal', 'enterprise']);
const FORBIDDEN_AMOUNT_KEYS = /\b(price_usd|msrp_usd|list_price|dollar_amount|eur_gbp)\b/i;

const CAPSULE_SERVICE_FIELDS = [
  'service_id',
  'module_ids',
  'service_name',
  'segment',
  'commercial_status',
  'benchmark_required',
  'cost_floor_required',
  'public_price_allowed',
  'entitlement_status',
  'related_docs',
  'related_reports',
];

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function loadEntitlementMap() {
  const data = readJson(ENT);
  const map = new Map();
  const rows = data?.capability_entitlements;
  if (!Array.isArray(rows)) return map;
  for (const row of rows) {
    if (row && typeof row.service_id === 'string') map.set(row.service_id, row);
  }
  return map;
}

function registryMap(reg) {
  const m = new Map();
  if (!reg || !Array.isArray(reg.services)) return m;
  for (const s of reg.services) {
    if (s && typeof s.service_id === 'string') m.set(s.service_id, s);
  }
  return m;
}

function valById(val) {
  const m = new Map();
  const v = val && val.schema === 'z_susbv_service_price_validation_v1' ? val : null;
  if (v && Array.isArray(v.services)) {
    for (const row of v.services) {
      if (row && typeof row.service_id === 'string') m.set(row.service_id, row);
    }
  }
  return m;
}

function validateGlobalRegistry(glob, red, yellow) {
  if (!glob || glob.schema !== 'z_susbv_global_market_comparison_registry_v1') {
    red.push('global_registry_missing_or_wrong_schema');
    return;
  }
  const raw = JSON.stringify(glob);
  if (FORBIDDEN_AMOUNT_KEYS.test(raw)) {
    red.push('global_registry_contains_forbidden_invented_amount_key_pattern');
  }
  const groups = glob.comparison_groups;
  if (!Array.isArray(groups) || !groups.length) {
    yellow.push('global_registry_comparison_groups_empty');
    return;
  }
  for (const g of groups) {
    if (!g || typeof g.comparison_group !== 'string') {
      red.push('global_registry:comparison_group_missing');
      continue;
    }
    const need = ['job_to_be_done', 'target_segment', 'evidence_status', 'freshness', 'source_policy'];
    for (const k of need) {
      if (g[k] === undefined || g[k] === null || g[k] === '') {
        yellow.push(`global_registry:${g.comparison_group}:missing_${k}`);
      }
    }
  }
}

function checkEvidenceForPublicPrice(sid, regSvc, vRow, red) {
  if (regSvc.public_price_allowed !== true) return;
  const v = vRow;
  const ev = v ? String(v.evidence_status || '') : '';
  const comps = v && typeof v.comps_documented === 'number' ? v.comps_documented : 0;
  const need = typeof regSvc.required_comps === 'number' ? regSvc.required_comps : 3;
  if (ev !== 'sufficient' || comps < need) {
    red.push(`${sid}:public_price_allowed_without_sufficient_evidence`);
  }
}

function checkBenchmarkRequired(sid, regSvc, vRow, red, yellow) {
  if (regSvc.benchmark_required !== true) return;
  const v = vRow;
  if (!v) {
    red.push(`${sid}:benchmark_required_but_no_validation_row`);
    return;
  }
  const ev = String(v.evidence_status || '');
  const rv = String(v.review_status || '');
  if (!ev) red.push(`${sid}:missing_evidence_status`);
  if (!rv) red.push(`${sid}:missing_review_status`);
  const comps = typeof v.comps_documented === 'number' ? v.comps_documented : 0;
  const need = typeof regSvc.required_comps === 'number' ? regSvc.required_comps : 0;
  if (need > 0 && comps < need) yellow.push(`${sid}:comps_below_required(${comps}/${need})`);
  if (ev === 'partial' || ev === 'none') yellow.push(`${sid}:evidence_not_sufficient`);
  if (Array.isArray(v.flags) && v.flags.includes('human_gating_required')) {
    /* blue handled in caller */
  }
}

function validateCapsuleProject(
  project,
  capsulePathAbs,
  capsule,
  regMap,
  valMap,
  modMappings,
  entMap,
  red,
  yellow,
  blue,
  checks,
) {
  const pid = project.project_id || '?';
  if (!capsule) {
    red.push(`${pid}:capsule_unreadable_or_missing`);
    return;
  }
  if (capsule.schema !== 'z_project_benchmark_capsule_v1') {
    red.push(`${pid}:capsule_wrong_schema`);
    return;
  }
  for (const req of ['project_id', 'project_name', 'pricing_owner', 'entitlement_owner', 'bridge_status', 'memory_status', 'benchmark_posture']) {
    if (!capsule[req]) red.push(`${pid}:capsule_missing:${req}`);
  }
  if (String(capsule.project_id) !== String(project.project_id)) {
    red.push(`${pid}:capsule_project_id_mismatch`);
  }

  const rawCapsule = JSON.stringify(capsule);
  if (RISKY_CLAIM_RE.test(rawCapsule)) {
    red.push(`${pid}:capsule_contains_risky_certification_or_superlative_language`);
  }

  const services = capsule.services;
  if (!Array.isArray(services) || !services.length) {
    red.push(`${pid}:capsule_services_empty`);
    return;
  }

  const modById = new Map();
  for (const m of modMappings) {
    if (m && typeof m.module_id === 'string') modById.set(m.module_id, m);
  }

  for (const svc of services) {
    const sid = typeof svc?.service_id === 'string' ? svc.service_id : '';
    const rowLabel = `${pid}/${sid || '?'}`;

    for (const f of CAPSULE_SERVICE_FIELDS) {
      if (svc[f] === undefined || svc[f] === null) {
        red.push(`${rowLabel}:missing_field:${f}`);
      }
    }

    const regSvc = regMap.get(sid);
    if (!regSvc) {
      red.push(`${rowLabel}:service_id_not_in_hub_benchmark_registry`);
      continue;
    }

    if (svc.benchmark_required !== regSvc.benchmark_required) {
      yellow.push(`${rowLabel}:capsule_registry_mismatch:benchmark_required`);
    }
    if (svc.public_price_allowed !== regSvc.public_price_allowed) {
      yellow.push(`${rowLabel}:capsule_registry_mismatch:public_price_allowed`);
    }

    const vRow = valMap.get(sid);
    checkEvidenceForPublicPrice(sid, regSvc, vRow, red);
    checkBenchmarkRequired(sid, regSvc, vRow, red, yellow);
    if (regSvc.benchmark_required === true && vRow && Array.isArray(vRow.flags) && vRow.flags.includes('human_gating_required')) {
      blue.push(`${rowLabel}:human_gating_required`);
    }

    const seg = String(svc.segment || '').toLowerCase();
    if (BLUE_SEGMENTS.has(seg) && (regSvc.benchmark_required === true || regSvc.commercial_readiness_required === true)) {
      blue.push(`${rowLabel}:sensitive_segment_requires_human_posture`);
    }

    const entRow = entMap.get(sid);
    const entStatus = String(svc.entitlement_status || '').toLowerCase();
    if (
      entRow &&
      /\b(billing|paid_access|sku|subscriber)\b/i.test(entStatus) &&
      /reference_only|local_project_only|metadata/i.test(String(entRow.reuse_status || '') + String(entRow.availability || ''))
    ) {
      red.push(`${rowLabel}:capability_language_conflicts_with_entitlement_catalog`);
    }

    if (Array.isArray(svc.module_ids)) {
      for (const mid of svc.module_ids) {
        if (!modById.has(mid)) {
          yellow.push(`${rowLabel}:module_id_not_in_hub_module_map:${mid}`);
        }
      }
    }
  }

  checks.push({ project_id: pid, capsule_path: path.relative(ROOT, capsulePathAbs).replace(/\\/g, '/'), services_checked: services.length });
}

function crossProjectHasSource(cross, projectId) {
  if (!cross || !Array.isArray(cross.sources)) return false;
  return cross.sources.some((s) => s && String(s.source_project) === String(projectId));
}

function main() {
  const red = [];
  const yellow = [];
  const blue = [];
  const checks = [];

  const reg = readJson(REG);
  const val = readJson(VAL);
  const mod = readJson(MOD);
  const index = readJson(INDEX);
  const policy = readJson(POLICY);
  const glob = readJson(GLOBAL);
  const cross = readJson(CROSS);
  const entMap = loadEntitlementMap();

  const regMap = registryMap(reg);
  const valMap = valById(val);
  const modMappings = mod && Array.isArray(mod.mappings) ? mod.mappings : [];

  if (!reg || reg.schema !== 'z_susbv_benchmark_registry_v1') {
    red.push('benchmark_registry_missing_or_invalid');
  }
  if (!mod || mod.schema !== 'z_susbv_module_to_service_map_v1') {
    red.push('module_to_service_map_missing_or_invalid');
  }
  if (!index || index.schema !== 'z_susbv_project_benchmark_index_v1') {
    red.push('project_benchmark_index_missing_or_invalid');
  }
  if (!policy || policy.schema !== 'z_susbv_overseer_policy_v1') {
    yellow.push('overseer_policy_missing_or_invalid');
  }

  validateGlobalRegistry(glob, red, yellow);

  if (index && Array.isArray(index.projects)) {
    for (const proj of index.projects) {
      const pid = proj.project_id || '?';
      const opt = Boolean(proj.optional_capsule);
      const rel = proj.capsule_relative_path ? String(proj.capsule_relative_path) : '';

      if (!rel) {
        if (opt) yellow.push(`${pid}:optional_capsule_not_declared`);
        else red.push(`${pid}:required_capsule_path_missing`);
        continue;
      }

      const abs = path.join(ROOT, rel.replace(/^\//, ''));
      if (!fs.existsSync(abs)) {
        if (opt) yellow.push(`${pid}:capsule_file_missing_optional:${rel}`);
        else red.push(`${pid}:capsule_file_missing_required:${rel}`);
        continue;
      }

      let cap = null;
      try {
        cap = JSON.parse(fs.readFileSync(abs, 'utf8'));
      } catch {
        red.push(`${pid}:capsule_json_malformed`);
        continue;
      }
      validateCapsuleProject(proj, abs, cap, regMap, valMap, modMappings, entMap, red, yellow, blue, checks);

      if (cross && !crossProjectHasSource(cross, pid)) {
        yellow.push(`${pid}:not_listed_in_cross_project_sources_optional`);
      }
    }
  }

  let overall = 'GREEN';
  if (red.length) overall = 'RED';
  else {
    if (yellow.length) overall = 'YELLOW';
    if (blue.length) overall = 'BLUE';
  }

  const payload = {
    schema: SCHEMA_REPORT,
    generated_at: new Date().toISOString(),
    overseer_signal: overall,
    phase: 'ZSUSBV-O1',
    counts: { red: red.length, yellow: yellow.length, blue: blue.length },
    flags: { red, yellow, blue },
    capsule_checks: checks,
    inputs: {
      registry: path.relative(ROOT, REG).replace(/\\/g, '/'),
      validation: path.relative(ROOT, VAL).replace(/\\/g, '/'),
      module_map: path.relative(ROOT, MOD).replace(/\\/g, '/'),
      index: path.relative(ROOT, INDEX).replace(/\\/g, '/'),
      policy: path.relative(ROOT, POLICY).replace(/\\/g, '/'),
      global_registry: path.relative(ROOT, GLOBAL).replace(/\\/g, '/'),
    },
    note: 'Z-SUSBV-O advises; AMK/human decides pricing, SKUs, research charter, and public claims. Z-Spiral Scout is future-governed research only.',
  };

  const md = [
    '# Z-SUSBV Benchmark Overseer report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| Overseer signal | **${payload.overseer_signal}** |`,
    `| Phase | ${payload.phase} |`,
    '',
    '## Counts',
    '',
    `| RED | ${payload.counts.red} |`,
    `| YELLOW | ${payload.counts.yellow} |`,
    `| BLUE | ${payload.counts.blue} |`,
    '',
    '## Golden law',
    '',
    '- Benchmark evidence ≠ price approval.',
    '- Readiness score ≠ certification.',
    '- Capsule reference ≠ entitlement.',
    '- No invented dollar amounts in placeholder registries.',
    '- No live web research in this validator.',
    '',
    '---',
    '',
    '*Read-only — Phase ZSUSBV-O1.*',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overseer_signal: overall,
        out_json: path.relative(ROOT, OUT_JSON).replace(/\\/g, '/'),
        out_md: path.relative(ROOT, OUT_MD).replace(/\\/g, '/'),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main();
