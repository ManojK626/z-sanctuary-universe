/* eslint quotes: ["error","single",{"avoidEscape":true,"allowTemplateLiterals":true}] */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_workspace_auto_sweep.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_workspace_auto_sweep.md');
const IDENTITY_PATH = path.join(ROOT, 'config', 'z_workspace_identity.json');

function readJson(absPath, fallback = null) {
  try {
    if (!fs.existsSync(absPath)) return fallback;
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch {
    return fallback;
  }
}

function runStep(id, title, command, args = []) {
  const startedAt = new Date().toISOString();
  const res = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  const endedAt = new Date().toISOString();
  const ok = (res.status ?? 1) === 0 && !res.error;
  return {
    id,
    title,
    ok,
    command: [command, ...args].join(' '),
    exit_code: res.status ?? 1,
    started_at: startedAt,
    ended_at: endedAt,
    stdout: String(res.stdout || '').trim().slice(-1200),
    stderr: String(res.stderr || '').trim().slice(-1200),
  };
}

function publishBroadcast(status, workspaceId, summary) {
  const impact = status === 'green' ? 'low' : 'medium';
  const review = status === 'green' ? 'false' : 'true';
  const notice = `${workspaceId} auto-sweep ${status.toUpperCase()}: ${summary}`;
  return runStep('workspace_broadcast', 'Workspace Broadcast Publish', process.execPath, [
    'scripts/z_workspace_broadcast_publish.mjs',
    `--notice=${notice}`,
    '--version=0.2',
    `--impact=${impact}`,
    `--review=${review}`,
  ]);
}

function main() {
  const identity = readJson(IDENTITY_PATH, { id: 'UNKNOWN', role: 'unknown' });
  const steps = [
    runStep('workspace_guard', 'Multi-Workspace Guard', process.execPath, [
      'scripts/z_multi_workspace_guard.mjs',
    ]),
    runStep('extension_guard', 'VS Code Extension Guard', process.execPath, [
      'scripts/z_extension_guard.mjs',
    ]),
    runStep('web_readiness', 'Web Readiness Check', process.execPath, [
      'scripts/z_web_readiness_check.mjs',
    ]),
    runStep('lab_task_guard', 'Lab Task Structure Guard', process.execPath, [
      'scripts/z_lab_task_structure_guard.mjs',
    ]),
    runStep('workspace_timeguard', 'Workspace Timeguard', process.execPath, [
      'scripts/z_vscode_timeguard.mjs',
    ]),
    runStep('ide_commflow_guard', 'IDE Comm-Flow Guard', process.execPath, [
      'scripts/z_ide_commflow_guard.mjs',
    ]),
    runStep('slo_guard', 'SLO Guard', process.execPath, [
      'scripts/z_slo_guard.mjs',
    ]),
    runStep('provenance_check', 'Provenance Check', process.execPath, [
      'scripts/z_provenance_check.mjs',
    ]),
  ];
  steps.push(
    runStep('incident_triage', 'Incident Triage', process.execPath, [
      'scripts/z_incident_triage.mjs',
    ])
  );
  steps.push(
    runStep('lab_folder_boost', 'Lab + Folder Manager Boost', process.execPath, [
      'scripts/z_lab_folder_manager_boost.mjs',
    ])
  );

  // Avoid circular dependency:
  // `z_slo_guard.mjs` checks `z_workspace_auto_sweep.json` freshness/status.
  // While this sweep is running, the current report may still reflect the previous run.
  // So we exclude the internal `slo_guard` step from determining overall status.
  const failed = steps.filter((s) => !s.ok && s.id !== 'slo_guard');
  const status = failed.length ? 'hold' : 'green';
  const summary =
    status === 'green'
      ? 'all checks passed'
      : `${failed.length} checks failed (${failed.map((f) => f.id).join(', ')})`;

  const broadcast = publishBroadcast(status, identity.id || 'UNKNOWN', summary);
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    workspace: identity.id || 'UNKNOWN',
    role: identity.role || 'unknown',
    totals: {
      checks: steps.length,
      passed: steps.length - failed.length,
      failed: failed.length,
    },
    summary,
    checks: steps,
    broadcast: {
      ok: broadcast.ok,
      command: broadcast.command,
      exit_code: broadcast.exit_code,
      stderr: broadcast.stderr,
    },
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Workspace Auto Sweep',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Workspace: ${payload.workspace}`,
    `- Role: ${payload.role}`,
    `- Checks: ${payload.totals.checks}`,
    `- Passed: ${payload.totals.passed}`,
    `- Failed: ${payload.totals.failed}`,
    `- Summary: ${payload.summary}`,
    '',
    '## Checks',
    ...payload.checks.map(
      (s) =>
        `- [${s.ok ? 'x' : ' '}] ${s.id} | exit=${s.exit_code} | ${s.title}`
    ),
    '',
    `## Broadcast`,
    `- Status: ${payload.broadcast.ok ? 'OK' : 'FAIL'}`,
    `- Command: \`${payload.broadcast.command}\``,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Z workspace auto sweep written: ${OUT_JSON}`);
  if (status !== 'green') {
    process.exit(1);
  }
}

main();
