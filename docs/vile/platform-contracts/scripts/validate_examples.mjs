#!/usr/bin/env node
/**
 * Phase 1.5 — validate contract fixtures parse as JSON and declare _non_executable.
 * Full JSON Schema validation deferred to Phase 2A (ajv in package).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.join(__dirname, '..', 'examples');
const schemasDir = path.join(__dirname, '..', 'schemas', 'v1');

let fail = 0;

function checkJsonFile(filePath, label) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
    console.log(`[OK] ${label}`);
  } catch (e) {
    console.error(`[FAIL] ${label}: ${e.message}`);
    fail += 1;
  }
}

for (const name of fs.readdirSync(examplesDir)) {
  if (!name.endsWith('.json')) continue;
  const full = path.join(examplesDir, name);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (data._non_executable !== true) {
    console.error(`[FAIL] ${name}: missing _non_executable: true`);
    fail += 1;
  } else {
    console.log(`[OK] ${name} marked non-executable`);
  }
  checkJsonFile(full, `parse ${name}`);
}

for (const name of fs.readdirSync(schemasDir)) {
  if (!name.endsWith('.schema.json')) continue;
  checkJsonFile(path.join(schemasDir, name), `schema ${name}`);
}

if (fail > 0) {
  console.error(`\nResult: FAIL (${fail} issue(s))`);
  process.exit(1);
}
console.log('\nResult: PASS — Phase 1.5 contract fixtures and schemas parse OK');
