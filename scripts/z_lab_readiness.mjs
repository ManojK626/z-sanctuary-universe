#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_readiness.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_readiness.md');

function npmCmd() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function runStep(label, command, args, softFail = false) {
  const startedAt = new Date().toISOString();
  const isWin = process.platform === 'win32';
  const shell = isWin;
  const execCommand = isWin ? `${command} ${args.join(' ')}` : command;
  const execArgs = isWin ? [] : args;
  const result = spawnSync(execCommand, execArgs, {
    cwd: ROOT,
    shell,
    encoding: 'utf8',
  });
  const finishedAt = new Date().toISOString();
  const ok = (result.status ?? 1) === 0;
  return {
    label,
    command: `${execCommand}${execArgs.length ? ` ${execArgs.join(' ')}` : ''}`.trim(),
    started_at: startedAt,
    finished_at: finishedAt,
    ok: softFail ? true : ok,
    raw_ok: ok,
    soft_fail: softFail,
    exit_code: result.status ?? 1,
    stdout_tail: String(result.stdout || '').trim().split(/\r?\n/).slice(-8),
    stderr_tail: String(result.stderr || '').trim().split(/\r?\n/).slice(-8),
  };
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const npm = npmCmd();
  const steps = [
    runStep('lab_bootstrap', npm, ['run', 'lab:bootstrap']),
    runStep('lab_status', npm, ['run', 'lab:status']),
    runStep('lab_task_guard', npm, ['run', 'lab:task-guard']),
    runStep('lab_dual_copies', npm, ['run', 'lab:dual-copies'], true),
    runStep('lab_folder_boost', npm, ['run', 'lab:folder:boost'], true),
  ];

  const hardFail = steps.some((x) => x.ok === false);
  const status = hardFail ? 'blocked' : steps.some((x) => x.raw_ok === false) ? 'watch' : 'ready';

  const labStatus = readJson(path.join(REPORTS_DIR, 'z_lab_status.json'), {});
  const dualCopies = readJson(path.join(REPORTS_DIR, 'z_lab_dual_copies_setup.json'), {});

  const payload = {
    generated_at: new Date().toISOString(),
    status,
    lab_root: labStatus?.lab_root || '--',
    lab_policy: labStatus?.lab_policy || {},
    checks: {
      total: steps.length,
      hard_failures: steps.filter((x) => !x.ok).length,
      soft_warnings: steps.filter((x) => x.soft_fail && !x.raw_ok).length,
    },
    steps,
    links: {
      lab_status_report: 'data/reports/z_lab_status.json',
      dual_copies_report: 'data/reports/z_lab_dual_copies_setup.json',
      folder_boost_report: 'data/reports/z_lab_folder_manager_boost.json',
      workspace_dashboard_copy: dualCopies?.artifacts?.dashboard_workspace || '--',
      workspace_ssws_copy: dualCopies?.artifacts?.ssws_workspace || '--',
      launcher_4_windows: dualCopies?.artifacts?.launcher || '--',
    },
    notes: [
      'Readiness keeps lab automation inside in-repo Z_Labs root.',
      'Soft warnings indicate optional lab comfort features to review, not hard blockers.',
    ],
  };

  ensureDir(REPORTS_DIR);
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    OUT_MD,
    `# Z Lab Readiness

- Generated: ${payload.generated_at}
- Status: ${payload.status}
- Lab root: ${payload.lab_root}
- Hard failures: ${payload.checks.hard_failures}
- Soft warnings: ${payload.checks.soft_warnings}

## Steps
${steps.map((s) => `- ${s.label}: ${s.raw_ok ? 'ok' : s.soft_fail ? 'warn' : 'fail'} (exit=${s.exit_code})`).join('\n')}

## Links
- Lab status: ${payload.links.lab_status_report}
- Dual copies: ${payload.links.dual_copies_report}
- Folder boost: ${payload.links.folder_boost_report}
- Dashboard workspace: ${payload.links.workspace_dashboard_copy}
- SSWS workspace: ${payload.links.workspace_ssws_copy}
- 4-window launcher: ${payload.links.launcher_4_windows}
`,
    'utf8'
  );

  console.log(`Z Lab readiness report written: ${OUT_JSON} (status=${status})`);
  process.exit(status === 'blocked' ? 1 : 0);
}

main();
