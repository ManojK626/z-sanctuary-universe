#!/usr/bin/env node
/**
 * scripts/z_generate_module_docs.mjs — Z-Sanctuary AI Builder module doc generator.
 * Read-only inputs; writes Markdown under docs/ from registry truth + filesystem evidence.
 * No network. Does not install, deploy, merge, or activate product features.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const PATHS = {
  master: path.join(ROOT, 'data', 'z_master_module_registry.json'),
  engines: path.join(ROOT, 'data', 'z_core_engines_registry.json'),
  zunoAudit: path.join(ROOT, 'data', 'reports', 'z_zuno_coverage_audit.json'),
  phase3: path.join(ROOT, 'data', 'reports', 'z_zuno_phase3_completion_plan.json'),
  zModuleRegistry: path.join(ROOT, 'data', 'Z_module_registry.json'),
  safetyDir: path.join(ROOT, 'docs', 'safety'),
  modulesOut: path.join(ROOT, 'docs', 'modules'),
  moduleIndex: path.join(ROOT, 'docs', 'Z_SANCTUARY_MODULE_INDEX.md'),
  engineIndex: path.join(ROOT, 'docs', 'Z_SANCTUARY_ENGINE_INDEX.md'),
  safetyIndex: path.join(ROOT, 'docs', 'Z_SANCTUARY_SAFETY_INDEX.md')
};

const SAFETY_FILES = [
  'GAMBLING_PREDICTION_BOUNDARY.md',
  'LOCATION_CAMERA_MIC_BOUNDARY.md',
  'BABY_PREDICTOR_CONSENT_BOUNDARY.md',
  'NON_MEDICAL_PRODUCT_BOUNDARY.md',
  'MIRRORSOUL_PRIVACY_BOUNDARY.md',
  'LOTTERY_RESPONSIBLE_USE_BOUNDARY.md'
];

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function slugCategory(cat) {
  const s = String(cat || 'uncategorized')
    .replace(/[/\\]+/g, '_')
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
  return s || 'uncategorized';
}

function existsRel(rel) {
  if (!rel || typeof rel !== 'string') return false;
  const n = rel.replace(/\\/g, '/');
  return fs.existsSync(path.join(ROOT, n));
}

function listSafetyDocs() {
  if (!fs.existsSync(PATHS.safetyDir)) return [];
  return fs
    .readdirSync(PATHS.safetyDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

/** Map free-text hints to safety doc paths (evidence: files under docs/safety/). */
function suggestSafetyLinks(mod) {
  const blob = `${mod.notes || ''} ${(mod.tags || []).join(' ')} ${(mod.safety_flags || []).join(' ')}`.toLowerCase();
  const out = new Set();
  const add = (name) => {
    if (SAFETY_FILES.includes(name) && fs.existsSync(path.join(PATHS.safetyDir, name))) {
      out.add(`docs/safety/${name}`);
    }
  };
  if (/gambl|prediction|betting/.test(blob)) add('GAMBLING_PREDICTION_BOUNDARY.md');
  if (/lottery|ticket/.test(blob)) add('LOTTERY_RESPONSIBLE_USE_BOUNDARY.md');
  if (/gps|location|camera|mic|device/.test(blob)) add('LOCATION_CAMERA_MIC_BOUNDARY.md');
  if (/baby|predictor|pregnancy/.test(blob)) add('BABY_PREDICTOR_CONSENT_BOUNDARY.md');
  if (/medical|health|clinical|diagnos/.test(blob)) add('NON_MEDICAL_PRODUCT_BOUNDARY.md');
  if (/mirror|soul|intimate|dating/.test(blob)) add('MIRRORSOUL_PRIVACY_BOUNDARY.md');
  if (mod.safety_class === 'high' || (mod.safety_flags && mod.safety_flags.length)) {
    for (const f of SAFETY_FILES) add(f);
  }
  return [...out];
}

function zunoVerdict({ registry_status, evidenceOk, expectedCount, zunoStatus }) {
  if (registry_status === 'safety_hold') return 'SAFETY_HOLD';
  if (registry_status === 'decision_required') return 'NEEDS_AMK_DECISION';
  if (registry_status === 'doctrine_only') return 'READY_FOR_DOCS_ONLY';
  if (registry_status === 'planned_stub' && expectedCount === 0) return 'READY_FOR_DOCS_ONLY';
  if (registry_status === 'partial' || zunoStatus === 'FOUND_PARTIAL') return 'READY_FOR_SAFE_REFACTOR';
  if (registry_status === 'implemented' && evidenceOk) return 'READY_FOR_SAFE_REFACTOR';
  if (registry_status === 'implemented' && !evidenceOk) return 'READY_FOR_SAFE_REFACTOR';
  if (zunoStatus === 'NEEDS_SAFETY_REVIEW') return 'SAFETY_HOLD';
  if (zunoStatus === 'NEEDS_DECISION') return 'NEEDS_AMK_DECISION';
  return 'READY_FOR_DOCS_ONLY';
}

function buildZunoMap(audit) {
  const map = new Map();
  if (!audit || !Array.isArray(audit.modules)) return map;
  for (const row of audit.modules) {
    if (row.module_id) map.set(row.module_id, row);
  }
  return map;
}

function buildPhase3Map(phase3) {
  const map = new Map();
  if (!phase3 || typeof phase3 !== 'object') return map;
  for (const [k, v] of Object.entries(phase3)) {
    if (!k.startsWith('lane') || !Array.isArray(v)) continue;
    for (const row of v) {
      if (!row || typeof row !== 'object' || !row.module_id) continue;
      const prev = map.get(row.module_id) || {
        why_partial: [],
        minimum_safe: [],
        closure_notes: [],
        boundary_docs_primary: [],
        decision_options: []
      };
      map.set(row.module_id, {
        why_partial: [...prev.why_partial, ...(row.why_partial || [])],
        minimum_safe: [...prev.minimum_safe, ...(row.minimum_safe_toward_found_full || [])],
        closure_notes: [...prev.closure_notes, ...(row.closure_notes ? [row.closure_notes] : [])],
        boundary_docs_primary: [...prev.boundary_docs_primary, ...(row.boundary_docs_primary || [])],
        decision_options: [...prev.decision_options, ...(row.options || [])]
      });
    }
  }
  return map;
}

function renderModuleDoc(mod, zunoRow, phaseHint) {
  const id = mod.id || mod.module_id || 'unknown';
  const name = mod.name || id;
  const category = mod.category || 'uncategorized';
  const registryStatus = mod.registry_status || 'unknown';
  const safetyClass = mod.safety_class || 'unknown';
  const zid = mod.z_registry_zid != null ? String(mod.z_registry_zid) : '—';
  const expected = Array.isArray(mod.expected_paths) ? mod.expected_paths : [];
  const evidenceLines = [];
  for (const rel of expected) {
    const ok = existsRel(rel);
    evidenceLines.push(`- \`${rel}\` — **${ok ? 'present' : 'missing'}**`);
  }
  const zunoFound = zunoRow && Array.isArray(zunoRow.evidence_paths_found) ? zunoRow.evidence_paths_found : [];
  for (const rel of zunoFound) {
    if (!expected.includes(rel) && rel) {
      const ok = existsRel(rel);
      evidenceLines.push(`- \`${rel}\` — **${ok ? 'present' : 'missing'}** _(Zuno audit evidence)_`);
    }
  }

  const evidenceOk =
    expected.length === 0 ? false : expected.every((rel) => existsRel(rel));
  const zunoStatus = zunoRow ? zunoRow.status : '—';
  const verdict = zunoVerdict({
    registry_status: registryStatus,
    evidenceOk: expected.length ? evidenceOk : zunoFound.length > 0,
    expectedCount: expected.length,
    zunoStatus
  });

  const suggested = new Set(suggestSafetyLinks(mod));
  if (phaseHint && phaseHint.boundary_docs_primary) {
    for (const b of phaseHint.boundary_docs_primary) {
      if (typeof b === 'string' && b.startsWith('docs/safety/')) suggested.add(b);
    }
  }
  const suggestedArr = [...suggested];
  const linkSafety = (p) => `- [\`${path.basename(p)}\`](../../safety/${path.basename(p)})`;
  const safetyBlock =
    suggestedArr.length > 0
      ? suggestedArr.map(linkSafety).join('\n')
      : '_No keyword-boundary match for this module. See hub [Z_SANCTUARY_SAFETY_INDEX.md](../../Z_SANCTUARY_SAFETY_INDEX.md) and `docs/safety/`._';

  let posture = `Registry lists **${registryStatus}**.`;
  if (expected.length === 0 && zunoFound.length === 0) {
    posture += ' No `expected_paths` in master registry — treat as doctrine, stub, or external until paths are added with on-disk proof.';
  } else if (!evidenceOk && expected.length) {
    posture += ' Some expected paths are missing on disk — do not claim full implementation.';
  } else if (evidenceOk) {
    posture += ' Declared paths exist — implementation evidence present at file level (runtime behaviour not asserted here).';
  }

  function formatPhaseBody(h) {
    if (!h) return '';
    const uniq = (a) => [...new Set((a || []).filter(Boolean))];
    const blocks = [];
    const wp = uniq(h.why_partial || []).slice(0, 8);
    if (wp.length) {
      blocks.push(`**Phase 3 hints (from last plan JSON):**\n\n${wp.map((w) => `- ${w}`).join('\n')}`);
    }
    const cn = uniq(h.closure_notes || []).slice(0, 4);
    if (cn.length) {
      blocks.push(`**Closure / safety notes:**\n\n${cn.map((c) => `- ${c}`).join('\n')}`);
    }
    const opts = (h.decision_options || []).slice(0, 4);
    if (opts.length) {
      const lines = opts.map((o) => `- \`${o.id || 'option'}\`: ${o.label || ''}`);
      blocks.push(`**Decision options (lane 3):**\n\n${lines.join('\n')}`);
    }
    return blocks.join('\n\n');
  }
  const phaseBody = formatPhaseBody(phaseHint);

  const forbidden = [
    'Auto-merge, deploy, publish, or enable payments without AMK consent and release gates.',
    'Invent files, paths, or features not listed in registry + evidence above.',
    'Activate GPS, camera, mic, health, gambling, emergency, soulmate/baby predictor, or marketplace automation without explicit boundary review.'
  ];
  if (registryStatus === 'safety_hold') forbidden.push('Treat as **safety hold** — no speculative code paths until governance clears.');

  const allowed = [
    'Documentation and registry alignment only unless a separate charter approves code.',
    'Re-run `npm run zuno:coverage` after changing `expected_paths`.',
    'Re-run `npm run z:docs:modules` to refresh this file from truth sources.'
  ];
  if (verdict === 'READY_FOR_SAFE_REFACTOR') {
    allowed.push('Narrow refactors inside evidenced files with human review and verify pipeline.');
  }

  return `# ${name}

## Registry Identity

| Field | Value |
| --- | --- |
| **ID** | \`${id}\` |
| **Category** | ${category} |
| **Registry status** | ${registryStatus} |
| **Safety class** | ${safetyClass} |
| **Z registry ZID** | ${zid} |
| **Zuno audit status** | ${zunoStatus} |

## Purpose

${mod.notes ? String(mod.notes) : 'See master registry `notes` and hub doctrine; no extra claims added by generator.'}

## Current Evidence

${evidenceLines.length ? evidenceLines.join('\n') : '> No implementation evidence paths declared in master registry (`expected_paths` empty) and no Zuno audit evidence paths. **Doctrine / stub / hold until paths exist on disk.**'}

## Current Build Posture

${posture}${phaseBody ? `\n\n${phaseBody}` : ''}

## Safety Boundaries

Cross-check hub safety doctrine (generator suggestions only — human authority wins):

${safetyBlock || '_No linked safety files; see `docs/safety/`._'}

## Allowed Next Steps

${allowed.map((x) => `- ${x}`).join('\n')}

## Forbidden Until Gate

${forbidden.map((x) => `- ${x}`).join('\n')}

## Cursor Builder Notes

- Read \`data/z_master_module_registry.json\` and this file together; registry ID is canonical.
- Do not claim **implemented** unless evidence paths above are present (or audit proves alternate evidence).
- Default deployment posture: **HOLD** unless AMK and Overseer workflow say otherwise.

## Zuno Verdict

\`${verdict}\`
`;
}

function main() {
  const warnings = [];
  const master = readJson(PATHS.master);
  if (!master || !Array.isArray(master.modules)) {
    console.error('Missing or invalid data/z_master_module_registry.json');
    process.exit(1);
  }

  const audit = readJson(PATHS.zunoAudit);
  if (!audit) warnings.push('z_zuno_coverage_audit.json missing — run npm run zuno:coverage');
  const zunoMap = buildZunoMap(audit);

  const phase3 = readJson(PATHS.phase3);
  if (!phase3) warnings.push('z_zuno_phase3_completion_plan.json missing — run npm run zuno:phase3-plan');
  const phaseMap = buildPhase3Map(phase3);

  const zMod = readJson(PATHS.zModuleRegistry);
  const zModCount = zMod && Array.isArray(zMod.ZModules) ? zMod.ZModules.length : 0;

  const safetyRelList = listSafetyDocs().map((f) => `docs/safety/${f}`);
  if (!safetyRelList.length) warnings.push('No docs/safety/*.md found');

  fs.mkdirSync(PATHS.modulesOut, { recursive: true });

  const byCategory = new Map();
  let written = 0;

  for (const mod of master.modules) {
    const id = mod.id || mod.module_id;
    if (!id) {
      warnings.push('Skipped module row without id');
      continue;
    }
    const catSlug = slugCategory(mod.category);
    const dir = path.join(PATHS.modulesOut, catSlug);
    fs.mkdirSync(dir, { recursive: true });

    const zunoRow = zunoMap.get(id) || null;
    const phaseHint = phaseMap.get(id) || null;
    const body = renderModuleDoc(mod, zunoRow, phaseHint);
    const outFile = path.join(dir, `${id.replace(/[/\\]/g, '-')}.md`);
    fs.writeFileSync(outFile, body, 'utf8');
    written++;

    if (!byCategory.has(catSlug)) byCategory.set(catSlug, []);
    byCategory.get(catSlug).push({ id, registry_status: mod.registry_status || 'unknown', rel: `modules/${catSlug}/${id.replace(/[/\\]/g, '-')}.md` });
  }

  const genAt = new Date().toISOString();
  const indexLines = [
    '<!-- Generated by scripts/z_generate_module_docs.mjs — do not hand-edit tables; re-run npm run z:docs:modules -->',
    '',
    '# Z-Sanctuary module index (AI Builder)',
    '',
    `**Generated:** ${genAt}`,
    '',
    '**Sources:** `data/z_master_module_registry.json`, optional `data/reports/z_zuno_coverage_audit.json`, `data/reports/z_zuno_phase3_completion_plan.json`.',
    '',
    '**Rule:** No module page without a registry ID; per-module files live under `docs/modules/<category>/`.',
    '',
    `**Counts:** master modules=${master.modules.length}; Z_module_registry rows=${zModCount || 'n/a'}.`,
    '',
    '## By category',
    ''
  ];

  const statusOrder = ['implemented', 'partial', 'planned_stub', 'doctrine_only', 'safety_hold', 'decision_required', 'unknown'];
  for (const catSlug of [...byCategory.keys()].sort()) {
    indexLines.push(`### ${catSlug}`, '', '| ID | Registry status | Doc |', '| --- | --- | --- |');
    const rows = byCategory.get(catSlug).sort((a, b) => a.id.localeCompare(b.id));
    for (const r of rows) {
      indexLines.push(`| \`${r.id}\` | ${r.registry_status} | [open](${r.rel.replace(/\\/g, '/')}) |`);
    }
    indexLines.push('');
  }

  indexLines.push('## By registry status', '', '| Status | Count |', '| --- | ---: |');
  const hist = {};
  for (const mod of master.modules) {
    const s = mod.registry_status || 'unknown';
    hist[s] = (hist[s] || 0) + 1;
  }
  for (const s of statusOrder) {
    if (hist[s]) indexLines.push(`| ${s} | ${hist[s]} |`);
  }
  for (const s of Object.keys(hist).sort()) {
    if (!statusOrder.includes(s)) indexLines.push(`| ${s} | ${hist[s]} |`);
  }
  indexLines.push('');

  fs.writeFileSync(PATHS.moduleIndex, indexLines.join('\n'), 'utf8');

  const engines = readJson(PATHS.engines);
  const engLines = [
    '<!-- Generated by scripts/z_generate_module_docs.mjs -->',
    '',
    '# Z-Sanctuary engine index (AI Builder)',
    '',
    `**Generated:** ${genAt}`,
    '',
    '**Source:** `data/z_core_engines_registry.json` (registry truth; runtime proof is separate).',
    '',
    '| ID | Name | Status | Risk | Role |',
    '| --- | --- | --- | --- | --- |'
  ];
  if (engines && Array.isArray(engines.engines)) {
    for (const e of engines.engines) {
      engLines.push(
        `| \`${e.id}\` | ${(e.name || '').replace(/\|/g, '/')} | ${e.status || ''} | ${e.risk || ''} | ${(e.role || '').replace(/\|/g, '/')} |`
      );
    }
  } else {
    engLines.push('| _none_ | — | — | — | Registry missing or empty |');
    warnings.push('z_core_engines_registry.json missing engines[]');
  }
  engLines.push('');
  fs.writeFileSync(PATHS.engineIndex, engLines.join('\n'), 'utf8');

  const safeLines = [
    '<!-- Generated by scripts/z_generate_module_docs.mjs -->',
    '',
    '# Z-Sanctuary safety index (AI Builder)',
    '',
    `**Generated:** ${genAt}`,
    '',
    '**Evidence:** files under `docs/safety/`.',
    '',
    '| Document | Path |',
    '| --- | --- |'
  ];
  for (const f of listSafetyDocs()) {
    safeLines.push(`| ${f.replace(/_/g, ' ')} | [docs/safety/${f}](safety/${f}) |`);
  }
  if (listSafetyDocs().length === 0) {
    safeLines.push('| _none_ | — |');
  }
  safeLines.push(
    '',
    '**Related:** `docs/Z_SANCTUARY_BUILD_RULES.md`, `docs/ai-builder/CURSOR_NO_HALLUCINATION_RULES.md`, phase 3 constraints in `data/reports/z_zuno_phase3_completion_plan.json`.',
    ''
  );
  fs.writeFileSync(PATHS.safetyIndex, safeLines.join('\n'), 'utf8');

  const readme = path.join(PATHS.modulesOut, 'README.md');
  const readmeBody = `# docs/modules — per-module AI Builder pages

**Generated pages:** one Markdown file per row in \`data/z_master_module_registry.json\`, grouped by category slug (folder name).

**Do not invent modules:** every file name matches a registry \`id\`.

**Refresh:** \`npm run z:docs:modules\` (after \`npm run zuno:coverage\` and \`npm run zuno:phase3-plan\` when you want audit text embedded).

**Template for humans:** [_MODULE_TEMPLATE.md](./_MODULE_TEMPLATE.md)

**Indexes:** [Z_SANCTUARY_MODULE_INDEX.md](../Z_SANCTUARY_MODULE_INDEX.md), [Z_SANCTUARY_ENGINE_INDEX.md](../Z_SANCTUARY_ENGINE_INDEX.md), [Z_SANCTUARY_SAFETY_INDEX.md](../Z_SANCTUARY_SAFETY_INDEX.md).
`;
  fs.writeFileSync(readme, readmeBody, 'utf8');

  console.log(`Z-AI Builder docs: wrote ${written} module files + 3 indexes + modules/README.md`);
  if (warnings.length) {
    console.log('Warnings:');
    for (const w of warnings) console.log(`  - ${w}`);
  }
}

main();
