#!/usr/bin/env node
/**
 * Copy hub .cursor/commands and .cursor/agents to PC root (Organiser) so /slash commands
 * and custom subagents work when opening only the parent folder or Z_All_Projects workspace.
 *
 * Default: dry-run (prints actions only). Use --apply to write. Use --apply --force to overwrite existing files.
 *
 * Safety: only runs if this repo path matches pc_root + hub from data/z_pc_root_projects.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');

const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');

function readPcRoot() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  const pcRoot = path.resolve(String(data.pc_root || '').replace(/\//g, path.sep));
  const hub = data.hub || 'ZSanctuary_Universe';
  return { pcRoot, hub, data };
}

function assertHubRepo(pcRoot, hub) {
  const expected = path.resolve(pcRoot, hub);
  const here = path.resolve(ROOT);
  if (here !== expected) {
    console.error('[z_sync_cursor_config_to_pc_root] Safety stop.');
    console.error(`  Expected hub repo at: ${expected}`);
    console.error(`  This script lives in:  ${here}`);
    console.error('  Run from ZSanctuary_Universe root only.');
    process.exit(1);
  }
}

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function copyDir({ label, srcDir, destDir, dryRun }) {
  const files = listMdFiles(srcDir);
  if (!files.length) {
    console.log(`[${label}] no .md files in ${srcDir} (skip)`);
    return { copied: 0, skipped: 0 };
  }
  let copied = 0;
  let skipped = 0;
  for (const name of files) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    const exists = fs.existsSync(to);
    if (dryRun) {
      if (exists && !force) {
        console.log(`[${label}] dry-run: skip (exists, use --force to replace): ${to}`);
        skipped++;
      } else {
        console.log(`[${label}] dry-run: would copy -> ${to}`);
        copied++;
      }
      continue;
    }
    if (exists && !force) {
      console.log(`[${label}] skip (exists): ${to}`);
      skipped++;
      continue;
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    console.log(`[${label}] copied: ${to}`);
    copied++;
  }
  return { copied, skipped };
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Missing', DATA_PATH);
    process.exit(1);
  }

  const { pcRoot, hub } = readPcRoot();
  if (!pcRoot || !fs.existsSync(pcRoot)) {
    console.error('Invalid or missing pc_root:', pcRoot);
    process.exit(1);
  }

  assertHubRepo(pcRoot, hub);

  const dryRun = !apply;
  if (dryRun) {
    console.log('[z_sync_cursor_config_to_pc_root] DRY-RUN (no writes). Pass --apply to copy; --apply --force to overwrite.\n');
  } else {
    console.log('[z_sync_cursor_config_to_pc_root] APPLY mode' + (force ? ' (force overwrite)' : '') + '\n');
  }

  const destBase = path.join(pcRoot, '.cursor');
  const commandsSrc = path.join(ROOT, '.cursor', 'commands');
  const agentsSrc = path.join(ROOT, '.cursor', 'agents');
  const commandsDest = path.join(destBase, 'commands');
  const agentsDest = path.join(destBase, 'agents');

  const r1 = copyDir({ label: 'commands', srcDir: commandsSrc, destDir: commandsDest, dryRun });
  const r2 = copyDir({ label: 'agents', srcDir: agentsSrc, destDir: agentsDest, dryRun });

  console.log(
    `\nSummary: commands copied=${r1.copied} skipped=${r1.skipped}; agents copied=${r2.copied} skipped=${r2.skipped}`
  );
  if (dryRun) {
    console.log('PC root .cursor destination:', destBase);
  }
}

main();
