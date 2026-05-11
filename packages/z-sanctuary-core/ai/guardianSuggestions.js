/**
 * Rule-based proactive hints from system snapshot (no LLM).
 * Extensible for future staleness signals (git, indicators JSON, etc.).
 */

const DAY_MS = 86400000;
const STALE_DAYS = 7;

/**
 * @param {object | null | undefined} status from data/system-status.json
 * @returns {string[]}
 */
export function buildGuardianSuggestions(status) {
  const out = [];

  if (!status) {
    out.push('Run npm run verify:ci from ZSanctuary_Universe to create a system snapshot.');
    return out.slice(0, 6);
  }

  if (status.verify === 'UNKNOWN') {
    out.push('Run npm run verify:ci to record verify state in data/system-status.json.');
  }

  if (status.verify === 'FAIL') {
    out.push('Run npm run system-status:refresh to re-check folder spine, structure, and registry omni.');
    out.push('Fix any failures reported by Z: Sanctuary Structure Verify or Z: Registry Omni Verify.');
  }

  if (status.status === 'degraded' && status.verify === 'PASS') {
    out.push('Confirm data/z_pc_root_projects.json lists your member projects (hub should not be empty).');
  }

  if (status.status === 'healthy' && status.verify === 'PASS') {
    out.push('Before a major release, run npm run verify:full (long pipeline) from the hub.');
  }

  const iso = status.last_check_iso || '';
  if (iso) {
    const t = Date.parse(iso);
    if (!Number.isNaN(t) && Date.now() - t > STALE_DAYS * DAY_MS) {
      out.push(
        `Last status snapshot is older than ${STALE_DAYS} days — run npm run verify:ci or npm run system-status:refresh.`
      );
    }
  }

  if (status.source === 'verify:ci' && status.verify === 'PASS') {
    out.push('Keep using Z: CI quick verify (folders + structure + registry) in PR checks when GitHub Actions is enabled.');
  }

  const dedup = [];
  const seen = new Set();
  for (const s of out) {
    if (!seen.has(s)) {
      seen.add(s);
      dedup.push(s);
    }
  }
  return dedup.slice(0, 6);
}
