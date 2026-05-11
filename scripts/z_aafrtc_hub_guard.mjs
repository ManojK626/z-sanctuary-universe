/**
 * Shared hub-root detection for AAFRTC (IDE / multi-root safety).
 * ZSanctuary_Universe hub only — prevents verify pipelines from running against wrong folders.
 */
import fs from 'node:fs';
import path from 'node:path';

export function isZSanctuaryHubRoot(root) {
  const pkgPath = path.join(root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.name === 'z-sanctuary-universe') return true;
    } catch {
      /* ignore */
    }
  }
  const pcPath = path.join(root, 'data', 'z_pc_root_projects.json');
  if (fs.existsSync(pcPath)) {
    try {
      const pc = JSON.parse(fs.readFileSync(pcPath, 'utf8'));
      const hub = (pc.projects || []).find((p) => p.role === 'hub');
      if (hub && /zsanctuary/i.test(hub.name || '') && pc.hub === 'ZSanctuary_Universe') return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}
