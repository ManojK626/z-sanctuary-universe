#!/usr/bin/env node
/**
 * Z-UNIVERSE-REGISTRY-REFRESH-1 — Idempotent refresh of universe project registry.
 * Re-runs read-only discovery scan (MC-0.5). No project mutations.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scan = path.join(__dirname, 'z_universe_discovery_scan.mjs');

const r = spawnSync(process.execPath, [scan, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
