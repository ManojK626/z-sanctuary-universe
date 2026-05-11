#!/usr/bin/env node
/**
 * Z-OMNAI-LETTER-GATE-1 — read-only media pipeline letter readiness check.
 * No providers, media generation, deploy, billing, or writes outside report paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const GATE = path.join(ROOT, 'data', 'z_omnai_media_letter_gate.json');
const SEED = path.join(ROOT, 'data', 'z_omnai_master_media_concept_seed.json');
const MEDIA_REPORT = path.join(ROOT, 'data', 'reports', 'z_omnai_master_media_seed_report.json');
const BUNDLE_REPORT = path.join(ROOT, 'data', 'reports', 'z_omnai_movie_trailer_bundle_report.json');
const BUILD_PLAN = path.join(ROOT, 'data', 'reports', 'z_omnai_build_plan_report.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_media_letter_gate_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_omnai_media_letter_gate_report.md');

const SCHEMA = 'z_omnai_media_letter_gate_report_v1';

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function seedHasAmkPlaceholders(seed) {
  const blob = JSON.stringify(seed || '');
  return blob.includes('[AMK:');
}

function rank(sig) {
  const o = { RED: 5, YELLOW: 4, BLUE: 3, GREEN: 2, GOLD: 1, PURPLE: 0 };
  return o[sig] ?? 0;
}

function worst(a, b) {
  return rank(a) >= rank(b) ? a : b;
}

function recommendNext(resolved, mediaReport) {
  const a = resolved.find((x) => x.letter === 'A');
  if (a?.signal === 'RED') {
    return { letter: null, reason: 'Letter A or seed pipeline is RED — fix before advancing.', auto_lane_ok: false };
  }
  if (a?.signal === 'YELLOW') {
    const ph = mediaReport?.overall_signal === 'YELLOW';
    return {
      letter: 'A',
      reason: ph
        ? 'Media-seed report is YELLOW — tighten seed fields and re-run z:omnai:media-seed.'
        : 'Master media seed still has [AMK: placeholders — AMK fills content, then re-run z:omnai:media-seed and z:omnai:letter-gate.',
      auto_lane_ok: true,
    };
  }
  if (a?.signal === 'GREEN' && mediaReport?.overall_signal === 'GREEN') {
    return {
      letter: 'D',
      reason: 'Seed filled and media-seed GREEN — optional dashboard visibility slice is lowest-risk next.',
      auto_lane_ok: true,
    };
  }
  if (a?.signal === 'GREEN') {
    return {
      letter: 'A',
      reason: 'Placeholders cleared; finish internal AMK read of seed and reports before opening B or public lanes.',
      auto_lane_ok: true,
    };
  }
  return { letter: 'E', reason: 'Hold baseline — no stronger recommendation.', auto_lane_ok: true };
}

function writeMd(payload) {
  const rec = payload.recommended_next_letter;
  const lines = [
    '# Z-OMNAI media letter gate report',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '|----|----|',
    `| Overall gate signal | **${payload.overall_letter_gate_signal}** |`,
    `| Recommended next letter | **${rec.letter ?? '—'}** |`,
    `| Recommendation reason | ${rec.reason} |`,
    '',
    '## Letter signals (A–E)',
    '',
    '| Letter | Lane | Signal |',
    '|----|----|----|',
    ...payload.letters_resolved.map((r) => `| ${r.letter} | ${r.lane_key} | ${r.signal} |`),
    '',
    '## Law',
    '',
    ...payload.law_echo.map((x) => `- ${x}`),
    '',
    '## Auto-lane vs AMK',
    '',
    '- **Auto-lane:** read JSON, read reports, emit this artefact — no execution.',
    '- **AMK:** sacred moves — public release, pricing, provider calls, deploy, merge.',
    '',
    '---',
    '',
    '*Z-OMNAI-LETTER-GATE-1 — recommendation ≠ execution.*',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const gate = readJson(GATE);
  const seed = readJson(SEED);
  const mediaReport = fs.existsSync(MEDIA_REPORT) ? readJson(MEDIA_REPORT) : null;
  const bundleReport = fs.existsSync(BUNDLE_REPORT) ? readJson(BUNDLE_REPORT) : null;
  const buildPlan = fs.existsSync(BUILD_PLAN) ? readJson(BUILD_PLAN) : null;

  /** @type {string[]} */
  const red = [];

  if (!gate || gate.schema !== 'z_omnai_media_letter_gate_v1' || !Array.isArray(gate.letters)) {
    red.push('letter_gate_missing_or_invalid_schema');
  }
  if (!seed || seed.schema !== 'z_omnai_master_media_concept_seed_v1') {
    red.push('master_media_seed_missing_or_invalid_schema');
  }

  if (mediaReport?.overall_signal === 'RED') {
    red.push('media_seed_report_overall_red');
  }

  const placeholders = seed ? seedHasAmkPlaceholders(seed) : true;

  /** @type {unknown[]} */
  const lettersResolved = [];

  if (!red.length && gate?.letters) {
    for (const row of gate.letters) {
      const L = row.letter;
      let signal = row.signal || 'YELLOW';

      if (L === 'A') {
        if (placeholders) signal = 'YELLOW';
        else if (mediaReport?.overall_signal === 'RED') signal = 'RED';
        else if (mediaReport?.overall_signal === 'YELLOW') signal = 'YELLOW';
        else signal = 'GREEN';
      } else if (L === 'B') {
        signal = 'BLUE';
      } else if (L === 'C') {
        signal = 'GREEN';
        if (!buildPlan?.modes?.some((m) => m.mode_id === 'tool_dashboard_prototype')) {
          signal = 'YELLOW';
        }
      } else if (L === 'D') {
        signal = 'GREEN';
        if (!fs.existsSync(MEDIA_REPORT) || !fs.existsSync(BUNDLE_REPORT)) {
          signal = 'YELLOW';
        }
      } else if (L === 'E') {
        signal = 'GOLD';
      }

      lettersResolved.push({
        letter: L,
        lane_key: row.lane_key,
        title: row.title,
        signal,
        current_condition: row.current_condition,
        auto_allowed_actions: row.auto_allowed_actions,
        amk_required_actions: row.amk_required_actions,
        blocked_until: row.blocked_until,
        required_checks: row.required_checks,
        related_docs: row.related_docs,
        related_reports: row.related_reports,
        recommended_next_step: row.recommended_next_step,
        autonomy_level: row.autonomy_level,
        forbidden_actions: row.forbidden_actions,
      });
    }
  }

  let overall = 'GREEN';
  if (red.length) overall = 'RED';
  else if (!lettersResolved.length) overall = 'RED';
  else {
    const abcd = lettersResolved.filter((x) => 'ABCD'.includes(x.letter));
    for (const x of abcd) overall = worst(overall, x.signal);
  }

  const recommended = red.length
    ? { letter: null, reason: 'Gate check RED — resolve flags before letter advance.', auto_lane_ok: false }
    : recommendNext(lettersResolved, mediaReport);

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    overall_letter_gate_signal: overall,
    flags: { red },
    seed_placeholders_detected: Boolean(placeholders),
    media_seed_report_signal: mediaReport?.overall_signal ?? null,
    movie_bundle_report_present: fs.existsSync(BUNDLE_REPORT),
    movie_bundle_report_signal: bundleReport?.overall_signal ?? null,
    build_plan_present: fs.existsSync(BUILD_PLAN),
    recommended_next_letter: recommended,
    letters_resolved: lettersResolved.length ? lettersResolved : [],
    law_echo: gate?.law || [
      'Letter recommendation ≠ execution.',
      'Auto readiness ≠ permission.',
      'GREEN internal ≠ public release.',
      'BLUE requires AMK or human.',
      'RED blocks movement.',
    ],
    note: 'Read-only. AMK-Goku owns sacred moves (public, pricing, provider, deploy, merge).',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMd(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overall_letter_gate_signal: payload.overall_letter_gate_signal,
        recommended_next_letter: payload.recommended_next_letter,
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
