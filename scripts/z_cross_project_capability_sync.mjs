#!/usr/bin/env node
/**
 * ZSX-1 + ZMV-1A — Local validation only: parse cross-project / magical-visual JSON
 * artifacts and verify referenced Questra manifest exists. No network, no writes.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const FILES = {
  index: path.join(ROOT, 'data', 'z_cross_project_capability_index.json'),
  entitlement: path.join(ROOT, 'data', 'z_service_entitlement_catalog.json'),
  shadow: path.join(ROOT, 'data', 'z_shadow_preview_policy.json'),
  magical: path.join(ROOT, 'data', 'z_magical_visual_capability_registry.json'),
};

function readJson(relMessage, absPath) {
  if (!fs.existsSync(absPath)) {
    console.error(`Missing file: ${path.relative(ROOT, absPath)}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function main() {
  const idx = readJson('index', FILES.index);
  const ent = readJson('entitlement', FILES.entitlement);
  const sh = readJson('shadow', FILES.shadow);
  const mv = readJson('magical', FILES.magical);

  if (idx.schema !== 'z_cross_project_capability_index_v1') {
    console.error('Unexpected schema on capability index');
    process.exit(1);
  }
  if (!Array.isArray(idx.capabilities) || idx.capabilities.length < 1) {
    console.error('Capability index must contain capabilities array');
    process.exit(1);
  }
  for (const row of idx.capabilities) {
    const need = [
      'service_id',
      'source_project',
      'capability_id',
      'capability_name',
      'current_status',
      'bridge_status',
      'memory_status',
      'allowed_reuse_modes',
      'future_gated_reuse_modes',
      'forbidden_without_charter',
      'drp_gate_required',
      'charter_required',
      'pricing_owner',
      'entitlement_status',
      'docs',
    ];
    for (const k of need) {
      if (!(k in row)) {
        console.error(`Capability row missing "${k}": ${row.service_id || '?'}`);
        process.exit(1);
      }
    }
    if (row.source_project === 'z-questra' && row.capability_id !== 'manifest_pending') {
      const manifestRel = row.source_manifest;
      if (typeof manifestRel !== 'string' || !manifestRel) {
        console.error(`Questra row missing source_manifest: ${row.service_id}`);
        process.exit(1);
      }
      const manifestAbs = path.join(ROOT, ...manifestRel.split('/'));
      if (!fs.existsSync(manifestAbs)) {
        console.error(`Referenced manifest missing: ${manifestRel}`);
        process.exit(1);
      }
    }
  }

  if (ent.schema !== 'z_service_entitlement_catalog_v1') {
    console.error('Unexpected schema on entitlement catalog');
    process.exit(1);
  }
  if (sh.schema !== 'z_shadow_preview_policy_v1') {
    console.error('Unexpected schema on shadow preview policy');
    process.exit(1);
  }

  if (mv.schema !== 'z_magical_visual_capability_registry_v1') {
    console.error('Unexpected schema on magical visual capability registry');
    process.exit(1);
  }
  if (!Array.isArray(mv.capabilities) || mv.capabilities.length < 1) {
    console.error('Magical visual registry must contain capabilities array');
    process.exit(1);
  }
  const mvNeed = [
    'id',
    'name',
    'source_project',
    'source_files',
    'capability_type',
    'current_status',
    'reuse_mode',
    'bridge_status',
    'pricing_owner',
    'entitlement_owner',
    'allowed_reuse',
    'future_gated_reuse',
    'forbidden_without_charter',
    'drp_gate_required',
    'dop_gate_required',
    'notes',
  ];
  for (const row of mv.capabilities) {
    for (const k of mvNeed) {
      if (!(k in row)) {
        console.error(`Magical visual row missing "${k}": ${row.id || '?'}`);
        process.exit(1);
      }
    }
    if (!Array.isArray(row.source_files) || row.source_files.length < 1) {
      console.error(`Magical visual row needs source_files[]: ${row.id}`);
      process.exit(1);
    }
  }

  console.log(
    `z:cross-project:sync OK — ${idx.capabilities.length} capability rows; entitlement + shadow + ${mv.capabilities.length} magical visual rows parsed.`,
  );
}

main();
