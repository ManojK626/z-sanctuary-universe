#!/usr/bin/env node
/**
 * Z-CAR² Phase 2 — refactor plan only (read-only; no source edits, no patches, no apply).
 * Input: data/reports/z_car2_similarity_report.json
 * Output: data/reports/z_car2_refactor_plan.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IN_JSON = path.join(ROOT, 'data', 'reports', 'z_car2_similarity_report.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_car2_refactor_plan.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_car2_refactor_plan.md');

const ACTIONS = [
  'KEEP_AS_EVIDENCE',
  'IGNORE_TRIVIAL',
  'MAKE_SHARED_DOC_REFERENCE',
  'MAKE_SCRIPT_HELPER',
  'MAKE_DASHBOARD_COMPONENT',
  'MAKE_ALIAS_MAP',
  'HUMAN_REVIEW_ONLY'
];

function involvedPaths(g) {
  return [...new Set((g.locations || []).map((l) => l.path).filter(Boolean))];
}

function allMatch(paths, pred) {
  return paths.length > 0 && paths.every(pred);
}

function anyMatch(paths, pred) {
  return paths.some(pred);
}

/** Single-line CSS property declarations — ubiquitous; not shared-component candidates. */
function isTrivialCssDeclarationLine(preview) {
  const s = String(preview || '').trim();
  if (!s || s.includes('{') || s.includes('}')) return false;
  return /^(font-size|color|margin|padding|width|height|border-radius|border-width|border-color|border-style|background-color|background|opacity|display|flex-direction|justify-content|align-items|gap|line-height|font-weight|font-family|text-align|max-width|min-width|overflow|box-sizing|position|top|right|bottom|left|z-index)\s*:/i.test(
    s
  );
}

/**
 * Phase 1 joins window lines with " · "; detect generic HTML document opening block only.
 */
function isHtmlDocumentSkeletonWindow(g) {
  if (g.kind !== 'four_line_window') return false;
  const raw = String(g.locations?.[0]?.preview || '');
  const flat = raw.replace(/\s*·\s*/g, '\n');
  const low = flat.toLowerCase();
  const hasHtml = /<html\b/i.test(flat);
  const hasHead = /<head\b/i.test(flat);
  const hasCharset = /<meta[^>]+charset/i.test(flat);
  const hasViewport = /<meta[^>]+viewport/i.test(flat);
  if (!hasHtml || !hasHead || !hasCharset || !hasViewport) return false;
  const noise =
    low.includes('<body') ||
    low.includes('<script') ||
    low.includes('<link ') ||
    low.includes('<style');
  return !noise;
}

/**
 * Classify a Phase 1 duplicate group into a safe action bucket.
 * RED / BLACK → HUMAN_REVIEW_ONLY or KEEP_AS_EVIDENCE only.
 */
function planForGroup(g) {
  const paths = involvedPaths(g);
  const preview = String(g.locations?.[0]?.preview || '');
  const joined = paths.join(' ').toLowerCase();
  const risk = g.risk_level || 'YELLOW';
  const cat = g.category || 'unknown';

  const underReportsOnly = allMatch(paths, (p) => p.startsWith('data/reports/'));
  const underSafety = anyMatch(paths, (p) => p.includes('docs/safety/') || p.includes('/safety/'));
  const snapshotOrTemp = anyMatch(
    paths,
    (p) =>
      p.includes('_snapshots/') ||
      p.includes('.pytest_basetemp') ||
      p.includes('pytest_basetemp') ||
      p.includes('/exports/')
  );
  const allMd = allMatch(paths, (p) => p.endsWith('.md'));
  const allScripts =
    allMatch(paths, (p) => p.startsWith('scripts/') || p.includes('/scripts/')) &&
    allMatch(paths, (p) => /\.(mjs|js|cjs)$/i.test(p));
  const anyDashboard = anyMatch(paths, (p) => p.includes('dashboard/') || p.includes('/panels/'));

  const base = {
    group_id: g.group_id,
    kind: g.kind,
    risk_level: risk,
    category: cat,
    involved_files: paths,
    phase1_recommendation: g.recommendation || null,
    why_duplicated:
      'Exact normalized text match across files (Phase 1 exact-line or 4-line window clustering).',
    proposed_canonical_home: null,
    minimum_safe_next_step: 'No automated change; review this row in the plan with a human gate.',
    eligible_for_future_patch_suggestion: false
  };

  if (risk === 'BLACK') {
    return {
      ...base,
      action: 'KEEP_AS_EVIDENCE',
      why_duplicated:
        'BLACK risk or evidence-adjacent paths — treat as trace / pack material; do not auto-merge or delete.',
      proposed_canonical_home: null,
      minimum_safe_next_step:
        'Archive policy only: if consolidation is ever needed, copy-forward with human sign-off — never silent rewrite.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (risk === 'RED' || underSafety || cat === 'safety') {
    return {
      ...base,
      action: 'HUMAN_REVIEW_ONLY',
      why_duplicated:
        'Safety-adjacent or RED-tagged cluster — Phase 2 does not propose doc merges or code extraction.',
      proposed_canonical_home: null,
      minimum_safe_next_step:
        'Governance + creator review only; optional cross-links written by hand after policy check.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (underReportsOnly) {
    return {
      ...base,
      action: 'IGNORE_TRIVIAL',
      why_duplicated:
        'All hits live under generated report JSON — repeating keys/strings across runs is expected; not a refactor spine.',
      proposed_canonical_home: null,
      minimum_safe_next_step: 'None; exclude from refactor backlog unless a human chooses to template report shape.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (snapshotOrTemp) {
    return {
      ...base,
      action: 'KEEP_AS_EVIDENCE',
      why_duplicated:
        'Snapshot, export pack, or test temp paths — repetition preserves historical or CI trace.',
      proposed_canonical_home: null,
      minimum_safe_next_step: 'Do not dedupe across snapshots; hub source of truth stays separate.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (/mirrorsoul|mirror.?soul|mirror_soul|z-display-morph|z_registry/i.test(preview + joined)) {
    return {
      ...base,
      action: 'MAKE_ALIAS_MAP',
      why_duplicated:
        'Naming or module-id token appears in multiple places — drift risk; canonical alias map is a suggestion only.',
      proposed_canonical_home: 'data/canonical/z_alias_map.json (suggested; file does not need to exist yet)',
      minimum_safe_next_step:
        'Human drafts alias rows; wire into master registry / docs index when ready — no auto-edit.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (allMd && !underSafety) {
    return {
      ...base,
      action: 'MAKE_SHARED_DOC_REFERENCE',
      why_duplicated: 'Same markdown line or block surfaced in multiple docs — good candidate for one canonical fragment.',
      proposed_canonical_home: 'docs/shared/ (suggested fragment or single canonical doc + links)',
      minimum_safe_next_step:
        'Author copies minimal shared snippet and replaces duplicates with links — after editorial review.',
      eligible_for_future_patch_suggestion: true
    };
  }

  if (g.kind === 'exact_line' && isTrivialCssDeclarationLine(preview)) {
    return {
      ...base,
      action: 'IGNORE_TRIVIAL',
      why_duplicated:
        'Repeated single-line CSS declaration (e.g. font-size, color, margin, padding) — stylistic boilerplate, not a UI component spine.',
      proposed_canonical_home: null,
      minimum_safe_next_step:
        'Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line clusters.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (isHtmlDocumentSkeletonWindow(g)) {
    return {
      ...base,
      action: 'IGNORE_TRIVIAL',
      why_duplicated:
        'Four-line cluster matches HTML document skeleton (html / head / charset meta / viewport meta) — not a meaningful shared dashboard component.',
      proposed_canonical_home: null,
      minimum_safe_next_step: 'None.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (anyDashboard || cat === 'dashboard') {
    return {
      ...base,
      action: 'MAKE_DASHBOARD_COMPONENT',
      why_duplicated: 'Repeated UI/markup or client script windows across dashboard surfaces.',
      proposed_canonical_home: 'dashboard/shared/ or shared partial (suggested)',
      minimum_safe_next_step:
        'Prototype shared partial behind a feature flag or separate include; verify in browser before merge.',
      eligible_for_future_patch_suggestion: true
    };
  }

  if (allScripts || cat === 'script') {
    return {
      ...base,
      action: 'MAKE_SCRIPT_HELPER',
      why_duplicated: 'Same helper-style line window across hub scripts — candidate for scripts/lib extraction.',
      proposed_canonical_home: 'scripts/lib/ (suggested; add only after tests and import graph review)',
      minimum_safe_next_step:
        'Draft helper module in a branch; migrate one consumer at a time with npm verify — no mass replace.',
      eligible_for_future_patch_suggestion: true
    };
  }

  if (cat === 'registry' && anyMatch(paths, (p) => p.startsWith('data/') && p.endsWith('.json'))) {
    return {
      ...base,
      action: 'HUMAN_REVIEW_ONLY',
      why_duplicated:
        'Registry JSON duplication touches governance truth — align with Z-EAII / manifest sync before any merge.',
      proposed_canonical_home: null,
      minimum_safe_next_step: 'Use module registry sync + human diff; do not auto-merge JSON.',
      eligible_for_future_patch_suggestion: false
    };
  }

  if (risk === 'ORANGE') {
    return {
      ...base,
      action: 'HUMAN_REVIEW_ONLY',
      why_duplicated:
        'ORANGE risk — scripts, dashboards, or data paths; default to human review until scope is narrowed.',
      proposed_canonical_home: null,
      minimum_safe_next_step: 'Triage in a PR with evidence links to this plan row.',
      eligible_for_future_patch_suggestion: false
    };
  }

  return {
    ...base,
    action: 'IGNORE_TRIVIAL',
    why_duplicated:
      'Low-signal repetition (e.g. common config or boilerplate) — not worth a structural change without new evidence.',
    proposed_canonical_home: null,
    minimum_safe_next_step: 'None unless product owner re-prioritizes.',
    eligible_for_future_patch_suggestion: false
  };
}

function histogram(rows) {
  const o = Object.fromEntries(ACTIONS.map((a) => [a, 0]));
  for (const r of rows) {
    if (o[r.action] !== undefined) o[r.action] += 1;
  }
  return o;
}

function buildMd(payload) {
  const h = payload.summary?.action_histogram || {};
  const L = [];
  L.push('# Z-CAR² refactor plan (Phase 2 — plan only)');
  L.push('');
  L.push(`Generated: ${payload.generated_at}`);
  L.push(`Source scan: ${payload.source_phase1_generated_at || '—'}`);
  L.push('');
  L.push('## Posture');
  L.push('');
  L.push('- **No source files modified.** No patches. No apply mode.');
  L.push('- **Safety docs:** never auto-refactored; RED/safety clusters stay human-only.');
  L.push('- **Audit outputs** (`data/reports/`) are not canonical truth — repeated lines there are usually IGNORE.');
  L.push('');
  L.push('## Action histogram');
  L.push('');
  L.push('| Action | Count |');
  L.push('| --- | ---: |');
  for (const a of ACTIONS) {
    L.push(`| ${a} | ${h[a] ?? 0} |`);
  }
  L.push('');
  L.push('## Sample rows (first 25)');
  L.push('');
  L.push('| Group | Action | Risk | Files | Next step |');
  L.push('| --- | --- | --- | ---: | --- |');
  for (const r of (payload.planned_groups || []).slice(0, 25)) {
    const step = String(r.minimum_safe_next_step || '—')
      .replace(/\|/g, '\\|')
      .slice(0, 100);
    L.push(
      `| ${r.group_id} | ${r.action} | ${r.risk_level} | ${r.involved_files.length} | ${step}… |`
    );
  }
  L.push('');
  L.push('Full JSON: `data/reports/z_car2_refactor_plan.json`.');
  L.push('');
  return L.join('\n');
}

function main() {
  if (!fs.existsSync(IN_JSON)) {
    console.error('Missing Phase 1 report. Run: npm run z:car2');
    process.exitCode = 1;
    return;
  }
  const phase1 = JSON.parse(fs.readFileSync(IN_JSON, 'utf8'));
  const lineGroups = phase1.duplicate_line_groups || [];
  const winGroups = phase1.duplicate_window_groups || [];

  const plannedLine = lineGroups.map(planForGroup);
  const plannedWin = winGroups.map(planForGroup);
  const planned_groups = [...plannedLine, ...plannedWin];

  const payload = {
    generated_at: new Date().toISOString(),
    mode: 'z_car2_phase2_plan_only',
    source_phase1_generated_at: phase1.generated_at || null,
    source_report: 'data/reports/z_car2_similarity_report.json',
    readme:
      'Phase 2 is advisory. eligible_for_future_patch_suggestion marks rows that may later feed a human-reviewed patch plan — never auto-apply.',
    summary: {
      groups_planned: planned_groups.length,
      line_groups: plannedLine.length,
      window_groups: plannedWin.length,
      action_histogram: histogram(planned_groups),
      eligible_for_future_patch_suggestion_count: planned_groups.filter((r) => r.eligible_for_future_patch_suggestion)
        .length
    },
    planned_groups
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(OUT_MD, buildMd(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        out_json: 'data/reports/z_car2_refactor_plan.json',
        out_md: 'data/reports/z_car2_refactor_plan.md',
        groups: planned_groups.length,
        patch_eligible_rows: payload.summary.eligible_for_future_patch_suggestion_count
      },
      null,
      2
    )
  );
}

main();
