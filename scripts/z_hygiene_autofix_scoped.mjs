import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_hygiene_autofix_scoped.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_hygiene_autofix_scoped.md');

const TARGETS = [
  'README.md',
  'docs/chatgpt_exports/**/*.md',
  'docs/Z-LEARNING-LOG-QUICKSTART.md',
  'docs/z-vault/**/*.md',
];

function shellQuote(s) {
  return `"${String(s).replaceAll('"', '\\"')}"`;
}

function runStep(label, command) {
  const result = spawnSync(command, {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
  });
  return {
    label,
    command,
    exit_code: result.status ?? 1,
    ok: !result.error && (result.status ?? 1) === 0,
    stdout: String(result.stdout || '').trim(),
    stderr: String(result.stderr || '').trim(),
    error: result.error ? result.error.message : null,
  };
}

function writeReports(payload) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const lines = [
    '# Z Hygiene Autofix (Scoped)',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Steps passed: ${payload.steps_passed}/${payload.steps_total}`,
    '',
    '## Targets',
    ...TARGETS.map((t) => `- ${t}`),
    '',
    '## Steps',
    ...payload.steps.map((s) => `- ${s.ok ? '[x]' : '[ ]'} ${s.label} (exit=${s.exit_code})`),
    '',
  ];
  fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`, 'utf8');
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const quotedTargets = TARGETS.map(shellQuote).join(' ');

const steps = [
  runStep(
    'markdownlint_fix_scoped',
    `${npxCmd} markdownlint -c .markdownlint.json --fix ${quotedTargets}`
  ),
  runStep(
    'prettier_markdown_scoped',
    `${npxCmd} prettier --write ${quotedTargets}`
  ),
  runStep(
    'markdownlint_validate_scoped',
    `${npxCmd} markdownlint -c .markdownlint.json ${quotedTargets}`
  ),
  runStep(
    'lint_md_repo_snapshot',
    `${npmCmd} run lint:md`
  ),
];

const stepsPassed = steps.filter((s) => s.ok).length;
const status = stepsPassed >= 3 ? 'green' : 'hold';

const payload = {
  generated_at: new Date().toISOString(),
  status,
  steps_total: steps.length,
  steps_passed: stepsPassed,
  note:
    'Scoped autofix must pass fully; repo-wide lint snapshot is informational and may fail due to legacy docs outside scope.',
  steps,
};

writeReports(payload);

if (stepsPassed < 3) {
  const failed = steps.filter((s) => !s.ok).map((s) => s.label).join(', ');
  console.error(`Z scoped hygiene autofix failed: ${failed}`);
  process.exit(1);
}

console.log('Z scoped hygiene autofix completed.');
