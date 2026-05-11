import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const target = path.join(root, 'core', 'index.html');
const reportDir = path.join(root, 'data', 'reports');
const jsonReport = path.join(reportDir, 'z_topic_prefix_guard.json');
const mdReport = path.join(reportDir, 'z_topic_prefix_guard.md');

const content = fs.readFileSync(target, 'utf8');
const regex = /data-title="([^"]+)"/g;
const findings = [];
let match;

while ((match = regex.exec(content)) !== null) {
  const title = match[1].trim();
  const ok = /^Z(\b|[-/])/i.test(title);
  if (!ok) {
    findings.push({
      title,
      index: match.index,
      message: 'Main topic title must start with Z.',
    });
  }
}

const payload = {
  generated_at: new Date().toISOString(),
  status: findings.length ? 'red' : 'green',
  scanned_file: 'core/index.html',
  checked_titles: [...content.matchAll(/data-title="([^"]+)"/g)].length,
  findings_count: findings.length,
  findings,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(jsonReport, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const md = [
  '# Z Topic Prefix Guard',
  '',
  `- Status: ${payload.status.toUpperCase()}`,
  `- Scanned file: \`${payload.scanned_file}\``,
  `- Checked titles: ${payload.checked_titles}`,
  `- Findings: ${payload.findings_count}`,
  '',
  ...findings.map((f) => `- ${f.title}: ${f.message}`),
  '',
].join('\n');

fs.writeFileSync(mdReport, md, 'utf8');

if (findings.length) {
  console.error(`z_topic_prefix_guard failed: ${findings.length} title(s) without Z prefix.`);
  process.exit(1);
}

console.log('z_topic_prefix_guard passed.');
