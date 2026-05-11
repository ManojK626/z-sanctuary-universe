#!/usr/bin/env node
/**
 * Phase 3 — completion plan from latest coverage audit (read-only inputs).
 * Reads: data/reports/z_zuno_coverage_audit.json, data/z_master_module_registry.json
 * Writes: data/reports/z_zuno_phase3_completion_plan.{json,md}
 *
 * Run: node scripts/z_zuno_phase3_plan.mjs
 * Prefer: npm run zuno:coverage && npm run zuno:phase3-plan
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const AUDIT = path.join(ROOT, 'data', 'reports', 'z_zuno_coverage_audit.json');
const MASTER = path.join(ROOT, 'data', 'z_master_module_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_zuno_phase3_completion_plan.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_zuno_phase3_completion_plan.md');

const CONSTRAINTS = [
  'No fake implementation paths.',
  'No payment, GPS, camera, mic, gambling automation, soulmate/baby predictor, emergency, or health product activation.',
  'Deployment HOLD: registry and documentation first; UI/backend only when explicitly approved.',
  'Evidence-first: re-run npm run zuno:coverage after any master registry or path change.'
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadMasterMap() {
  const raw = readJson(MASTER);
  const mods = Array.isArray(raw.modules) ? raw.modules : [];
  const map = new Map();
  for (const m of mods) {
    if (m?.id) map.set(String(m.id), m);
  }
  return map;
}

function analyzePartialWhy(auditMod, masterRow) {
  const reasons = [];
  const miss = auditMod.missing_expected_paths || [];
  const notes = auditMod.doc_mention_notes || [];
  const exp = Array.isArray(masterRow?.expected_paths) ? masterRow.expected_paths : [];

  if (miss.length) {
    reasons.push(`Declared expected path(s) not on disk: ${miss.join('; ')}`);
  }
  for (const n of notes) {
    if (String(n).includes('token_miss')) reasons.push('doc_mentions contract failed (tokens not found in referenced doc).');
    if (String(n).includes('missing_file')) reasons.push('doc_mentions references a doc file that is missing.');
  }
  if (auditMod.registry_note) reasons.push(auditMod.registry_note);
  if (!reasons.length && exp.length === 0) {
    reasons.push(
      'Master registry has zero expected_paths (Z_module_registry ZEntry absent on disk, non-path ZEntry, or vision doctrine row). Audit rule: zero paths ⇒ FOUND_PARTIAL.'
    );
  }
  if (!reasons.length && exp.length > 0 && miss.length === 0) {
    reasons.push('Partial status from doc/registry contract or path subset (see audit doc_checks if present).');
  }
  return reasons;
}

function minimumSafeSteps(auditMod, masterRow, reasons) {
  const steps = [];
  const miss = auditMod.missing_expected_paths || [];
  const exp = Array.isArray(masterRow?.expected_paths) ? masterRow.expected_paths : [];
  const zEntry = masterRow?.notes || '';

  if (miss.length) {
    steps.push(`Restore or relocate files: ${miss.join(', ')} — or narrow expected_paths in master after confirming intentional removal.`);
  }
  if (reasons.some((r) => r.includes('doc_mentions'))) {
    steps.push('Edit the referenced boundary/spec doc to include required tokens, or relax doc_mentions in master (human gate).');
  }
  if (exp.length === 0 && auditMod.registry_status === 'planned_stub') {
    steps.push(
      'When code/docs exist: add real paths to Z_module_registry ZEntry (or master expected_paths) only after verifying files on disk; run npm run zuno:master-expand then npm run zuno:coverage.'
    );
    if (zEntry && String(zEntry).includes('docs/')) {
      steps.push(
        'Optional doc-only lane: add a short spec under docs/ linking this module (does not alone yield FOUND_FULL without expected_paths).',
      );
    }
  }
  if (exp.length === 0 && auditMod.registry_status === 'doctrine_only') {
    steps.push('Keep as doctrine until a canonical ZEntry or master path is agreed; avoid inflating to FOUND_FULL without disk evidence.');
  }
  if (!steps.length) {
    steps.push('Re-run coverage after registry or file changes; no automated fix.');
  }
  return steps;
}

function boundaryDocsForModule(moduleId, masterRow, auditMod) {
  const fromMaster = [];
  const dm = Array.isArray(masterRow?.doc_mentions) ? masterRow.doc_mentions : [];
  for (const d of dm) {
    const p = d.path || d.file;
    if (p) fromMaster.push(p.replace(/\\/g, '/'));
  }
  if (fromMaster.length) return { primary: fromMaster, source: 'master.doc_mentions' };

  const fallback = {
    soulmate_baby_predictor: ['docs/safety/BABY_PREDICTOR_CONSENT_BOUNDARY.md'],
    gps_safety_module: ['docs/safety/LOCATION_CAMERA_MIC_BOUNDARY.md'],
    gambling_prediction_voice: ['docs/safety/GAMBLING_PREDICTION_BOUNDARY.md'],
    movement_health_coach_lite: ['docs/safety/NON_MEDICAL_PRODUCT_BOUNDARY.md'],
    roulette: ['docs/safety/GAMBLING_PREDICTION_BOUNDARY.md', 'docs/safety/LOTTERY_RESPONSIBLE_USE_BOUNDARY.md'],
    'roulette-calculator': ['docs/safety/GAMBLING_PREDICTION_BOUNDARY.md'],
    mirrorsoul_hub_slice: ['docs/safety/MIRRORSOUL_PRIVACY_BOUNDARY.md'],
    public_trust_portal_lottery: ['docs/safety/LOTTERY_RESPONSIBLE_USE_BOUNDARY.md']
  };
  if (fallback[moduleId]) return { primary: fallback[moduleId], source: 'heuristic_map' };
  return { primary: [], source: 'none' };
}

function buildMarkdown(plan) {
  const L = [];
  L.push('# Z-Zuno Phase 3 — completion plan');
  L.push('');
  L.push(`Generated: ${plan.generated_at}`);
  L.push('');
  L.push('## Constraints');
  CONSTRAINTS.forEach((c) => L.push(`- ${c}`));
  L.push('');
  L.push('## Audit snapshot (inputs)');
  L.push('');
  L.push('| Status | Count |');
  L.push('| --- | ---: |');
  for (const [k, v] of Object.entries(plan.audit_summary_counts || {})) {
    L.push(`| ${k} | ${v} |`);
  }
  L.push('');
  L.push('## Lane 1 — FOUND_PARTIAL queue');
  L.push('');
  L.push('| Module | Category | Why partial (summary) | Minimum safe toward FOUND_FULL |');
  L.push('| --- | --- | --- | --- |');
  for (const row of plan.lane1_found_partial) {
    const why = row.why_partial.join(' ');
    const min = row.minimum_safe_toward_found_full.join(' ');
    L.push(
      `| ${row.module_id} | ${String(row.category).replace(/\|/g, '\\|')} | ${why.replace(/\|/g, '\\|')} | ${min.replace(/\|/g, '\\|')} |`
    );
  }
  L.push('');
  L.push('## Lane 2 — NEEDS_SAFETY_REVIEW → boundary docs');
  L.push('');
  L.push('| Module | Boundary docs | Closure notes |');
  L.push('| --- | --- | --- |');
  for (const row of plan.lane2_safety_review) {
    const docs = row.boundary_docs_primary.length ? row.boundary_docs_primary.map((x) => `\`${x}\``).join('<br>') : '—';
    L.push(`| ${row.module_id} | ${docs} | ${String(row.closure_notes).replace(/\|/g, '\\|')} |`);
  }
  L.push('');
  L.push('## Lane 3 — NEEDS_DECISION');
  L.push('');
  for (const row of plan.lane3_decision) {
    L.push(`### ${row.module_id}`);
    L.push('');
    L.push(`- **Option A — ${row.options[0].label}:** ${row.options[0].detail}`);
    L.push(`- **Option B — ${row.options[1].label}:** ${row.options[1].detail}`);
    L.push('');
  }
  L.push('## Lane 4 — Z-Zuno report snapshot (manual paste)');
  L.push('');
  L.push('Copy the block below into `docs/Z-ZUNO-AI-FULL-REPORT.md` under Coverage audit snapshot when you accept the numbers (keeps human gate).');
  L.push('');
  L.push('```md');
  L.push(plan.lane4_zuno_manual_snapshot_md.trimEnd());
  L.push('```');
  L.push('');
  L.push('## Lane 5 — Dashboard / Trust visibility (suggested)');
  L.push('');
  plan.lane5_dashboard.suggestions.forEach((s) => L.push(`- ${s}`));
  L.push('');
  return L.join('\n');
}

function main() {
  if (!fs.existsSync(AUDIT)) {
    console.error('Missing audit. Run: npm run zuno:coverage');
    process.exitCode = 1;
    return;
  }
  const audit = readJson(AUDIT);
  const masterMap = loadMasterMap();
  const modules = audit.modules || [];

  const partial = modules.filter((m) => m.status === 'FOUND_PARTIAL');
  const safety = modules.filter((m) => m.status === 'NEEDS_SAFETY_REVIEW');
  const decision = modules.filter((m) => m.status === 'NEEDS_DECISION');

  const lane1 = partial.map((m) => {
    const masterRow = masterMap.get(m.module_id) || {};
    const why = analyzePartialWhy(m, masterRow);
    const minimum = minimumSafeSteps(m, masterRow, why);
    return {
      module_id: m.module_id,
      module_name: m.module_name,
      category: m.category,
      registry_status: m.registry_status,
      why_partial: why,
      minimum_safe_toward_found_full: minimum,
      audit_evidence_paths_found: m.evidence_paths_found,
      audit_missing_expected_paths: m.missing_expected_paths
    };
  });

  const lane2 = safety.map((m) => {
    const masterRow = masterMap.get(m.module_id) || {};
    const bd = boundaryDocsForModule(m.module_id, masterRow, m);
    const docOk = (m.doc_mention_notes || []).some((n) => String(n).includes(': ok'));
    const hasDisk = (m.evidence_paths_found || []).length > 0;
    const isHold = m.registry_status === 'safety_hold';

    let closure =
      'Human review: confirm UX copy, retention, data minimization, and jurisdiction gates before widening access.';
    if (!docOk && bd.primary.length) {
      closure = `Add doc_mentions in master for ${bd.primary.join(', ')} with tokens present in those files, then npm run zuno:coverage.`;
    } else if (isHold && !hasDisk && docOk) {
      closure =
        'Doctrine / safety_hold: boundary text verifies; no implementation paths yet — creator sign-off before any UX or automation.';
    } else if (isHold && !hasDisk && !docOk) {
      closure =
        'Safety_hold without disk evidence: wire boundary docs + master doc_mentions first; keep build and deploy HOLD.';
    } else if (docOk && (isHold || (m.safety_flags || []).length)) {
      closure =
        'Boundary doc tokens satisfied; still requires explicit human safety sign-off before production-facing changes.';
    }
    return {
      module_id: m.module_id,
      module_name: m.module_name,
      category: m.category,
      registry_status: m.registry_status,
      safety_flags: m.safety_flags,
      boundary_docs_primary: bd.primary,
      boundary_doc_map_source: bd.source,
      closure_notes: closure
    };
  });

  const lane3 = decision.map((m) => ({
    module_id: m.module_id,
    module_name: m.module_name,
    notes: m.notes,
    options: [
      {
        id: 'keep_decision_required',
        label: 'Keep as intentional decision_required',
        detail:
          'Leave master registry_status as decision_required; document in Zuno or governance doc that monetization is deferred until AMK-Goku defines policy.'
      },
      {
        id: 'resolve_to_doctrine_or_stub',
        label: 'Resolve into doctrine_only or planned_stub',
        detail:
          'Change registry_status to doctrine_only (no paths) or planned_stub with a single verified doc path (e.g. economy ethics note under docs/) after file exists; re-run coverage.'
      }
    ]
  }));

  const counts = audit.summary_counts || {};
  const lane4Md = `
**Latest coverage counters** (from \`data/reports/z_zuno_coverage_audit.json\` at plan generation):

| Status | Count |
| --- | ---: |
| FOUND_FULL | ${counts.FOUND_FULL ?? '—'} |
| FOUND_PARTIAL | ${counts.FOUND_PARTIAL ?? '—'} |
| MISSING | ${counts.MISSING ?? '—'} |
| DUPLICATE_OR_CONFLICT | ${counts.DUPLICATE_OR_CONFLICT ?? '—'} |
| NEEDS_SAFETY_REVIEW | ${counts.NEEDS_SAFETY_REVIEW ?? '—'} |
| NEEDS_DECISION | ${counts.NEEDS_DECISION ?? '—'} |

**Phase 3 plan:** \`data/reports/z_zuno_phase3_completion_plan.md\`
`.trim();

  const lane5 = {
    suggestions: [
      'Trust Portal / lottery subtree: read-only display of `data/reports/z_zuno_coverage_audit.json` summary (operator refresh after `npm run zuno:coverage`) — avoid hard-coding stale counts.',
      'SKK–RKPK dashboard: optional small panel linking to `z_zuno_coverage_audit.md` and Phase 3 plan MD (static links first; live counters later with human approval).',
      'Do not enable network fetch to production; local file or same-origin static JSON only.'
    ]
  };

  const plan = {
    generated_at: new Date().toISOString(),
    sources: {
      audit_json: 'data/reports/z_zuno_coverage_audit.json',
      master_registry: 'data/z_master_module_registry.json'
    },
    audit_summary_counts: counts,
    constraints: CONSTRAINTS,
    lane1_found_partial: lane1,
    lane2_safety_review: lane2,
    lane3_decision: lane3,
    lane4_zuno_manual_snapshot_md: lane4Md,
    lane5_dashboard: lane5
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(plan, null, 2), 'utf8');
  fs.writeFileSync(OUT_MD, buildMarkdown(plan), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        written: ['data/reports/z_zuno_phase3_completion_plan.json', 'data/reports/z_zuno_phase3_completion_plan.md'],
        lane1_count: lane1.length,
        lane2_count: lane2.length,
        lane3_count: lane3.length
      },
      null,
      2
    )
  );
}

main();
