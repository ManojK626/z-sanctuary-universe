import fs from 'node:fs';
import { zBridgePaths } from './z_bridge_loader.mjs';
import { appendZBridgeLog } from './z_bridge_logger.mjs';

const PATHS = zBridgePaths();

function readPool() {
  const raw = fs.readFileSync(PATHS.pool, 'utf8');
  const pool = JSON.parse(raw);
  if (!pool || typeof pool !== 'object') throw new Error('pool_shape_invalid');
  return pool;
}

function writePool(pool) {
  fs.writeFileSync(PATHS.pool, `${JSON.stringify(pool, null, 2)}\n`, 'utf8');
}

function readRules() {
  const raw = fs.readFileSync(PATHS.rules, 'utf8');
  const rules = JSON.parse(raw);
  if (!rules || typeof rules !== 'object') throw new Error('rules_shape_invalid');
  return rules;
}

function numOrZero(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

export function allocateCredits(userId, amount) {
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return { status: 'INVALID_USER' };
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return { status: 'INVALID_AMOUNT' };
  }

  const pool = readPool();
  const rules = readRules();

  if (pool.status !== 'ACTIVE') {
    return { status: 'POOL_NOT_ACTIVE', mode: pool.status ?? null };
  }

  const available = numOrZero(pool.total_credits) - numOrZero(pool.distributed_credits);
  const dailyLimit = typeof rules.max_daily_per_user === 'number' ? rules.max_daily_per_user : Infinity;
  if (amount > dailyLimit) {
    return { status: 'RULE_LIMIT_EXCEEDED', limit: dailyLimit };
  }

  if (available < amount) {
    return { status: 'INSUFFICIENT_POOL', available };
  }

  pool.distributed_credits = numOrZero(pool.distributed_credits) + amount;
  pool.contributions = numOrZero(pool.contributions);
  pool.available = Math.max(0, numOrZero(pool.total_credits) - numOrZero(pool.distributed_credits));
  pool.last_updated = new Date().toISOString();
  writePool(pool);

  appendZBridgeLog({
    action: 'z_pool_allocate',
    level: 'info',
    detail: 'allocation_granted',
    meta: { userId, amount, availableAfter: pool.available }
  });

  return { status: 'ALLOCATED', amount, available_after: pool.available };
}
