#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_folder_manager_boost.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_folder_manager_boost.md');

function runStep(id, command, args = []) {
  const res = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  return {
    id,
    ok: (res.status ?? 1) === 0 && !res.error,
    exit_code: res.status ?? 1,
    command: [command, ...args].join(' '),
    stdout: String(res.stdout || '').trim().slice(-1000),
    stderr: String(res.stderr || '').trim().slice(-1000),
    ran_at: new Date().toISOString(),
  };
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function buildPayload(steps) {
  const lab = readJson(path.join(REPORTS_DIR, 'z_lab_status.json'), {});
  const folder = readJson(path.join(REPORTS_DIR, 'z_folder_manager_status.json'), {});
  const latestManifest = readJson(
    path.join(ROOT, 'safe_pack', 'z_sanctuary_vault', 'folder_manager', 'latest_manifest.json'),
    {}
  );
  const latestSnapshot = folder?.latest_snapshot || latestManifest?.snapshot_rel || null;
  const dormantSignals = [];

  if (String(lab?.status || '').toLowerCase() !== 'ready') {
    dormantSignals.push('lab_not_ready');
  }
  if (Number(lab?.draft_modules_count ?? 0) === 0 && Number(lab?.prototype_modules_count ?? 0) === 0) {
    dormantSignals.push('lab_no_active_modules');
  }
  if (!latestSnapshot) {
    dormantSignals.push('folder_manager_no_latest_snapshot');
  }
  if (String(folder?.status || '').toLowerCase() === 'blocked') {
    dormantSignals.push('folder_manager_guard_blocked');
  }

  const failed = steps.filter((x) => !x.ok);
  const status = failed.length > 0 || dormantSignals.length > 0 ? 'watch' : 'green';

  return {
    generated_at: new Date().toISOString(),
    status,
    step_summary: {
      total: steps.length,
      failed: failed.length,
    },
    steps,
    capability_state: {
      lab_status: lab?.status || 'unknown',
      draft_modules_count: Number(lab?.draft_modules_count ?? 0),
      prototype_modules_count: Number(lab?.prototype_modules_count ?? 0),
      folder_manager_status: folder?.status || 'unknown',
      folder_manager_latest_snapshot: latestSnapshot,
      folder_manager_candidate_changes: Number(folder?.candidate_changes ?? 0),
    },
    dormant_signals: dormantSignals,
    boost_actions: [
      dormantSignals.includes('lab_no_active_modules')
        ? 'Create one starter module under Z_Labs/modules_draft with README + draft manifest.'
        : 'Lab has active module footprint.',
      dormantSignals.includes('folder_manager_no_latest_snapshot')
        ? 'Run `node scripts/z_folder_manager_guard.mjs snapshot` once to establish baseline.'
        : 'Folder manager snapshot baseline exists.',
      'Keep running `Z: Lab Status` and `Z: Folder Manager Status` in the SSWS cycle.',
    ],
  };
}

function toMarkdown(payload) {
  const lines = [
    '# Z Lab + Folder Manager Boost',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${String(payload.status).toUpperCase()}**`,
    `Steps failed: ${payload.step_summary.failed}/${payload.step_summary.total}`,
    '',
    '## Capability State',
    `- Lab status: ${payload.capability_state.lab_status}`,
    `- Draft modules: ${payload.capability_state.draft_modules_count}`,
    `- Prototype modules: ${payload.capability_state.prototype_modules_count}`,
    `- Folder manager status: ${payload.capability_state.folder_manager_status}`,
    `- Latest snapshot: ${payload.capability_state.folder_manager_latest_snapshot || 'none'}`,
    '',
    '## Dormant Signals',
    ...(payload.dormant_signals.length ? payload.dormant_signals.map((x) => `- ${x}`) : ['- none']),
    '',
    '## Boost Actions',
    ...payload.boost_actions.map((x) => `- ${x}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const nodeCmd = process.execPath;
  const steps = [
    runStep('lab_bootstrap', nodeCmd, ['scripts/z_lab_bootstrap.mjs']),
    runStep('lab_status', nodeCmd, ['scripts/z_lab_status.mjs']),
    runStep('folder_manager_status', nodeCmd, ['scripts/z_folder_manager_guard.mjs', 'status']),
    runStep('folder_manager_recreate_dry_run', nodeCmd, ['scripts/z_folder_manager_guard.mjs', 'recreate']),
  ];

  const payload = buildPayload(steps);
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, toMarkdown(payload), 'utf8');
  console.log(`Z Lab + Folder Manager boost: ${OUT_JSON} status=${payload.status}`);
  if (steps.some((x) => !x.ok)) process.exitCode = 1;
}

main();
