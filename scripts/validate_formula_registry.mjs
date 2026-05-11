import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const registryPath = path.join(root, 'rules', 'Z_FORMULA_REGISTRY.json');
if (!existsSync(registryPath)) {
  throw new Error(`Missing formula registry at ${registryPath}`);
}

const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
if (!Array.isArray(registry.formulas)) {
  throw new Error('Registry missing `formulas` array');
}

const missingFiles = [];
const invalidTargets = [];
const metadataIssues = [];
for (const formula of registry.formulas) {
  const id = formula.id ?? formula.name ?? 'unknown';
  for (const key of ['docs', 'embodiment', 'schema', 'visual', 'notice']) {
  if (!formula[key]) {
    metadataIssues.push(`${id}: missing metadata field ${key}`);
    continue;
  }
  const candidate = path.join(root, formula[key]);
    if (!existsSync(candidate)) {
      missingFiles.push(`${id}: missing ${key} -> ${formula[key]}`);
    }
  }

  if (Array.isArray(formula.integration_targets)) {
    for (const target of formula.integration_targets) {
      const normalized = target.replace(/\*.*$/, '');
      const candidateDir = path.join(root, normalized);
      if (!existsSync(candidateDir)) {
        invalidTargets.push(`${id}: integration target folder missing (expected ${normalized})`);
      }
    }
  } else {
    metadataIssues.push(`${id}: integration_targets missing or not an array`);
  }

  if (!formula.integration_state) {
    metadataIssues.push(`${id}: missing integration_state`);
  }
  if (!formula.exposure) {
    metadataIssues.push(`${id}: missing exposure`);
  }
  if (!formula.docs) {
    metadataIssues.push(`${id}: missing docs reference`);
  }
}

const snapshotCandidates = [
  path.join(root, 'core_index.snapshot.html'),
  path.join(root, 'core', 'index.html'),
  path.join(root, 'copies', 'dashboard_copy', 'core_index.snapshot.html')
];
const snapshotPath = snapshotCandidates.find((candidate) => existsSync(candidate));
if (!snapshotPath) {
  throw new Error('Cannot find `core_index.snapshot.html` or equivalent in the repository root');
}
const snapshotContent = readFileSync(snapshotPath, 'utf-8');
if (!snapshotContent.includes('id="zFormulaRegistryPanel"')) {
  throw new Error('core_index.snapshot.html lacks zFormulaRegistryPanel markup');
}
if (!snapshotContent.includes('data-title="Z Formula Registry (Private)"')) {
  throw new Error('Formula registry panel data-title missing in snapshot');
}

if (missingFiles.length) {
  const message = ['Formula registry validation failed:', ...missingFiles].join('\n');
  throw new Error(message);
}
if (invalidTargets.length) {
  console.warn('Integration target folders missing:', invalidTargets);
}
if (metadataIssues.length) {
  console.warn('Formula metadata issues detected:', metadataIssues);
}

console.log(
  `Formula registry validated (${registry.formulas.length} formulas, all assets present, metadata checked).`
);
