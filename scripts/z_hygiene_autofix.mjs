import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_hygiene_autofix.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_hygiene_autofix.md');

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
    '# Z Hygiene Autofix',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Steps passed: ${payload.steps_passed}/${payload.steps_total}`,
    '',
    '## Steps',
    ...payload.steps.map((s) => `- ${s.ok ? '[x]' : '[ ]'} ${s.label} (exit=${s.exit_code})`),
    '',
  ];
  fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`, 'utf8');
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const steps = [
  runStep('markdown_table_compact_pre', 'node scripts/z_markdown_table_compact.mjs'),
  runStep(
    'markdownlint_fix',
    `${npxCmd} markdownlint -c .markdownlint.json --fix --ignore "safe_pack/**" --ignore "apps/**/node_modules/**" --ignore "Amk_Goku Worldwide Loterry/exports/**" --ignore "docs/ZALS_DELIVERABLE_*.md" "**/*.md"`
  ),
  runStep(
    'prettier_markdown',
    `${npxCmd} prettier --write "docs/**/*.md" "sandbox/**/*.md" "data/reports/**/*.md"`
  ),
  runStep('markdown_table_compact_post', 'node scripts/z_markdown_table_compact.mjs'),
  runStep(
    'markdownlint_fix_post_prettier',
    `${npxCmd} markdownlint -c .markdownlint.json --fix --ignore "safe_pack/**" --ignore "apps/**/node_modules/**" --ignore "Amk_Goku Worldwide Loterry/exports/**" --ignore "docs/ZALS_DELIVERABLE_*.md" "**/*.md"`
  ),
  runStep('markdownlint_validate', `${npmCmd} run lint:md`),
];

const stepsPassed = steps.filter((s) => s.ok).length;
const status = stepsPassed === steps.length ? 'green' : 'hold';

const payload = {
  generated_at: new Date().toISOString(),
  status,
  steps_total: steps.length,
  steps_passed: stepsPassed,
  steps,
};

writeReports(payload);

if (status !== 'green') {
  const failed = steps.filter((s) => !s.ok).map((s) => s.label).join(', ');
  console.error(`Z hygiene autofix failed: ${failed}`);
  process.exit(1);
}

console.log('Z hygiene autofix completed.');
