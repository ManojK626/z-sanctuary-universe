#!/usr/bin/env node
/**
 * Z-OMNAI-1 — Creative Production Blueprint Adapter (read-only validator).
 * No live AI, APIs, deploy, billing, or autonomous orchestration. Writes JSON + MD reports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG_PATH = path.join(ROOT, 'data', 'z_omnai_blueprint_translation_registry.json');
const TPL_PATH = path.join(ROOT, 'data', 'z_omnai_creative_pipeline_templates.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_blueprint_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_omnai_blueprint_report.md');

const REPORT_SCHEMA = 'z_omnai_blueprint_report_v1';

/** Surfaces that require AMK or specialist attention (BLUE advisory). */
const BLUE_SURFACES = new Set([
  'public_launch',
  'pricing',
  'legal_compliance',
  'children_privacy',
  'medical_health',
  'deep_research_api',
]);

/** Positive-risk phrases; templates must not advocate these (substring match on JSON text). */
const RED_PHRASES = [
  'infinite agi',
  'infinite-power',
  'infinite power',
  'guaranteed convergence',
  'guaranteed outcomes',
  'unbounded intelligence',
  'superintelligence',
  '11000 autonomous',
  'autonomous deployment',
  'auto-merge to production',
  'change live billing',
  'change live pricing',
  'external api without charter',
  'live provider without charter',
];

const REGISTRY_ROW_KEYS = [
  'source_concept',
  'safe_z_equivalent',
  'allowed_use',
  'forbidden_claims',
  'related_existing_systems',
  'autonomy_level',
  'human_gate_required',
  'output_examples',
];

const TEMPLATE_KEYS = [
  'pipeline_id',
  'purpose',
  'governance_surfaces',
  'inputs',
  'production_steps',
  'required_evidence',
  'safety_checks',
  'output_assets',
  'blocked_without_human_gate',
  'recommended_verification',
];

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function hasRedPhrase(blob) {
  const b = blob.toLowerCase();
  for (const phrase of RED_PHRASES) {
    if (b.includes(phrase)) return phrase;
  }
  return null;
}

function validateRegistry(reg, red, yellow) {
  if (!reg || reg.schema !== 'z_omnai_blueprint_translation_registry_v1') {
    red.push('registry:missing_or_wrong_schema');
    return;
  }
  const rows = reg.translations;
  if (!Array.isArray(rows) || rows.length === 0) {
    red.push('registry:translations_empty');
    return;
  }
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const prefix = `registry:row[${i}]`;
    for (const k of REGISTRY_ROW_KEYS) {
      if (row[k] === undefined || row[k] === null) {
        red.push(`${prefix}:missing:${k}`);
      }
    }
    if (!Array.isArray(row.forbidden_claims) || row.forbidden_claims.length === 0) {
      yellow.push(`${prefix}:forbidden_claims_empty_or_missing`);
    }
    if (!Array.isArray(row.related_existing_systems) || row.related_existing_systems.length === 0) {
      yellow.push(`${prefix}:related_existing_systems_empty`);
    }
    if (!Array.isArray(row.output_examples) || row.output_examples.length === 0) {
      yellow.push(`${prefix}:output_examples_empty`);
    }
    const lvl = String(row.autonomy_level || '');
    if (!/^L[0-5]$/.test(lvl)) {
      yellow.push(`${prefix}:autonomy_level_not_L0_to_L5:${lvl || '?'}`);
    }
    const slice = `${row.source_concept || ''} ${row.safe_z_equivalent || ''} ${row.allowed_use || ''}`;
    const phraseHit = hasRedPhrase(slice);
    if (phraseHit) {
      red.push(`${prefix}:forbidden_phrase:${phraseHit}`);
    }
  }
}

/**
 * @param {unknown} tpl
 * @param {string[]} red
 * @param {string[]} yellow
 * @param {string[]} blue
 * @returns {{ pipeline_id: string, signal: string, notes: string[] }[]}
 */
function validateTemplates(tpl, red, yellow, blue) {
  /** @type {{ pipeline_id: string, signal: string, notes: string[] }[]} */
  const perTemplate = [];

  if (!tpl || tpl.schema !== 'z_omnai_creative_pipeline_templates_v1') {
    red.push('templates:missing_or_wrong_schema');
    return perTemplate;
  }
  const templates = tpl.templates;
  if (!Array.isArray(templates) || templates.length === 0) {
    red.push('templates:list_empty');
    return perTemplate;
  }

  const expectedIds = new Set([
    'z_omnai_movie_trailer_v1',
    'z_omnai_marketing_campaign_v1',
    'z_omnai_product_landing_page_v1',
    'z_omnai_pdf_manual_ebook_v1',
    'z_omnai_tool_dashboard_prototype_v1',
    'z_omnai_music_sound_brief_v1',
    'z_omnai_investor_partner_pitch_v1',
  ]);

  for (const t of templates) {
    const pid = typeof t?.pipeline_id === 'string' ? t.pipeline_id : '?';
    const notes = [];

    for (const k of TEMPLATE_KEYS) {
      if (t[k] === undefined || t[k] === null) {
        red.push(`template:${pid}:missing_field:${k}`);
        notes.push('RED:missing_field');
      }
    }

    const redScanParts = [
      t.purpose,
      ...(Array.isArray(t.inputs) ? t.inputs : []),
      ...(Array.isArray(t.production_steps) ? t.production_steps : []),
    ]
      .filter(Boolean)
      .join(' ');
    const hit = hasRedPhrase(redScanParts);
    if (hit) {
      red.push(`template:${pid}:forbidden_phrase:${hit}`);
      notes.push(`RED:phrase:${hit}`);
    }

    const surfaces = Array.isArray(t.governance_surfaces) ? t.governance_surfaces : [];
    let blueHit = false;
    for (const s of surfaces) {
      if (BLUE_SURFACES.has(String(s))) {
        blue.push(`template:${pid}:governance_surface:${s}`);
        notes.push(`BLUE:surface:${s}`);
        blueHit = true;
      }
    }
    if (surfaces.length === 0) {
      yellow.push(`template:${pid}:governance_surfaces_empty`);
      notes.push('YELLOW:no_governance_surfaces');
    }

    const ev = Array.isArray(t.required_evidence) ? t.required_evidence : [];
    if (ev.length < 2) {
      yellow.push(`template:${pid}:required_evidence_incomplete`);
      notes.push('YELLOW:evidence_count');
    }
    for (let j = 0; j < ev.length; j++) {
      const e = ev[j];
      if (!e || typeof e.evidence_kind !== 'string' || !e.evidence_kind.trim()) {
        yellow.push(`template:${pid}:required_evidence[${j}]:missing_evidence_kind`);
        notes.push(`YELLOW:evidence[${j}].kind`);
      }
      if (!e || typeof e.description !== 'string' || !e.description.trim()) {
        yellow.push(`template:${pid}:required_evidence[${j}]:missing_description`);
        notes.push(`YELLOW:evidence[${j}].description`);
      }
    }

    const lists = ['inputs', 'production_steps', 'safety_checks', 'output_assets', 'blocked_without_human_gate', 'recommended_verification'];
    for (const key of lists) {
      if (!Array.isArray(t[key]) || t[key].length === 0) {
        yellow.push(`template:${pid}:list_empty:${key}`);
        notes.push(`YELLOW:empty:${key}`);
      }
    }

    expectedIds.delete(pid);

    let signal = 'GREEN';
    if (notes.some((n) => n.startsWith('RED:'))) signal = 'RED';
    else if (notes.some((n) => n.startsWith('YELLOW:'))) signal = 'YELLOW';
    else if (blueHit) signal = 'BLUE';

    perTemplate.push({ pipeline_id: pid, signal, notes: [...new Set(notes)] });
  }

  for (const id of expectedIds) {
    yellow.push(`templates:missing_expected_pipeline:${id}`);
  }

  return perTemplate;
}

function overallFrom(perTemplate, red, yellow, blue) {
  if (red.length) return 'RED';
  if (yellow.length) return 'YELLOW';
  const tplBlue = perTemplate.some((p) => p.signal === 'BLUE');
  if (blue.length || tplBlue) return 'BLUE';
  const tplGreen = perTemplate.length && perTemplate.every((p) => p.signal === 'GREEN');
  return tplGreen ? 'GREEN' : 'YELLOW';
}

function writeMd(payload) {
  const lines = [
    '# Z-OMNAI blueprint validation report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| Overall Z-OMNAI signal | **${payload.overall_signal}** |`,
    `| Registry | ${payload.registry_path} |`,
    `| Templates | ${payload.templates_path} |`,
    '',
    '## Per-template signals',
    '',
    '| pipeline_id | signal |',
    '| ---- | ---- |',
    ...payload.per_template.map((p) => `| ${p.pipeline_id} | ${p.signal} |`),
    '',
    '## Counts',
    '',
    `| RED flags | ${payload.counts.red} |`,
    `| YELLOW flags | ${payload.counts.yellow} |`,
    `| BLUE flags | ${payload.counts.blue} |`,
    '',
    '## Law (phase)',
    '',
    '- Blueprint ≠ product claim.',
    '- Architecture metaphor ≠ AGI proof.',
    '- Creative pipeline ≠ autonomous launch.',
    '- This validator is read-only metadata; no provider calls.',
    '',
    '---',
    '',
    '*Z-OMNAI-1 — docs + JSON + validator only.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  /** @type {string[]} */
  const red = [];
  /** @type {string[]} */
  const yellow = [];
  /** @type {string[]} */
  const blue = [];

  const reg = readJson(REG_PATH);
  const tpl = readJson(TPL_PATH);

  validateRegistry(reg, red, yellow);
  const perTemplate = validateTemplates(tpl, red, yellow, blue);

  const overall = overallFrom(perTemplate, red, yellow, blue);

  const payload = {
    schema: REPORT_SCHEMA,
    generated_at: new Date().toISOString(),
    overall_signal: overall,
    z_omnai_signal: overall,
    counts: {
      red: red.length,
      yellow: yellow.length,
      blue: blue.length,
    },
    flags: { red, yellow, blue },
    per_template: perTemplate,
    registry_path: path.relative(ROOT, REG_PATH).replace(/\\/g, '/'),
    templates_path: path.relative(ROOT, TPL_PATH).replace(/\\/g, '/'),
    note: 'OMNAI is translated as internal creative routing. AMK/human opens public, pricing, and charter lanes.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMd(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        z_omnai_signal: overall,
        overall_signal: overall,
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
