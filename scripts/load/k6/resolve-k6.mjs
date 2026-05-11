/**
 * Locate k6 executable when not on PATH (common on Windows after winget install).
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function firstLineFromWhich() {
  const cmd = process.platform === 'win32' ? 'where.exe' : 'which';
  const r = spawnSync(cmd, ['k6'], { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout) return null;
  const line = r.stdout.trim().split(/\r?\n/)[0]?.trim();
  if (line && existsSync(line)) return line;
  return null;
}

export function resolveK6Binary() {
  const found = firstLineFromWhich();
  if (found) return found;

  if (process.platform === 'win32') {
    const candidates = [
      path.join(process.env.ProgramFiles || 'C:\\Program Files', 'k6', 'k6.exe'),
      path.join(process.env['ProgramFiles(x86)'] || '', 'k6', 'k6.exe'),
    ];
    for (const p of candidates) {
      if (p && existsSync(p)) return p;
    }
  }

  return null;
}
