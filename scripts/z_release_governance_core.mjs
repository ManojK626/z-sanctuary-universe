/**
 * Task 007.6 — release governance: technical readiness vs intentional human release.
 * Used by z_execution_enforcer.mjs and z_release_governance.mjs.
 */

/**
 * @param {object} control — from data/z_release_control.json (optional fields)
 * @returns {{ manual_release: boolean, approved_by: string|null, timestamp: string|null }}
 */
export function normalizeReleaseControl(control) {
  const c = control && typeof control === 'object' ? control : {};
  return {
    manual_release: Boolean(c.manual_release),
    approved_by: c.approved_by != null ? String(c.approved_by) : null,
    timestamp: c.timestamp != null ? String(c.timestamp) : null
  };
}

/**
 * @param {{ p1Open: number, readinessPass: number, readinessTotal: number, control: object }} input
 */
export function evaluateReleaseGovernance(input) {
  const control = normalizeReleaseControl(input.control);
  const readinessTotalSafe = Math.max(Number(input.readinessTotal) || 0, 1);
  const pass = Number(input.readinessPass) || 0;
  const readinessOk = pass >= readinessTotalSafe;
  const p1 = Math.max(0, Number(input.p1Open) || 0);
  const technicalReady = p1 === 0 && readinessOk;
  const releaseReady = technicalReady && control.manual_release;

  return {
    generated_at: new Date().toISOString(),
    readiness: `${pass}/${readinessTotalSafe}`,
    p1_open: p1,
    manual_release: control.manual_release,
    approved_by: control.approved_by,
    timestamp: control.timestamp,
    technical_ready: technicalReady,
    final_status: releaseReady ? 'READY' : 'HOLD',
    effective_release_gate: releaseReady ? 'ready' : 'hold'
  };
}
