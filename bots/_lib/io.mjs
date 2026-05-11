import fs from 'node:fs';
import path from 'node:path';

export function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

export function writeJson(p, value) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function appendJsonl(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.appendFileSync(p, `${JSON.stringify(obj)}\n`, 'utf8');
}

export function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8').trim();
  if (!raw) return [];
  const out = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t));
    } catch {
      /* skip bad line */
    }
  }
  return out;
}
