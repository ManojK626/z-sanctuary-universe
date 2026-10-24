'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const view = require('../dashboard/scripts/z_anydevice_evidence_view.cjs');

const root = path.join(__dirname, '..');
const registryPath = path.join(root, 'data', 'z_anydevice_adaptive_adoption_registry.json');
const before = fs.readFileSync(registryPath);
const registry = JSON.parse(before.toString('utf8'));
const rows = view.rowsFromRegistry(registry);
const summary = view.platformSummary(rows);

function byId(id) {
  return rows.find((row) => row.project === id);
}

assert.strictEqual(byId('unified-dashboard').status, 'GREEN');
assert.strictEqual(byId('apps-web').status, 'GREEN');
assert.strictEqual(byId('amk-goku-main-control').status, 'GREEN');
assert.strictEqual(byId('amk-goku-main-control').role, 'HOST');
assert.strictEqual(byId('amk-goku-main-control').testedSha, 'dd2085d6f19ba3428f9e5984b7ea8c76bb7f3c46');
assert.strictEqual(byId('amk-goku-main-control').chromium, 'PASS');
assert.strictEqual(byId('amk-goku-main-control').firefox, 'PASS');
assert.strictEqual(byId('amk-goku-main-control').webkit, 'PASS');
assert.strictEqual(byId('amk-goku-main-control').physicalDevice, 'NOT_COLLECTED');
assert.strictEqual(byId('z-connect').status, 'NOT_TESTED');
assert.ok(byId('z-golden').surface.includes('not identified'));
assert.strictEqual(byId('shadow-workbench').status, 'LEGACY');
assert.ok(byId('shadow-workbench').openP2.includes('PRE_EXISTING_SHADOW_404'));
assert.strictEqual(summary.greenHosts, 3);
assert.strictEqual(summary.openP0, 0);
assert.strictEqual(summary.openP1, 0);
assert.strictEqual(summary.openP2, 1);
assert.strictEqual(summary.ecosystemWideGreen, 'NO');
assert.strictEqual(summary.capability, 'PROVEN_THREE_HOST_PLATFORM_CAPABILITY');

function hostRow(status) {
  return { role: 'HOST', status: status, openP0: [], openP1: [], openP2: [] };
}
assert.strictEqual(
  view.platformSummary([hostRow('GREEN'), hostRow('GREEN')]).capability,
  'PROVEN_TWO_HOST_PLATFORM_CAPABILITY'
);
assert.strictEqual(
  view.platformSummary([hostRow('GREEN'), hostRow('GREEN'), hostRow('NOT_TESTED')]).capability,
  'UNKNOWN'
);
assert.strictEqual(
  view.platformSummary([hostRow('GREEN'), hostRow('GREEN'), hostRow('GREEN')]).ecosystemWideGreen,
  'NO'
);

const sparse = view.rowsFromRegistry({ entries: [{ project_id: 'example' }] });
assert.strictEqual(sparse[0].status, 'UNKNOWN');
assert.strictEqual(sparse[0].chromium, 'UNKNOWN');
assert.strictEqual(sparse[0].physicalDevice, 'UNKNOWN');

assert.strictEqual(view.driftLabel('abc', 'abc'), 'SAME_RECORDED_SHA');
assert.strictEqual(view.driftLabel('abc', 'def'), 'DRIFT OBSERVED');
assert.notStrictEqual(view.driftLabel('abc', 'def'), 'FAIL');
assert.strictEqual(view.driftLabel('UNKNOWN', 'def'), 'UNKNOWN');

const hidden = view.filterRows(rows, 'NOT_TESTED').map((row) => row.project);
assert.ok(hidden.includes('z-connect'));
assert.ok(!hidden.includes('amk-goku-main-control'));
assert.ok(!hidden.includes('unified-dashboard'));
assert.ok(view.filterRows(rows, 'HAS P2').some((row) => row.project === 'shadow-workbench'));

const after = fs.readFileSync(registryPath);
assert.strictEqual(before.equals(after), true);

const sources = [
  'dashboard/scripts/z_anydevice_evidence_view.cjs',
  'dashboard/scripts/z_anydevice_evidence_readonly.js',
].map((rel) => fs.readFileSync(path.join(root, rel), 'utf8')).join('\n');
assert.ok(!/\b860\b|\b1280\b|\b1600\b|layoutFromWidth/.test(sources));
assert.ok(!/writeFile|fs\.promises|method:\s*'POST'|method:\s*'PUT'/.test(sources));
assert.ok(!/z_adaptive_runtime/.test(fs.readFileSync(path.join(root, 'dashboard/scripts/z_anydevice_evidence_readonly.js'), 'utf8')));
['Adopt', 'Deploy', 'Approve', 'Retest', 'Merge'].forEach((label) => {
  assert.strictEqual(sources.includes('\'' + label + '\''), false);
});

const html = fs.readFileSync(path.join(root, 'dashboard/Html/amk-goku-main-control.html'), 'utf8');
assert.ok(html.includes('zAnyDeviceEvidenceMount'));
assert.ok(html.includes('z_adaptive_runtime.cjs'));
assert.ok(html.includes('z-anydevice-adaptive'));
assert.ok(html.includes('z_anydevice_main_control_host.js'));
assert.ok(!html.includes('z_layout_engine.js'));

console.log('Z_ANYDEVICE_EVIDENCE_VIEW: PASS');
