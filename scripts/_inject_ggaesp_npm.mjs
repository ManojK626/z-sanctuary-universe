import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pkgPath = new URL('../package.json', import.meta.url);
const raw = readFileSync(pkgPath, 'utf8');
const j = JSON.parse(raw);

const gga = {
  'ts:check:ggaesp':
    'tsc --noEmit -p core_engine/tsconfig.json && tsc --noEmit -p core_engine/tsconfig.node.json && tsc --noEmit -p core_engine/tsconfig.heatmap_dev_sample.json',
  'ts:build:ggaesp':
    'tsc -p core_engine/tsconfig.json && tsc -p core_engine/tsconfig.node.json && tsc -p core_engine/tsconfig.heatmap_dev_sample.json',
  'ts:run:ggaesp': 'node core_engine/browser/ggaesp_test.js',
  'ts:run:ggaesp:heatmap': 'node core_engine/dist_heatmap/ggaesp_heatmap_dev_sample.js',
  'ts:run:ggaesp:heatmap:go': 'node core_engine/dist_heatmap/ggaesp_heatmap_go_dev_sample.js',
  'ts:run:ggaesp:heatmap:browser': 'node core_engine/browser/ggaesp_heatmap_dev_sample.js',
  'ggaesp:memory:append': 'node scripts/z_ggaesp_memory_append.mjs',
  'ts:run:ggaesp:heatmap:go:browser': 'node core_engine/browser/ggaesp_heatmap_go_dev_sample.js',
};

for (const [k, v] of Object.entries(gga)) {
  j.scripts[k] = v;
}

if (!j.devDependencies.typescript) {
  j.devDependencies.typescript = '~5.4.5';
}
if (!j.devDependencies['@types/node']) {
  j.devDependencies['@types/node'] = '^20.12.0';
}

const out = JSON.stringify(j, null, 2) + '\n';
writeFileSync(pkgPath, out, 'utf8');
console.log('injected ggaesp scripts', fileURLToPath(pkgPath));
