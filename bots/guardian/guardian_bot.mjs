#!/usr/bin/env node
/**
 * z-mini-bot-guardian — registry vs disk (observe-only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { readJson, writeJson } from '../_lib/io.mjs';
import { buildGuardianReport } from '../_lib/registry_scan.mjs';

const ROOT = hubRoot(import.meta.url);
const PC_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_guardian.json');
const SPI_PRE = path.join(ROOT, 'data', 'reports', 'z_spi_guardian_pre_warnings.json');

const reg = readJson(PC_PATH);
const pcRootRaw = reg?.pc_root ? path.normalize(String(reg.pc_root)) : '';
const pcRoot = pcRootRaw.replace(/\\/g, '/');
const projects = Array.isArray(reg?.projects) ? reg.projects : [];

const { results, summary } = pcRoot
  ? buildGuardianReport(pcRoot, projects)
  : { results: [], summary: { total: 0, present: 0, missing: 0, skipped_external: 0, severity: { HIGH: 0, MEDIUM: 0, LOW: 0, NONE: 0 }, highest_severity: 'NONE' } };

const spiPre = readJson(SPI_PRE);
const preWarnings = Array.isArray(spiPre?.pre_warnings) ? spiPre.pre_warnings : [];

const payload = {
  schema_version: 2,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-guardian',
  advisory: true,
  drp_note: 'Observe only. No auto-fix. Severity routes attention only.',
  pc_root: pcRoot || null,
  summary,
  results,
  pre_warnings: preWarnings,
  pre_warnings_source: preWarnings.length ? 'data/reports/z_spi_guardian_pre_warnings.json' : null,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
writeJson(OUT, payload);
console.log(`✅ Guardian bot: ${OUT} (missing ${summary.missing}, present ${summary.present})`);
