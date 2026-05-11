import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_sandbox_phase_guard.json');
const OUT_MD = path.join(REPORTS, 'z_sandbox_phase_guard.md');

function readText(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

const requiredFiles = [
  'sandbox/zgm_phase_lab/README.md',
  'sandbox/zgm_phase_lab/phase_manifest.json',
  'sandbox/zgm_phase_lab/CAPABILITY_ENVELOPE.md',
  'docs/Z_SANDBOX_ISOLATION_PROTOCOL.md',
];

const checks = requiredFiles.map((rel) => {
  const abs = path.join(ROOT, rel);
  return {
    id: rel,
    pass: fs.existsSync(abs),
    note: fs.existsSync(abs) ? 'present' : 'missing',
  };
});

const moduleRegistry = readText('core/z_module_registry_boot.js') || '';
checks.push({
  id: 'core_registry_no_sandbox_entry',
  pass: !moduleRegistry.includes('zgm_phase_lab'),
  note: !moduleRegistry.includes('zgm_phase_lab')
    ? 'no sandbox registration in core registry'
    : 'sandbox entry found in core registry',
});

const docsRegistry = readText('docs/z_module_registry.json') || '';
checks.push({
  id: 'docs_registry_no_sandbox_entry',
  pass: !docsRegistry.includes('zgm_phase_lab'),
  note: !docsRegistry.includes('zgm_phase_lab')
    ? 'no sandbox registration in docs registry'
    : 'sandbox entry found in docs registry',
});

let manifestPass = true;
let pauseStatePass = true;
let freezeControlsPass = true;
try {
  const raw = readText('sandbox/zgm_phase_lab/phase_manifest.json');
  const parsed = raw ? JSON.parse(raw) : null;
  manifestPass =
    !!parsed &&
    parsed.mode === 'sandbox_only' &&
    parsed.integration === 'blocked' &&
    parsed.controls?.core_registry_changes === false &&
    parsed.controls?.production_module_registration === false;

  pauseStatePass =
    !!parsed &&
    parsed.operating_state === 'paused_pending_nas_sync' &&
    typeof parsed.pause_reason === 'string' &&
    parsed.pause_reason.trim().length > 0;

  freezeControlsPass =
    !!parsed &&
    parsed.freeze?.new_phase_development === true &&
    parsed.freeze?.core_promotion === true &&
    parsed.freeze?.auto_bridge === true &&
    parsed.freeze?.core_writes === true;
} catch {
  manifestPass = false;
  pauseStatePass = false;
  freezeControlsPass = false;
}
checks.push({
  id: 'manifest_isolation_controls',
  pass: manifestPass,
  note: manifestPass ? 'sandbox controls valid' : 'manifest controls invalid',
});
checks.push({
  id: 'manifest_pause_state',
  pass: pauseStatePass,
  note: pauseStatePass ? 'pause state valid' : 'pause state missing or invalid',
});
checks.push({
  id: 'manifest_freeze_controls',
  pass: freezeControlsPass,
  note: freezeControlsPass ? 'freeze controls active' : 'freeze controls missing/inactive',
});

const status = checks.every((c) => c.pass) ? 'green' : 'hold';
const payload = {
  generated_at: new Date().toISOString(),
  status,
  checks,
  note:
    status === 'green'
      ? 'Sandbox remains isolated; safe to continue experimental phases.'
      : 'Sandbox isolation checks failed; hold promotion.',
};

fs.mkdirSync(REPORTS, { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
fs.writeFileSync(
  OUT_MD,
  [
    '# Z Sandbox Phase Guard',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    `Note: ${payload.note}`,
    '',
  ].join('\n')
);

console.log(`✅ Sandbox phase guard written: ${OUT_JSON}`);
