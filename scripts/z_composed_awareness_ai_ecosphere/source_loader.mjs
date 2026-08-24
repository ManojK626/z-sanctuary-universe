import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function repoRel(root, rel) {
  return path.join(root, rel.split('/').join(path.sep));
}

export function sha256Bytes(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export function sha256File(absPath) {
  return sha256Bytes(fs.readFileSync(absPath));
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

export function canonicalJsonSha(obj) {
  return sha256Bytes(Buffer.from(JSON.stringify(sortKeys(obj)), 'utf8'));
}

export function loadJson(root, rel) {
  const abs = repoRel(root, rel);
  if (!fs.existsSync(abs)) return { ok: false, path: rel, reason: 'SOURCE_MISSING' };
  const buf = fs.readFileSync(abs);
  const sha256 = sha256Bytes(buf);
  try {
    const data = JSON.parse(buf.toString('utf8'));
    return { ok: true, path: rel, sha256, canonical_json_sha256: canonicalJsonSha(data), data };
  } catch {
    return { ok: false, path: rel, sha256, reason: 'SOURCE_INVALID' };
  }
}

export function loadConfigured(root, paths) {
  const config = loadJson(root, paths.config);
  const ledger = loadJson(root, paths.ledger);
  const status = loadJson(root, paths.status);
  const errors = [config, ledger, status].filter((x) => !x.ok);
  return { config, ledger, status, errors };
}
