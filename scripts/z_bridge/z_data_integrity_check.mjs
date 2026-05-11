#!/usr/bin/env node
/**
 * Gate 1 — Z-Bridge data integrity (read-only on live JSON).
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadZBridge, Z_BRIDGE_REPO_ROOT } from './z_bridge_loader.mjs';

const REPORT_DIR = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'reports');
const OUT = path.join(REPORT_DIR, 'z_bridge_data_integrity.json');

function main() {
  const reasons = [];
  const loaded = loadZBridge();
  if (!loaded.ok) {
    const payload = {
      generated_at: new Date().toISOString(),
      gate: 'data_integrity',
      status: 'FAIL',
      reasons: loaded.errors
    };
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(JSON.stringify(payload, null, 2));
    process.exit(1);
  }

  const { pool, users, allocationHistory } = loaded.bundle;

  const total = Number(pool?.total_credits);
  const avail = Number(pool?.available);
  const dist = Number(pool?.distributed_credits);
  const contrib = Number(pool?.contributions);

  for (const [name, v] of [
    ['total_credits', total],
    ['available', avail],
    ['distributed_credits', dist],
    ['contributions', contrib]
  ]) {
    if (!Number.isFinite(v) || v < 0) reasons.push(`invalid_or_negative:${name}=${pool?.[name]}`);
  }

  if (Number.isFinite(total) && Number.isFinite(dist) && dist > total + 1e-6) {
    reasons.push(`distributed_exceeds_total: distributed=${dist} total=${total}`);
  }

  if (Number.isFinite(total) && Number.isFinite(avail) && Number.isFinite(dist)) {
    const expectedAvail = total - dist;
    if (Math.abs(avail - expectedAvail) > 1e-6) {
      reasons.push(`available_mismatch: available=${avail} expected_total_minus_distributed=${expectedAvail}`);
    }
  }

  const userList = Array.isArray(users?.users) ? users.users : [];
  const ids = new Set();
  for (const u of userList) {
    const id = u?.id;
    if (!id || typeof id !== 'string') reasons.push('user_missing_id');
    else if (ids.has(id)) reasons.push(`duplicate_user_id:${id}`);
    else ids.add(id);
    const c = u?.credits;
    if (typeof c === 'number' && c < 0) reasons.push(`negative_user_credits:${id}`);
  }

  const allocs = Array.isArray(allocationHistory?.allocations) ? allocationHistory.allocations : [];
  for (const a of allocs) {
    const amt = Number(a?.amount);
    if (!Number.isFinite(amt) || amt < 0) reasons.push(`invalid_allocation_amount:${JSON.stringify(a)}`);
    if (!a?.userId) reasons.push(`allocation_missing_userId:${JSON.stringify(a)}`);
  }

  const status = reasons.length === 0 ? 'PASS' : 'FAIL';
  const payload = {
    generated_at: new Date().toISOString(),
    gate: 'data_integrity',
    status,
    reasons,
    checks: {
      users: userList.length,
      allocations: allocs.length
    }
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(status === 'PASS' ? 0 : 1);
}

main();
