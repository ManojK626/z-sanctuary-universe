import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function runCapture(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (output) process.stdout.write(output);
    return { ok: true, output };
  } catch (err) {
    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    return { ok: false, output: `${stdout}\n${stderr}`.trim() };
  }
}

function tryRun(cmd) {
  try {
    run(cmd);
  } catch (err) {
    // Keep going; remaining steps still run.
  }
}

function addIssue(counts, rule, sample) {
  if (!rule) return;
  if (!counts[rule]) counts[rule] = { count: 0, sample: sample || '' };
  counts[rule].count += 1;
  if (!counts[rule].sample && sample) counts[rule].sample = sample;
}

function parseMarkdownlint(output, counts) {
  try {
    const data = JSON.parse(output);
    if (!Array.isArray(data)) return;
    data.forEach((item) => {
      const rule = item.ruleNames && item.ruleNames[0];
      const sample = `${item.fileName || ''}:${item.lineNumber || ''}`;
      addIssue(counts, rule, sample);
    });
  } catch (err) {
    // Ignore parse errors.
  }
}

function parseEslint(output, counts) {
  try {
    const data = JSON.parse(output);
    if (!Array.isArray(data)) return;
    data.forEach((file) => {
      (file.messages || []).forEach((msg) => {
        addIssue(counts, msg.ruleId || 'eslint', `${file.filePath || ''}:${msg.line || ''}`);
      });
    });
  } catch (err) {
    // Ignore parse errors.
  }
}

function writeReport(counts) {
  const issues = Object.entries(counts)
    .map(([rule, info]) => ({ rule, count: info.count, sample: info.sample }))
    .sort((a, b) => b.count - a.count);
  const repeatIssues = issues.filter((issue) => issue.count >= 2);
  const report = {
    generatedAt: new Date().toISOString(),
    issues,
    repeatIssues,
  };
  const outputPath = path.join(process.cwd(), 'data', 'z_codex_report.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  const zReport = {
    ZFormat: 'v1',
    ZGeneratedAt: report.generatedAt,
    ZIssues: issues.map((issue) => ({
      ZRule: issue.rule,
      ZCount: issue.count,
      ZSample: issue.sample,
    })),
    ZRepeatIssues: repeatIssues.map((issue) => ({
      ZRule: issue.rule,
      ZCount: issue.count,
      ZSample: issue.sample,
    })),
  };
  const zOutputPath = path.join(process.cwd(), 'data', 'Z_codex_report.json');
  fs.writeFileSync(zOutputPath, JSON.stringify(zReport, null, 2));
}

console.log('Z_AUTO_CODEX: starting repair cycle...');

tryRun('npm run -s format');
tryRun('npm run -s lint:root -- --fix');

const issueCounts = {};
const eslintResult = runCapture('npm run -s lint:root -- --format json');
if (eslintResult.output) parseEslint(eslintResult.output, issueCounts);

const mdResult = runCapture('npm run -s lint:md -- --json');
if (mdResult.output) parseMarkdownlint(mdResult.output, issueCounts);

tryRun('npm run -s typecheck --workspaces --if-present');
tryRun('npm run -s lint --workspaces --if-present');

writeReport(issueCounts);
tryRun('node scripts/z_priority_sync.js');

console.log('\nZ_AUTO_CODEX: cycle complete. Review Problems panel for leftovers.');
