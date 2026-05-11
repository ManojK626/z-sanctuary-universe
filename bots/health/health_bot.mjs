#!/usr/bin/env node
/**
 * z-mini-bot-health — local Node/OS metrics (observe-only).
 */
import os from 'node:os';
import path from 'node:path';
import { hubRoot } from '../_lib/hub_root.mjs';
import { writeJson } from '../_lib/io.mjs';

const ROOT = hubRoot(import.meta.url);
const OUT = path.join(ROOT, 'data', 'reports', 'z_bot_health.json');

const total = os.totalmem();
const free = os.freemem();
const used = total - free;
const used_pct = total > 0 ? Math.round((used / total) * 1000) / 10 : 0;

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  name: 'z-mini-bot-health',
  advisory: true,
  drp_note: 'Local process metrics only. Not a replacement for SICMNS or service monitors.',
  hostname: os.hostname(),
  platform: os.platform(),
  release: os.release(),
  loadavg: os.loadavg(),
  cpu_count: os.cpus().length,
  memory: {
    total_bytes: total,
    free_bytes: free,
    used_bytes: used,
    used_pct
  },
  uptime_sec: os.uptime()
};

writeJson(OUT, payload);
console.log(`✅ Health bot: ${OUT}`);
