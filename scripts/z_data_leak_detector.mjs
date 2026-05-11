import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_data_leak_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_data_leak_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_data_leak_audit.md');

const DETECTORS = [
  { id: 'private_key_block', severity: 'critical', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { id: 'aws_access_key', severity: 'high', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'openai_key_like', severity: 'high', re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { id: 'bearer_token', severity: 'high', re: /bearer\s+[A-Za-z0-9_.=-]{20,}/i },
  { id: 'password_assignment', severity: 'warn', re: /\b(password|passwd|pwd)\b\s*[:=]\s*['"][^'"]{6,}['"]/i },
  { id: 'api_key_assignment', severity: 'warn', re: /\b(api[_-]?key|secret|token)\b\s*[:=]\s*['"][^'"]{10,}['"]/i },
];

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function shouldSkip(relPath, excludes) {
  const p = relPath.replaceAll('\\', '/');
  return excludes.some((token) => p.includes(token));
}

function isTextCandidate(relPath, textExt) {
  const ext = path.extname(relPath).toLowerCase();
  return textExt.includes(ext) || ext === '';
}

function walk(rootAbs, rootRel, excludes, out = []) {
  if (!fs.existsSync(rootAbs)) return out;
  const entries = fs.readdirSync(rootAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(rootAbs, entry.name);
    const rel = path.join(rootRel, entry.name).replaceAll('\\', '/');
    if (shouldSkip(rel, excludes)) continue;
    if (entry.isDirectory()) walk(abs, rel, excludes, out);
    else if (entry.isFile()) out.push(rel);
  }
  return out;
}

function run() {
  const policy = readJson(POLICY_PATH, {});
  const roots = Array.isArray(policy.scan_roots) ? policy.scan_roots : [];
  const excludes = Array.isArray(policy.exclude_contains) ? policy.exclude_contains : [];
  const textExt = Array.isArray(policy.text_extensions) ? policy.text_extensions : [];
  const allowPath = (policy.allow_path_patterns || []).map((p) => String(p).toLowerCase());
  const maxBytes = Number(policy.max_file_size_kb || 512) * 1024;
  const thresholds = policy.thresholds || {};

  const files = [];
  for (const root of roots) walk(path.join(ROOT, root), root, excludes, files);

  const findings = [];
  for (const rel of files) {
    const relLc = rel.toLowerCase();
    if (!isTextCandidate(rel, textExt)) continue;
    if (allowPath.some((p) => relLc.includes(p))) continue;
    const abs = path.join(ROOT, rel);
    const stat = fs.statSync(abs);
    if (stat.size > maxBytes) continue;
    let text = '';
    try {
      text = fs.readFileSync(abs, 'utf8');
    } catch {
      continue;
    }
    for (const d of DETECTORS) {
      const m = text.match(d.re);
      if (!m) continue;
      findings.push({
        file: rel,
        detector: d.id,
        severity: d.severity,
        sample: String(m[0]).slice(0, 80),
      });
    }
  }

  const counts = { critical: 0, high: 0, warn: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  const checks = [
    {
      id: 'critical_leaks_limit',
      pass: counts.critical <= Number(thresholds.critical_max ?? 0),
      note: `critical=${counts.critical}, limit=${thresholds.critical_max ?? 0}`,
    },
    {
      id: 'high_leaks_limit',
      pass: counts.high <= Number(thresholds.high_max ?? 0),
      note: `high=${counts.high}, limit=${thresholds.high_max ?? 0}`,
    },
  ];

  const status = checks.every((c) => c.pass) ? 'green' : 'hold';
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    mode: policy.mode || 'audit-only',
    files_scanned: files.length,
    findings_count: findings.length,
    counts,
    checks,
    findings: findings.slice(0, 200),
    note: 'Audit-only leak detector. No automatic file mutation.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Data Leak Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Files scanned: ${payload.files_scanned}`,
    `Findings: ${payload.findings_count}`,
    '',
    '## Counts',
    `- critical: ${counts.critical}`,
    `- high: ${counts.high}`,
    `- warn: ${counts.warn}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Findings (sample)',
    ...payload.findings.slice(0, 30).map((f) => `- ${f.severity.toUpperCase()} ${f.detector}: ${f.file}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Z data leak audit written: ${OUT_JSON}`);
}

run();
