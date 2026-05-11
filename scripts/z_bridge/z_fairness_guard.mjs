import { findUserById, loadUsers } from './z_user_registry.mjs';

const MAX_DAILY_CREDITS = 20;
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours

function sameDay(aIso, bMs) {
  if (!aIso) return false;
  const a = new Date(aIso);
  if (Number.isNaN(a.getTime())) return false;
  return a.toDateString() === new Date(bMs).toDateString();
}

/**
 * Returns ALLOW, BLOCK, or REDUCE before allocation.
 * @param {string} userId
 * @param {number} requestedAmount
 * @returns {{status:'ALLOW'}|{status:'BLOCK', reason:string}|{status:'REDUCE', reason:string, allowedAmount:number}}
 */
export function checkFairness(userId, requestedAmount) {
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return { status: 'BLOCK', reason: 'INVALID_USER' };
  }
  if (typeof requestedAmount !== 'number' || !Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    return { status: 'BLOCK', reason: 'INVALID_AMOUNT' };
  }

  const usersDoc = loadUsers();
  const user = findUserById(usersDoc, userId);
  if (!user) return { status: 'BLOCK', reason: 'USER_NOT_FOUND' };
  if (user.flagged === true) return { status: 'BLOCK', reason: 'USER_FLAGGED' };

  const now = Date.now();
  const lastMs = user.last_allocation ? new Date(user.last_allocation).getTime() : 0;

  if (lastMs > 0 && now - lastMs < COOLDOWN_MS) {
    return { status: 'BLOCK', reason: 'COOLDOWN_ACTIVE' };
  }

  const dailyAllocated = typeof user.daily_allocated === 'number' ? user.daily_allocated : 0;
  const onSameDay = sameDay(user.last_daily_reset ?? user.last_allocation, now);
  const effectiveDailyAllocated = onSameDay ? dailyAllocated : 0;

  if (effectiveDailyAllocated >= MAX_DAILY_CREDITS) {
    return { status: 'BLOCK', reason: 'DAILY_LIMIT_REACHED' };
  }

  const remaining = MAX_DAILY_CREDITS - effectiveDailyAllocated;
  if (requestedAmount > remaining) {
    return { status: 'REDUCE', reason: 'DAILY_LIMIT_PARTIAL', allowedAmount: remaining };
  }

  return { status: 'ALLOW' };
}
