#!/usr/bin/env node
/**
 * Z-SUSBV Phase 1 — read-only benchmark / price / entitlement validation.
 * No web research, APIs, billing, copy rewrites, or deploy. Writes JSON + MD reports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG = path.join(ROOT, 'data', 'z_susbv_benchmark_registry.json');
const VAL = path.join(ROOT, 'data', 'z_susbv_service_price_validation.json');
const ENT = path.join(ROOT, 'data', 'z_service_entitlement_catalog.json');
const SHADOW = path.join(ROOT, 'data', 'z_shadow_preview_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_susbv_validation_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_susbv_validation_report.md');

const SCHEMA = 'z_susbv_validation_report_v1';

const REQUIRED_SERVICE_FIELDS = [
  'service_id',
  'service_name',
  'segment',
  'status',
  'pricing_owner',
  'entitlement_status',
  'benchmark_required',
  'cost_floor_required',
  'public_price_allowed',
];

const RISKY_CLAIM_RE = /\b(best|guaranteed|certified|#\s*1|number\s*one)\b/i;
const BLUE_SEGMENTS = new Set(['school', 'children', 'partner', 'donation', 'crisis', 'health', 'legal', 'enterprise']);

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
    if (row && typeof row.service_id === 'string') {
      map.set(row.service_id, row);
    }
  }
  return map;
}

/**
 * @param {unknown} reg
 * @param {unknown} val
 * @param {Map<string, unknown>} entMap
 */
function validate(reg, val, entMap) {
  /** @type {string[]} */
  const red = [];
  /** @type {string[]} */
  const yellow = [];
  /** @type {string[]} */
  const blue = [];
  /** @type {Record<string, unknown>[]} */
  const perService = [];

  if (!reg || reg.schema !== 'z_susbv_benchmark_registry_v1') {
    red.push('registry_missing_or_wrong_schema');
    return { overall: 'RED', red, yellow, blue, perService };
  }
  const services = reg.services;
  if (!Array.isArray(services) || !services.length) {
    red.push('registry_services_empty');
    return { overall: 'RED', red, yellow, blue, perService };
  }

  const valData = val && val.schema === 'z_susbv_service_price_validation_v1' ? val : null;
  const valById = new Map();
  if (valData && Array.isArray(valData.services)) {
    for (const v of valData.services) {
      if (v && typeof v.service_id === 'string') valById.set(v.service_id, v);
    }
  } else {
    yellow.push('validation_json_missing_or_wrong_schema');
  }

  for (const svc of services) {
    const sid = typeof svc?.service_id === 'string' ? svc.service_id : '';
    const rowIssues = { service_id: sid || '?', signals: [] };

    for (const k of REQUIRED_SERVICE_FIELDS) {
      if (svc[k] === undefined || svc[k] === null) {
        red.push(`${sid || '?'}:missing_field:${k}`);
        rowIssues.signals.push(`RED:missing:${k}`);
      }
    }

    const textBlob = `${svc.notes || ''} ${svc.service_name || ''}`.toLowerCase();
    if (RISKY_CLAIM_RE.test(String(svc.notes || '') + String((valById.get(sid) || {}).claim_notes || ''))) {
      red.push(`${sid}:unsafe_marketing_language_without_evidence_ref`);
      rowIssues.signals.push('RED:risky_claim_language');
    }

    const seg = String(svc.segment || '').toLowerCase();
    if ((seg.includes('crisis') || seg.includes('emergency')) && /\b(upsell|revenue|upgrade|tier)\b/i.test(textBlob)) {
      red.push(`${sid}:crisis_or_emergency_segment_with_commercial_upsell_language`);
      rowIssues.signals.push('RED:crisis_commercial_mix');
    }

    if (/shadow\s*preview/i.test(textBlob) && /\b(paid|purchase|sku|checkout|subscribe)\b/i.test(textBlob)) {
      yellow.push(`${sid}:shadow_preview_language_near_paid_access`);
      rowIssues.signals.push('YELLOW:shadow_paid_language');
    }

    const entRow = entMap.get(sid);
    const entStatus = String(svc.entitlement_status || '').toLowerCase();
    if (
      entRow &&
      /\b(billing|paid_access|sku|subscriber)\b/i.test(entStatus) &&
      /reference_only|local_project_only|metadata/i.test(String(entRow.reuse_status || '') + String(entRow.availability || ''))
    ) {
      red.push(`${sid}:registry_entitlement_language_conflicts_with_entitlement_catalog_reference_posture`);
      rowIssues.signals.push('RED:capability_vs_entitlement_confusion');
    }

    if (svc.benchmark_required === true) {
      if (typeof svc.required_comps !== 'number' || svc.required_comps < 1) {
        red.push(`${sid}:benchmark_required_but_required_comps_missing_or_invalid`);
        rowIssues.signals.push('RED:required_comps');
      }
      const v = valById.get(sid);
      if (!v) {
        red.push(`${sid}:benchmark_required_but_no_validation_row`);
        rowIssues.signals.push('RED:missing_validation_row');
      } else {
        const ev = String(v.evidence_status || '');
        const rv = String(v.review_status || '');
        if (!ev) {
          red.push(`${sid}:missing_evidence_status`);
          rowIssues.signals.push('RED:evidence_status');
        }
        if (!rv) {
          red.push(`${sid}:missing_review_status`);
          rowIssues.signals.push('RED:review_status');
        }
        const comps = typeof v.comps_documented === 'number' ? v.comps_documented : 0;
        const need = typeof svc.required_comps === 'number' ? svc.required_comps : 0;
        if (need > 0 && comps < need) {
          yellow.push(`${sid}:comps_below_required(${comps}/${need})`);
          rowIssues.signals.push('YELLOW:comps_gap');
        }
        if (ev === 'partial' || ev === 'none') {
          yellow.push(`${sid}:evidence_not_sufficient`);
          rowIssues.signals.push('YELLOW:evidence');
        }
        if (Array.isArray(v.flags) && v.flags.includes('human_gating_required')) {
          blue.push(`${sid}:human_gating_required_flag`);
          rowIssues.signals.push('BLUE:human_gate');
        }
      }
    }

    if (svc.public_price_allowed === true) {
      const v = valById.get(sid);
      const ev = v ? String(v.evidence_status || '') : '';
      const comps = v && typeof v.comps_documented === 'number' ? v.comps_documented : 0;
      const need = typeof svc.required_comps === 'number' ? svc.required_comps : 3;
      if (ev !== 'sufficient' || comps < need) {
        red.push(`${sid}:public_price_allowed_without_sufficient_evidence`);
        rowIssues.signals.push('RED:public_price_evidence');
      }
    }

    if (BLUE_SEGMENTS.has(seg) && (svc.benchmark_required === true || svc.commercial_readiness_required === true)) {
      blue.push(`${sid}:segment_requires_amk_human_commercial_posture`);
      rowIssues.signals.push('BLUE:sensitive_segment');
    }

    perService.push(rowIssues);
  }

  if (valData && Array.isArray(valData.services)) {
    const regIds = new Set(services.map((s) => s.service_id).filter(Boolean));
    for (const v of valData.services) {
      if (v && typeof v.service_id === 'string' && !regIds.has(v.service_id)) {
        yellow.push(`validation_orphan_service_id:${v.service_id}`);
      }
    }
  }

  const inputPaths = [
    path.join(ROOT, 'docs', 'pricing-and-benchmarks.md'),
    path.join(ROOT, 'docs', 'QUARTERLY-MARKET-AND-FACTS-REVIEW.md'),
    path.join(ROOT, 'docs', 'COMMERCIAL-READINESS.md'),
    path.join(ROOT, 'docs', 'cross-project', 'Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md'),
    path.join(ROOT, 'docs', 'Z_TRAFFIC_MINIBOTS.md'),
  ];
  for (const p of inputPaths) {
    if (!fs.existsSync(p)) yellow.push(`missing_input_doc:${path.relative(ROOT, p).replace(/\\/g, '/')}`);
  }

  if (!fs.existsSync(SHADOW)) yellow.push('missing_data:z_shadow_preview_policy.json');
  else if (!readJson(SHADOW)?.schema) yellow.push('shadow_policy_unreadable');

  let overall = 'GREEN';
  if (red.length) overall = 'RED';
  else {
    if (yellow.length) overall = 'YELLOW';
    if (blue.length) overall = 'BLUE';
  }

  return { overall, red, yellow, blue, perService };
}

/** @param {Record<string, unknown>} payload */
function writeMd(payload) {
  const lines = [
    '# Z-SUSBV validation report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| Overall signal | **${payload.overall_signal}** |`,
    `| Registry | ${payload.registry_path} |`,
    `| Validation | ${payload.validation_path} |`,
    '',
    '## Counts',
    '',
    `| RED flags | ${payload.counts.red} |`,
    `| YELLOW flags | ${payload.counts.yellow} |`,
    `| BLUE flags | ${payload.counts.blue} |`,
    '',
    '## Core law',
    '',
    '- No benchmark without source.',
    '- No price without cost floor.',
    '- No claim without evidence.',
    '- No auto-rewrite of public copy.',
    '- No billing/SKU change without AMK/human approval.',
    '',
    '---',
    '',
    '*Read-only — Phase ZSUSBV-1. No APIs, billing, or deploy.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const reg = readJson(REG);
  const val = readJson(VAL);
  const entMap = loadEntitlementMap();
  const result = validate(reg, val, entMap);

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    overall_signal: result.overall,
    counts: {
      red: result.red.length,
      yellow: result.yellow.length,
      blue: result.blue.length,
    },
    flags: {
      red: result.red,
      yellow: result.yellow,
      blue: result.blue,
    },
    per_service: result.perService,
    registry_path: path.relative(ROOT, REG).replace(/\\/g, '/'),
    validation_path: path.relative(ROOT, VAL).replace(/\\/g, '/'),
    entitlement_catalog_loaded: entMap.size > 0,
    note: 'Z-SUSBV advises; AMK/human decides pricing, SKUs, and public claims.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMd(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overall_signal: payload.overall_signal,
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
