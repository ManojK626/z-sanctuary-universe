// Z: scripts/launch_zsanctuary.js
/**
 * launch_zsanctuary.js
 * One-click bootstrap for the Z-Sanctuary workspace.
 *
 * Creates:
 *  - complete folder structure (/core, /interface, /miniai, /audio, /data, /archive, /.vscode)
 *  - full placeholder content for all core modules
 *  - VS Code configuration (tasks, extensions)
 *  - free VS Code extensions (Live Server, Code Runner, Prettier)
 *  - opens workspace in VS Code
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const SOURCE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SOURCE_ROOT, '..');
const dirs = ['core', 'interface', 'miniai', 'audio', 'data', 'archive', '.vscode'];

console.log(' Bootstrapping Z-Sanctuary Universe...\n');

function ensureDir(d) {
  const full = path.join(ROOT, d);
  fs.mkdirSync(full, { recursive: true });
  console.log(' created:', full);
}

fs.mkdirSync(ROOT, { recursive: true });
dirs.forEach(ensureDir);
console.log();

const templateFiles = [
  'core/z_status_console.js',
  'core/z_emotion_filter.js',
  'core/z_energy_response.js',
  'core/z_chronicle.js',
  'core/z_chronicle_hud.js',
  'core/z_dev_mode.js',
  'core/z_dashboard.js',
  'core/z_governance_hud.js',
  'core/index.html',
  'interface/z_style.css',
  '.vscode/extensions.json',
  '.vscode/tasks.json',
  '.vscode/settings.json',
  '.vscode/launch.json',
  '.vscode/ZSanctuary_Universe.code-workspace',
];

function writeTemplate(relPath) {
  const src = path.join(ROOT, relPath);
  const dest = path.join(ROOT, relPath);
  const content = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, content);
  console.log('created:', dest);
}

templateFiles.forEach(writeTemplate);
console.log('[OK] File scaffolding complete\n');

const extensions = [
  'ritwickdey.liveserver',
  'formulahendry.code-runner',
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint',
];

console.log(' Installing VS Code extensions...');
let successCount = 0;
extensions.forEach((ext) => {
  try {
    execSync(`code --install-extension ${ext}`, { stdio: 'ignore' });
    console.log('   ', ext);
    successCount++;
  } catch {
    console.log('   [WARN]', ext, '(offline or already installed)');
  }
});
console.log(`[OK] Extensions installed: ${successCount}/${extensions.length}`);
console.log();

console.log('[START] Opening workspace in VS Code...');
try {
  execSync(`code "${ROOT}"`, { stdio: 'inherit' });
} catch {
  console.log('[OK] Setup complete! Open VS Code manually at:', ROOT);
}

console.log('\n[OK] Next steps:');
console.log('   1. Right-click core/index.html -> \'Open with Live Server\'');
console.log('   2. Browser console shows module activation logs');
console.log('   3. Dev mode: Click button or Ctrl+Shift+D (passphrase: zuno-dev)');
