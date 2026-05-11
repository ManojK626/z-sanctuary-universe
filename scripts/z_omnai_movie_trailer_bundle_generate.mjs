#!/usr/bin/env node
/**
 * Z-OMNAI-BUILD-2 — read-only movie trailer review bundle report generator.
 * No media generation, APIs, deploy, billing, or writes outside report paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const BUNDLE = path.join(ROOT, 'data', 'z_omnai_movie_trailer_bundle.json');
const WB = path.join(ROOT, 'data', 'z_omnai_capability_workbench.json');
const TPL = path.join(ROOT, 'data', 'z_omnai_creative_pipeline_templates.json');
const BUILD_PLAN = path.join(ROOT, 'data', 'reports', 'z_omnai_build_plan_report.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_movie_trailer_bundle_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_omnai_movie_trailer_bundle_report.md');

const SCHEMA = 'z_omnai_movie_trailer_bundle_report_v1';

const REQUIRED_SECTION_KEYS = [
  'story_concept',
  'world_bible',
  'character_roles',
  'trailer_structure',
  'scene_beats',
  'shot_list',
  'visual_style_guide',
  'music_sound_brief',
  'poster_key_art_brief',
  'accessibility_and_sensory_notes',
  'safety_rights_checklist',
  'review_questions_for_amk',
];

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

function collectStrings(obj, out) {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'string') {
    out.push(obj);
    return;
  }
  if (Array.isArray(obj)) {
    for (const x of obj) collectStrings(x, out);
    return;
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) collectStrings(v, out);
  }
}

function hasRedPhrase(blob) {
  const b = String(blob || '').toLowerCase();
  for (const phrase of RED_PHRASES) {
    if (b.includes(phrase)) return phrase;
  }
  return null;
}

function validateSections(sections) {
  /** @type {string[]} */
  const yellow = [];
  if (!sections || typeof sections !== 'object') {
    yellow.push('sections_missing');
    return yellow;
  }
  for (const key of REQUIRED_SECTION_KEYS) {
    if (!sections[key]) {
      yellow.push(`missing_section:${key}`);
      continue;
    }
    const s = sections[key];
    const prompts = s.amk_input_prompts;
    const ph = s.outline_placeholders;
    if (!Array.isArray(prompts) || prompts.length < 1) yellow.push(`weak_section:${key}:prompts`);
    if (!Array.isArray(ph) || ph.length < 1) yellow.push(`weak_section:${key}:placeholders`);
  }
  return yellow;
}

function writeMd(payload) {
  const b = payload.bundle_summary;
  const lines = [
    '# Z-OMNAI movie trailer bundle report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '|----|----|',
    `| Overall signal | **${payload.overall_signal}** |`,
    `| Bundle id | ${b.bundle_id} |`,
    `| Status | ${b.status} |`,
    `| Public release | ${b.public_release_status} |`,
    `| Rights posture | ${b.rights_posture} |`,
    '',
    '## Public release',
    '',
    '- **Blocked** until AMK or human opens the public release lane.',
    '- This report is an internal review bundle only.',
    '',
    '## AMK input prompts (index)',
    '',
    ...payload.amk_prompt_index.map((x) => `- **${x.section}:** ${x.count} prompt(s)`),
    '',
    '## Output asset checklist',
    '',
    ...payload.output_asset_checklist.map((x) => `- ${x}`),
    '',
    '## Rights and safety checklist (summary)',
    '',
    ...payload.rights_safety_summary.map((x) => `- ${x}`),
    '',
    '## Review questions (from bundle)',
    '',
    ...payload.review_questions_flat.slice(0, 12).map((x) => `- ${x}`),
    '',
    '---',
    '',
    '*Z-OMNAI-BUILD-2 — no generated media, no providers, no publishing.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const bundle = readJson(BUNDLE);
  const wb = readJson(WB);
  const tplData = readJson(TPL);
  const buildPlan = fs.existsSync(BUILD_PLAN) ? readJson(BUILD_PLAN) : null;

  if (!bundle || bundle.schema !== 'z_omnai_movie_trailer_review_bundle_v1') {
    console.error(JSON.stringify({ ok: false, error: 'bundle_missing_or_invalid_schema' }, null, 2));
    process.exit(1);
  }

  const stringsForRed = [];
  collectStrings(bundle.sections, stringsForRed);
  collectStrings([bundle.summary], stringsForRed);
  const redBlob = stringsForRed.join('\n');
  const redHit = hasRedPhrase(redBlob);

  const sectionYellow = validateSections(bundle.sections);
  let overall = 'GREEN';
  const flags = { red: [], yellow: [], blue: [] };

  if (redHit) {
    flags.red.push(`forbidden_phrase:${redHit}`);
    overall = 'RED';
  }

  for (const y of sectionYellow) {
    flags.yellow.push(y);
    if (overall !== 'RED') overall = 'YELLOW';
  }

  if (overall !== 'RED' && overall === 'GREEN') {
    flags.blue.push(
      'advisory:public_or_rights_or_music_review_required_before_any_externalisation',
    );
  }

  const template = (tplData?.templates || []).find((t) => t.pipeline_id === bundle.source_pipeline_id);
  const workbenchMode = (wb?.supported_workbench_modes || []).find((m) => m.mode_id === bundle.workbench_mode_id);

  const amkPromptIndex = [];
  for (const key of REQUIRED_SECTION_KEYS) {
    const sec = bundle.sections?.[key];
    const prompts = Array.isArray(sec?.amk_input_prompts) ? sec.amk_input_prompts : [];
    amkPromptIndex.push({ section: key, count: prompts.length });
  }
  const rq = bundle.sections?.review_questions_for_amk;
  const reviewQuestionsFlat = [
    ...(Array.isArray(rq?.amk_input_prompts) ? rq.amk_input_prompts : []),
    ...(Array.isArray(rq?.outline_placeholders) ? rq.outline_placeholders : []),
  ];

  const outputAssetChecklist = [
    'Logline and story spine notes',
    'World bible (trailer-scoped)',
    'Character list for trailer',
    'Trailer structure beat sheet',
    'Scene beat list with duration notes',
    'Shot list with rights notes per shot',
    'Visual style guide (intent only)',
    'Music and sound brief (no license implied)',
    'Poster or key-art brief (no generated art)',
    'Accessibility and sensory notes',
    'Safety and rights checklist with clearance TBDs',
    'AMK review question answers (dated)',
  ];

  const rightsSafetySummary = [
    bundle.rights_posture,
    'Original material or documented permission before any public screeners.',
    'Music brief does not grant sync or master use — separate rights path.',
    'Poster or key-art brief does not grant IP — design or commission lane is separate.',
    'Child or youth depiction triggers additional review per policy.',
    'Commercial claims in trailer copy route through Z-SUSBV and entitlement posture when applicable.',
  ];

  const trailerOutlinePlaceholders = Array.isArray(template?.production_steps)
    ? template.production_steps.map((step, i) => `${i + 1}. ${step} — [TBD notes]`)
    : [];

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    overall_signal: overall,
    flags,
    bundle_summary: {
      bundle_id: bundle.bundle_id,
      source_pipeline_id: bundle.source_pipeline_id,
      workbench_mode_id: bundle.workbench_mode_id,
      status: bundle.status,
      public_release_status: bundle.public_release_status,
      autonomy_level: bundle.autonomy_level,
      rights_posture: bundle.rights_posture,
    },
    build_plan_context: buildPlan
      ? {
          overall_build_plan_signal: buildPlan.overall_build_plan_signal,
          movie_mode_signal: (buildPlan.modes || []).find((m) => m.mode_id === 'movie_trailer')?.signal ?? null,
        }
      : null,
    workbench_mode_summary: workbenchMode
      ? {
          purpose: workbenchMode.purpose,
          recommended_verification: workbenchMode.recommended_verification || [],
        }
      : null,
    trailer_outline_placeholders: trailerOutlinePlaceholders,
    amk_prompt_index: amkPromptIndex,
    output_asset_checklist: outputAssetChecklist,
    rights_safety_summary: rightsSafetySummary,
    review_questions_flat: reviewQuestionsFlat,
    forbidden_actions: bundle.forbidden_actions || [],
    required_human_gates: bundle.required_human_gates || [],
    public_release_blocked_note:
      'Public release, upload, paid media, and distribution remain blocked until AMK or human opens that lane with rights and policy sign-off.',
    law: [
      'Review bundle ≠ final movie.',
      'Trailer outline ≠ public release.',
      'Style guide ≠ copyrighted asset permission.',
      'Music brief ≠ music rights.',
      'Poster brief ≠ generated key art.',
      'AMK or human opens public release.',
    ],
    note: 'Read-only generator output. No binaries, no provider calls, no deploy.',
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

  process.exit(overall === 'RED' ? 1 : 0);
}

main();
