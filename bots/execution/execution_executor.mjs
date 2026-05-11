#!/usr/bin/env node
/**
 * z-mini-bot-execution-result — read-only preview for investigate_missing_project (no writes).
 */
import fs from 'node:fs';
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';
import { similarDirNames } from '../_lib/registry_scan.mjs';

const ROOT = hubRoot(import.meta.url);
const PC_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const GUARD = path.join(ROOT, 'data', 'reports', 'z_bot_guardian.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_execution_result.json');

const reg = readJson(PC_PATH);
const guardian = readJson(GUARD);
const pcRoot = reg?.pc_root ? path.normalize(String(reg.pc_root)) : '';

const missing = (guardian?.results || []).filter((r) => r.status === 'missing');
const expected_paths = missing.map((r) => ({
  id: r.id,
  name: r.name,
  path_relative: r.path_relative,
  absolute: r.absolute ? r.absolute.replace(/\\/g, '/') : r.absolute,
  exists_on_disk: false
}));

const similarPool = [];
for (const r of missing) {
  if (r.path_relative) {
    similarPool.push(...similarDirNames(pcRoot, r.path_relative, { max: 6 }));
  }
}

const last_run = {
  ok: true,
  mode: 'preview',
  decision_id: 'investigate_missing_project',
  summary:
    'Read-only. Confirms which registry paths are missing on disk. No files modified. Similar folder names are hints only.',
  findings: {
    registry_present: Boolean(reg),
    pc_root: pcRoot ? pcRoot.replace(/\\/g, '/') : null,
    expected_paths,
    similar_names: [...new Set(similarPool)].slice(0, 12)
  }
};

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-execution-result',
  advisory: true,
  drp_note: 'Preview/execute output. No destructive automation.',
  last_run
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
writeJson(OUT, payload);
console.log(`✅ Execution executor (preview): ${OUT} (${expected_paths.length} missing path(s))`);
