import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function repoRel(root, rel) {
  return path.join(root, rel.split('/').join(path.sep));
}

export function sha256File(absPath) {
  const buf = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(buf).digest('hex');
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
    for (const key of Object.keys(value).sort()) {
      out[key] = sortKeys(value[key]);
    }
    return out;
  }
  return value;
}

export function stableStringify(value) {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

function missing(rel, reason) {
  return { ok: false, path: rel, reason };
}

export function loadJsonSource(root, rel) {
  const abs = repoRel(root, rel);
  if (!fs.existsSync(abs)) return missing(rel, 'SOURCE_MISSING');
  const sha256 = sha256File(abs);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch {
    return { ok: false, path: rel, reason: 'SOURCE_INVALID', sha256 };
  }
  return { ok: true, path: rel, sha256, data: parsed };
}

export function loadTextSource(root, rel) {
  const abs = repoRel(root, rel);
  if (!fs.existsSync(abs)) return missing(rel, 'SOURCE_MISSING');
  const sha256 = sha256File(abs);
  const text = fs.readFileSync(abs, 'utf8');
  return { ok: true, path: rel, sha256, data: text };
}

export function loadConfiguredSources(root, sourcePaths) {
  const pc = loadJsonSource(root, sourcePaths.pc_root);
  const identity = loadTextSource(root, sourcePaths.identity_reconciliation);
  const eco = loadJsonSource(root, sourcePaths.ecosystem_awareness);
  const errors = [];
  for (const item of [pc, identity, eco]) {
    if (!item.ok) errors.push(item);
  }
  return { pc, identity, eco, errors };
}
