import { spawn } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const WORKSPACES = [
  path.join(ROOT, 'Z_SSWS.code-workspace'),
  path.join(ROOT, 'core', 'ZSanctuary_Universe.code-workspace'),
  path.join(ROOT, 'Z_LAB_Dashboard_Copy.code-workspace'),
  path.join(ROOT, 'Z_LAB_SSWS_Copy.code-workspace'),
];

function runCommand(workspace) {
  if (process.platform === 'win32') {
    const proc = spawn('cmd.exe', ['/c', 'start', '', 'code', '--command', 'workbench.action.closeAllEditors', '--new-window', workspace], {
      detached: true,
      stdio: 'ignore',
    });
    proc.unref();
    return { workspace, command: `cmd.exe /c start code --command workbench.action.closeAllEditors --new-window ${workspace}` };
  }
  const proc = spawn('code', ['--command', 'workbench.action.closeAllEditors', '--new-window', workspace], {
    detached: true,
    stdio: 'ignore',
  });
  proc.unref();
  return { workspace, command: `code --command workbench.action.closeAllEditors --new-window ${workspace}` };
}

function main() {
  const results = WORKSPACES.map((workspace) => runCommand(workspace));
  const report = {
    generated_at: new Date().toISOString(),
    note: 'Distributed reset of open editors across four workspaces.',
    workspaces: results,
  };
  console.log(JSON.stringify(report, null, 2));
}

main();
