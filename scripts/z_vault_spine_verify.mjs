#!/usr/bin/env node
/**
 * Scan configured vault-spine Markdown files; verify relative/local links resolve to files on disk.
 * Writes data/reports/z_vault_spine_manifest.json (+ .md). Advisory for ecosphere ledger.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const CONFIG = path.join(ROOT, 'data', 'z_vault_spine.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_vault_spine_manifest.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_vault_spine_manifest.md');

const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;

function readJson(p, fb = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function shouldSkipHref(raw) {
  const h = String(raw || '').trim();
  if (!h || h.startsWith('#')) return true;
  if (/^https?:\/\//i.test(h)) return true;
  if (h.startsWith('mailto:')) return true;
  return false;
}

function hrefToPath(href) {
  const [pathPart] = String(href).trim().split(/\s+/);
  const noTitle = pathPart.replace(/^<|>$/g, '');
  const [filePart] = noTitle.split('#');
  return filePart || '';
}

function verifyFile(mdAbs, href) {
  const rel = hrefToPath(href);
  if (!rel) return { href, ok: true, resolved: null, note: 'anchor-only' };
  const target = path.normalize(path.resolve(path.dirname(mdAbs), rel));
  if (!target.startsWith(ROOT)) {
    return { href, ok: false, resolved: target, note: 'escapes_repo_root' };
  }
  if (!fs.existsSync(target)) {
    return { href, ok: false, resolved: target, note: 'missing' };
  }
  const st = fs.statSync(target);
  if (!st.isFile()) {
    return { href, ok: false, resolved: target, note: 'not_a_file' };
  }
  return { href, ok: true, resolved: target, note: 'ok' };
}

function main() {
  const strict = !process.argv.includes('--soft') && process.env.VAULT_SPINE_SOFT !== '1';
  const cfg = readJson(CONFIG, null);
  const files = Array.isArray(cfg?.spine_markdown) ? cfg.spine_markdown : [];
  if (!files.length) {
    console.error('Missing or empty data/z_vault_spine.json spine_markdown');
    process.exit(1);
  }

  const generatedAt = new Date().toISOString();
  const perFile = [];
  const broken = [];

  for (const rel of files) {
    const abs = path.join(ROOT, ...rel.split('/'));
    const entry = { path: rel, exists: fs.existsSync(abs), links_checked: 0, broken: [] };
    if (!entry.exists) {
      broken.push({ source: rel, href: '(file missing)', resolved: abs, note: 'spine_source_missing' });
      perFile.push(entry);
      continue;
    }
    const text = fs.readFileSync(abs, 'utf8');
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(text)) !== null) {
      const href = m[2];
      if (shouldSkipHref(href)) continue;
      entry.links_checked += 1;
      const r = verifyFile(abs, href);
      if (!r.ok) {
        entry.broken.push(r);
        broken.push({ source: rel, ...r });
      }
    }
    perFile.push(entry);
  }

  const totalLinks = perFile.reduce((n, f) => n + f.links_checked, 0);
  const status = broken.length === 0 ? 'green' : 'hold';
  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    purpose: 'Vault spine link verification — docs/z-vault + config data/z_vault_spine.json',
    config_file: 'data/z_vault_spine.json',
    status,
    totals: {
      spine_files: files.length,
      links_checked: totalLinks,
      broken: broken.length,
    },
    broken_links: broken,
    per_file: perFile.map((f) => ({
      path: f.path,
      exists: f.exists,
      links_checked: f.links_checked,
      broken_count: f.broken.length,
    })),
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Vault spine manifest',
    '',
    `- Generated: ${generatedAt}`,
    `- Status: **${status.toUpperCase()}**`,
    `- Files: ${files.length} · links checked: ${totalLinks} · broken: ${broken.length}`,
    '',
    ...(broken.length
      ? ['## Broken', ...broken.map((b) => `- \`${b.source}\` → \`${b.href}\` (${b.note})`)]
      : ['## Broken', '- none']),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Z-Vault spine: ${OUT_JSON} status=${status} broken=${broken.length}`);
  if (strict && broken.length) process.exit(1);
}

main();
