import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';

const cwd = path.resolve(process.cwd());

// Portable: pass if cwd looks like Z-Sanctuary root (has package.json + required files)
// Works from "ZSanctuary_Universe" or "Cursor Projects Organiser\ZSanctuary_Universe" etc.
const hasPackage = fs.existsSync(path.join(cwd, 'package.json'));
const hasRegistry = fs.existsSync(path.join(cwd, 'rules', 'Z_FORMULA_REGISTRY.json'));
const hasWorkspace = fs.existsSync(path.join(cwd, 'Z_SSWS.code-workspace'));

const checks = [
  {
    id: 'cwd_is_canonical_root',
    pass: hasPackage && (hasRegistry || hasWorkspace),
    note: `cwd=${cwd}`,
  },
  {
    id: 'registry_exists',
    pass: hasRegistry,
    note: 'rules/Z_FORMULA_REGISTRY.json',
  },
  {
    id: 'workspace_exists',
    pass: hasWorkspace,
    note: 'Z_SSWS.code-workspace',
  },
];

const failed = checks.filter((c) => !c.pass);

if (failed.length > 0) {
  console.error('Z Workspace Root Guard: FAILED');
  for (const item of failed) {
    console.error(`- ${item.id}: ${item.note}`);
  }
  process.exit(1);
}

console.log('Z Workspace Root Guard: OK');
