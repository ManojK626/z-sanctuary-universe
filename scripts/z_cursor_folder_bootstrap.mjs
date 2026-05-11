#!/usr/bin/env node
// Z: scripts/z_cursor_folder_bootstrap.mjs
// Ensures hub spine directories from data/z_cursor_folder_blueprint.json exist.
// Usage (repo root):
//   node scripts/z_cursor_folder_bootstrap.mjs           # dry-run: list missing
//   node scripts/z_cursor_folder_bootstrap.mjs --apply   # create missing (mkdir -p)
//   node scripts/z_cursor_folder_bootstrap.mjs --verify  # exit 1 if any verify path missing

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const BLUEPRINT_REL = path.join('data', 'z_cursor_folder_blueprint.json');

function readBlueprint() {
  const p = path.join(ROOT, BLUEPRINT_REL);
  if (!fs.existsSync(p)) {
    console.error(`[z_cursor_folder_bootstrap] Missing blueprint: ${BLUEPRINT_REL}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('[z_cursor_folder_bootstrap] Invalid JSON in blueprint:', e?.message || e);
    process.exit(1);
  }
}

function isDir(rel) {
  const abs = path.join(ROOT, rel);
  try {
    return fs.statSync(abs).isDirectory();
  } catch {
    return false;
  }
}

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const verifyOnly = args.has('--verify');

const bp = readBlueprint();
const dirs = Array.isArray(bp.directories) ? bp.directories : [];

const toVerify = dirs.filter((d) => d.verify && d.path);
const toMkdir = dirs.filter((d) => d.mkdirOnApply && d.path);

const missingVerify = toVerify.map((d) => d.path).filter((rel) => !isDir(rel));
const missingMkdir = toMkdir.map((d) => d.path).filter((rel) => !isDir(rel));

if (verifyOnly) {
  if (missingVerify.length) {
    console.error('\n[z_cursor_folder_bootstrap] VERIFY FAIL — missing directories:\n');
    missingVerify.forEach((rel) => console.error('  -', rel));
    console.error('\nRun: npm run cursor:folders:apply (after review) or restore from git.\n');
    process.exit(1);
  }
  console.log(`✅ Cursor folder blueprint verify OK (${toVerify.length} path(s) checked).`);
  process.exit(0);
}

console.log('\nZ-Cursor folder blueprint (hub spine)');
console.log('=====================================\n');
if (bp.ZHumanPrompt) console.log(`Ritual phrase: "${bp.ZHumanPrompt}"\n`);

if (missingMkdir.length === 0) {
  console.log('All mkdirOnApply paths already exist. Nothing to do.\n');
  process.exit(0);
}

console.log(`${apply ? 'Creating' : 'Would create'} missing director${missingMkdir.length === 1 ? 'y' : 'ies'}:\n`);
missingMkdir.forEach((rel) => console.log(`  - ${rel}`));
console.log('');

if (!apply) {
  console.log('Dry-run only. To create: node scripts/z_cursor_folder_bootstrap.mjs --apply\n');
  process.exit(0);
}

for (const rel of missingMkdir) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(abs, { recursive: true });
}
console.log(`✅ Created ${missingMkdir.length} missing director${missingMkdir.length === 1 ? 'y' : 'ies'}.\n`);
