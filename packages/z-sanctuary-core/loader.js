import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo hub root: packages/z-sanctuary-core -> ../.. */
export function getHubRootFromPackage() {
  return path.resolve(__dirname, '..', '..');
}

/**
 * Load the real PC-root project registry (single source of truth).
 * @param {{ hubRoot?: string }} [options] - override hub root (defaults to this monorepo root from package location, or Z_SANCTUARY_HUB_ROOT).
 */
export function loadPcRootProjects(options = {}) {
  const root =
    options.hubRoot ||
    options.root ||
    process.env.Z_SANCTUARY_HUB_ROOT ||
    getHubRootFromPackage();
  const filePath = path.join(root, 'data', 'z_pc_root_projects.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}
