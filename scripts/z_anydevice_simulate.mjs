#!/usr/bin/env node
/**
 * Z-ANYDEVICE-2 — Read-only synthetic device simulation.
 * Reads data/z_anydevice_synthetic_devices.json + data/z_anydevice_ai_capsule_registry.json.
 * Writes only data/reports/z_anydevice_simulation_report.{json,md}.
 * No hardware, scanning, drivers, secrets, Cloudflare production, or NAS writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const SYNTH = path.join(ROOT, 'data', 'z_anydevice_synthetic_devices.json');
const CAPSULE = path.join(ROOT, 'data', 'z_anydevice_ai_capsule_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_anydevice_simulation_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_anydevice_simulation_report.md');
const SCHEMA = 'z_anydevice_simulation_report_v1';

const VALID_TRUST = new Set(['GREEN', 'YELLOW', 'BLUE', 'RED', 'QUARANTINE', 'NAS_WAIT']);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function worstRisk(a, b) {
  const R = { RED: 4, QUARANTINE: 3, YELLOW: 2, BLUE: 2, GREEN: 1, NAS_WAIT: 2 };
  const ra = R[String(a || '').toUpperCase()] ?? 0;
  const rb = R[String(b || '').toUpperCase()] ?? 0;
  return ra >= rb ? String(a || 'YELLOW').toUpperCase() : String(b || 'YELLOW').toUpperCase();
}

function deriveRisk(trusted, declaredRisk) {
  const t = String(trusted || '').toUpperCase();
  if (t === 'QUARANTINE' || t === 'RED') return worstRisk('RED', declaredRisk);
  return String(declaredRisk || 'YELLOW').toUpperCase();
}

function classify(trusted, ecosystemRole) {
  const t = String(trusted || '').toUpperCase();
  let recommended_action = '';
  let required_human_gate = '';
  let simulation_blocked = false;

  if (t === 'RED' || t === 'QUARANTINE') {
    simulation_blocked = true;
    recommended_action =
      'BLOCK: RED or QUARANTINE — no sensitive hub workflows; no auto-connect; treat as untrusted until reclassified.';
    required_human_gate = 'remediation_or_disposal_amk';
  } else if (t === 'NAS_WAIT') {
    recommended_action =
      'HOLD: NAS_WAIT — mount and operator-verify before any NAS or cold-mirror class action; no NAS writes from simulation.';
    required_human_gate = 'mount_and_operator_verify_nas';
  } else if (t === 'BLUE') {
    recommended_action =
      'AMK_DECISION: BLUE — governance sequencing; preview/docs posture only until AMK-Goku clears expansion.';
    required_human_gate = 'amk_governance_decision';
  } else if (t === 'GREEN') {
    recommended_action =
      'ALLOWED: GREEN — use only within declared ecosystem_role and read-only hub doctrine; do not exceed charter.';
    required_human_gate = 'none_for_declared_read_only_role';
  } else if (t === 'YELLOW') {
    recommended_action =
      'REVIEW_REQUIRED: YELLOW — human review before role expansion, exports, or new integration surfaces.';
    required_human_gate = 'human_review_before_expansion';
  } else {
    recommended_action = 'UNKNOWN_TRUST_STATE: treat as YELLOW until corrected.';
    required_human_gate = 'human_review_before_expansion';
  }

  return {
    simulation_blocked,
    recommended_action,
    required_human_gate,
    ecosystem_role: ecosystemRole,
    trusted_status: t,
  };
}

function validateRole(roleId, validIds) {
  if (!roleId) return { ok: false, message: 'missing ecosystem_role' };
  if (validIds.has(roleId)) return { ok: true };
  return { ok: false, message: `unknown ecosystem_role: ${roleId}` };
}

function mdEscape(s) {
  return String(s || '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function main() {
  const generated_at = new Date().toISOString();
  const warnings = [];

  let synth;
  let capsule;
  try {
    synth = readJson(SYNTH);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: `synthetic: ${e?.message || e}` }));
    process.exit(1);
  }
  try {
    capsule = readJson(CAPSULE);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: `capsule: ${e?.message || e}` }));
    process.exit(1);
  }

  const forbidden = Array.isArray(capsule.forbidden_actions) ? [...capsule.forbidden_actions] : [];
  const roleIds = new Set((capsule.ecosystem_roles || []).map((r) => r.id).filter(Boolean));

  const devicesIn = Array.isArray(synth.devices) ? synth.devices : [];
  const simulations = [];

  for (const d of devicesIn) {
    const device_id = d.device_id || d.id || '';
    const eco = d.ecosystem_role || '';
    const trusted = String(d.trusted_status || '').toUpperCase();

    if (!VALID_TRUST.has(trusted)) {
      warnings.push({ device_id, code: 'invalid_trusted_status', detail: d.trusted_status });
    }

    const vr = validateRole(eco, roleIds);
    if (!vr.ok) warnings.push({ device_id, code: 'role_validation', detail: vr.message });

    const risk_signal = deriveRisk(trusted, d.risk_signal);
    const c = classify(trusted, eco);

    simulations.push({
      device_id,
      inputs: {
        device_type: d.device_type,
        os: d.os,
        cpu: d.cpu,
        gpu: d.gpu,
        ram: d.ram,
        storage: d.storage,
        network_capability: d.network_capability,
        scenario_note: d.scenario_note || '',
      },
      ecosystem_role: eco,
      trusted_status: c.trusted_status,
      risk_signal,
      recommended_action: c.recommended_action,
      forbidden_actions: forbidden,
      required_human_gate: c.required_human_gate,
      simulation_blocked: c.simulation_blocked,
    });
  }

  const report = {
    schema: SCHEMA,
    phase: 'Z-ANYDEVICE-2',
    generated_at,
    law: 'Synthetic simulation only. No real device scanning, no antivirus claims, no network probing, no drivers, no secrets, no Cloudflare production changes, no NAS writes.',
    inputs: {
      synthetic: 'data/z_anydevice_synthetic_devices.json',
      capsule: 'data/z_anydevice_ai_capsule_registry.json',
    },
    rules_applied: {
      RED_QUARANTINE: 'block — simulation_blocked true',
      NAS_WAIT: 'hold until mounted and verified',
      BLUE: 'AMK governance decision',
      GREEN: 'allowed for declared ecosystem_role only (read-only doctrine)',
      YELLOW: 'human review required before expansion',
    },
    casa_ai_builder: {
      may: ['read_simulation_report', 'suggest_safe_checklists', 'suggest_docs_prompts_only'],
      must_not: ['device_authority'],
    },
    cloudflare_ai: {
      may: ['review_preview_runtime_posture_in_governance_docs_only'],
      must_not: ['device_authority', 'secrets', 'production_deploy'],
    },
    warnings,
    simulations,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const lines = [
    `# Z-AnyDevice synthetic simulation report`,
    ``,
    `- **Generated:** ${generated_at}`,
    `- **Schema:** \`${SCHEMA}\``,
    ``,
    `## Law`,
    ``,
    report.law,
    ``,
    `## Simulations (${simulations.length} devices)`,
    ``,
    '| device_id | ecosystem_role | trusted_status | risk_signal | blocked | required_human_gate |',
    '| --------- | -------------- | -------------- | ----------- | ------- | ------------------- |',
  ];

  for (const s of simulations) {
    lines.push(
      `| ${mdEscape(s.device_id)} | ${mdEscape(s.ecosystem_role)} | ${mdEscape(s.trusted_status)} | ${mdEscape(s.risk_signal)} | ${s.simulation_blocked ? 'yes' : 'no'} | ${mdEscape(s.required_human_gate)} |`
    );
  }

  lines.push('', '## Recommended actions (summary)', '');
  for (const s of simulations) {
    lines.push(`- **${s.device_id}:** ${mdEscape(s.recommended_action)}`);
  }

  if (warnings.length) {
    lines.push('', '## Warnings', '');
    for (const w of warnings) {
      lines.push(`- \`${w.device_id || '—'}\` ${w.code}: ${mdEscape(w.detail)}`);
    }
  }

  lines.push('', '---', '', `Full JSON: \`data/reports/z_anydevice_simulation_report.json\``, '');

  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        devices: simulations.length,
        warnings: warnings.length,
        out_json: OUT_JSON,
        out_md: OUT_MD,
      },
      null,
      2
    )
  );
}

main();
