import path from 'node:path';
import fs from 'node:fs';

export function resolveHubRoot(explicit) {
  if (explicit) return path.resolve(explicit);
  if (process.env.Z_SANCTUARY_HUB_ROOT) {
    return path.resolve(process.env.Z_SANCTUARY_HUB_ROOT);
  }
  return path.resolve(process.cwd(), '../..');
}

/**
 * Works when cwd is `apps/api`, `apps/web`, or hub root.
 */
export function resolveHubForChildWorkspace(cwd = process.cwd()) {
  if (process.env.Z_SANCTUARY_HUB_ROOT) {
    return path.resolve(process.env.Z_SANCTUARY_HUB_ROOT);
  }
  const cur = path.resolve(cwd);
  if (fs.existsSync(path.join(cur, 'data', 'reports'))) {
    return cur;
  }
  const fromWebOrApi = path.join(cur, '..', '..');
  if (fs.existsSync(path.join(fromWebOrApi, 'data', 'reports'))) {
    return path.resolve(fromWebOrApi);
  }
  return path.resolve(cwd, '../..');
}
