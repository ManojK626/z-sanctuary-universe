import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function getArgValue(name) {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
}

function runStep(step, dryRun) {
  const { label, command, args, softFail = false } = step;
  const printable = `${command} ${args.join(' ')}`.trim();
  console.log(`\n[SSWS BOOT] ${label}`);
  console.log(`[SSWS BOOT] > ${printable}`);

  if (dryRun) return { ok: true, code: 0 };

  const execResult = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
  });
  const result = {
    ok: (execResult.status ?? 1) === 0,
    code: execResult.status ?? 1,
    softFail,
  };
  if (!result.ok && softFail) {
    console.warn(`[SSWS BOOT] Soft warning at step: ${label} (exit=${result.code})`);
    return { ok: true, code: result.code, softFail: true, warning: true };
  }
  return { ...result, warning: false };
}

function npmRunArgs(scriptName) {
  return ['run', scriptName];
}

function npmCommand() {
  return 'npm';
}

function ecosystemSteps() {
  const npmCmd = npmCommand();
  return [
    { label: 'IDE Comm-Flow Guard', command: npmCmd, args: npmRunArgs('ide:commflow:guard'), softFail: true },
    { label: 'Cross-Project Observer', command: npmCmd, args: npmRunArgs('monitor:cross-project'), softFail: true },
    { label: 'Lab + Folder Manager Boost', command: npmCmd, args: npmRunArgs('lab:folder:boost'), softFail: true },
    { label: 'Ecosystem Comm-Flow Verifier', command: npmCmd, args: npmRunArgs('ecosystem:commflow:verify'), softFail: true },
    { label: 'Autonomous Runtime Cycle', command: npmCmd, args: npmRunArgs('autonomous:run:once'), softFail: true },
    { label: 'Autonomous Watchdog', command: npmCmd, args: npmRunArgs('autonomous:watchdog'), softFail: true },
    { label: 'Emit PC Root Workspace', command: 'node', args: ['scripts/z_emit_pc_root_workspace.mjs'], softFail: true },
  ];
}

function profileSupportsEcosystem(profile) {
  return !profile || profile === 'full-sanctuary' || profile === 'core-only';
}

function main() {
  const dryRun = hasFlag('dry-run');
  const withHygiene = hasFlag('with-hygiene');
  const noOpen = hasFlag('no-open');
  const profile = getArgValue('profile');

  const steps = [
    { label: 'Workspace Root Guard', command: 'node', args: ['scripts/z_workspace_root_guard.mjs'] },
    { label: 'Multi-Workspace Guard', command: 'node', args: ['scripts/z_multi_workspace_guard.mjs'] },
    { label: 'Lab Task Structure Guard', command: 'node', args: ['scripts/z_lab_task_structure_guard.mjs'] },
    { label: 'VS Code Time Guard', command: 'node', args: ['scripts/z_vscode_timeguard.mjs'] },
    { label: 'AnyDevices Monitor', command: 'node', args: ['scripts/z_anydevices_monitor.mjs'] },
    { label: 'Gadget Mirrors Guard', command: 'node', args: ['scripts/z_gadget_mirrors_guard.mjs'] },
    { label: 'Sandbox Phase Guard', command: 'node', args: ['scripts/z_sandbox_phase_guard.mjs'] },
    { label: 'Reports Vault Refresh', command: 'python', args: ['scripts/reports_vault_refresh.py'] }
  ];

  if (withHygiene) {
    const npmCmd = npmCommand();
    steps.splice(2, 0, { label: 'Hygiene Autofix', command: npmCmd, args: npmRunArgs('hygiene:autofix') });
  }

  if (profileSupportsEcosystem(profile)) {
    steps.push(...ecosystemSteps());
  }

  const htmlArgs = ['scripts/z_open_html_cores.mjs', '--open'];
  if (noOpen) htmlArgs.push('--no-open');
  if (profile) htmlArgs.push(`--profile=${profile}`);
  steps.push({ label: 'Open HTML Cores', command: 'node', args: htmlArgs });

  const startedAt = new Date().toISOString();
  const stepResults = [];
  for (const step of steps) {
    const result = runStep(step, dryRun);
    stepResults.push({
      id: step.label,
      command: `${step.command} ${step.args.join(' ')}`.trim(),
      ok: result.ok,
      exit_code: result.code,
      soft_fail: Boolean(step.softFail),
      warning: Boolean(result.warning),
    });
    if (!result.ok) {
      console.error(`\n[SSWS BOOT] Failed at step: ${step.label} (exit=${result.code})`);
      writeBootReport({
        started_at: startedAt,
        ended_at: new Date().toISOString(),
        profile,
        dry_run: dryRun,
        no_open: noOpen,
        status: 'failed',
        step_results: stepResults,
      });
      process.exit(result.code);
    }
  }

  writeBootReport({
    started_at: startedAt,
    ended_at: new Date().toISOString(),
    profile,
    dry_run: dryRun,
    no_open: noOpen,
    status: 'ok',
    step_results: stepResults,
  });
  console.log('\n[SSWS BOOT] Completed successfully.');
}

function writeBootReport(payload) {
  const reportsDir = path.join(process.cwd(), 'data', 'reports');
  const outJson = path.join(reportsDir, 'z_ssws_boot_report.json');
  const outMd = path.join(reportsDir, 'z_ssws_boot_report.md');
  const warnings = payload.step_results.filter((x) => x.warning);
  const failed = payload.step_results.filter((x) => !x.ok);
  const report = {
    generated_at: new Date().toISOString(),
    ...payload,
    summary: {
      total_steps: payload.step_results.length,
      warnings: warnings.length,
      failed: failed.length,
    },
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  const md = [
    '# Z SSWS Boot Report',
    '',
    `Generated: ${report.generated_at}`,
    `Status: **${String(report.status).toUpperCase()}**`,
    `Profile: ${report.profile || 'default'}`,
    `Warnings: ${report.summary.warnings}`,
    `Failed: ${report.summary.failed}`,
    '',
    '## Steps',
    ...report.step_results.map(
      (s) => `- ${s.id}: ${s.ok ? 'ok' : 'failed'} (exit=${s.exit_code})${s.warning ? ' [soft-warning]' : ''}`
    ),
    '',
  ];
  fs.writeFileSync(outMd, `${md.join('\n')}\n`, 'utf8');
}

main();
