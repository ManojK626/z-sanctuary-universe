import fs from 'node:fs';
import { zBridgePaths } from './z_bridge_loader.mjs';
import { createUser, findUserById, loadUsers, saveUsers } from './z_user_registry.mjs';
import { allocateCredits } from './z_pool_allocator.mjs';
import { appendZBridgeLog } from './z_bridge_logger.mjs';
import { checkFairness } from './z_fairness_guard.mjs';
import { applyIntelligentAllocation } from './z_intelligence_engine.mjs';

const HISTORY_PATH = zBridgePaths().allocationHistory;

function appendHistory(entry) {
  const raw = fs.readFileSync(HISTORY_PATH, 'utf8');
  const doc = JSON.parse(raw);
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.allocations)) {
    throw new Error('allocation_history_shape_invalid');
  }
  doc.allocations.push(entry);
  fs.writeFileSync(HISTORY_PATH, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

function resetDailyIfNeeded(user) {
  const today = new Date().toDateString();
  const last = user.last_daily_reset ? new Date(user.last_daily_reset).toDateString() : null;
  if (last !== today) {
    user.daily_allocated = 0;
    user.last_daily_reset = new Date().toISOString();
  }
}

function applyReputationBoost(user, amount) {
  const rep = typeof user.reputation_score === 'number' ? user.reputation_score : 1;
  const boost = Math.min(Math.max(rep, 0) * 0.1, 0.5);
  return Math.max(1, Math.floor(amount + amount * boost));
}

export function requestAllocation(userId, amount) {
  const now = new Date().toISOString();
  try {
    createUser(userId);
    const usersDoc = loadUsers();
    const user = findUserById(usersDoc, userId);
    if (!user) {
      return { status: 'USER_NOT_FOUND' };
    }

    resetDailyIfNeeded(user);

    const intelligence = applyIntelligentAllocation(amount, user);
    const adjustedAmount = applyReputationBoost(user, intelligence.adjusted_amount);
    const fairness = checkFairness(userId, adjustedAmount);
    if (fairness.status === 'BLOCK') {
      appendZBridgeLog({
        action: 'z_bridge_request',
        level: 'warn',
        detail: 'blocked_fairness',
        meta: {
          userId,
          amount: adjustedAmount,
          requested: amount,
          priority_score: intelligence.priority_score,
          reason: fairness.reason
        }
      });
      saveUsers(usersDoc);
      return { status: 'BLOCKED', reason: fairness.reason };
    }

    const effectiveAmount = fairness.status === 'REDUCE' ? fairness.allowedAmount : adjustedAmount;
    if (fairness.status === 'REDUCE') {
      appendZBridgeLog({
        action: 'z_bridge_request',
        level: 'warn',
        detail: 'reduced_fairness',
        meta: {
          userId,
          requested: amount,
          priority_score: intelligence.priority_score,
          allowed: effectiveAmount,
          reason: fairness.reason
        }
      });
    }

    const allocation = allocateCredits(userId, effectiveAmount);
    if (allocation.status !== 'ALLOCATED') {
      appendZBridgeLog({
        action: 'z_bridge_request',
        level: 'warn',
        detail: 'allocation_denied',
        meta: {
          userId,
          requested: amount,
          priority_score: intelligence.priority_score,
          amount: effectiveAmount,
          reason: allocation.status
        }
      });
      return allocation;
    }

    user.credits = (typeof user.credits === 'number' ? user.credits : 0) + effectiveAmount;
    user.daily_allocated = (typeof user.daily_allocated === 'number' ? user.daily_allocated : 0) + effectiveAmount;
    user.last_allocation = now;
    saveUsers(usersDoc);

    appendHistory({
      userId,
      amount: effectiveAmount,
      source: 'local_engine',
      time: now
    });

    appendZBridgeLog({
      action: 'z_bridge_request',
      level: 'info',
      detail: 'allocation_success',
      meta: {
        userId,
        requested: amount,
        final_amount: effectiveAmount,
        priority_score: intelligence.priority_score
      }
    });

    return { status: 'SUCCESS', user, granted: effectiveAmount, priority_score: intelligence.priority_score };
  } catch (e) {
    appendZBridgeLog({
      action: 'z_bridge_request',
      level: 'error',
      detail: 'engine_error',
      meta: { userId, amount, message: e instanceof Error ? e.message : String(e) }
    });
    return { status: 'ERROR', error: e instanceof Error ? e.message : String(e) };
  }
}
