#!/usr/bin/env node
/**
 * On-demand snapshot: copy the live Zuno markdown report to an dated archive file.
 * Does not run the report generator — run `npm run zuno:state` first.
 *
 *   npm run zuno:state:archive
 *   node scripts/z_zuno_state_archive.mjs --date=2026-04-27
 *   node scripts/z_zuno_state_archive.mjs --force
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const SRC = path.join(REPORTS, 'zuno_system_state_report.md');
const hasForce = process.argv.includes('--force');

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

let dateStr;
const dateArg = process.argv.find((a) => a.startsWith('--date='));
if (dateArg) {
  dateStr = dateArg.slice('--date='.length).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.error('Invalid --date=YYYY-MM-DD');
    process.exit(1);
  }
} else {
  dateStr = ymd(new Date());
}

const dest = path.join(REPORTS, `zuno_system_state_report_archive_${dateStr}.md`);

if (!fs.existsSync(SRC)) {
  console.error('Missing source (run npm run zuno:state first):', SRC);
  process.exit(1);
}
if (fs.existsSync(dest) && !hasForce) {
  console.error('Archive already exists:', dest, '— use --force to overwrite.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(SRC, dest);
console.log('OK: archived to', path.relative(ROOT, dest));
