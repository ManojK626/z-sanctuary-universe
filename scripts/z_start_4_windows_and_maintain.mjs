import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_start_4_windows_and_maintain.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_start_4_windows_and_maintain.md');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function launchWorkspace(workspacePath) {
  if (!fs.existsSync(workspacePath)) {
    return { workspace: workspacePath, launched: false, reason: 'missing' };
  }

  if (process.platform === 'win32') {
    spawn('cmd.exe', ['/c', 'start', '', 'code', '-n', workspacePath], {
      detached: true,
      stdio: 'ignore',
    }).unref();
    return { workspace: workspacePath, launched: true };
  }

  // Best-effort fallback for non-Windows environments.
  const child = spawn('code', ['-n', workspacePath], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return { workspace: workspacePath, launched: true };
}

function runMaintainDaily() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCmd, ['run', 'maintain:daily'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
    encoding: 'utf8',
  });
  return {
    exit_code: result.status ?? 1,
    ok: (result.status ?? 1) === 0,
  };
}

const workspaces = [
  path.join(ROOT, 'Z_SSWS.code-workspace'),
  path.join(ROOT, 'core', 'ZSanctuary_Universe.code-workspace'),
  path.join(ROOT, 'Z_LAB_Dashboard_Copy.code-workspace'),
  path.join(ROOT, 'Z_LAB_SSWS_Copy.code-workspace'),
];

const launchResults = workspaces.map(launchWorkspace);
const maintain = runMaintainDaily();

const payload = {
  generated_at: new Date().toISOString(),
  status: maintain.ok ? 'green' : 'hold',
  windows_launched: launchResults.filter((x) => x.launched).length,
  launch_results: launchResults.map((x) => ({
    ...x,
    workspace: x.workspace.replace(/\\/g, '/'),
  })),
  maintain_daily: maintain,
  notes: 'Launched 4 VS Code workspaces and executed maintain:daily.',
};

ensureDir(REPORTS_DIR);
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  `# Z Start 4 Windows + Maintain

- Generated: ${payload.generated_at}
- Status: ${payload.status}
- Lab root: ${payload.lab_root}
- Windows launched: ${payload.windows_launched}/4
- maintain:daily: ${payload.maintain_daily.ok ? 'PASS' : 'FAIL'} (exit=${payload.maintain_daily.exit_code})

## Launch Results
${payload.launch_results
  .map((x) => `- [${x.launched ? 'x' : ' '}] ${x.workspace}${x.reason ? ` (${x.reason})` : ''}`)
  .join('\n')}
`,
  'utf8'
);

if (!maintain.ok) {
  process.exit(1);
}
