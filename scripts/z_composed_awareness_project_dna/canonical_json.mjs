import crypto from 'node:crypto';

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
  return crypto.createHash('sha256').update(Buffer.from(JSON.stringify(sortKeys(obj)), 'utf8')).digest('hex');
}

export function sha256Bytes(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}
