#!/usr/bin/env node
/**
 * Guided flow for learning log:
 * 1) generate template (optional)
 * 2) validate (dry-run)
 * 3) append (when --apply is provided)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const TEMPLATE_SCRIPT = path.join(ROOT, 'scripts', 'z_learning_log_template.mjs');
const APPEND_SCRIPT = path.join(ROOT, 'scripts', 'z_learning_log_append.mjs');

function parseArgs(argv) {
  const out = {
    eventFile: null,
    out: 'data/tmp_learning_event.json',
    strategy: undefined,
    domain: undefined,
    success: undefined,
    impact: undefined,
    apply: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--event-file') out.eventFile = argv[++i] ?? null;
    else if (a === '--out') out.out = argv[++i] ?? out.out;
    else if (a === '--strategy') out.strategy = argv[++i] ?? undefined;
    else if (a === '--domain') out.domain = argv[++i] ?? undefined;
    else if (a === '--success') out.success = argv[++i] ?? undefined;
    else if (a === '--impact') out.impact = argv[++i] ?? undefined;
    else if (a === '--apply') out.apply = true;
  }
  return out;
}

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: ROOT,
    stdio: 'inherit',
  });
}

function ensureTemplate(args) {
  const target = args.eventFile || args.out;
  if (args.eventFile) return args.eventFile;

  const cmd = [TEMPLATE_SCRIPT, '--out', target];
  if (args.strategy) cmd.push('--strategy', args.strategy);
  if (args.domain) cmd.push('--domain', args.domain);
  if (args.success !== undefined) cmd.push('--success', String(args.success));
  if (args.impact !== undefined) cmd.push('--impact', String(args.impact));
  const r = runNode(cmd);
  if (r.status !== 0) process.exit(r.status ?? 1);
  return target;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const eventFile = ensureTemplate(args);
  const resolved = path.resolve(ROOT, eventFile);

  if (!fs.existsSync(resolved)) {
    console.error(`❌ Event file missing: ${resolved}`);
    process.exit(1);
  }

  console.log('🔎 Validating event (dry-run)…');
  const validate = runNode([APPEND_SCRIPT, '--event-file', eventFile, '--dry-run']);
  if (validate.status !== 0) process.exit(validate.status ?? 1);

  if (!args.apply) {
    console.log(`\nNext step:\n  npm run ai:learning:flow -- --event-file "${eventFile}" --apply`);
    return;
  }

  console.log('✍️ Appending validated event…');
  const append = runNode([APPEND_SCRIPT, '--event-file', eventFile]);
  if (append.status !== 0) process.exit(append.status ?? 1);
}

main();
