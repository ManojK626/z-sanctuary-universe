import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadZBridge, Z_BRIDGE_REPO_ROOT } from './z_bridge_loader.mjs';
import { appendZBridgeLog } from './z_bridge_logger.mjs';

function bridgeLog(entry) {
  try {
    const lr = appendZBridgeLog(entry);
    if (!lr.ok) console.warn('[Z-Bridge log]', lr.error);
  } catch (e) {
    console.warn('[Z-Bridge log]', e instanceof Error ? e.message : String(e));
  }
}

/**
 * Structural + non-negative checks. Observational — does not mutate stores.
 * @param {Record<string, unknown>} bundle
 * @returns {{ ok: boolean, issues: string[] }}
 */
export function validateZBridge(bundle) {
  const issues = [];

  if (!bundle || typeof bundle !== 'object') {
    issues.push('bundle_missing');
    return { ok: false, issues };
  }

  const { pool, users, allocationHistory, logs, rules } = bundle;

  // pool
  if (typeof pool !== 'object' || pool === null) {
    issues.push('pool_not_object');
  } else {
    for (const k of ['total_credits', 'daily_limit', 'status']) {
      if (!(k in pool)) issues.push(`pool_missing_key:${k}`);
    }
    if ('total_credits' in pool && typeof pool.total_credits === 'number' && pool.total_credits < 0) {
      issues.push('pool_negative_total_credits');
    }
    if ('total_credits' in pool && pool.total_credits !== null && typeof pool.total_credits !== 'number') {
      issues.push('pool_total_credits_not_number');
    }
    if ('daily_limit' in pool && typeof pool.daily_limit === 'number' && pool.daily_limit < 0) {
      issues.push('pool_negative_daily_limit');
    }
    if ('daily_limit' in pool && pool.daily_limit !== null && typeof pool.daily_limit !== 'number') {
      issues.push('pool_daily_limit_not_number');
    }
    if ('status' in pool && (typeof pool.status !== 'string' || pool.status.length === 0)) {
      issues.push('pool_status_invalid');
    }
  }

  // users
  if (typeof users !== 'object' || users === null || !Array.isArray(users.users)) {
    issues.push('users_array_missing');
  } else {
    users.users.forEach((u, i) => {
      if (u === null || typeof u !== 'object' || Array.isArray(u)) {
        issues.push(`users_corrupt_index:${i}`);
        return;
      }
      for (const key of ['balance', 'credits', 'daily_used']) {
        if (key in u) {
          const v = u[key];
          if (typeof v !== 'number' || Number.isNaN(v) || v < 0) {
            issues.push(`users_negative_or_nan:${i}:${key}`);
          }
        }
      }
    });
  }

  // allocation history
  if (
    typeof allocationHistory !== 'object' ||
    allocationHistory === null ||
    !Array.isArray(allocationHistory.allocations)
  ) {
    issues.push('allocations_array_missing');
  } else {
    allocationHistory.allocations.forEach((row, i) => {
      if (row === null || typeof row !== 'object' || Array.isArray(row)) {
        issues.push(`allocation_corrupt_index:${i}`);
        return;
      }
      for (const key of ['amount', 'credits', 'delta', 'quantity']) {
        if (key in row) {
          const v = row[key];
          if (typeof v !== 'number' || Number.isNaN(v) || v < 0) {
            issues.push(`allocation_negative_or_nan:${i}:${key}`);
          }
        }
      }
    });
  }

  // logs
  if (typeof logs !== 'object' || logs === null || !Array.isArray(logs.events)) {
    issues.push('logs_events_array_missing');
  } else {
    logs.events.forEach((ev, i) => {
      if (ev === null || typeof ev !== 'object' || Array.isArray(ev)) {
        issues.push(`log_event_corrupt_index:${i}`);
      }
    });
  }

  // rules
  if (typeof rules !== 'object' || rules === null) {
    issues.push('rules_not_object');
  } else {
    for (const k of ['max_daily_per_user', 'tier_limits', 'cooldown_hours', 'abuse_threshold', 'system_modes']) {
      if (!(k in rules)) issues.push(`rules_missing_key:${k}`);
    }
    if (typeof rules.max_daily_per_user === 'number' && rules.max_daily_per_user < 0) {
      issues.push('rules_negative_max_daily_per_user');
    }
    if (typeof rules.cooldown_hours === 'number' && rules.cooldown_hours < 0) {
      issues.push('rules_negative_cooldown_hours');
    }
    if (typeof rules.abuse_threshold === 'number' && rules.abuse_threshold < 1) {
      issues.push('rules_abuse_threshold_too_low');
    }
    if (rules.tier_limits && typeof rules.tier_limits === 'object' && !Array.isArray(rules.tier_limits)) {
      for (const [tier, lim] of Object.entries(rules.tier_limits)) {
        if (typeof lim === 'number' && lim < 0) {
          issues.push(`rules_negative_tier_limit:${tier}`);
        }
      }
    }
    if (rules.system_modes !== undefined && !Array.isArray(rules.system_modes)) {
      issues.push('rules_system_modes_not_array');
    }
  }

  return { ok: issues.length === 0, issues };
}

async function main() {
  const loaded = loadZBridge(Z_BRIDGE_REPO_ROOT);
  if (!loaded.ok) {
    console.error(JSON.stringify({ ok: false, phase: 'validate', errors: loaded.errors }, null, 2));
    bridgeLog({
      action: 'z_bridge_validate',
      level: 'warn',
      detail: 'load_failed',
      meta: { verdict: 'FAIL', errorCount: loaded.errors.length }
    });
    process.exitCode = 1;
    return;
  }
  const v = validateZBridge(loaded.bundle);
  console.log(JSON.stringify({ ok: v.ok, phase: 'validate', issues: v.issues }, null, 2));
  bridgeLog({
    action: 'z_bridge_validate',
    level: v.ok ? 'info' : 'warn',
    detail: v.ok ? 'structure_ok' : 'structure_issues',
    meta: {
      verdict: v.ok ? 'PASS' : 'FAIL',
      issueCount: v.issues.length
    }
  });
  if (!v.ok) process.exitCode = 1;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((e) => {
    console.error(JSON.stringify({ ok: false, phase: 'validate', issues: [String(e)] }, null, 2));
    bridgeLog({
      action: 'z_bridge_validate',
      level: 'error',
      detail: 'uncaught',
      meta: { verdict: 'FAIL', message: String(e) }
    });
    process.exitCode = 1;
  });
}
