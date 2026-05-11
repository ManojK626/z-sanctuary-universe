#!/usr/bin/env node
/**
 * Z-API-SPINE-1 — API readiness charter (Phase 1 placeholder).
 * Reads spine registry for smoke/readiness command strings only; does not execute them.
 * Exit 0 always when registry parses (evidence posture, not a live readiness probe).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REG = path.join(ROOT, 'data', 'z_api_spine_registry.json');

function main() {
  let reg;
  try {
    reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  } catch (e) {
    console.error(`[z:api:readiness] Cannot parse ${REG}: ${e.message}`);
    process.exit(1);
  }
  const services = Array.isArray(reg.services) ? reg.services : [];
  const summary = services.map((s) => ({
    service_id: s.service_id,
    smoke_command: s.smoke_command || '',
    readiness_command: s.readiness_command || '',
    allow_health_probe: Boolean(s.allow_health_probe),
  }));
  const rel = path.relative(ROOT, REG).split(path.sep).join('/');
  const out = {
    schema: 'z_api_readiness_charter_v1',
    generated_at: new Date().toISOString(),
    posture:
      'Phase 1: charter and command strings only. Operators run smoke/readiness manually; no HTTP probes from this script unless a future SPINE-3 gate opens.',
    registry: rel,
    services: summary,
  };
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

main();
