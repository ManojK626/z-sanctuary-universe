/**
 * Z-CONTROL-LINK-1 — Sync thin `docs/Z_SANCTUARY_CONTROL_LINK.md` bridge into manifest-approved satellites only.
 *
 * Default: dry-run (no writes). Pass --apply to write.
 *
 * Never scans arbitrary folders — only manifest entries.
 * Never touches package.json, .env, git, deployments, NAS mutation beyond writing one markdown file under satellite root.
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

const TEMPLATE_REL = 'docs/Z_SANCTUARY_CONTROL_LINK.md';
const MANIFEST_REL = 'data/z_satellite_control_link_manifest.json';
const REPORT_JSON = 'data/reports/z_control_link_sync_report.json';
const REPORT_MD = 'data/reports/z_control_link_sync_report.md';

const argv = new Set(process.argv.slice(2));
const apply = argv.has('--apply');
const mode = apply ? 'apply' : 'dry-run';

function sha256Hex(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function normalizeRoot(p) {
  const n = normalize(p.trim());
  return n.endsWith(sep) ? n.slice(0, -1) : n;
}

/** Reject bridge_path that escapes satellite root. */
function safeRelativeBridgePath(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const fwd = raw.replace(/\\/g, '/').trim();
  if (fwd.startsWith('/') || /^[a-zA-Z]:\//.test(fwd)) return null;
  const parts = fwd.split('/').filter(Boolean);
  if (parts.some((x) => x === '..' || x === '.')) return null;
  return parts.join('/');
}

function isInsideRoot(rootAbs, fileAbs) {
  const r = normalizeRoot(resolve(rootAbs));
  const f = normalizeRoot(resolve(fileAbs));
  if (f === r) return false;
  const rel = relative(r, f);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return false;
  return true;
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readTemplate() {
  const p = resolve(repoRoot, TEMPLATE_REL);
  const buf = await fs.readFile(p);
  return { path: p, buf, text: buf.toString('utf8'), sha256: sha256Hex(buf) };
}

async function readManifest() {
  const p = resolve(repoRoot, MANIFEST_REL);
  const json = JSON.parse(await fs.readFile(p, 'utf8'));
  if (json.schema !== 'z_satellite_control_link_manifest_v1') {
    throw new Error(`Unexpected manifest schema at ${MANIFEST_REL}`);
  }
  return { path: p, data: json };
}

async function mkdirSoft(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeReports(payload) {
  const jPath = resolve(repoRoot, REPORT_JSON);
  const mPath = resolve(repoRoot, REPORT_MD);
  await mkdirSoft(dirname(jPath));
  await fs.writeFile(jPath, JSON.stringify(payload, null, 2), 'utf8');

  const rows = payload.results || [];
  const md = [
    '# Z-Control-Link sync report',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: **${payload.mode}**`,
    `Template SHA-256: \`${payload.template_sha256}\``,
    `Overall OK: **${payload.ok ? 'yes' : 'no'}**`,
    '',
    '| id | name | dest | outcome | reason |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((r) => {
      const dest = (r.dest_absolute || '').replace(/\|/g, '\\|');
      return `| ${r.id} | ${r.name} | \`${dest}\` | ${r.outcome} | ${r.reason || '—'} |`;
    }),
    '',
  ].join('\n');

  await fs.writeFile(mPath, md, 'utf8');
}

async function main() {
  if (argv.has('--help') || argv.has('-h')) {
    console.log(`z_sync_control_links.mjs
  Default: dry-run (compare / plan only).
  --apply   Write bridge file to each approved target.
  Reads template: ${TEMPLATE_REL}
  Reads manifest: ${MANIFEST_REL}`);
    process.exit(0);
  }

  const template = await readTemplate();
  const { data: manifest } = await readManifest();
  const satellites = Array.isArray(manifest.satellites) ? manifest.satellites : [];

  const results = [];
  let ok = true;

  for (const row of satellites) {
    const id = String(row.id || '');
    const name = String(row.name || id);
    const satPathRaw = row.path;
    const enabled = Boolean(row.enabled);
    const status = String(row.status || '').toUpperCase();
    const nasRequired = Boolean(row.nas_required);
    const bridgeRel = safeRelativeBridgePath(String(row.bridge_path || 'docs/Z_SANCTUARY_CONTROL_LINK.md'));

    const base = {
      id,
      name,
      path_declared: satPathRaw,
      bridge_path: bridgeRel || String(row.bridge_path || ''),
      dest_absolute: null,
      outcome: 'skipped',
      reason: null,
      match: null,
      wrote: false,
    };

    if (!enabled) {
      base.reason = 'disabled';
      results.push(base);
      continue;
    }

    if (!bridgeRel) {
      base.reason = 'invalid_bridge_path';
      ok = false;
      results.push(base);
      continue;
    }

    if (!satPathRaw || typeof satPathRaw !== 'string') {
      base.reason = 'missing_path';
      ok = false;
      results.push(base);
      continue;
    }

    const satelliteRoot = resolve(satPathRaw);
    const dest = resolve(satelliteRoot, ...bridgeRel.split('/'));

    if (!isInsideRoot(satelliteRoot, dest)) {
      base.reason = 'bridge_escapes_root';
      base.dest_absolute = dest;
      ok = false;
      results.push(base);
      continue;
    }

    base.dest_absolute = dest;

    if (status === 'RED') {
      base.reason = 'manifest_status_red';
      results.push(base);
      continue;
    }

    const rootExists = await pathExists(satelliteRoot);
    if (!rootExists) {
      if (nasRequired || status === 'NAS_WAIT') {
        base.reason = 'NAS_WAIT';
        base.outcome = 'skipped';
      } else {
        base.reason = 'target_root_missing';
        base.outcome = 'skipped';
      }
      results.push(base);
      continue;
    }

    let existing = null;
    if (await pathExists(dest)) {
      try {
        existing = await fs.readFile(dest, 'utf8');
      } catch (e) {
        base.reason = `read_error:${e.message}`;
        base.outcome = 'error';
        ok = false;
        results.push(base);
        continue;
      }
    }

    const match = existing !== null && existing === template.text;
    base.match = match;

    if (match) {
      base.outcome = 'verified';
      results.push(base);
      continue;
    }

    if (!apply) {
      base.outcome = 'would_write';
      results.push(base);
      continue;
    }

    try {
      await mkdirSoft(dirname(dest));
      await fs.writeFile(dest, template.text, 'utf8');
      base.wrote = true;
      base.outcome = 'wrote';
    } catch (e) {
      base.outcome = 'error';
      base.reason = e.message;
      ok = false;
    }
    results.push(base);
  }

  const payload = {
    ok,
    phase: 'Z-CONTROL-LINK-1',
    mode,
    template_path: template.path,
    template_sha256: template.sha256,
    manifest_path: resolve(repoRoot, MANIFEST_REL),
    generated_at: new Date().toISOString(),
    results,
  };

  await writeReports(payload);

  console.log(JSON.stringify({ ok: payload.ok, mode: payload.mode, report_json: REPORT_JSON, report_md: REPORT_MD }, null, 2));

  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
