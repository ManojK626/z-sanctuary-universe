import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_pending_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_pending_audit.md');

const TAGS = ['TODO', 'FIXME', 'PENDING', 'TBD', 'NEEDS', 'UNRESOLVED'];
const IGNORE = ['node_modules', '.git', 'logs', 'exports', 'data', 'dist', 'build'];

function runRg() {
  const pattern = TAGS.map((t) => `\\b${t}\\b`).join('|');
  const cmd = [
    'rg',
    '-n',
    '--no-heading',
    '--color',
    'never',
    pattern,
    '.',
    ...IGNORE.flatMap((d) => ['-g', `!${d}/**`]),
  ].join(' ');
  try {
    const out = execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return out ? out.split(/\r?\n/) : [];
  } catch {
    return [];
  }
}

function categorize(lines) {
  const entries = lines.map((line) => {
    const [file] = line.split(':', 2);
    const tag = TAGS.find((t) => line.includes(t)) || 'OTHER';
    const area = file.split(/[\\/]/)[0] || 'root';
    return { file, line, tag, area };
  });

  const byTag = {};
  const byArea = {};
  const byFile = {};
  for (const e of entries) {
    byTag[e.tag] = (byTag[e.tag] || 0) + 1;
    byArea[e.area] = (byArea[e.area] || 0) + 1;
    byFile[e.file] = (byFile[e.file] || 0) + 1;
  }

  const topFiles = Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([file, count]) => ({ file, count }));

  return { entries, byTag, byArea, topFiles };
}

function writeReports(payload) {
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z-Sanctuary Pending Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Total markers: ${payload.total}`,
    '',
    '## By Tag',
    ...Object.entries(payload.by_tag).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## By Area',
    ...Object.entries(payload.by_area).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Top Files',
    ...payload.top_files.map((f) => `- ${f.file}: ${f.count}`),
    '',
    '## Sample Lines',
    ...payload.sample_lines.map((l) => `- ${l}`),
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md);
}

const lines = runRg();
const { entries, byTag, byArea, topFiles } = categorize(lines);

const payload = {
  generated_at: new Date().toISOString(),
  total: entries.length,
  by_tag: byTag,
  by_area: byArea,
  top_files: topFiles,
  sample_lines: lines.slice(0, 25),
};

writeReports(payload);
console.log('✅ Pending audit written:', OUT_JSON);
