import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'data', 'z_canonical_alias_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_canonical_alias_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_canonical_alias_audit.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function hashFile(absPath) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(absPath));
  return h.digest('hex');
}

function run() {
  const registry = readJson(REGISTRY_PATH, { aliases: [] });
  const items = Array.isArray(registry.aliases) ? registry.aliases : [];

  const checks = items.map((item) => {
    const canonicalPath = String(item.canonical || '').replaceAll('\\', '/');
    const canonicalAbs = path.join(ROOT, canonicalPath);
    const canonicalExists = fs.existsSync(canonicalAbs);
    const canonicalHash = canonicalExists ? hashFile(canonicalAbs) : null;

    const aliasResults = (item.aliases || []).map((alias) => {
      const aliasPath = String(alias || '').replaceAll('\\', '/');
      const aliasAbs = path.join(ROOT, aliasPath);
      const exists = fs.existsSync(aliasAbs);
      const hash = exists ? hashFile(aliasAbs) : null;
      return {
        path: aliasPath,
        exists,
        hash_match: canonicalHash && hash ? canonicalHash === hash : false,
      };
    });

    const pass =
      canonicalExists &&
      aliasResults.every((a) => a.exists) &&
      aliasResults.every((a) => a.hash_match);

    return {
      id: item.id || canonicalPath,
      canonical: canonicalPath,
      canonical_exists: canonicalExists,
      aliases: aliasResults,
      pass,
      reason: item.reason || '',
    };
  });

  const payload = {
    generated_at: new Date().toISOString(),
    status: checks.every((c) => c.pass) ? 'green' : 'hold',
    total: checks.length,
    pass: checks.filter((c) => c.pass).length,
    fail: checks.filter((c) => !c.pass).length,
    checks,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Canonical Alias Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Pass: ${payload.pass}/${payload.total}`,
    '',
    '## Items',
    ...checks.map(
      (c) =>
        `- [${c.pass ? 'x' : ' '}] ${c.id}: canonical=${c.canonical} (${c.canonical_exists ? 'exists' : 'missing'})`
    ),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Canonical alias audit written: ${OUT_JSON}`);
}

run();
