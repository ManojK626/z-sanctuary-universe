import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_vscode_timeguard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_vscode_timeguard.md');

function discoverTaskFiles() {
  const result = [];
  const stack = [ROOT];
  while (stack.length) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const rel = path.relative(ROOT, fullPath).replaceAll('\\', '/');
      if (entry.isDirectory()) {
        if (
          rel.startsWith('safe_pack/') ||
          rel.includes('/node_modules/') ||
          rel.startsWith('.git/')
        ) {
          continue;
        }
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name === 'tasks.json' && rel.includes('/.vscode/')) {
        result.push(fullPath);
      }
    }
  }
  return result;
}

const FORBIDDEN_PATTERNS = [
  { id: 'prompt_window_id', re: /"id"\s*:\s*"ZBackgroundWindow"/ },
  { id: 'prompt_tz_id', re: /"id"\s*:\s*"ZBackgroundTZ"/ },
  { id: 'local_window_prompt_text', re: /Local time window HH:MM-HH:MM/ },
  { id: 'input_reference_window', re: /\$\{input:ZBackgroundWindow\}/ },
  { id: 'input_reference_tz', re: /\$\{input:ZBackgroundTZ\}/ },
];

const ALLOWED_FOLDER_OPEN_TASKS = new Map([
  ['.vscode/tasks.json', new Set(['Z: SSWS Auto Boot'])],
]);

function run() {
  const generatedAt = new Date().toISOString();
  const taskFiles = discoverTaskFiles().filter((p) => fs.existsSync(p));

  const findings = [];
  for (const filePath of taskFiles) {
    const rel = path.relative(ROOT, filePath).replaceAll('\\', '/');
    const raw = fs.readFileSync(filePath, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.re.test(raw)) {
        findings.push({
          file: rel,
          issue: pattern.id,
        });
      }
    }

    // Allow only explicitly approved startup tasks.
    try {
      const parsed = JSON.parse(raw);
      const tasks = Array.isArray(parsed?.tasks) ? parsed.tasks : [];
      for (const task of tasks) {
        if (task?.runOptions?.runOn !== 'folderOpen') continue;
        const allowedLabels = ALLOWED_FOLDER_OPEN_TASKS.get(rel);
        const label = String(task?.label || '');
        if (!allowedLabels || !allowedLabels.has(label)) {
          findings.push({
            file: rel,
            issue: 'autorun_folder_open_unapproved',
            label,
          });
        }
      }
    } catch {
      findings.push({
        file: rel,
        issue: 'invalid_json',
      });
    }
  }

  const status = findings.length === 0 ? 'green' : 'hold';
  const payload = {
    generated_at: generatedAt,
    status,
    scanned_files: taskFiles.length,
    findings_count: findings.length,
    findings,
    note: 'Prevents reintroduction of prompt-based timezone/window inputs.',
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z VS Code Time Guard',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status.toUpperCase()}`,
    `Scanned files: ${taskFiles.length}`,
    `Findings: ${findings.length}`,
    '',
    '## Findings',
    ...(findings.length
      ? findings.map((f) => `- ${f.issue}: ${f.file}`)
      : ['- none']),
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  if (findings.length > 0) {
    console.error('Z VS Code Time Guard failed. Prompt-based timezone/window inputs detected.');
    process.exit(1);
  }

  console.log('Z VS Code Time Guard passed.');
}

run();
