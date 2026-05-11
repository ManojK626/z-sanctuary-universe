#!/usr/bin/env node
/**
 * Z-OMNAI-BUILD-2A — read-only master media concept seed report generator.
 * No media generation, providers, deploy, billing, or writes outside report paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SEED = path.join(ROOT, 'data', 'z_omnai_master_media_concept_seed.json');
const BUNDLE = path.join(ROOT, 'data', 'z_omnai_movie_trailer_bundle.json');
const WB = path.join(ROOT, 'data', 'z_omnai_capability_workbench.json');
const TPL = path.join(ROOT, 'data', 'z_omnai_creative_pipeline_templates.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_master_media_seed_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_omnai_master_media_seed_report.md');

const SCHEMA = 'z_omnai_master_media_seed_report_v1';

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

const COMMERCIAL_BLUE = /\b(price|pricing|sku|subscribe|checkout|for sale)\b/i;

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

function contentBlob(seed) {
  const parts = [
    seed.concept_title_placeholder,
    seed.core_message,
    seed.target_audience,
    seed.emotional_tone,
    seed.world_setting,
    JSON.stringify(seed.main_characters || []),
    ...(seed.trailer_structure || []),
    ...(seed.song_seed_hooks || []),
    seed.podcast_episode_angle,
    ...(seed.marketing_hook_candidates || []),
    seed.poster_key_art_direction,
    seed.pdf_or_ebook_angle,
    seed.rights_and_originality_notes,
    ...(seed.amk_decision_questions || []),
  ];
  return parts.filter(Boolean).join('\n');
}

function commercialBlob(seed) {
  return [...(seed.marketing_hook_candidates || []), seed.pdf_or_ebook_angle || ''].join('\n');
}

function validateSeed(seed) {
  /** @type {string[]} */
  const y = [];
  const cm = String(seed.core_message || '').trim();
  if (cm.length < 20) y.push('YELLOW:core_message_too_thin');
  if (!Array.isArray(seed.song_seed_hooks) || seed.song_seed_hooks.length < 1) y.push('YELLOW:song_seed_hooks_empty');
  if (!Array.isArray(seed.marketing_hook_candidates) || seed.marketing_hook_candidates.length < 1) {
    y.push('YELLOW:marketing_hook_candidates_empty');
  }
  if (!Array.isArray(seed.trailer_structure) || seed.trailer_structure.length < 2) {
    y.push('YELLOW:trailer_structure_thin');
  }
  if (!Array.isArray(seed.main_characters) || seed.main_characters.length < 1) {
    y.push('YELLOW:main_characters_empty');
  }
  return y;
}

function writeMd(payload) {
  const s = payload.master_concept_summary;
  const lines = [
    '# Z-OMNAI master media seed report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '|----|----|',
    `| Overall signal | **${payload.overall_signal}** |`,
    `| Seed id | ${s.seed_id} |`,
    `| Source bundle | ${s.source_bundle_id} |`,
    `| Status | ${s.status} |`,
    `| Public release | ${s.public_release_status} |`,
    '',
    '## Law (short)',
    '',
    ...payload.law.map((x) => `- ${x}`),
    '',
    '## Master concept summary',
    '',
    `- **Title placeholder:** ${s.concept_title_placeholder}`,
    `- **Core message:** ${s.core_message}`,
    `- **Audience:** ${s.target_audience}`,
    `- **Tone:** ${s.emotional_tone}`,
    '',
    '## AMK next decisions',
    '',
    ...payload.amk_next_decisions.map((x) => `- ${x}`),
    '',
    '---',
    '',
    '*Z-OMNAI-BUILD-2A — seed only; no generated media or public lane.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const seed = readJson(SEED);
  const bundle = readJson(BUNDLE);
  const wb = readJson(WB);
  const tplData = readJson(TPL);

  if (!seed || seed.schema !== 'z_omnai_master_media_concept_seed_v1') {
    console.error(JSON.stringify({ ok: false, error: 'seed_missing_or_invalid_schema' }, null, 2));
    process.exit(1);
  }
  if (!bundle || bundle.schema !== 'z_omnai_movie_trailer_review_bundle_v1') {
    console.error(JSON.stringify({ ok: false, error: 'bundle_missing_or_invalid_schema' }, null, 2));
    process.exit(1);
  }

  const flags = { red: [], yellow: [], blue: [] };
  const redHit = hasRedPhrase(contentBlob(seed));
  if (redHit) flags.red.push(`forbidden_phrase:${redHit}`);

  const yellows = validateSeed(seed);
  for (const y of yellows) flags.yellow.push(y);

  /** @type {string[]} */
  const advisory = [];
  if (COMMERCIAL_BLUE.test(commercialBlob(seed))) {
    flags.blue.push('BLUE:commercial_or_pricing_language_detected_in_marketing_or_pdf_angle');
  } else {
    advisory.push('advisory:public_rights_music_partner_review_before_externalising_any_branch');
  }

  let overall = 'GREEN';
  if (flags.red.length) overall = 'RED';
  else if (flags.yellow.some((x) => x.startsWith('YELLOW:'))) overall = 'YELLOW';
  else if (flags.blue.some((x) => x.startsWith('BLUE:'))) overall = 'BLUE';

  const trailerTpl = (tplData?.templates || []).find((t) => t.pipeline_id === 'z_omnai_movie_trailer_v1');
  const wbMovie = (wb?.supported_workbench_modes || []).find((m) => m.mode_id === 'movie_trailer');

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    overall_signal: overall,
    flags,
    advisory_notes: advisory,
    master_concept_summary: {
      seed_id: seed.seed_id,
      source_bundle_id: seed.source_bundle_id,
      concept_title_placeholder: seed.concept_title_placeholder,
      core_message: seed.core_message,
      target_audience: seed.target_audience,
      emotional_tone: seed.emotional_tone,
      world_setting: seed.world_setting,
      main_characters: seed.main_characters,
      status: seed.status,
      public_release_status: seed.public_release_status,
      autonomy_level: seed.autonomy_level,
    },
    movie_trailer_prep_block: {
      trailer_structure_from_seed: seed.trailer_structure || [],
      bundle_sections_index: Object.keys(bundle.sections || {}),
      template_production_steps: trailerTpl?.production_steps || [],
      workbench_verification: wbMovie?.recommended_verification || [],
    },
    song_soundtrack_prep_block: {
      song_seed_hooks: seed.song_seed_hooks || [],
      note: 'Hooks are thematic seeds only — not lyrics to ship and not a music license.',
    },
    podcast_prep_block: {
      podcast_episode_angle: seed.podcast_episode_angle,
      note: 'Angle is planning copy — not a published episode or RSS action from this repo.',
    },
    marketing_prep_block: {
      marketing_hook_candidates: seed.marketing_hook_candidates || [],
      note: 'Hooks are internal candidates — not approved public copy until AMK and evidence pass.',
    },
    poster_key_art_prep_block: {
      poster_key_art_direction: seed.poster_key_art_direction,
      note: 'Direction text only — no generated key art in this phase.',
    },
    rights_safety_checklist: [
      seed.rights_and_originality_notes,
      ...(bundle.forbidden_actions || []).slice(0, 6).map((x) => `Bundle forbidden (reminder): ${x}`),
    ],
    amk_next_decisions: seed.amk_decision_questions || [],
    forbidden_actions_echo: seed.forbidden_actions || [],
    required_human_gates_echo: seed.required_human_gates || [],
    law: [
      'Media seed ≠ generated movie.',
      'Song hook ≠ music rights.',
      'Podcast angle ≠ public episode.',
      'Marketing hook ≠ approved public copy.',
      'Poster direction ≠ generated key art.',
      'AMK or human opens public and media-generation lanes.',
    ],
    note: 'Read-only report. No binaries written; no provider or deploy side effects.',
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
