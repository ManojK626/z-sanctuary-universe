#!/usr/bin/env node
// Z: scripts/z_sanctuary_structure_verify.mjs
// Verifies Z-Sanctuary structure: PC root projects, key docs, dashboard, AI design, tasks.
// Run from repo root: node scripts/z_sanctuary_structure_verify.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const results = { ok: [], fail: [] };

function pass(label, note = '') {
  results.ok.push(note ? `${label}: ${note}` : label);
}
function fail(label, note = '') {
  results.fail.push(note ? `${label}: ${note}` : label);
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}
function isDir(rel) {
  try {
    return fs.statSync(path.join(ROOT, rel)).isDirectory();
  } catch {
    return false;
  }
}
function readJson(rel) {
  try {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// 1. PC root projects config
const pcRoot = readJson('data/z_pc_root_projects.json');
if (!pcRoot) {
  fail('data/z_pc_root_projects.json', 'missing or invalid');
} else {
  pass('data/z_pc_root_projects.json', 'exists');
  const projects = pcRoot.projects || [];
  const hub = projects.find((p) => p.role === 'hub');
  if (!hub) fail('PC root projects', 'no hub defined');
  else pass('PC root projects', `hub=${hub.name}, ${projects.length} project(s)`);
  if (pcRoot.hub && pcRoot.pc_root) pass('PC root config', `root=${pcRoot.pc_root}, hub=${pcRoot.hub}`);
}

// 2. Hierarchy & authority docs
if (exists('docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md')) pass('Hierarchy Chief doc');
else fail('Hierarchy Chief doc', 'missing');
if (exists('docs/Z-ECR-ENERGY-CLASSIFICATION-AND-REPLICATION-LAYER.md')) {
  const ecrDoc = fs.readFileSync(
    path.join(ROOT, 'docs/Z-ECR-ENERGY-CLASSIFICATION-AND-REPLICATION-LAYER.md'),
    'utf8',
  );
  if (ecrDoc.includes('Z-ECR') && ecrDoc.includes('Z-Lineage Replication Core') && ecrDoc.includes('origin_id')) {
    pass('Z-ECR energy/layer doc');
  } else {
    fail('Z-ECR doc', 'expected markers (Z-ECR, lineage, origin_id) missing');
  }
} else {
  fail('Z-ECR doc', 'missing docs/Z-ECR-ENERGY-CLASSIFICATION-AND-REPLICATION-LAYER.md');
}
if (exists('docs/Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md')) pass('SSWS + All Projects blueprint');
else fail('SSWS + All Projects blueprint', 'missing');
if (exists('AGENTS.md')) pass('AGENTS.md (any-AI rule)');
else fail('AGENTS.md', 'missing');

// 3. Cursor rules (check chief when unsure)
if (exists('.cursor/rules/z-hierarchy-chief.mdc')) pass('.cursor/rules/z-hierarchy-chief.mdc');
else fail('.cursor/rules/z-hierarchy-chief.mdc', 'missing');
if (exists('.cursor/rules/z-canvas-sanctuary.mdc')) pass('.cursor/rules/z-canvas-sanctuary.mdc');
else fail('.cursor/rules/z-canvas-sanctuary.mdc', 'missing');
if (exists('.cursor/rules/z-completions-test-and-comms-flow.mdc')) pass('.cursor/rules/z-completions-test-and-comms-flow.mdc');
else fail('.cursor/rules/z-completions-test-and-comms-flow.mdc', 'missing');
if (exists('.cursor/rules/z-omni-unified-organism.mdc')) pass('.cursor/rules/z-omni-unified-organism.mdc');
else fail('.cursor/rules/z-omni-unified-organism.mdc', 'missing');
if (exists('.cursor/rules/z-acn-mteh.mdc')) pass('.cursor/rules/z-acn-mteh.mdc');
else fail('.cursor/rules/z-acn-mteh.mdc', 'missing');

// 4. Dashboard & All projects panel (canonical: index-skk-rkpk.html; index.html = redirect stub)
if (exists('dashboard/Html/index-skk-rkpk.html')) pass('Dashboard (HODP SKK&RKPK canonical)');
else fail('Dashboard', 'missing dashboard/Html/index-skk-rkpk.html');
if (exists('dashboard/Html/index.html')) pass('Dashboard (compat redirect stub)');
else fail('Dashboard', 'missing dashboard/Html/index.html stub');
if (exists('dashboard/Html/shadow/index-skk-rkpk.workbench.html')) pass('Dashboard (shadow workbench)');
if (exists('dashboard/Html/z-addon-dashboard.html') && exists('data/z_addon_dashboard_state.json')) {
  pass('Z-Add On staging dashboard + state');
} else {
  fail('Z-Add On', 'missing dashboard/Html/z-addon-dashboard.html or data/z_addon_dashboard_state.json');
}
if (exists('core_engine/ggaesp_pipeline.ts') && exists('core_engine/browser/ggaesp_pipeline.js')) {
  pass('GGAESP TypeScript + browser emit');
} else {
  fail('GGAESP core_engine', 'missing ggaesp_pipeline.ts or run npm run ts:build:ggaesp');
}
if (exists('dashboard/panels/ggaesp_panel.html')) {
  const ggaespPanel = fs.readFileSync(path.join(ROOT, 'dashboard/panels/ggaesp_panel.html'), 'utf8');
  if (ggaespPanel.includes('Save Memory Capsule') && ggaespPanel.includes('zGgaespMemStatus')) {
    pass('GGAESP dashboard panel (HTML + memory control)');
  } else {
    fail('GGAESP panel', 'Save Memory Capsule or status region missing in ggaesp_panel.html');
  }
} else {
  fail('GGAESP panel', 'missing dashboard/panels/ggaesp_panel.html');
}
if (isDir('data/ggaesp')) {
  pass('GGAESP data directory (memory_capsules.jsonl: gitignored; created on first append)');
} else {
  fail('GGAESP data', 'missing data/ggaesp');
}
if (exists('core_engine/ggaesp_memory.ts') && exists('core_engine/node/ggaesp_memory.js')) {
  pass('GGAESP memory helper + node emit');
} else {
  fail('GGAESP memory', 'missing ggaesp_memory.ts or run npm run ts:build:ggaesp (tsconfig.node)');
}
if (exists('scripts/z_ggaesp_memory_append.mjs')) {
  pass('GGAESP memory append script (CLI)');
} else {
  fail('GGAESP memory append', 'missing scripts/z_ggaesp_memory_append.mjs');
}
if (exists('core/z_pc_root_projects_panel.js')) pass('All projects panel script');
else fail('All projects panel script', 'missing');
const indexHtml = fs.readFileSync(path.join(ROOT, 'dashboard/Html/index-skk-rkpk.html'), 'utf8');
const zAddonDashHtml = fs.readFileSync(path.join(ROOT, 'dashboard/Html/z-addon-dashboard.html'), 'utf8');
if (zAddonDashHtml.includes('ggaesp_panel.html') && zAddonDashHtml.includes('GGAESP-360')) {
  pass('Z-Add On wires GGAESP panel');
} else {
  fail('Z-Add On GGAESP', 'GGAESP panel not linked from z-addon-dashboard.html');
}
if (indexHtml.includes('zAllProjectsBody') && indexHtml.includes('z_pc_root_projects_panel.js')) {
  pass('Dashboard wires All projects block');
} else {
  fail('Dashboard wires All projects block', 'container or script not found');
}
if (indexHtml.includes('super-chat:readonly') && indexHtml.includes('Z Super Chat')) {
  pass('Dashboard wires Z Super Chat (Blueprint)');
} else {
  fail('Dashboard wires Z Super Chat', 'section or command not found');
}
if (indexHtml.includes('zBlueprintPotentialRadar') && indexHtml.includes('z_ambient_weather_audio.js')) {
  pass('Dashboard wires Blueprint radar + ambient audio');
} else {
  fail('Dashboard wires Blueprint radar + ambient audio', 'canvas or script tag not found');
}
if (indexHtml.includes('zControlCentreGroupedTools') && indexHtml.includes('z_dashboard_tools_a11y.js')) {
  pass('Dashboard Control Centre grouped tools + a11y script');
} else {
  fail('Dashboard Control Centre grouped tools + a11y', 'section or script not found');
}
if (indexHtml.includes('z-addon-dashboard.html') && indexHtml.includes('Z-Add On staging')) {
  pass('Dashboard links Z-Add On staging');
} else {
  fail('Dashboard Z-Add On link', 'z-addon-dashboard.html or label not in index-skk-rkpk.html');
}
if (indexHtml.includes('Z-BUILD-GATE-MATRIX.md') && indexHtml.includes('Build Gate Matrix')) {
  pass('Dashboard links Build Gate Matrix');
} else {
  fail('Dashboard Build Gate Matrix', 'Z-BUILD-GATE-MATRIX.md or label not in index-skk-rkpk.html');
}
if (exists('docs/Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md')) {
  pass('Operator discipline doc (truth chain)');
} else {
  fail('Operator discipline doc', 'missing docs/Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md');
}
if (indexHtml.includes('Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md')) {
  pass('Dashboard links operator discipline doc');
} else {
  fail('Dashboard operator discipline', 'Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md not in index-skk-rkpk.html');
}
const shadowHtml = fs.readFileSync(path.join(ROOT, 'dashboard/Html/shadow/index-skk-rkpk.workbench.html'), 'utf8');
if (
  shadowHtml.includes('Z-BUILD-GATE-MATRIX.md') &&
  shadowHtml.includes('Build Gate Matrix') &&
  shadowHtml.includes('Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md') &&
  shadowHtml.includes('../z-addon-dashboard.html') &&
  shadowHtml.includes('Z-Add On staging')
) {
  pass('Shadow workbench Build Gate + operator doc + Z-Add On parity');
} else {
  fail(
    'Shadow workbench parity',
    'Build Gate, operator discipline, or Z-Add On staging not wired in shadow workbench',
  );
}
if (indexHtml.includes('z-top-a11y-strip') && indexHtml.includes('data-z-a11y="large"')) {
  pass('Dashboard top strip accessibility toggles');
} else {
  fail('Dashboard top strip accessibility toggles', 'strip or data-z-a11y not found');
}
if (exists('docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md')) pass('Z-Acoustic Living Pulse architecture doc');
else fail('Z-Acoustic Living Pulse architecture doc', 'missing');
if (exists('scripts/z_soundscape_posture.mjs')) pass('Soundscape posture script');
else fail('Soundscape posture script', 'missing');
if (exists('core/z_soundscape_pulse_panel.js')) pass('Soundscape pulse panel script');
else fail('Soundscape pulse panel script', 'missing');
if (exists('core/z_soundscape_audio.js')) pass('Soundscape audio (Phase 2 mic) script');
else fail('Soundscape audio script', 'missing');
if (indexHtml.includes('zSoundscapePostureBody') && indexHtml.includes('z_soundscape_pulse_panel.js')) {
  pass('Dashboard wires Z-Soundscape Posture (Z-ACG)');
} else {
  fail('Dashboard wires Z-Soundscape Posture', 'container or script not found');
}
if (indexHtml.includes('z_soundscape_audio.js') && indexHtml.includes('zLivingPulseMic')) {
  pass('Dashboard wires Z-Soundscape Mic opt-in');
} else {
  fail('Dashboard wires Z-Soundscape Mic', 'script or checkbox not found');
}

// 5. Formula registry & SSWS
if (exists('rules/Z_FORMULA_REGISTRY.json')) {
  const reg = readJson('rules/Z_FORMULA_REGISTRY.json');
  const formulas = reg?.formulas?.length || 0;
  pass('Formula registry', formulas ? `${formulas} formula(s)` : 'no formulas');
} else fail('Formula registry', 'missing');
if (exists('Z_SSWS.code-workspace')) pass('Z_SSWS.code-workspace');
else fail('Z_SSWS.code-workspace', 'missing');
if (exists('scripts/z_ssws_verify.py')) pass('Z-SSWS verify script');
else fail('Z-SSWS verify script', 'missing');

// 6. Key tasks in tasks.json
if (exists('.vscode/tasks.json')) {
  const tasksJson = readJson('.vscode/tasks.json');
  const labels = (tasksJson?.tasks || []).map((t) => t.label).filter(Boolean);
  const required = ['Z: SSWS Auto Boot', 'Z: SSWS Verify', 'Z: Zuno State Report'];
  for (const r of required) {
    if (labels.includes(r)) pass(`Task: ${r}`);
    else fail(`Task: ${r}`, 'missing');
  }
} else fail('.vscode/tasks.json', 'missing');

// 7. Zuno, Module Registry, Folder Manager
if (exists('scripts/z_zuno_state_report.mjs')) pass('Zuno state report script');
else fail('Zuno state report script', 'missing');
if (exists('scripts/z_module_registry_sync.mjs')) pass('Module Registry sync script');
else fail('Module Registry sync script', 'missing');
if (exists('scripts/z_folder_manager_guard.mjs')) pass('Folder Manager guard script');
else fail('Folder Manager guard script', 'missing');

// 7b. Cursor folder blueprint (hub spine directories for Cursor + verifiers)
const cursorBp = readJson('data/z_cursor_folder_blueprint.json');
if (!cursorBp || !Array.isArray(cursorBp.directories) || !cursorBp.directories.length) {
  fail('Cursor folder blueprint', 'missing or empty data/z_cursor_folder_blueprint.json');
} else {
  pass('Cursor folder blueprint JSON', 'exists');
  const miss = cursorBp.directories.filter((d) => d.verify && d.path && !isDir(d.path));
  if (miss.length) {
    fail('Cursor folder blueprint dirs', `${miss.length} missing: ${miss.map((m) => m.path).join(', ')}`);
  } else pass('Cursor folder blueprint dirs', 'all verify paths present');
}
if (exists('scripts/z_cursor_folder_bootstrap.mjs')) pass('Cursor folder bootstrap script');
else fail('Cursor folder bootstrap script', 'missing');

// 8. Z-Creator Manual (if present)
if (exists('docs/Z-CREATOR-MANUAL.md')) pass('Z-Creator Manual');
else fail('Z-Creator Manual', 'missing');

// Output
console.log('\nZ-Sanctuary Structure Verification');
console.log('================================\n');
results.ok.forEach((m) => console.log('[OK]', m));
results.fail.forEach((m) => console.log('[FAIL]', m));
console.log('\n--------------------------------');
const exitCode = results.fail.length > 0 ? 1 : 0;
console.log(`Result: ${results.fail.length === 0 ? 'PASS' : 'FAIL'} (${results.ok.length} ok, ${results.fail.length} fail)\n`);
process.exit(exitCode);
