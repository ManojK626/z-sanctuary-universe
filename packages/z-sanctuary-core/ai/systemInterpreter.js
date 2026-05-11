/**
 * Human-readable interpretation of data/system-status.json (no LLM).
 */

/**
 * @param {object | null | undefined} status
 * @returns {string}
 */
export function interpretSystem(status) {
  if (!status) return 'System status unavailable.';

  if (status.verify === 'UNKNOWN') {
    return 'ℹ️ System snapshot not yet recorded — run npm run verify:ci from the hub.';
  }

  if (status.verify === 'FAIL') {
    return '⚠️ System verification failed. Immediate attention required.';
  }

  if (status.status === 'degraded') {
    return '⚠️ System is running but missing project data.';
  }

  if (status.status === 'healthy') {
    return '✅ System is stable and fully operational.';
  }

  return 'ℹ️ System state unclear.';
}

/**
 * Multi-line companion text: headline + checks + projects + alignment + hub/last check.
 * @param {object} status
 * @param {string[]} [projectNames]
 */
export function formatCompanionInsight(status, projectNames) {
  if (!status || status.verify === 'UNKNOWN') return '';

  const head = interpretSystem(status);
  const parts = [head];

  if (status.verify === 'PASS') {
    parts.push('All verification checks passed on the last recorded run.');
  }

  const n =
    typeof status.projects === 'number'
      ? status.projects
      : Array.isArray(projectNames)
        ? projectNames.length
        : 0;

  if (n > 0) {
    parts.push(`You currently have ${n} active project(s) in the ecosystem registry.`);
  }

  if (status.status === 'healthy') {
    parts.push('Everything is aligned — you can continue building safely.');
  } else if (status.status === 'degraded') {
    parts.push('Confirm registry entries in data/z_pc_root_projects.json when you can.');
  } else if (status.verify === 'FAIL') {
    parts.push('Run npm run verify:ci or npm run system-status:refresh from the hub.');
  }

  const when = status.last_check || String(status.last_check_iso || '').slice(0, 10) || 'n/a';
  parts.push(`Hub: ${status.hub || '—'} · Last check: ${when}.`);

  return parts.join('\n');
}
