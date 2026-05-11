// Z: scripts\doctor.js
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const checks = [
  {
    name: 'Node.js',
    check: () => {
      try {
        const version = execSync('node -v', { stdio: 'pipe' }).toString().trim();
        return { ok: version.startsWith('v18'), detail: version };
      } catch (e) {
        return { ok: false, detail: 'node not installed' };
      }
    },
  },
  {
    name: 'Roulette data folder',
    check: () => {
      return { ok: existsSync('data/raw'), detail: 'data/raw exists' };
    },
  },
  {
    name: 'Module manifest',
    check: () => {
      if (!existsSync('data/Z_module_manifest.json') && !existsSync('data/z_module_manifest.json'))
        return { ok: false, detail: 'missing z_module_manifest' };
      try {
        const path = existsSync('data/Z_module_manifest.json')
          ? 'data/Z_module_manifest.json'
          : 'data/z_module_manifest.json';
        JSON.parse(readFileSync(path, 'utf8'));
        return { ok: true, detail: 'manifest parsed' };
      } catch {
        return { ok: false, detail: 'manifest parse error' };
      }
    },
  },
];

console.log('🩺 Z-Sanctuary Doctor Check');
checks.forEach((entry) => {
  const result = entry.check();
  if (result.ok) {
    console.log(`🟢 ${entry.name} — ${result.detail}`);
  } else {
    console.log(`⚠️ ${entry.name} — ${result.detail}`);
  }
});
console.log('Doctor complete.');
