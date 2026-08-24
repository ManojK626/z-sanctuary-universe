import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function repoRel(root, rel) {
  return path.join(root, rel.split('/').join(path.sep));
}

export function sha256File(absPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(absPath)).digest('hex');
}

export function deepClone(v) {
  return JSON.parse(JSON.stringify(v));
}

export function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    if (Array.isArray(value)) {
      for (const item of value) deepFreeze(item);
    } else {
      for (const key of Object.keys(value)) deepFreeze(value[key]);
    }
  }
  return value;
}

export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeys(value[key]);
    return out;
  }
  return value;
}

export function stableStringify(value) {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

export function loadJson(root, rel) {
  const abs = repoRel(root, rel);
  if (!fs.existsSync(abs)) return { ok: false, path: rel, reason: 'SOURCE_MISSING' };
  const sha256 = sha256File(abs);
  try {
    return { ok: true, path: rel, sha256, data: JSON.parse(fs.readFileSync(abs, 'utf8')) };
  } catch {
    return { ok: false, path: rel, sha256, reason: 'SOURCE_INVALID' };
  }
}

export function loadConfigured(root, paths) {
  const manifest = loadJson(root, paths.manifest);
  const drift = loadJson(root, paths.drift);
  const pc_root = loadJson(root, paths.pc_root);
  const errors = [manifest, drift, pc_root].filter((x) => !x.ok);
  return { manifest, drift, pc_root, errors };
}
