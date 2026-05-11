// Z: scripts\z_change_packager.js
import { execSync } from 'child_process';
import path from 'path';

function listStagedFiles() {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
  return output ? output.split(/\r?\n/) : [];
}

function groupKeyForPath(filePath) {
  if (filePath.startsWith('rules/')) return 'rules';
  if (filePath.startsWith('schemas/')) return 'schemas';
  if (filePath.includes('/governance/')) return 'governance';
  if (filePath.startsWith('core/')) return 'core';
  if (filePath.startsWith('interface/')) return 'interface';
  if (filePath.startsWith('packages/')) return 'packages';
  if (filePath.startsWith('scripts/')) return 'scripts';
  if (filePath.endsWith('.md')) return 'docs';
  return path.dirname(filePath) || 'root';
}

function riskForGroup(group) {
  if (['rules', 'schemas', 'governance'].includes(group)) return 'high';
  if (['core', 'packages'].includes(group)) return 'medium';
  if (['interface', 'scripts'].includes(group)) return 'low';
  if (group === 'docs') return 'low';
  return 'medium';
}

function main() {
  const files = listStagedFiles();
  if (!files.length) {
    console.log('z_change_packager: no staged files');
    process.exit(0);
  }

  const groups = new Map();
  for (const filePath of files) {
    const group = groupKeyForPath(filePath);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(filePath);
  }

  const maxFiles = Number(process.env.Z_PACKAGER_MAX_FILES || 25);
  console.log('Z-Change Packager (staged files)');

  for (const [group, items] of groups.entries()) {
    const risk = riskForGroup(group);
    const warning = items.length > maxFiles ? ' [split recommended]' : '';
    console.log(`\n- Group: ${group} | risk: ${risk} | files: ${items.length}${warning}`);
    for (const filePath of items) {
      console.log(`  - ${filePath}`);
    }
  }

  console.log('\nTip: run Z-Commit Scribe per group to generate commit messages.');
}

main();
