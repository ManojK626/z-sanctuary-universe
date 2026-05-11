#!/usr/bin/env node
// Z: scripts/z_registry_omni_verify.mjs
// Registry Verification Script: confirm Cursor is 100% synced with PC/NAS and the Omni-Heart.
// Run from repo root: node scripts/z_registry_omni_verify.mjs
// Aligns with Z-OMNI Unified Organism manifest and §9 / §10 sign-offs.

import fs from 'node:fs';
import path from 'node:path';
import { appendZBridgeLog } from './z_bridge/z_bridge_logger.mjs';

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
function readJson(rel) {
  try {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// ─── 1. PC/NAS (PC root projects) ─────────────────────────────────────────
const pcRoot = readJson('data/z_pc_root_projects.json');
if (!pcRoot) {
  fail('PC/NAS: z_pc_root_projects.json', 'missing or invalid');
} else {
  pass('PC/NAS: z_pc_root_projects.json', 'exists');
  const projects = pcRoot.projects || [];
  const hub = projects.find((p) => p.role === 'hub');
  if (!hub) fail('PC/NAS: hub', 'no hub defined');
  else pass('PC/NAS: hub', `${hub.name}; ${projects.length} project(s)`);
  if (pcRoot.pc_root) pass('PC/NAS: pc_root', pcRoot.pc_root);
}

// ─── 2. Cursor (workspace, rules, tasks) ────────────────────────────────────
if (exists('Z_SSWS.code-workspace')) pass('Cursor: Z_SSWS.code-workspace');
else fail('Cursor: Z_SSWS.code-workspace', 'missing');

const rules = [
  '.cursor/rules/z-hierarchy-chief.mdc',
  '.cursor/rules/z-canvas-sanctuary.mdc',
  '.cursor/rules/z-completions-test-and-comms-flow.mdc',
  '.cursor/rules/z-omni-unified-organism.mdc',
  '.cursor/rules/z-acn-mteh.mdc',
  '.cursor/rules/z-github-ai-comms.mdc',
  '.cursor/rules/z-cloudflare-ai-comms.mdc',
  '.cursor/rules/z-aafrtc.mdc',
  '.cursor/rules/z-visual-automation-boundary.mdc',
  '.cursor/rules/z-multi-option-merge.mdc',
];
rules.forEach((r) => {
  if (exists(r)) pass(`Cursor rule: ${path.basename(r)}`);
  else fail(`Cursor rule: ${path.basename(r)}`, 'missing');
});

if (exists('.vscode/tasks.json')) {
  const tasksJson = readJson('.vscode/tasks.json');
  const labels = (tasksJson?.tasks || []).map((t) => t.label).filter(Boolean);
  if (labels.includes('Z: Sanctuary Structure Verify')) pass('Cursor: task Z: Sanctuary Structure Verify');
  else fail('Cursor: task Z: Sanctuary Structure Verify', 'missing');
} else fail('Cursor: .vscode/tasks.json', 'missing');

// ─── 3. AI (registry, state, authority docs) ──────────────────────────────
const moduleReg = readJson('data/Z_module_registry.json');
if (!moduleReg) {
  fail('AI: Z_module_registry.json', 'missing or invalid');
} else {
  const mods = moduleReg.ZModules || moduleReg.modules || moduleReg;
  const count = Array.isArray(mods) ? mods.length : 1;
  pass('AI: Module Registry', count ? count + ' module(s)' : 'exists');
}

if (exists('scripts/z_zuno_state_report.mjs')) pass('AI: Zuno state report script');
else fail('AI: Zuno state report script', 'missing');
if (exists('data/z_cursor_folder_blueprint.json')) pass('AI: Cursor folder blueprint');
else fail('AI: Cursor folder blueprint', 'missing');
if (exists('scripts/z_cursor_folder_bootstrap.mjs')) pass('AI: Cursor folder bootstrap script');
else fail('AI: Cursor folder bootstrap script', 'missing');
if (exists('scripts/z_module_registry_sync.mjs')) pass('AI: Module Registry sync script');
else fail('AI: Module Registry sync script', 'missing');

// Authority & §9 / §10
if (exists('docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md')) pass('AI: Hierarchy Chief (authority)');
else fail('AI: Hierarchy Chief', 'missing');
if (exists('docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md')) pass('AI: §9 Completions test & comms flow');
else fail('AI: §9 Completions test & comms flow doc', 'missing');
if (exists('docs/Z-SANCTUARY-VERIFICATION-CHECKLIST.md')) pass('AI: Verification checklist (§9, §10)');
else fail('AI: Verification checklist', 'missing');
if (exists('docs/Z-FULL-VISION-AND-REINFORCEMENT.md')) pass('AI: Full Vision & Reinforcement');
else fail('AI: Full Vision doc', 'missing');

// ─── 4. Omni-Heart (formulas, vault, single control plane) ─────────────────
if (exists('rules/Z_FORMULA_REGISTRY.json')) {
  const reg = readJson('rules/Z_FORMULA_REGISTRY.json');
  const formulas = reg?.formulas?.length ?? 0;
  pass('Omni-Heart: Formula registry', formulas ? `${formulas} formula(s)` : 'exists');
} else fail('Omni-Heart: Formula registry', 'missing');
if (exists('docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md')) pass('Omni-Heart: Z-Formulas doc');
else fail('Omni-Heart: Z-Formulas doc', 'missing');

if (exists('dashboard/Html/index-skk-rkpk.html')) pass('Omni-Heart: Dashboard (single control plane)');
else fail('Omni-Heart: Dashboard', 'missing');
if (exists('core/z_pc_root_projects_panel.js')) pass('Omni-Heart: All projects panel');
else fail('Omni-Heart: All projects panel', 'missing');

// Vault / security (Sovereign Vault ref)
if (exists('docs/vault/Vault_Access_Map.md') || exists('docs/vault/Vault_Policy_Sheet.md')) {
  pass('Omni-Heart: Vault/Security refs');
} else fail('Omni-Heart: Vault refs', 'missing');

// ─── 5. AGENTS.md (any-AI rule) ───────────────────────────────────────────
if (exists('AGENTS.md')) pass('AGENTS.md', 'any-AI rule');
else fail('AGENTS.md', 'missing');

// ─── 6. Ecosystem GitHub identity (operator + AI alignment) ──────────────
const ghId = readJson('data/z_ecosystem_github_identity.json');
if (!ghId) {
  fail('Ecosystem: z_ecosystem_github_identity.json', 'missing or invalid');
} else {
  const login = ghId.github?.login;
  if (login) pass('Ecosystem: GitHub identity', `login ${login}`);
  else fail('Ecosystem: GitHub identity', 'missing github.login');
}

const ghCommsReq = readJson('data/z_github_ai_comms_requirements.json');
if (!ghCommsReq || ghCommsReq.ZFormat !== 'v1') {
  fail('Ecosystem: z_github_ai_comms_requirements.json', 'missing or invalid');
} else {
  const themes = ghCommsReq.precaution_themes?.length ?? 0;
  pass('Ecosystem: GitHub AI comms requirements', themes ? `${themes} theme(s)` : 'exists');
}

const cfCommsReq = readJson('data/z_cloudflare_ai_comms_requirements.json');
if (!cfCommsReq || cfCommsReq.ZFormat !== 'v1') {
  fail('Ecosystem: z_cloudflare_ai_comms_requirements.json', 'missing or invalid');
} else {
  const themes = cfCommsReq.precaution_themes?.length ?? 0;
  pass('Ecosystem: Cloudflare AI comms requirements', themes ? `${themes} theme(s)` : 'exists');
}

const aafrtc = readJson('data/z_aafrtc_policy.json');
if (!aafrtc || aafrtc.ZFormat !== 'v1') {
  fail('Ecosystem: z_aafrtc_policy.json', 'missing or invalid');
} else {
  pass('Ecosystem: AAFRTC policy', aafrtc.acronym || 'AAFRTC');
}

const visBoundary = readJson('data/z_visual_automation_boundary.json');
if (!visBoundary || visBoundary.ZFormat !== 'v1') {
  fail('Ecosystem: z_visual_automation_boundary.json', 'missing or invalid');
} else {
  pass('Ecosystem: visual automation boundary', 'DRP-aligned');
}

const optMerge = readJson('data/z_ai_option_merge_hints.json');
if (!optMerge || optMerge.ZFormat !== 'v1') {
  fail('Ecosystem: z_ai_option_merge_hints.json', 'missing or invalid');
} else {
  pass('Ecosystem: AI multi-option merge hints', optMerge.stages?.length ? `${optMerge.stages.length} stage(s)` : 'exists');
}

// ─── Output ───────────────────────────────────────────────────────────────
console.log('\nZ-Registry Omni Verify — PC/NAS & Omni-Heart Sync');
console.log('==================================================\n');
results.ok.forEach((m) => console.log('[OK]', m));
results.fail.forEach((m) => console.log('[FAIL]', m));
console.log('\n--------------------------------');
const allPass = results.fail.length === 0;
if (allPass) {
  console.log('Result: 100% SYNCED with PC/NAS and the Omni-Heart.');
  console.log('Cursor is aligned with the Z-OMNI Unified Organism. Section 9 and Section 10 = Moral and Technical Law.\n');
} else {
  console.log('Result: SYNC INCOMPLETE (' + results.fail.length + ' fail). Fix failures and re-run.\n');
}

// Z-Bridge append-only observability (best-effort; never overrides verify exit code)
try {
  const lr = appendZBridgeLog({
    action: 'registry_omni_verify',
    level: allPass ? 'info' : 'warn',
    detail: allPass ? 'hub_sync_complete' : 'hub_sync_incomplete',
    meta: {
      checksOk: results.ok.length,
      checksFail: results.fail.length,
      verdict: allPass ? 'PASS' : 'FAIL'
    }
  });
  if (!lr.ok) console.warn('[Z-Bridge log]', lr.error);
} catch (e) {
  console.warn('[Z-Bridge log]', e instanceof Error ? e.message : String(e));
}

process.exit(allPass ? 0 : 1);
