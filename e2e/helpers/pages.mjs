/**
 * Static page inventory for hub human-facing HTML (filesystem evidence).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const SKIP_DIR_PARTS = [
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}ZSanctuary_Labs${path.sep}`,
  `${path.sep}copies${path.sep}`,
  `${path.sep}shadow${path.sep}`,
];

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full);
    if (SKIP_DIR_PARTS.some((p) => full.includes(p))) continue;
    if (ent.isDirectory()) {
      walkHtml(full, out);
      continue;
    }
    if (!ent.name.toLowerCase().endsWith('.html')) continue;
    out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

function purposeFor(route) {
  if (route.includes('index-skk-rkpk')) return 'Main unified SKK/RKPK dashboard shell';
  if (route.includes('ggaesp')) return 'GGAESP-360 advisory panel (export only; no auto JSONL)';
  if (route.includes('cycle-dashboard')) return 'Read-only cycle observe dashboard';
  if (route.includes('amk-goku-main-control')) return 'AMK-Goku main control surface';
  if (route.includes('z-addon-dashboard')) return 'Z-Add On staging dashboard';
  if (route.includes('z-ai-ecosphere')) return 'AI ecosphere map surface';
  if (route.includes('zilwa')) return 'ZILWA exhibit / living experiences (static mock)';
  if (route.includes('ssws')) return 'SSWS cockpit / morning surface (governance HOLD expected)';
  if (route.includes('consent') || route.includes('terms')) return 'Consent / terms surface';
  if (route === 'dashboard/index.html') return 'Dashboard stub / readiness entry';
  return 'Human-facing HTML surface';
}

function governanceFor(route) {
  const r = route.toLowerCase();
  if (r.includes('ssws') || r.includes('ssr')) return 'HOLD / OBSERVE — wake forbidden in E2E';
  if (r.includes('ggaesp')) return 'Advisory only — not release authority';
  if (r.includes('cycle-dashboard') || r.includes('readonly')) return 'READ_ONLY observer';
  if (r.includes('zilwa')) return 'Static exhibit / AMBER+ HOLD posture';
  if (r.includes('family') || r.includes('health')) return 'Observer / BLUE HOLD';
  return 'Local static — no production authority';
}

/** Priority deep-interaction set (charter smoke + click reality). */
export const PRIORITY_ROUTES = [
  'dashboard/index.html',
  'dashboard/Html/index-skk-rkpk.html',
  'dashboard/Html/amk-goku-main-control.html',
  'dashboard/Html/z-addon-dashboard.html',
  'dashboard/panels/ggaesp_panel.html',
  'dashboard/panels/z-cycle-dashboard-readonly.html',
  'dashboard/panels/z-ssws-morning-cockpit.html',
  'dashboard/z-ai-ecosphere/index.html',
  'dashboard/Html/zilwa-exhibit-hub.html',
];

export function discoverPages() {
  const files = [
    ...walkHtml(path.join(ROOT, 'dashboard')),
    ...walkHtml(path.join(ROOT, 'core')).filter((f) => f.endsWith('index.html')),
  ];
  const uniq = [...new Set(files)].sort();
  return uniq.map((rel) => ({
    page: path.basename(rel),
    route: `/${rel}`,
    source: rel,
    expectedPurpose: purposeFor(rel),
    governancePosture: governanceFor(rel),
    priority: PRIORITY_ROUTES.includes(rel),
  }));
}

export { ROOT };
