#!/usr/bin/env node
// Z: appends one JSONL line. Pass full runGGAESP output, or `{ "memoryCapsule": { } }`, or a path to JSON.
// Examples (hub root):
//   node scripts/z_ggaesp_memory_append.mjs ggaesp_snapshot.json
//   npx -y ggaesp — no;  echo {"memoryCapsule":{...}}  |  node scripts/z_ggaesp_memory_append.mjs

import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { appendGgaespZecrResult, appendMemoryCapsule } from '../core_engine/node/ggaesp_memory.js';

async function readInput() {
  const arg = process.argv[2];
  if (arg === '-h' || arg === '--help') {
    process.stdout.write(
      'GGAESP memory: append one record to data/ggaesp/memory_capsules.jsonl\n' +
        '  node scripts/z_ggaesp_memory_append.mjs <path.json>\n' +
        '  Full runGGAESP JSON (with energyMode + branch) → GGAESP_MEMORY_V2\n' +
        '  echo \'{"memoryCapsule":{...}}\' | node scripts/z_ggaesp_memory_append.mjs  (V1)\n',
    );
    process.exit(0);
  }
  if (arg) {
    return (await readFile(arg, 'utf8')).trim();
  }
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8').trim();
}

function pickCapsule(data) {
  if (data == null) return null;
  if (typeof data !== 'object' || Array.isArray(data)) return null;
  if (data.memoryCapsule && typeof data.memoryCapsule === 'object' && !Array.isArray(data.memoryCapsule)) {
    return data.memoryCapsule;
  }
  if (data.capsuleType === 'GGAESP_MEMORY' && 'moduleId' in data) {
    return data;
  }
  return null;
}

async function main() {
  const text = await readInput();
  if (!text) {
    process.stderr.write('GGAESP memory: empty input. Provide a .json file path, or pipe JSON to stdin.\n');
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    process.stderr.write('GGAESP memory: invalid JSON\n');
    process.exit(1);
  }
  const cap = pickCapsule(data);
  if (cap == null || typeof cap !== 'object') {
    process.stderr.write('GGAESP memory: could not resolve memoryCapsule\n');
    process.exit(1);
  }

  const isZecrResult =
    typeof data.energyMode === 'string' &&
    data.branch != null &&
    typeof data.branch === 'object' &&
    typeof data.moduleId === 'string' &&
    typeof data.timestamp === 'string';

  let r;
  if (isZecrResult) {
    r = appendGgaespZecrResult(
      {
        moduleId: data.moduleId,
        timestamp: data.timestamp,
        energyMode: data.energyMode,
        branch: data.branch,
        memoryCapsule: cap,
      },
      { extra: { via: 'z_ggaesp_memory_append.mjs' } }
    );
  } else {
    r = appendMemoryCapsule(cap, { extra: { via: 'z_ggaesp_memory_append.mjs' } });
  }
  process.stdout.write(`OK ${r.path} (+${r.bytes} bytes)  [${isZecrResult ? 'V2 Z-ECR' : 'V1'}]\n`);
}

main().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
