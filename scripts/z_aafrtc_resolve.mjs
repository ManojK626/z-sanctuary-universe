#!/usr/bin/env node
/**
 * Writes data/reports/z_aafrtc_context.json and validates cwd is ZSanctuary hub root.
 * Usage: node scripts/z_aafrtc_resolve.mjs [--strict]
 * --strict: exit 1 if not hub (for IDE gate tasks).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isZSanctuaryHubRoot } from './z_aafrtc_hub_guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'reports', 'z_aafrtc_context.json');

const strict = process.argv.includes('--strict');
const cwd = process.cwd();
const isHub = isZSanctuaryHubRoot(cwd);

const payload = {
  generated_at: new Date().toISOString(),
  cwd,
  is_zsanctuary_hub_root: isHub,
  policy_file: 'data/z_aafrtc_policy.json',
  note: isHub
    ? 'AAFRTC pipelines may run here; overseer gates apply via npm scripts.'
    : 'Not the hub root — do not run verify:ci / verify:full here; open ZSanctuary_Universe as workspace folder.'
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
process.stdout.write(`AAFRTC context → ${OUT} (hub=${isHub})\n`);

if (!isHub && strict) {
  process.stderr.write(
    '[AAFRTC] Not ZSanctuary_Universe hub root. cd into hub or open that folder in Cursor before full run.\n'
  );
  process.exit(1);
}
process.exit(0);
