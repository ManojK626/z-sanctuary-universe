#!/usr/bin/env node
/**
 * z-mini-bot-sync — copy registry JSON into a timestamped snapshot dir (not full tree).
 */
import fs from 'node:fs';
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const SRC = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const snapRoot = path.join(ROOT, 'data', 'reports', 'bot_sync_snapshots');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const destDir = path.join(snapRoot, stamp);

fs.mkdirSync(destDir, { recursive: true });
const destFile = path.join(destDir, 'z_pc_root_projects.json');
if (fs.existsSync(SRC)) {
  fs.copyFileSync(SRC, destFile);
}

const reg = readJson(SRC);
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_sync.json');
const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-sync',
  advisory: true,
  drp_note:
    'Registry snapshot only. No full Organiser copy. For production backup, use NAS / Folder Manager per vault policy.',
  source_registry: 'data/z_pc_root_projects.json',
  destination_dir: path.relative(ROOT, destDir).replace(/\\/g, '/'),
  latest_snapshot_dir: path.relative(ROOT, destDir).replace(/\\/g, '/'),
  copied: Boolean(reg)
};
writeJson(OUT, payload);
console.log(`✅ Sync bot: ${OUT} → ${payload.latest_snapshot_dir}`);
