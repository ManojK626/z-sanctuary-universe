#!/usr/bin/env node
/**
 * Z-OMNAI-BUILD-1 — read-only build plan + review bundle report generator.
 * No AI providers, APIs, deploy, billing, or writes outside report paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const WB = path.join(ROOT, 'data', 'z_omnai_capability_workbench.json');
const TPL = path.join(ROOT, 'data', 'z_omnai_creative_pipeline_templates.json');
const BLUEPRINT_REPORT = path.join(ROOT, 'data', 'reports', 'z_omnai_blueprint_report.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_build_plan_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_omnai_build_plan_report.md');

const SCHEMA = 'z_omnai_build_plan_report_v1';

const BLUE_SURFACES = new Set([
  'public_launch',
  'pricing',
  'legal_compliance',
  'children_privacy',
  'medical_health',
  'deep_research_api',
]);

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

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function hasRedPhrase(blob) {
  const b = String(blob || '').toLowerCase();
  for (const phrase of RED_PHRASES) {
    if (b.includes(phrase)) return phrase;
  }
  return null;
}

function parseModeArg() {
  const a = process.argv.find((x) => x.startsWith('--mode='));
  return a ? a.slice('--mode='.length).trim() : null;
}

function signalForMode(mode, templateById) {
  const notes = [];
  const scanBlob = [mode.purpose, ...(mode.required_inputs || []), ...(mode.optional_inputs || [])].join(' ');
  const redHit = hasRedPhrase(scanBlob);
  if (redHit) {
    notes.push(`RED:forbidden_phrase:${redHit}`);
    return { signal: 'RED', notes };
  }

  const ev = Array.isArray(mode.required_evidence) ? mode.required_evidence : [];
  if (ev.length < 2) notes.push('YELLOW:required_evidence_incomplete');
  for (let i = 0; i < ev.length; i++) {
    const e = ev[i];
    if (!e?.evidence_kind?.trim() || !e?.description?.trim()) {
      notes.push(`YELLOW:evidence_row[${i}]`);
    }
  }

  const tpl = templateById.get(mode.source_pipeline_id);
  if (!tpl) {
    notes.push('YELLOW:missing_template_for_source_pipeline_id');
  } else {
    const tev = Array.isArray(tpl.required_evidence) ? tpl.required_evidence : [];
    if (tev.length < 2) notes.push('YELLOW:template_evidence_incomplete');
    const surfaces = Array.isArray(tpl.governance_surfaces) ? tpl.governance_surfaces : [];
    let blue = false;
    for (const s of surfaces) {
      if (BLUE_SURFACES.has(String(s))) {
        notes.push(`BLUE:surface:${s}`);
        blue = true;
      }
    }
    if (!blue && surfaces.length === 0) notes.push('YELLOW:no_governance_surfaces_on_template');
  }

  if (notes.some((n) => n.startsWith('RED:'))) return { signal: 'RED', notes };
  if (notes.some((n) => n.startsWith('YELLOW:'))) return { signal: 'YELLOW', notes };
  if (notes.some((n) => n.startsWith('BLUE:'))) return { signal: 'BLUE', notes };
  return { signal: 'GREEN', notes };
}

function overallFrom(rows) {
  if (rows.some((r) => r.signal === 'RED')) return 'RED';
  if (rows.some((r) => r.signal === 'YELLOW')) return 'YELLOW';
  if (rows.some((r) => r.signal === 'BLUE')) return 'BLUE';
  return 'GREEN';
}

function writeMd(payload) {
  const lines = [
    '# Z-OMNAI build plan report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '|----|----|',
    `| Overall build-plan signal | **${payload.overall_build_plan_signal}** |`,
    `| Blueprint validator signal | ${payload.blueprint_validator_signal ?? 'n/a'} |`,
    `| Focus mode | ${payload.focus_mode ?? 'all'} |`,
    '',
    '## Global laws',
    '',
    ...payload.global_laws.map((l) => `- ${l}`),
    '',
    '## Per-mode summary',
    '',
    '| mode_id | signal | source_pipeline_id |',
    '|----|----|----|',
    ...payload.modes.map((m) => `| ${m.mode_id} | ${m.signal} | ${m.source_pipeline_id} |`),
    '',
    '## Rollback (artefacts only)',
    '',
    '- Delete `data/reports/z_omnai_build_plan_report.json` and `.md` if you need to discard this run.',
    '- Removing the workbench JSON or generator does not change runtime, billing, or deploy.',
    '',
    '---',
    '',
    '*Z-OMNAI-BUILD-1 — review plans only. AMK opens public, legal, pricing, and provider lanes.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const focusMode = parseModeArg();
  const wb = readJson(WB);
  const tplData = readJson(TPL);
  const blueprintRep = fs.existsSync(BLUEPRINT_REPORT) ? readJson(BLUEPRINT_REPORT) : null;

  if (!wb || wb.schema !== 'z_omnai_capability_workbench_v1') {
    console.error(JSON.stringify({ ok: false, error: 'workbench_missing_or_invalid_schema' }, null, 2));
    process.exit(1);
  }
  if (!tplData || tplData.schema !== 'z_omnai_creative_pipeline_templates_v1') {
    console.error(JSON.stringify({ ok: false, error: 'templates_missing_or_invalid_schema' }, null, 2));
    process.exit(1);
  }

  const templateById = new Map();
  for (const t of tplData.templates || []) {
    if (t?.pipeline_id) templateById.set(t.pipeline_id, t);
  }

  const globalLaws = Array.isArray(wb.global_laws) ? wb.global_laws : [];
  const modesIn = Array.isArray(wb.supported_workbench_modes) ? wb.supported_workbench_modes : [];

  /** @type {unknown[]} */
  const modeRows = [];

  for (const mode of modesIn) {
    const tpl = templateById.get(mode.source_pipeline_id);
    const { signal, notes } = signalForMode(mode, templateById);
    const productionSteps = Array.isArray(tpl?.production_steps) ? tpl.production_steps : [];

    modeRows.push({
      mode_id: mode.mode_id,
      source_pipeline_id: mode.source_pipeline_id,
      purpose: mode.purpose,
      signal,
      signal_notes: notes,
      autonomy_level: mode.autonomy_level,
      dashboard_visibility: mode.dashboard_visibility,
      review_bundle: {
        inputs_required: mode.required_inputs || [],
        inputs_optional: mode.optional_inputs || [],
        production_steps: productionSteps,
        output_assets: mode.output_assets || [],
        required_evidence: mode.required_evidence || [],
        safety_gates: mode.safety_gates || [],
        blocked_without_human_gate: mode.blocked_without_human_gate || [],
        recommended_verification: mode.recommended_verification || [],
        rollback: [
          'Revert local doc or asset edits if plan was exploratory only.',
          'Do not treat this JSON as merge approval or deploy approval.',
        ],
      },
    });
  }

  if (focusMode) {
    const found = modeRows.find((r) => r.mode_id === focusMode);
    if (!found) {
      console.error(JSON.stringify({ ok: false, error: 'unknown_mode_id', mode: focusMode }, null, 2));
      process.exit(1);
    }
  }

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    overall_build_plan_signal: overallFrom(modeRows),
    blueprint_validator_signal: blueprintRep?.overall_signal ?? blueprintRep?.z_omnai_signal ?? null,
    focus_mode: focusMode || null,
    focus_expansion: focusMode ? modeRows.find((r) => r.mode_id === focusMode) : null,
    global_laws: globalLaws,
    modes: modeRows,
    note: 'Build plan and review bundle metadata only. Execution, APIs, deploy, and billing require separate AMK-chartered lanes.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMd(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overall_build_plan_signal: payload.overall_build_plan_signal,
        out_json: path.relative(ROOT, OUT_JSON).replace(/\\/g, '/'),
        out_md: path.relative(ROOT, OUT_MD).replace(/\\/g, '/'),
        focus_mode: payload.focus_mode,
      },
      null,
      2,
    ),
  );

  process.exit(payload.overall_build_plan_signal === 'RED' ? 1 : 0);
}

main();
