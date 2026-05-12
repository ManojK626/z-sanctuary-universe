#!/usr/bin/env node
/**
 * Z-CRYSTAL-DNA-3 — Read-only topology drift / integrity awareness for Crystal DNA Mesh.
 * Writes only data/reports/z_crystal_dna_drift_report.{json,md}. No repair, git, deploy, NAS, or secrets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const CRYSTAL = path.join(ROOT, 'data', 'z_crystal_dna_asset_manifest.json');
const SATELLITE = path.join(ROOT, 'data', 'z_satellite_control_link_manifest.json');
const DOORWAY = path.join(ROOT, 'data', 'z_doorway_workspace_registry.json');
const INDICATORS = path.join(ROOT, 'dashboard', 'data', 'amk_project_indicators.json');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_crystal_dna_drift_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_crystal_dna_drift_report.md');
const SCHEMA = 'z_crystal_dna_drift_report_v1';

const SIGNAL_ORDER = { RED: 6, QUARANTINE: 5, HOLD: 4, BLUE: 4, NAS_WAIT: 3, YELLOW: 2, GREEN: 1 };

function maxSignal(a, b) {
  return (SIGNAL_ORDER[a] ?? 0) >= (SIGNAL_ORDER[b] ?? 0) ? a : b;
}

function readJsonSafe(p) {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(p, 'utf8')), path: p };
  } catch (e) {
    return { ok: false, error: String(e?.message || e), path: p };
  }
}

function existsPath(abs) {
  try {
    return fs.existsSync(abs);
  } catch {
    return false;
  }
}

function isNasLikePath(p) {
  const s = String(p || '').trim();
  if (!s) return false;
  const up = s.toUpperCase();
  return up.startsWith('Z:') || up.startsWith('Y:') || up.startsWith('\\\\');
}

function safeRelToAbs(rel) {
  const r = String(rel || '')
    .trim()
    .replace(/\\/g, '/');
  if (!r || r.startsWith('/') || /^[a-zA-Z]:\//.test(r)) return path.normalize(rel);
  return path.join(ROOT, ...r.split('/').filter(Boolean));
}

function main() {
  const generated_at = new Date().toISOString();
  const findings = [];

  const crystalR = readJsonSafe(CRYSTAL);
  const satR = readJsonSafe(SATELLITE);
  const doorR = readJsonSafe(DOORWAY);
  const indR = readJsonSafe(INDICATORS);

  if (!crystalR.ok) {
    findings.push({
      code: 'manifest_unreadable',
      signal: 'RED',
      message: `Cannot read crystal manifest: ${crystalR.error}`,
      refs: [],
    });
  }

  const crystal = crystalR.ok ? crystalR.data : null;
  const sat = satR.ok ? satR.data : null;
  const door = doorR.ok ? doorR.data : null;
  const ind = indR.ok ? indR.data : null;

  if (!satR.ok) {
    findings.push({
      code: 'satellite_manifest_unreadable',
      signal: 'YELLOW',
      message: `Satellite manifest read failed: ${satR.error}`,
      refs: [],
    });
  }
  if (!doorR.ok) {
    findings.push({
      code: 'doorway_registry_unreadable',
      signal: 'YELLOW',
      message: `Doorway registry read failed: ${doorR.error}`,
      refs: [],
    });
  }
  if (!indR.ok) {
    findings.push({
      code: 'indicators_unreadable',
      signal: 'YELLOW',
      message: `Indicators read failed: ${indR.error}`,
      refs: [],
    });
  }

  const crystalIds = new Set();
  const pathToCrystalIds = new Map();
  if (crystal && Array.isArray(crystal.shards)) {
    for (const sh of crystal.shards) {
      const id = String(sh.id || '').trim();
      if (id) crystalIds.add(id);
      const p = String(sh.path || '')
        .trim()
        .replace(/\\/g, '/');
      if (p) {
        if (!pathToCrystalIds.has(p)) pathToCrystalIds.set(p, []);
        pathToCrystalIds.get(p).push(id);
      }
    }
  }

  if (crystal && Array.isArray(crystal.shards)) {
    const inbound = new Map();
    crystalIds.forEach((id) => inbound.set(id, 0));
    for (const sh of crystal.shards) {
      const id = String(sh.id || '').trim();
      const deps = Array.isArray(sh.dependencies) ? sh.dependencies : [];
      for (const d of deps) {
        inbound.set(String(d), (inbound.get(String(d)) || 0) + 1);
      }
    }

    for (const sh of crystal.shards) {
      const id = String(sh.id || '').trim();
      const deps = Array.isArray(sh.dependencies) ? sh.dependencies : [];
      for (const d of deps) {
        const ds = String(d).trim();
        if (!crystalIds.has(ds)) {
          findings.push({
            code: 'broken_dependency',
            signal: 'RED',
            message: `Shard "${id}" depends on missing shard id "${ds}".`,
            refs: [`crystal:${id}`, `missing:${ds}`],
          });
        }
      }

      const p = String(sh.path || '').trim();
      if (p && !isNasLikePath(p)) {
        const abs = safeRelToAbs(p);
        if (!existsPath(abs)) {
          findings.push({
            code: 'missing_shard_path',
            signal: sh.status === 'NAS_WAIT' ? 'NAS_WAIT' : 'RED',
            message: `Crystal shard "${id}" path not found on disk: ${p}`,
            refs: [`crystal:${id}`],
          });
        }
      }
      if (p && isNasLikePath(p) && String(sh.status || '').toUpperCase() !== 'NAS_WAIT') {
        findings.push({
          code: 'nas_path_without_wait_status',
          signal: 'YELLOW',
          message: `Shard "${id}" uses NAS-like path but status is not NAS_WAIT.`,
          refs: [`crystal:${id}`],
        });
      }

      const inc = inbound.get(id) || 0;
      if (deps.length === 0 && inc === 0 && id && id !== 'dna_mesh_doctrine') {
        if (String(sh.status || '').toUpperCase() === 'NAS_WAIT') continue;
        if (
          String(sh.owner_layer || '')
            .toLowerCase()
            .includes('nas')
        )
          continue;
        findings.push({
          code: 'orphan_isolated_dna_shard',
          signal: 'YELLOW',
          message: `DNA shard "${id}" has no dependencies and is not depended on (isolated cluster risk).`,
          refs: [`crystal:${id}`],
        });
      }
    }

    for (const [p, ids] of pathToCrystalIds) {
      if (ids.length > 1) {
        findings.push({
          code: 'duplicate_crystal_path',
          signal: 'YELLOW',
          message: `Multiple DNA shards share path "${p}": ${ids.join(', ')}.`,
          refs: ids.map((x) => `crystal:${x}`),
        });
      }
    }
  }

  const satIds = new Set();
  if (sat && Array.isArray(sat.satellites)) {
    for (const s of sat.satellites) {
      const id = String(s.id || '').trim();
      if (id) {
        if (crystalIds.has(id)) {
          findings.push({
            code: 'id_manifest_overlap',
            signal: 'RED',
            message: `Satellite id "${id}" collides with a crystal shard id.`,
            refs: [`sat:${id}`, `crystal:${id}`],
          });
        }
        satIds.add(id);
      }
    }

    const hubTplRel = String(
      sat.hub_relative_template || 'docs/Z_SANCTUARY_CONTROL_LINK.md'
    ).trim();
    const hubTplAbs = safeRelToAbs(hubTplRel);
    const tplMtime = existsPath(hubTplAbs) ? fs.statSync(hubTplAbs).mtimeMs : null;

    for (const s of sat.satellites) {
      if (!s.enabled) continue;
      const id = String(s.id || '').trim();
      const root = String(s.path || '').trim();
      const br = String(s.bridge_path || 'docs/Z_SANCTUARY_CONTROL_LINK.md').trim();
      if (!root) continue;
      const rootAbs = path.normalize(root);
      if (!existsPath(rootAbs)) {
        if (s.nas_required || String(s.status || '').toUpperCase() === 'NAS_WAIT') {
          findings.push({
            code: 'nas_wait_unresolved',
            signal: 'NAS_WAIT',
            message: `Enabled satellite "${id}" root path missing (NAS_WAIT posture).`,
            refs: [`sat:${id}`],
          });
        } else {
          findings.push({
            code: 'satellite_root_missing',
            signal: 'RED',
            message: `Enabled satellite "${id}" root path missing.`,
            refs: [`sat:${id}`],
          });
        }
        continue;
      }
      const dest = path.join(rootAbs, ...br.split('/').filter(Boolean));
      if (!existsPath(dest)) {
        findings.push({
          code: 'stale_or_missing_bridge',
          signal: 'RED',
          message: `Satellite "${id}" bridge file missing at ${br}.`,
          refs: [`sat:${id}`],
        });
      } else if (tplMtime != null) {
        const dm = fs.statSync(dest).mtimeMs;
        if (dm < tplMtime - 1000) {
          findings.push({
            code: 'stale_bridge',
            signal: 'YELLOW',
            message: `Satellite "${id}" bridge file is older than hub template (refresh drift).`,
            refs: [`sat:${id}`],
          });
        }
      }

      let wired = false;
      if (crystal && Array.isArray(crystal.shards)) {
        for (const sh of crystal.shards) {
          const deps = Array.isArray(sh.dependencies) ? sh.dependencies : [];
          if (deps.includes(id) || String(sh.path || '').includes(id)) wired = true;
        }
      }
      if (!wired) {
        findings.push({
          code: 'satellite_not_wired_in_dna_mesh',
          signal: 'YELLOW',
          message: `Enabled satellite "${id}" is not referenced by DNA shard dependencies (topology gap).`,
          refs: [`sat:${id}`],
        });
      }
    }
  }

  if (door && Array.isArray(door.entries)) {
    let holdCt = 0;
    let greenCt = 0;
    for (const e of door.entries) {
      if (!e.enabled) continue;
      const st = String(e.status || '').toUpperCase();
      if (st === 'HOLD') holdCt += 1;
      if (st === 'GREEN') greenCt += 1;
      if (
        e.nas_required &&
        !isNasLikePath(String(e.path || '')) &&
        !existsPath(path.normalize(String(e.path || '')))
      ) {
        findings.push({
          code: 'doorway_nas_unresolved',
          signal: 'NAS_WAIT',
          message: `Doorway entry "${e.id}" nas_required but path missing.`,
          refs: [`door:${e.id}`],
        });
      }
    }
    if (holdCt > 0 && greenCt > 0) {
      findings.push({
        code: 'hold_parallel_green_doorway',
        signal: 'BLUE',
        message: 'Doorway registry mixes HOLD and GREEN enabled rows — operator sequencing review.',
        refs: [],
      });
    }
  }

  if (ind && Array.isArray(ind.indicators)) {
    const cf = ind.cloudflare_go_no_go;
    const deployHold = cf && String(cf.deployment_status || '').toUpperCase() === 'HOLD';
    let greenN = 0;
    let total = 0;
    for (const x of ind.indicators) {
      total += 1;
      if (String(x.signal || '').toUpperCase() === 'GREEN') greenN += 1;
      const reps = Array.isArray(x.related_reports) ? x.related_reports : [];
      let repChecked = 0;
      for (const rp of reps) {
        if (repChecked >= 3) break;
        repChecked += 1;
        const rel = String(rp || '').trim();
        if (!rel) continue;
        const abs = safeRelToAbs(rel);
        if (!existsPath(abs)) {
          findings.push({
            code: 'indicator_report_path_missing',
            signal: 'YELLOW',
            message: `Indicator "${x.id}" references missing report path ${rel}.`,
            refs: [`ind:${x.id}`],
          });
        }
      }
    }
    if (deployHold && total > 0 && greenN / total > 0.75) {
      findings.push({
        code: 'posture_deploy_hold_vs_green_indicators',
        signal: 'YELLOW',
        message: 'Cloudflare deploy is HOLD while most indicators are GREEN — advisory divergence.',
        refs: [],
      });
    }
  }

  let worst = 'GREEN';
  for (const f of findings) {
    worst = maxSignal(worst, f.signal);
  }

  const exitCode = worst === 'RED' ? 1 : 0;

  const payload = {
    schema: SCHEMA,
    phase: 'Z-CRYSTAL-DNA-3',
    generated_at,
    inputs: {
      crystal: 'data/z_crystal_dna_asset_manifest.json',
      satellite: 'data/z_satellite_control_link_manifest.json',
      doorway: 'data/z_doorway_workspace_registry.json',
      indicators: 'dashboard/data/amk_project_indicators.json',
    },
    overall_signal: worst,
    findings_count: findings.length,
    findings,
    law: 'Detect / compare / report only. No automatic restore, repair, deploy, git, NAS writes, or secrets.',
    exit_hint: exitCode,
    visualization_hook: {
      relative_url: 'data/reports/z_crystal_dna_drift_report.json',
      note: 'Optional: Living Crystal map may fetch this JSON to tint shard nodes by refs[].',
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  const md = [
    '# Z-Crystal DNA drift report',
    '',
    `**Generated:** ${generated_at}`,
    '',
    `**Overall signal:** ${worst}`,
    '',
    `**Findings:** ${findings.length}`,
    '',
    '| code | signal | message | refs |',
    '| --- | --- | --- | --- |',
    ...findings.map((f) => {
      const refs = (f.refs || []).join('; ').replace(/\|/g, '/');
      const msg = String(f.message || '').replace(/\|/g, '/');
      return `| ${f.code} | ${f.signal} | ${msg} | ${refs || '—'} |`;
    }),
    '',
    '## Law',
    '',
    payload.law,
    '',
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify({ ok: true, overall_signal: worst, out_json: OUT_JSON, out_md: OUT_MD }, null, 2)
  );
  process.exit(exitCode);
}

main();
