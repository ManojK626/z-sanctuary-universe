#!/usr/bin/env node
/**
 * ZUNO-A2 helper — copy current ingested snapshot to baseline for future diffs.
 * Explicit operator action (no automatic side effects from diff).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CURRENT = path.join(ROOT, 'data', 'zuno_state_snapshot.json');
const BASELINE = path.join(ROOT, 'data', 'zuno_state_snapshot.baseline.json');

function main() {
  if (!fs.existsSync(CURRENT)) {
    console.error('Missing data/zuno_state_snapshot.json — run npm run zuno:snapshot first.');
    process.exit(1);
  }
  fs.copyFileSync(CURRENT, BASELINE);
  console.log(JSON.stringify({ ok: true, wrote: path.relative(ROOT, BASELINE).replace(/\\/g, '/') }, null, 2));
}

main();
