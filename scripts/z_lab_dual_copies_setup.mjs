import fs from 'node:fs';
import path from 'node:path';
import { resolveLabRoot } from './z_lab_root_resolver.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_dual_copies_setup.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_dual_copies_setup.md');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

const { labRoot: LAB_ROOT, policy } = resolveLabRoot(ROOT);
const copiesRoot = path.join(LAB_ROOT, 'copies');
const dashboardCopy = path.join(copiesRoot, 'dashboard_copy');
const sswsCopy = path.join(copiesRoot, 'z_ssws_copy');
const workspacesRoot = path.join(LAB_ROOT, 'workspaces');

ensureDir(dashboardCopy);
ensureDir(sswsCopy);
ensureDir(workspacesRoot);

const copiedArtifacts = [];
if (
  copyIfExists(
    path.join(ROOT, 'core', 'index.html'),
    path.join(dashboardCopy, 'core_index.snapshot.html')
  )
) {
  copiedArtifacts.push('core/index.html -> copies/dashboard_copy/core_index.snapshot.html');
}
if (
  copyIfExists(
    path.join(ROOT, 'core', 'z_ssws_banner.js'),
    path.join(sswsCopy, 'z_ssws_banner.snapshot.js')
  )
) {
  copiedArtifacts.push('core/z_ssws_banner.js -> copies/z_ssws_copy/z_ssws_banner.snapshot.js');
}

write(
  path.join(dashboardCopy, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Z Dashboard Copy Hub (Lab)</title>
    <style>
      body { background:#020b2b; color:#00d4ff; font-family:Consolas,Segoe UI,Arial,sans-serif; margin:0; padding:1rem; }
      .card { border:1px solid #00d4ff; border-radius:10px; padding:1rem; margin-bottom:1rem; background:rgba(0,0,0,.25); }
      a { color:#7dffb0; display:block; margin:.35rem 0; }
      .muted { color:#9fb3c8; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Z Dashboard Copy Hub (Lab-Only)</h2>
      <p class="muted">No runtime linkage. Reference-only copy and launch links.</p>
      <a href="http://127.0.0.1:5503/core/index.html" target="_blank" rel="noopener">Open Main Sanctuary Dashboard</a>
      <a href="http://127.0.0.1:5503/dashboard/index.html" target="_blank" rel="noopener">Open Secondary Dashboard Path</a>
      <a href="../z_ssws_copy/index.html" target="_blank" rel="noopener">Open Z-SSWS Copy Hub</a>
    </div>
    <div class="card">
      <h3>Snapshot Artifact</h3>
      <a href="./core_index.snapshot.html" target="_blank" rel="noopener">Open copied core index snapshot</a>
    </div>
  </body>
</html>
`
);

write(
  path.join(sswsCopy, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Z-SSWS Copy Hub (Lab)</title>
    <style>
      body { background:#020b2b; color:#00d4ff; font-family:Consolas,Segoe UI,Arial,sans-serif; margin:0; padding:1rem; }
      .card { border:1px solid #00d4ff; border-radius:10px; padding:1rem; margin-bottom:1rem; background:rgba(0,0,0,.25); }
      a { color:#7dffb0; display:block; margin:.35rem 0; }
      code { color:#ffd166; }
      .muted { color:#9fb3c8; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Z-SSWS Copy Hub (Lab-Only)</h2>
      <p class="muted">Task and report links for isolated SSWS follow-up (no runtime binding).</p>
      <a href="http://127.0.0.1:5503/core/index.html" target="_blank" rel="noopener">Open Sanctuary Dashboard</a>
      <a href="http://127.0.0.1:5503/data/reports/z_ssws_daily_report.json" target="_blank" rel="noopener">Open SSWS Daily Report JSON</a>
      <a href="http://127.0.0.1:5503/data/reports/zuno_system_state_report.md" target="_blank" rel="noopener">Open Zuno System Report</a>
    </div>
    <div class="card">
      <h3>Recommended VS Code Tasks</h3>
      <p><code>Z: SSWS Verify</code></p>
      <p><code>Z: SSWS Daily Report</code></p>
      <p><code>Z: Reports Vault Refresh</code></p>
    </div>
    <div class="card">
      <h3>Snapshot Artifact</h3>
      <a href="./z_ssws_banner.snapshot.js" target="_blank" rel="noopener">Open copied z_ssws_banner snapshot</a>
    </div>
  </body>
</html>
`
);

const dashboardWs = path.join(workspacesRoot, 'Z_LAB_Dashboard_Copy.code-workspace');
const sswsWs = path.join(workspacesRoot, 'Z_LAB_SSWS_Copy.code-workspace');

write(
  dashboardWs,
  JSON.stringify(
    {
      folders: [{ path: path.join(LAB_ROOT, 'copies', 'dashboard_copy') }],
      settings: {
        'files.autoSave': 'afterDelay',
        'editor.formatOnSave': true,
        'terminal.integrated.defaultProfile.windows': 'PowerShell',
        'task.allowAutomaticTasks': 'on',
        'liveServer.settings.port': 5601,
      },
    },
    null,
    2
  ) + '\n'
);

write(
  sswsWs,
  JSON.stringify(
    {
      folders: [{ path: path.join(LAB_ROOT, 'copies', 'z_ssws_copy') }],
      settings: {
        'files.autoSave': 'afterDelay',
        'editor.formatOnSave': true,
        'terminal.integrated.defaultProfile.windows': 'PowerShell',
        'task.allowAutomaticTasks': 'on',
        'liveServer.settings.port': 5602,
      },
    },
    null,
    2
  ) + '\n'
);

const launcherPath = path.join(workspacesRoot, 'launch_4_windows.cmd');
write(
  launcherPath,
  `@echo off
set CORE_A=${path.join(ROOT, 'Z_SSWS.code-workspace')}
set CORE_B=${path.join(ROOT, 'core', 'ZSanctuary_Universe.code-workspace')}
set LAB_A=${dashboardWs}
set LAB_B=${sswsWs}

start "" code -n "%CORE_A%"
start "" code -n "%CORE_B%"
start "" code -n "%LAB_A%"
start "" code -n "%LAB_B%"
echo Launched 4 VS Code windows: 2 core + 2 lab copies.
`
);

const planPath = path.join(workspacesRoot, 'Z_4_WINDOW_PLAN.md');
write(
  planPath,
  `# Z 4-Window Plan

1. Core Window A: \`Z_SSWS.code-workspace\`
2. Core Window B: \`core/ZSanctuary_Universe.code-workspace\`
3. Lab Window A: \`Z_LAB_Dashboard_Copy.code-workspace\`
4. Lab Window B: \`Z_LAB_SSWS_Copy.code-workspace\`

Run \`launch_4_windows.cmd\` to open all four.

Safety:
- Lab windows are isolated copy hubs.
- No runtime registry linkage was added.
- Sanctuary core remains protected.
`
);

ensureDir(REPORTS_DIR);
const report = {
  generated_at: new Date().toISOString(),
  status: 'ready',
  lab_root: LAB_ROOT.replace(/\\/g, '/'),
  lab_policy: policy,
  artifacts: {
    dashboard_copy_html: path.join(dashboardCopy, 'index.html').replace(/\\/g, '/'),
    ssws_copy_html: path.join(sswsCopy, 'index.html').replace(/\\/g, '/'),
    dashboard_workspace: dashboardWs.replace(/\\/g, '/'),
    ssws_workspace: sswsWs.replace(/\\/g, '/'),
    launcher: launcherPath.replace(/\\/g, '/'),
    plan: planPath.replace(/\\/g, '/'),
  },
  copied_snapshots: copiedArtifacts,
  notes:
    'Created copy hubs and VS Code workspace windows for parallel operation; no Sanctuary runtime linkage.',
};
fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  `# Z Lab Dual Copies Setup

- Generated: ${report.generated_at}
- Status: ${report.status}
- Lab root: ${report.lab_root}

## Artifacts
- Dashboard copy: ${report.artifacts.dashboard_copy_html}
- Z-SSWS copy: ${report.artifacts.ssws_copy_html}
- Dashboard workspace: ${report.artifacts.dashboard_workspace}
- Z-SSWS workspace: ${report.artifacts.ssws_workspace}
- 4-window launcher: ${report.artifacts.launcher}
- Plan: ${report.artifacts.plan}

## Notes
- ${report.notes}
`,
  'utf8'
);

console.log(`Z lab dual copies setup complete: ${OUT_JSON}`);
