#!/usr/bin/env node
/**
 * Gate 3 — Stability: repeated in-memory allocation math (no pool mutation).
 */
import fs from 'node:fs';
import path from 'node:path';
import { applyIntelligentAllocation } from './z_intelligence_engine.mjs';
import { Z_BRIDGE_REPO_ROOT } from './z_bridge_loader.mjs';

const REPORT_DIR = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'reports');
const OUT = path.join(REPORT_DIR, 'z_bridge_stability_runner.json');

const LOOPS = Math.min(200, Math.max(20, Number(process.env.Z_READINESS_STABILITY_LOOPS || 80)));

function main() {
  const errors = [];
  for (let i = 0; i < LOOPS; i++) {
    const u = {
      reputation_score: 0.9 + (i % 5) * 0.05,
      daily_allocated: i % 18,
      flagged: i % 17 === 0
    };
    try {
      const a = applyIntelligentAllocation(8 + (i % 7), u);
      if (!Number.isFinite(a.priority_score) || a.priority_score < 0.5) errors.push(`priority_oob:i=${i}`);
      if (!Number.isFinite(a.adjusted_amount) || a.adjusted_amount < 1) errors.push(`adjusted_oob:i=${i}`);
    } catch (e) {
      errors.push(`throw:i=${i}:${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const status = errors.length === 0 ? 'PASS' : 'FAIL';
  const payload = {
    generated_at: new Date().toISOString(),
    gate: 'stability',
    status,
    loops: LOOPS,
    errors
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(status === 'PASS' ? 0 : 1);
}

main();
