/**
 * Append-only strip for future learning:eval / cross:system (no raw journal text).
 */
import fs from 'node:fs';
import path from 'node:path';

function filePath(hubRoot) {
  return path.join(hubRoot, 'data', 'mirrorSoul', 'adaptive_fuel.jsonl');
}

/**
 * @param {string} hubRoot
 * @param {object} row
 * @param {string} row.reflection_id
 * @param {string} [row.user_id]
 * @param {string[]} [row.signals]
 * @param {number} [row.confidence]
 */
export function appendAdaptiveFuel(hubRoot, row) {
  const f = filePath(hubRoot);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  const line = JSON.stringify({
    schema: 'adaptive_fuel_v1',
    ...row,
    ts: new Date().toISOString(),
  });
  fs.appendFileSync(f, `${line}\n`, 'utf8');
}
