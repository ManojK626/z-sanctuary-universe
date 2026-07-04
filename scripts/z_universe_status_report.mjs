#!/usr/bin/env node
/**
 * Z-UNIVERSE-STATUS-1 — Comprehensive Universe Status Report (read-only).
 * Observer/orchestrator posture: writes ONLY data/reports/z_universe_status_report.{json,md}
 * Does NOT: deploy, merge, build, publish, mutate sibling repos, or bypass DRP/human gates.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_universe_status_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_universe_status_report.md');
const SCHEMA = 'z_universe_status_report_v1';

const DEPT_REG = path.join(ROOT, 'data', 'z_universe_department_registry.json');
const PC_ROOT = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const ECOSYSTEM = path.join(ROOT, 'data', 'reports', 'z_ecosystem_awareness_report.json');
const CROSS = path.join(ROOT, 'data', 'reports', 'z_cross_project_observer.json');
const DEPLOY = path.join(ROOT, 'data', 'reports', 'z_deployment_readiness_status.json');
const CYCLE = path.join(ROOT, 'data', 'reports', 'z_cycle_observe_status.json');
const RESOLUTION = path.join(ROOT, 'docs', 'Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md');
const UNIVERSE_REG = path.join(ROOT, 'data', 'z_universe_project_registry.json');
const DISCOVERY = path.join(ROOT, 'data', 'reports', 'z_universe_discovery_report.json');

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function gitSnapshot(cwd) {
  try {
    const branch = execSync('git branch --show-current', { cwd, encoding: 'utf8', timeout: 8000 }).trim();
    const head = execSync('git rev-parse --short HEAD', { cwd, encoding: 'utf8', timeout: 8000 }).trim();
    const dirty = execSync('git status --porcelain', { cwd, encoding: 'utf8', timeout: 8000 }).trim();
    return { branch, head, dirty: Boolean(dirty), ok: true };
  } catch (e) {
    return { branch: '', head: '', dirty: null, ok: false, error: String(e?.message || e) };
  }
}

function signalFromReport(data, key = 'overall_signal') {
  if (!data) return 'UNKNOWN';
  const s = data[key] || data.status || data.signal;
  if (!s) return 'UNKNOWN';
  return String(s).toUpperCase();
}

function healthDim(label, signal, note) {
  return { dimension: label, signal, note };
}

function buildDepartmentReport(dept, hubGit) {
  const statusPath = dept.status_doc ? path.join(ROOT, dept.status_doc) : '';
  const handbookPath = dept.handbook_doc ? path.join(ROOT, dept.handbook_doc) : '';
  const reports = (dept.related_reports || []).map((r) => {
    const p = path.join(ROOT, r);
    return { path: r, present: exists(p), signal: signalFromReport(readJsonSafe(p)) };
  });

  let openIssues = [];
  if (dept.id === 'vile') {
    openIssues = ['Pkgs 1–3 pending merge to main', 'zuno-drp charter only — not implemented'];
  } else if (dept.id === 'z_connect') {
    openIssues = ['Phase 1.6 blocked', 'Sprint 0 blocked', 'Runtime NOT AUTHORIZED'];
  } else if (dept.id === 'compassion_platform' || dept.id === 'future_projects') {
    openIssues = ['Not yet chartered'];
  }

  const architecture =
    dept.id === 'z_connect' ? 'FROZEN' : dept.merge_hold ? 'HOLD / docs' : 'UNKNOWN';
  const governance = dept.merge_hold ? 'LOCKED · Merge Hold active' : 'UNKNOWN';
  const implementation = dept.runtime_authorized ? 'AUTHORIZED' : 'NOT AUTHORIZED';

  let tests = 'UNKNOWN';
  if (dept.id === 'vile') tests = '30/30 on integration branch (see report)';
  if (dept.id === 'zuno_core') tests = 'Hub verify intents available';

  return {
    project: dept.display_name,
    department_id: dept.id,
    system_id: dept.system_id,
    current_phase: dept.default_phase,
    current_branch: dept.id === 'zuno_core' || dept.id === 'vile' || dept.id === 'z_connect' ? hubGit.branch : 'see sibling repo',
    current_status: dept.merge_hold ? 'Merge Hold' : 'UNKNOWN',
    architecture,
    governance,
    implementation,
    verification: reports.some((r) => r.present && r.signal === 'GREEN') ? 'GREEN evidence' : 'partial / pending',
    tests,
    open_issues: openIssues,
    known_risks: dept.merge_hold ? ['Sacred moves require AMK gate'] : [],
    dependencies: dept.dependencies || [],
    commercial_readiness: dept.id === 'z_connect' ? 'Early — prep checklist ready' : 'N/A or not chartered',
    documentation: exists(statusPath) ? 'present' : exists(handbookPath) ? 'handbook only' : 'gap',
    last_review: '2026-07-04',
    recommended_next_step: dept.recommended_next,
    overall_health: dept.id === 'z_connect' || dept.id === 'zuno_core' ? 'GREEN' : dept.id === 'vile' ? 'YELLOW' : 'BLUE',
    department_card: {
      current_phase: dept.default_phase,
      architecture,
      merge_hold: dept.merge_hold,
      runtime: implementation,
      readiness: dept.id === 'vile' ? 'YELLOW — merge pending' : dept.id === 'z_connect' ? 'FROZEN — ready for review' : 'varies',
      open_risks: openIssues.slice(0, 3),
      next_action: dept.recommended_next,
      required_human_gate: dept.id === 'vile' ? 'Merge Hold release + main verify' : 'AMK gate on sacred moves',
      latest_ai_review: 'Consolidated in universe report',
      latest_validation: reports.filter((r) => r.present).map((r) => `${r.path} (${r.signal})`),
      dependencies: dept.dependencies || [],
    },
  };
}

function buildPriorities() {
  return [
    { rank: 1, track: 'A', action: 'Review and merge VILE Packages 1–3', gate: 'Merge Hold + human review' },
    { rank: 2, track: 'A', action: 'Implement zuno-drp from approved charter', gate: 'After Pkgs 1–3 on main' },
    { rank: 3, track: 'A', action: 'Verify shared foundation on main', gate: 'Post-merge verify pipeline' },
    { rank: 4, track: 'B', action: 'Z-Connect commercial prep (non-runtime)', gate: 'No architecture expansion' },
    { rank: 5, track: '—', action: 'Z-Connect Phase 1.6 (OpenAPI + logical DB)', gate: 'Blocked until Track A opens intentionally' },
  ];
}

function buildActionGates() {
  return [
    { action: 'review_pr', available: 'always', note: 'Initiates review workflow — does not merge' },
    { action: 'generate_report', available: 'always', note: 'Read-only report scripts' },
    { action: 'run_validation', available: 'always', note: 'Verify intents — no deploy' },
    { action: 'build', available: 'when_allowed', note: 'Only when project gate permits' },
    { action: 'merge', available: 'after_governance', note: 'DRP + human approval required' },
    { action: 'deploy', available: 'after_governance', note: 'Sacred move — AMK gate' },
    { action: 'publish', available: 'after_governance', note: 'Sacred move — AMK gate' },
  ];
}

function buildAiReviewRoles() {
  return [
    { role: 'zuno_architect', emoji: '🧠', responsibility: 'Architecture review' },
    { role: 'governance_ai', emoji: '🛡', responsibility: 'DRP and policy checks' },
    { role: 'qa_ai', emoji: '🔍', responsibility: 'Verification and testing' },
    { role: 'documentation_ai', emoji: '📚', responsibility: 'Documentation completeness' },
    { role: 'strategy_ai', emoji: '📈', responsibility: 'Prioritization and roadmap' },
    { role: 'commercial_ai', emoji: '🚀', responsibility: 'Launch readiness' },
    { role: 'security_ai', emoji: '🔐', responsibility: 'Security posture' },
  ];
}

function main() {
  const deptReg = readJsonSafe(DEPT_REG);
  if (!deptReg?.departments?.length) {
    console.error('Missing department registry:', DEPT_REG);
    process.exit(1);
  }

  const hubGit = gitSnapshot(ROOT);
  const ecosystem = readJsonSafe(ECOSYSTEM);
  const cross = readJsonSafe(CROSS);
  const deploy = readJsonSafe(DEPLOY);
  const cycle = readJsonSafe(CYCLE);
  const universeReg = readJsonSafe(UNIVERSE_REG);
  const discovery = readJsonSafe(DISCOVERY);

  const departmentReports = deptReg.departments.map((d) => buildDepartmentReport(d, hubGit));

  const universeHealth = [
    healthDim('architecture', 'GREEN', 'Z-Connect Phase 1.5 frozen; lifecycle established'),
    healthDim('governance', 'GREEN', 'Merge Hold active; Universe Resolution locked'),
    healthDim('documentation', 'GREEN', 'Reference handbook + hub lifecycle complete'),
    healthDim('development', 'YELLOW', 'VILE Pkgs 1–3 pending merge to main'),
    healthDim('testing', 'GREEN', 'Foundation packages tested on branches'),
    healthDim('deployment', 'RED', 'Runtime NOT AUTHORIZED — sacred gate'),
    healthDim('commercial', 'YELLOW', 'Early — parallel prep allowed'),
    healthDim('security', 'GREEN', 'zuno-security + zuno-shadow complete; DRP charter'),
  ];

  const blockers = [
    { id: 'merge_hold', severity: 'BLUE', message: 'Merge Hold active on product/runtime lanes' },
    { id: 'vile_main', severity: 'YELLOW', message: 'VILE Pkgs 1–3 not yet on main' },
    { id: 'zuno_drp', severity: 'YELLOW', message: 'zuno-drp implementation pending' },
    { id: 'z_connect_16', severity: 'BLUE', message: 'Z-Connect Phase 1.6 blocked until Track A gate' },
  ];

  if (cross?.summary?.bad > 0) {
    blockers.push({
      id: 'pc_root_paths',
      severity: 'RED',
      message: `${cross.summary.bad} PC root project path(s) missing`,
    });
  }

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    posture: 'observer_orchestrator',
    law_note:
      'Dashboard observes and recommends — DRP Governance and Human Approval before sacred actions. No auto-execute.',
    pipeline: [
      'AMK-Goku Indicator Dashboard',
      'Universe Status Engine',
      'Readiness Evaluation',
      'DRP Governance',
      'Human Approval',
      'Approved Action',
    ],
    hub_git: hubGit,
    universe_resolution_present: exists(RESOLUTION),
    ecosystem_signal: signalFromReport(ecosystem),
    cross_project_status: cross?.status || 'UNKNOWN',
    deployment_readiness_signal: signalFromReport(deploy, 'overall_signal'),
    cycle_observer_signal: signalFromReport(cycle, 'overall_observer_signal'),
    universe_health_dimensions: universeHealth,
    department_reports: departmentReports,
    ai_review_roles: buildAiReviewRoles(),
    one_click_action_gates: buildActionGates(),
    priorities: buildPriorities(),
    blockers,
    governance_gates: ['Merge Hold', 'DRP', 'Shadow', 'AMK sacred moves', '14 DRP'],
    project_registry_summary: universeReg?.summary || discovery?.executive_summary || null,
    universe_health_expansion: universeReg?.summary
      ? {
          total_registered_projects: universeReg.summary.total_registered_projects,
          classification: universeReg.summary.classification,
          integration: universeReg.summary.integration,
          documentation_coverage: universeReg.summary.documentation_coverage,
          governance_coverage: universeReg.summary.governance_coverage,
        }
      : null,
    recommended_operator_sequence: [
      'Run npm run z:universe:discovery',
      'Run npm run z:universe:status',
      'Review data/reports/z_universe_status_report.md',
      'Execute Track A priorities when intentionally approved',
      'Refresh dashboard indicators over HTTP (read-only)',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Sanctuary Universe Status Report',
    '',
    `Generated: ${payload.generated_at}`,
    '',
    '**Posture:** Observer / orchestrator — **not** autonomous controller.',
    '',
    '## Pipeline',
    '',
    '```text',
    'AMK-Goku Indicator Dashboard',
    '  ↓',
    'Universe Status Engine',
    '  ↓',
    'Readiness Evaluation',
    '  ↓',
    'DRP Governance',
    '  ↓',
    'Human Approval',
    '  ↓',
    'Approved Action',
    '```',
    '',
    '## Universe health (separate dimensions — no single score)',
    '',
    '| Dimension | Signal | Note |',
    '| --------- | ------ | ---- |',
    ...universeHealth.map((h) => `| ${h.dimension} | ${h.signal} | ${h.note} |`),
    '',
    '## Hub git snapshot',
    '',
    `- Branch: \`${hubGit.branch || 'unknown'}\``,
    `- HEAD: \`${hubGit.head || 'unknown'}\``,
    `- Dirty working tree: ${hubGit.dirty === null ? 'unknown' : hubGit.dirty}`,
    '',
    '## Track A priorities',
    '',
    '| Rank | Track | Action | Gate |',
    '| ---- | ----- | ------ | ---- |',
    ...buildPriorities().map((p) => `| ${p.rank} | ${p.track} | ${p.action} | ${p.gate} |`),
    '',
    '## Blockers',
    '',
    ...blockers.map((b) => `- **${b.severity}** — ${b.message}`),
    '',
    '## Department reports',
    '',
  ];

  for (const r of departmentReports) {
    md.push(`### ${r.project}`, '');
    md.push(`| Field | Value |`);
    md.push(`| ----- | ----- |`);
    md.push(`| Phase | ${r.current_phase} |`);
    md.push(`| Branch | ${r.current_branch} |`);
    md.push(`| Architecture | ${r.architecture} |`);
    md.push(`| Governance | ${r.governance} |`);
    md.push(`| Implementation | ${r.implementation} |`);
    md.push(`| Overall health | ${r.overall_health} |`);
    md.push(`| Next step | ${r.recommended_next_step} |`);
    md.push('');
  }

  md.push('## One-click action gates', '');
  md.push('| Action | Available | Note |');
  md.push('| ------ | ----------- | ---- |');
  for (const a of buildActionGates()) {
    md.push(`| ${a.action} | ${a.available} | ${a.note} |`);
  }
  md.push('');
  md.push('---');
  md.push('');
  md.push('Law: buttons initiate **approved workflows** — they do not override governance.');
  md.push('');
  md.push('Docs: [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](../docs/dashboard/Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)');

  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    JSON.stringify({
      ok: true,
      out_json: OUT_JSON,
      out_md: OUT_MD,
      departments: departmentReports.length,
      ecosystem_signal: payload.ecosystem_signal,
    }),
  );
}

main();
