#!/usr/bin/env node
/**
 * Z-Connect Phase 1.5 B1 — validate contract JSON parses; examples are non-executable.
 * Full AJV validation deferred to Phase 1.6+ / package layer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORBIDDEN_KEYS = new Set([
  'percentCompatible',
  'percent_compatible',
  'soulmateCertainty',
  'brainRank',
  'brainCapabilityTier',
  'destinyScore',
  'iqScore',
]);

let fail = 0;

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

function checkForbidden(obj, label, trail = '') {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => checkForbidden(v, label, `${trail}[${i}]`));
      return;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (FORBIDDEN_KEYS.has(k)) {
        console.error(`[FAIL] ${label}: forbidden key "${k}" at ${trail || 'root'}`);
        fail += 1;
      }
      checkForbidden(v, label, trail ? `${trail}.${k}` : k);
    }
  }
}

const schemaFiles = walk(ROOT).filter((f) => f.includes(`${path.sep}schemas${path.sep}`) && f.endsWith('.schema.json'));
const exampleDir = path.join(ROOT, 'examples');
const exampleFiles = fs.existsSync(exampleDir)
  ? walk(exampleDir).filter((f) => f.endsWith('.json'))
  : [];

for (const file of schemaFiles) {
  const rel = path.relative(ROOT, file);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    checkForbidden(data, rel);
    console.log(`[OK] schema ${rel}`);
  } catch (e) {
    console.error(`[FAIL] schema ${rel}: ${e.message}`);
    fail += 1;
  }
}

for (const file of exampleFiles) {
  const rel = path.relative(ROOT, file);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data._non_executable !== true) {
      console.error(`[FAIL] ${rel}: missing _non_executable: true`);
      fail += 1;
    }
    checkForbidden(data, rel);
    console.log(`[OK] example ${rel}`);
  } catch (e) {
    console.error(`[FAIL] example ${rel}: ${e.message}`);
    fail += 1;
  }
}

if (fail > 0) {
  console.error(`\nResult: FAIL (${fail} issue(s))`);
  process.exit(1);
}
console.log(`\nResult: PASS — ${schemaFiles.length} schemas, ${exampleFiles.length} examples`);
