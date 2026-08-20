#!/usr/bin/env node
/**
 * Z-SANCTUARY-PID-1-IDENTITY-OBSERVATION-REPORT-1 (PID-1B)
 * Read-only Project Identity observer.
 *
 * Writes only:
 *   data/reports/z_project_identity_observe_status.json
 *   data/reports/z_project_identity_observe_status.md
 *
 * Does not: mutate registries, Overseer, Cycle Observe, indicators, Doorway,
 * Mission Control, deploy, merge, install, NAS, secrets, or auto-canonical.
 *
 * Bound by:
 *   docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md (PID-0.5)
 *   docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md (PID-1A)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PC_ROOT_JSON = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const CONTRACT = path.join(ROOT, 'docs', 'Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md');
const INPUT_MAP = path.join(ROOT, 'docs', 'Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_project_identity_observe_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_project_identity_observe_status.md');
const SCHEMA = 'z_project_identity_observe_status_v1';

const ALLOWED_AUTO = new Set([
  'WORKTREE_OF',
  'CANONICAL_PATH_MISSING',
  'REGISTRY_DISK_DRIFT',
  'HOLD_UNCLASSIFIED',
  'POSSIBLE_RELATIONSHIP',
]);

const FORBIDDEN_AUTO = new Set([
  'BACKUP_OF',
  'MIRROR_OF',
  'CONTINUATION_OF',
  'FORK_OF',
  'CANONICAL',
]);

const DIRTY_U2_ROLES = new Set(['continuation_active', 'hub_backup_slice']);

const MARKING = [
  'DERIVED',
  'READ-ONLY',
  'REBUILDABLE',
  'LOCAL_ONLY',
  'NOT A REGISTRY',
  'NOT MEMBERSHIP AUTHORITY',
  'NOT CANONICAL AUTHORITY',
];

function readJsonSafe(p) {
  try {
    return { ok: true, path: p, data: JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch (e) {
    return { ok: false, path: p, error: String(e?.message || e) };
  }
}

function existsFile(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function git(args) {
  const r = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  return {
    ok: r.status === 0,
    stdout: String(r.stdout || '').trim(),
    stderr: String(r.stderr || '').trim(),
    status: r.status,
  };
}

function normPath(p) {
  return String(p || '')
    .replace(/\//g, path.sep)
    .replace(/\\/g, path.sep)
    .replace(/[/\\]+$/, '')
    .toLowerCase();
}

function resolvePcPath(pcRoot, rel) {
  const r = String(rel || '').trim();
  if (!r) return null;
  if (path.isAbsolute(r)) return r;
  return path.join(pcRoot, r);
}

function parseWorktrees(porcelain) {
  const blocks = String(porcelain || '')
    .split(/\n(?=worktree )/m)
    .map((b) => b.trim())
    .filter(Boolean);
  const out = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const wt = { path: '', head: '', branch: '', bare: false, detached: false };
    for (const line of lines) {
      if (line.startsWith('worktree ')) wt.path = line.slice('worktree '.length).trim();
      else if (line.startsWith('HEAD ')) wt.head = line.slice(5).trim();
      else if (line.startsWith('branch ')) wt.branch = line.slice(7).trim();
      else if (line === 'bare') wt.bare = true;
      else if (line === 'detached') wt.detached = true;
    }
    if (wt.path) out.push(wt);
  }
  return out;
}

function readPackageName(absDir) {
  const pkgPath = path.join(absDir, 'package.json');
  if (!existsFile(pkgPath)) return { ok: false, reason: 'no_package_json' };
  try {
    const j = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return { ok: true, name: String(j?.name || ''), path: pkgPath, trust: 'OBSERVATIONAL_ONLY' };
  } catch (e) {
    return { ok: false, reason: String(e?.message || e) };
  }
}

function pushFinding(findings, f) {
  if (FORBIDDEN_AUTO.has(f.classification)) {
    findings.push({
      ...f,
      classification: 'HOLD_UNCLASSIFIED',
      suppressed_forbidden_auto: f.classification,
      note: `${f.note || ''} [forbidden auto remapped to HOLD]`.trim(),
    });
    return;
  }
  if (!ALLOWED_AUTO.has(f.classification) && f.classification !== 'EXTERNAL') {
    findings.push({
      ...f,
      classification: 'HOLD_UNCLASSIFIED',
      remapped_from: f.classification,
      note: `${f.note || ''} [unknown class remapped to HOLD]`.trim(),
    });
    return;
  }
  findings.push(f);
}

function buildReport() {
  const generated_at = new Date().toISOString();
  const findings = [];
  const case_tests = [];
  const input_trust_citations = [];

  const contractOk = existsFile(CONTRACT);
  const mapOk = existsFile(INPUT_MAP);
  input_trust_citations.push({
    source: 'docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md',
    class: 'TRUSTED_CANON',
    present: contractOk,
  });
  input_trust_citations.push({
    source: 'docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md',
    class: 'TRUSTED_CANON',
    present: mapOk,
  });

  const pc = readJsonSafe(PC_ROOT_JSON);
  input_trust_citations.push({
    source: 'data/z_pc_root_projects.json',
    class: 'TRUSTED_STRUCTURAL',
    note: 'Row id/path/empty-path only; contested roles are DIRTY_UNSEALED for relationship',
    present: pc.ok,
  });

  const pcRoot = pc.ok ? String(pc.data.pc_root || '').replace(/\//g, path.sep) : '';
  const projects = pc.ok && Array.isArray(pc.data.projects) ? pc.data.projects : [];

  // --- Git worktrees (TRUSTED_STRUCTURAL) ---
  const wtGit = git(['worktree', 'list', '--porcelain']);
  input_trust_citations.push({
    source: 'git worktree list --porcelain',
    class: 'TRUSTED_STRUCTURAL',
    present: wtGit.ok,
  });
  const worktrees = wtGit.ok ? parseWorktrees(wtGit.stdout) : [];
  const hubAbs = normPath(ROOT);
  const linked = worktrees.filter((w) => normPath(w.path) !== hubAbs);

  for (const w of linked) {
    pushFinding(findings, {
      case_id: 'hub_worktree',
      subject: w.path,
      related_to: 'z-sanctuary-universe',
      classification: 'WORKTREE_OF',
      source_trust: 'TRUSTED_STRUCTURAL',
      evidence: [`git worktree · branch=${w.branch || '(detached)'} · HEAD=${w.head || '?'}`],
      note: 'Worktree ≠ organism · not a PC-root member',
    });
  }

  case_tests.push({
    id: 'case_hub_worktrees',
    expected: 'WORKTREE_OF · not members',
    observed_count: linked.length,
    pass: linked.length >= 1 && linked.every((w) => normPath(w.path) !== hubAbs),
    detail: linked.map((w) => w.path),
  });

  // --- PC-root rows: path missing / drift / dirty U2 ---
  const emptyPathIds = [];
  const missingPathIds = [];
  const u2HoldIds = [];

  for (const proj of projects) {
    const id = String(proj.id || '');
    const rel = String(proj.path || '').trim();
    const role = String(proj.role || '');

    if (DIRTY_U2_ROLES.has(role) || /universe.?2/i.test(id)) {
      u2HoldIds.push(id);
      pushFinding(findings, {
        case_id: 'universe_2_ambiguity',
        subject: id,
        related_to: 'z-sanctuary-universe',
        classification: 'HOLD_UNCLASSIFIED',
        source_trust: 'DIRTY_UNSEALED',
        evidence: [
          `registry.role=${role || '(none)'} (not sealed CONTINUATION_OF / BACKUP_OF)`,
          `path=${rel || '(empty)'}`,
        ],
        note: 'Dirty/unsealed U2 labels ignored as governance authority · HOLD',
      });
    }

    if (!rel) {
      emptyPathIds.push(id);
      pushFinding(findings, {
        case_id: 'empty_registry_path',
        subject: id,
        classification: 'CANONICAL_PATH_MISSING',
        source_trust: 'TRUSTED_STRUCTURAL',
        evidence: [
          'pc_root.path empty',
          `hosting=${proj.hosting || ''}`,
          `migration_status=${proj.migration_status || ''}`,
        ],
        note: 'No auto-promote of another disk copy',
      });
      continue;
    }

    const abs = resolvePcPath(pcRoot, rel);
    if (!abs) continue;
    const onDisk = existsFile(abs);
    if (!onDisk) {
      missingPathIds.push(id);
      pushFinding(findings, {
        case_id: 'registry_path_absent',
        subject: id,
        classification: 'REGISTRY_DISK_DRIFT',
        source_trust: 'TRUSTED_STRUCTURAL',
        evidence: [`declared_path=${abs}`, 'exists=false'],
        note: 'Registry path declared but absent on disk',
      });
    }
  }

  case_tests.push({
    id: 'case_lumina_missing_path',
    expected: 'CANONICAL_PATH_MISSING · no promote',
    pass: findings.some(
      (f) =>
        f.subject === 'z-sanctuary-browser-z-saiyan-lumina' &&
        f.classification === 'CANONICAL_PATH_MISSING'
    ),
    detail: findings.filter((f) => f.subject === 'z-sanctuary-browser-z-saiyan-lumina'),
  });

  case_tests.push({
    id: 'case_universe_2_hold',
    expected: 'HOLD_UNCLASSIFIED · not CONTINUATION_OF',
    pass:
      u2HoldIds.length >= 1 &&
      findings
        .filter((f) => f.case_id === 'universe_2_ambiguity')
        .every((f) => f.classification === 'HOLD_UNCLASSIFIED'),
    detail: u2HoldIds,
  });

  // --- Gem package name vs D2 id (OBSERVATIONAL_ONLY) ---
  const gem = projects.find((p) => p.id === 'z-sanctuary-gem');
  const d2Id = 'amk-goku-dashboards-2';
  let gemPkg = { ok: false };
  if (gem && String(gem.path || '').trim() && pcRoot) {
    const gemAbs = resolvePcPath(pcRoot, gem.path);
    if (gemAbs && existsFile(gemAbs)) {
      gemPkg = readPackageName(gemAbs);
      if (gemPkg.ok && gemPkg.name && gemPkg.name === d2Id) {
        pushFinding(findings, {
          case_id: 'gem_d2_package_similarity',
          subject: 'z-sanctuary-gem',
          related_to: d2Id,
          classification: 'POSSIBLE_RELATIONSHIP',
          source_trust: 'OBSERVATIONAL_ONLY',
          evidence: [`package.json name=${gemPkg.name}`, `≠ identity bind to registry id ${d2Id}`],
          note: 'PACKAGE NAME ≠ CANONICAL AUTHORITY · no SAME_PROJECT / alias',
        });
      }
    }
  }

  case_tests.push({
    id: 'case_gem_d2_similarity',
    expected: 'POSSIBLE_RELATIONSHIP · no bind',
    pass: findings.some(
      (f) =>
        f.case_id === 'gem_d2_package_similarity' && f.classification === 'POSSIBLE_RELATIONSHIP'
    ),
    detail: gemPkg,
  });

  // --- SSR / Z-Family: disk awareness ≠ membership ---
  const organiser = pcRoot || path.dirname(ROOT);
  const awarenessRoots = [
    {
      id: 'super-saiyan-roulette-pro-app',
      abs: path.join(organiser, 'Super-Saiyan-Roulette-Pro-App'),
      label: 'SSR',
    },
    {
      id: 'z-family-health',
      abs: path.join(organiser, 'Z-Family Health'),
      label: 'Z-Family Health',
    },
  ];

  for (const a of awarenessRoots) {
    const onDisk = existsFile(a.abs);
    const inRegistry = projects.some((p) => p.id === a.id);
    pushFinding(findings, {
      case_id: 'known_awareness_not_member',
      subject: a.id,
      classification: 'HOLD_UNCLASSIFIED',
      source_trust: onDisk ? 'TRUSTED_STRUCTURAL' : 'OBSERVATIONAL_ONLY',
      evidence: [
        `disk_exists=${onDisk}`,
        `path=${a.abs}`,
        `pc_root_member_row=${inRegistry}`,
        'KNOWN ≠ MEMBER',
      ],
      note: `${a.label}: known awareness state · no membership grant`,
      awareness_state: onDisk ? 'KNOWN_ON_DISK' : 'ABSENT_OR_UNPROBED',
    });
  }

  case_tests.push({
    id: 'case_ssr_family_awareness',
    expected: 'KNOWN awareness · not MEMBER',
    pass: findings
      .filter((f) => f.case_id === 'known_awareness_not_member')
      .every((f) => f.classification === 'HOLD_UNCLASSIFIED'),
    detail: findings.filter((f) => f.case_id === 'known_awareness_not_member'),
  });

  // --- ASTRALIS / Z-Oisela: EXTERNAL from TRUSTED_CANON (not disk walk) ---
  for (const ext of [
    { id: 'astralis', name: 'ASTRALIS' },
    { id: 'z-oisela', name: 'Z-Oisela' },
  ]) {
    pushFinding(findings, {
      case_id: 'external_not_missing',
      subject: ext.id,
      classification: 'EXTERNAL',
      source_trust: 'TRUSTED_CANON',
      evidence: [
        'PID-0.5 case table · EXTERNAL ≠ MISSING',
        'No Organiser incorporation · no registry membership inferred',
      ],
      note: `${ext.name}: external organism · not a missing Sanctuary citizen`,
    });
  }

  case_tests.push({
    id: 'case_astralis_oisela_external',
    expected: 'EXTERNAL · NOT MISSING',
    pass: findings
      .filter((f) => f.case_id === 'external_not_missing')
      .every((f) => f.classification === 'EXTERNAL'),
    detail: findings.filter((f) => f.case_id === 'external_not_missing'),
  });

  const case_pass = case_tests.every((c) => c.pass === true);
  const forbidden_used = findings.filter((f) => FORBIDDEN_AUTO.has(f.classification));

  return {
    schema: SCHEMA,
    phase: 'Z-SANCTUARY-PID-1-IDENTITY-OBSERVATION-REPORT-1',
    stages: { '1A': 'TRUSTED_INPUT_MAP', '1B': 'READ_ONLY_IDENTITY_REPORT' },
    generated_at,
    marking: MARKING,
    authority: {
      contract: 'docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md',
      trusted_input_map: 'docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md',
      not_connected_to: [
        'Overseer',
        'Cycle Observe',
        'indicators',
        'Doorway',
        'Mission Control',
        'Lifeboat apply',
      ],
    },
    allowed_auto_classifications: [...ALLOWED_AUTO],
    forbidden_auto_classifications: [...FORBIDDEN_AUTO],
    input_trust_citations,
    git_worktrees: {
      trust: 'TRUSTED_STRUCTURAL',
      primary: ROOT,
      linked_count: linked.length,
      linked: linked.map((w) => ({
        path: w.path,
        branch: w.branch || null,
        head: w.head || null,
        classification: 'WORKTREE_OF',
      })),
    },
    registry_summary: {
      trust: 'TRUSTED_STRUCTURAL',
      project_count: projects.length,
      empty_path_ids: emptyPathIds,
      missing_declared_path_ids: missingPathIds,
      dirty_u2_hold_ids: u2HoldIds,
    },
    findings,
    case_tests,
    case_tests_pass: case_pass && forbidden_used.length === 0,
    overall_observer_signal: case_pass && forbidden_used.length === 0 ? 'BLUE' : 'YELLOW',
    script: path.relative(ROOT, path.join(__dirname, 'z_project_identity_observe_status.mjs')),
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Z-Project Identity Observe Status (PID-1B)');
  lines.push('');
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Signal:** ${report.overall_observer_signal}`);
  lines.push(`**Case tests:** ${report.case_tests_pass ? 'PASS' : 'FAIL'}`);
  lines.push('');
  lines.push('## Marking');
  lines.push('');
  lines.push('```text');
  lines.push(report.marking.join(' · '));
  lines.push('```');
  lines.push('');
  lines.push('## Authority');
  lines.push('');
  lines.push(`- Contract: \`${report.authority.contract}\``);
  lines.push(`- Trusted input map: \`${report.authority.trusted_input_map}\``);
  lines.push(`- Not connected to: ${report.authority.not_connected_to.join(', ')}`);
  lines.push('');
  lines.push('## Git worktrees');
  lines.push('');
  lines.push(`Primary: \`${report.git_worktrees.primary}\``);
  lines.push(`Linked (WORKTREE_OF): **${report.git_worktrees.linked_count}**`);
  lines.push('');
  for (const w of report.git_worktrees.linked) {
    lines.push(`- \`${w.path}\` · ${w.branch || 'detached'} · \`${w.head || '?'}\``);
  }
  lines.push('');
  lines.push('## Registry summary');
  lines.push('');
  lines.push(`- Empty path: ${report.registry_summary.empty_path_ids.join(', ') || '(none)'}`);
  lines.push(
    `- Declared path missing on disk: ${report.registry_summary.missing_declared_path_ids.join(', ') || '(none)'}`
  );
  lines.push(`- U2 HOLD: ${report.registry_summary.dirty_u2_hold_ids.join(', ') || '(none)'}`);
  lines.push('');
  lines.push('## Case tests');
  lines.push('');
  lines.push('| Case | Expected | Pass |');
  lines.push('| --- | --- | --- |');
  for (const c of report.case_tests) {
    lines.push(`| ${c.id} | ${c.expected} | ${c.pass ? 'PASS' : 'FAIL'} |`);
  }
  lines.push('');
  lines.push('## Findings (conservative)');
  lines.push('');
  for (const f of report.findings) {
    lines.push(`### ${f.classification} · \`${f.subject}\``);
    lines.push('');
    lines.push(`- case: ${f.case_id}`);
    lines.push(`- trust: ${f.source_trust}`);
    if (f.related_to) lines.push(`- related_to: \`${f.related_to}\``);
    lines.push(`- note: ${f.note || ''}`);
    if (Array.isArray(f.evidence)) {
      for (const e of f.evidence) lines.push(`- evidence: ${e}`);
    }
    lines.push('');
  }
  lines.push('## Rebuild');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run z:project-identity:observe');
  lines.push('```');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const report = buildReport();
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, toMarkdown(report), 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`Wrote ${path.relative(ROOT, OUT_MD)}`);
  console.log(`signal=${report.overall_observer_signal} case_tests=${report.case_tests_pass}`);
  if (!report.case_tests_pass) process.exitCode = 1;
}

main();
