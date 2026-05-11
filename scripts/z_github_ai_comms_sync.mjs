#!/usr/bin/env node
/**
 * Propagates GitHub + AI precaution requirements into a resolved manifest for
 * communications-flow consumers (reports, future dashboard panels).
 * Read-only toward requirements definition; writes data/reports/z_github_ai_comms_manifest.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendZBridgeLog } from './z_bridge/z_bridge_logger.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REQ = path.join(ROOT, 'data', 'z_github_ai_comms_requirements.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_github_ai_comms_manifest.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function existsRel(rel) {
  return fs.existsSync(path.join(ROOT, rel.replace(/^\//, '')));
}

function main() {
  const req = readJson(REQ);
  if (!req || req.ZFormat !== 'v1') {
    process.stderr.write('[comms:github-ai] Missing or invalid data/z_github_ai_comms_requirements.json\n');
    process.exitCode = 1;
    return;
  }

  const pathsToCheck = [];
  for (const d of req.authority_chain || []) pathsToCheck.push({ kind: 'authority', path: d });
  for (const d of req.instructional_docs || []) pathsToCheck.push({ kind: 'instructional_doc', path: d.path, id: d.id });
  for (const d of req.data_sources || []) pathsToCheck.push({ kind: 'data_source', path: d.path, id: d.id });

  const resolved = pathsToCheck.map((row) => ({
    ...row,
    exists: existsRel(row.path),
    absolute: path.join(ROOT, row.path.replace(/^\//, ''))
  }));

  const missing = resolved.filter((r) => !r.exists);
  const identity = readJson(path.join(ROOT, 'data', 'z_ecosystem_github_identity.json'));
  const manifest = {
    generated_at: new Date().toISOString(),
    requirements_version: req.ZUpdatedAt || null,
    requirements_file: 'data/z_github_ai_comms_requirements.json',
    github_login: identity?.github?.login ?? null,
    precaution_themes: req.precaution_themes || [],
    resolved_paths: resolved,
    missing_paths: missing.map((m) => m.path),
    comms_flow_doc: 'docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md',
    ok: missing.length === 0
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`GitHub AI comms manifest → ${OUT}\n`);

  try {
    const lr = appendZBridgeLog({
      action: 'github_ai_comms_sync',
      level: manifest.ok ? 'info' : 'warn',
      detail: manifest.ok ? 'manifest_ok' : 'manifest_missing_refs',
      meta: { missingCount: missing.length, github_login: manifest.github_login }
    });
    if (!lr.ok) {
      process.stdout.write(`[Z-Bridge log skipped] ${lr.error}\n`);
    }
  } catch {
    /* optional */
  }

  if (missing.length > 0) {
    process.stderr.write(
      `[comms:github-ai] Missing files (${missing.length}): ${missing.map((m) => m.path).join(', ')}\n`
    );
    process.exitCode = 1;
  }
}

main();
