#!/usr/bin/env node
/**
 * Gate 2 — Abuse resistance: uses real checkFairness on temporary users, then restores bridge JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { zBridgePaths, Z_BRIDGE_REPO_ROOT } from './z_bridge_loader.mjs';
import { checkFairness } from './z_fairness_guard.mjs';
import { applyIntelligentAllocation } from './z_intelligence_engine.mjs';
import { createUser, findUserById, loadUsers, saveUsers } from './z_user_registry.mjs';

const REPORT_DIR = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'reports');
const OUT = path.join(REPORT_DIR, 'z_bridge_abuse_simulation.json');
const PATHS = zBridgePaths();

function readJsonFile(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJsonFile(p, doc) {
  fs.writeFileSync(p, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

function snapshotBridgeStores() {
  const files = [PATHS.pool, PATHS.users, PATHS.allocationHistory, PATHS.logs];
  const snap = new Map();
  for (const fp of files) {
    snap.set(fp, readJsonFile(fp));
  }
  return snap;
}

function restoreBridgeStores(snap) {
  if (!snap) return;
  for (const [fp, doc] of snap.entries()) {
    writeJsonFile(fp, doc);
  }
}

function prepareUser(id, patch) {
  createUser(id);
  const doc = loadUsers();
  const u = findUserById(doc, id);
  if (!u) return;
  Object.assign(u, patch);
  saveUsers(doc);
}

function main() {
  const snap = snapshotBridgeStores();
  const scenarios = [];
  const now = Date.now();
  try {
    prepareUser('sim_rapid', {
      credits: 0,
      daily_allocated: 0,
      flagged: false,
      reputation_score: 1,
      last_allocation: new Date(now - 60_000).toISOString(),
      last_daily_reset: new Date().toISOString()
    });
    const r1 = checkFairness('sim_rapid', 5);
    scenarios.push({ id: 'rapid_after_allocation', expect: 'BLOCK', got: r1.status, pass: r1.status === 'BLOCK' });

    prepareUser('sim_flagged', {
      credits: 0,
      daily_allocated: 0,
      flagged: true,
      reputation_score: 1,
      last_allocation: null,
      last_daily_reset: new Date().toISOString()
    });
    const r2 = checkFairness('sim_flagged', 10);
    scenarios.push({ id: 'flagged_blocked', expect: 'BLOCK', got: r2.status, pass: r2.status === 'BLOCK' });

    prepareUser('sim_heavy', {
      credits: 0,
      daily_allocated: 20,
      flagged: false,
      reputation_score: 1,
      last_allocation: null,
      last_daily_reset: new Date().toISOString()
    });
    const r3 = checkFairness('sim_heavy', 5);
    scenarios.push({ id: 'daily_cap', expect: 'BLOCK', got: r3.status, pass: r3.status === 'BLOCK' });

    prepareUser('sim_ok', {
      credits: 0,
      daily_allocated: 0,
      flagged: false,
      reputation_score: 1,
      last_allocation: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
      last_daily_reset: new Date().toISOString()
    });
    const r4 = checkFairness('sim_ok', 0);
    scenarios.push({ id: 'invalid_amount', expect: 'BLOCK', got: r4.status, pass: r4.status === 'BLOCK' });

    let intelOk = true;
    for (let i = 0; i < 200; i++) {
      const u = { reputation_score: 1 + (i % 3) * 0.05, daily_allocated: i % 19, flagged: false };
      const a = applyIntelligentAllocation(10, u);
      if (!Number.isFinite(a.adjusted_amount) || a.adjusted_amount < 1) intelOk = false;
    }
    scenarios.push({ id: 'intel_flood_stable', expect: 'stable', pass: intelOk });
  } finally {
    restoreBridgeStores(snap);
  }

  const failed = scenarios.filter((s) => !s.pass);
  const status = failed.length === 0 ? 'SAFE' : 'RISK';
  const payload = {
    generated_at: new Date().toISOString(),
    gate: 'abuse_resistance',
    status,
    scenarios,
    failed_count: failed.length,
    note: 'Temporary sim users were written then fully restored from snapshot.'
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(status === 'SAFE' ? 0 : 1);
}

main();
