import { requestAllocation } from './z_bridge_engine.mjs';
import { contributeToPool } from './z_contribution_engine.mjs';
import { createUser, findUserById, loadUsers, saveUsers } from './z_user_registry.mjs';
import { zBridgePaths } from './z_bridge_loader.mjs';
import fs from 'node:fs';

const NOW_ISO = new Date().toISOString();
const DRY_RUN = process.argv.includes('--dry-run');
const PATHS = zBridgePaths();
const SNAPSHOT_FILES = [PATHS.pool, PATHS.users, PATHS.allocationHistory, PATHS.logs];

function snapshotBridgeStores() {
  const snapshot = new Map();
  for (const filePath of SNAPSHOT_FILES) {
    snapshot.set(filePath, JSON.parse(JSON.stringify(requireJson(filePath))));
  }
  return snapshot;
}

function restoreBridgeStores(snapshot) {
  if (!snapshot) return;
  for (const [filePath, doc] of snapshot.entries()) {
    writeJson(filePath, doc);
  }
}

function requireJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, doc) {
  fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

function prepareUser(id, patch) {
  createUser(id);
  const doc = loadUsers();
  const u = findUserById(doc, id);
  if (!u) return;
  Object.assign(u, patch);
  saveUsers(doc);
}

const snapshot = DRY_RUN ? snapshotBridgeStores() : null;
try {
  prepareUser('user_low', {
    credits: 0,
    daily_allocated: 0,
    flagged: false,
    reputation_score: 1.2,
    last_allocation: null,
    last_daily_reset: NOW_ISO
  });
  prepareUser('user_heavy', {
    credits: 40,
    daily_allocated: 16,
    flagged: false,
    reputation_score: 1,
    last_allocation: null,
    last_daily_reset: NOW_ISO
  });
  prepareUser('user_flagged', {
    credits: 5,
    daily_allocated: 2,
    flagged: true,
    reputation_score: 1,
    last_allocation: null,
    last_daily_reset: NOW_ISO
  });

  console.log('Add contribution:', JSON.stringify(contributeToPool(50, 'donor_001'), null, 2));
  console.log('=== USER LOW USAGE ===');
  console.log(JSON.stringify(requestAllocation('user_low', 10), null, 2));
  console.log('=== USER HEAVY USAGE ===');
  console.log(JSON.stringify(requestAllocation('user_heavy', 10), null, 2));
  console.log('=== USER FLAGGED ===');
  console.log(JSON.stringify(requestAllocation('user_flagged', 10), null, 2));
} finally {
  if (DRY_RUN) {
    restoreBridgeStores(snapshot);
    console.log('[z_bridge test_run] dry-run mode: bridge stores restored.');
  }
}
