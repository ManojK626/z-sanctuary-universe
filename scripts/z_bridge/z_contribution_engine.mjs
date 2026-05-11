import fs from 'node:fs';
import { zBridgePaths } from './z_bridge_loader.mjs';
import { appendZBridgeLog } from './z_bridge_logger.mjs';

const POOL_PATH = zBridgePaths().pool;

function numOrZero(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function readPool() {
  const raw = fs.readFileSync(POOL_PATH, 'utf8');
  const pool = JSON.parse(raw);
  if (!pool || typeof pool !== 'object') throw new Error('pool_shape_invalid');
  return pool;
}

function writePool(pool) {
  fs.writeFileSync(POOL_PATH, `${JSON.stringify(pool, null, 2)}\n`, 'utf8');
}

export function contributeToPool(amount, source = 'unknown') {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return { status: 'INVALID_AMOUNT' };
  }

  const pool = readPool();
  const distributed = numOrZero(pool.distributed_credits);

  pool.total_credits = numOrZero(pool.total_credits) + amount;
  pool.contributions = numOrZero(pool.contributions) + amount;
  pool.available = Math.max(0, pool.total_credits - distributed);
  pool.last_updated = new Date().toISOString();
  writePool(pool);

  appendZBridgeLog({
    action: 'z_pool_contribution',
    level: 'info',
    detail: 'contribution_added',
    meta: { source, amount, totalCredits: pool.total_credits, available: pool.available }
  });

  return {
    status: 'CONTRIBUTION_ADDED',
    amount,
    source,
    pool
  };
}
