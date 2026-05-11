#!/usr/bin/env node
/**
 * Emit a VS Code multi-root workspace at the PC root so Cursor sees every EAII-listed project.
 * Aligns with docs/Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md (Phase 2).
 * Hub folder is listed first. Run from ZSanctuary_Universe repo root.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const OUT_NAME = 'Z_All_Projects.code-workspace';

const dryRun = process.argv.includes('--dry-run');

function readProjectsData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function sortHubFirst(projects) {
  return [...projects].sort((a, b) => {
    if (a.role === 'hub') return -1;
    if (b.role === 'hub') return 1;
    return 0;
  });
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Missing', DATA_PATH);
    process.exit(1);
  }

  const data = readProjectsData();
  const pcRoot = path.resolve(data.pc_root || path.join(ROOT, '..'));
  const projects = sortHubFirst(data.projects || []);

  const folders = [];
  for (const p of projects) {
    const rel = p.path || p.id;
    if (!rel) continue;
    const abs = path.join(pcRoot, rel);
    if (!fs.existsSync(abs)) {
      console.warn(`[emit] skip missing path: ${abs}`);
      continue;
    }
    const shadowFlag =
      p.ssws_shadow &&
      (p.ssws_shadow === true || (typeof p.ssws_shadow === 'object' && p.ssws_shadow.enabled !== false));
    const displayName =
      p.role === 'hub'
        ? `Hub · ${p.name || p.id}`
        : shadowFlag
          ? `Shadow · ${p.name || p.id}`
          : p.name || p.id;
    folders.push({
      path: abs,
      name: displayName,
    });
  }

  const workspace = {
    folders,
    settings: {
      'files.exclude': {
        '**/node_modules': true,
      },
    },
  };

  const outPath = path.join(pcRoot, OUT_NAME);
  const json = JSON.stringify(workspace, null, 2);

  if (dryRun) {
    console.log(`[emit] dry-run — would write: ${outPath}`);
    console.log(`[emit] folders: ${folders.length}`);
    folders.forEach((f) => console.log(`  - ${f.name}: ${f.path}`));
    return;
  }

  fs.mkdirSync(pcRoot, { recursive: true });
  fs.writeFileSync(outPath, `${json}\n`, 'utf8');
  console.log(`[emit] wrote ${outPath} (${folders.length} folders)`);
}

main();
