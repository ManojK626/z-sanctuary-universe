#!/usr/bin/env node
/**
 * Z-SSWS-COCKPIT-1 — read-only workspace cockpit orchestrator.
 * No auto-launch, NAS mount, cloud deploy, or IDE remote control.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REGISTRY = path.join(ROOT, 'data', 'z_ssws_cockpit_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_ssws_cockpit_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_ssws_cockpit_report.md');
const IDE_PATH_REPORT = path.join(ROOT, 'data', 'reports', 'z_pc_ide_path_report.json');
const FUSION_REPORT = path.join(ROOT, 'data', 'reports', 'z_ide_fusion_report.json');

const RANK = { RED: 4, BLUE: 3, YELLOW: 2, GREEN: 1 };

function maxSignal(a, b) {
  return RANK[b] > RANK[a] ? b : a;
}

function readJsonSafe(p, issues, code) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    issues.push({ signal: 'YELLOW', code, message: `Missing or unreadable: ${path.relative(ROOT, p)} — ${String(e.message || e)}` });
    return null;
  }
}

function existsDir(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function dryRunSuggestion(project) {
  const rp = String(project.root_path || '').trim();
  if (!rp) return { text: '(declaration_only — operator sets path manually after AMK gate)', exe: null };
  const q = `"${rp}"`;
  if (project.preferred_ide === 'cursor_ai_heavy_builder')
    return { text: `cursor ${q}`, exe: 'cursor' };
  if (project.preferred_ide === 'vscode_stable_editor') return { text: `code ${q}`, exe: 'code' };
  if (project.preferred_ide === 'browser_dashboard_overview')
    return { text: 'Open hub dashboard HTML from repo root (HTTP only when operator serves)', exe: null };
  if (project.preferred_ide === 'powershell_explicit_commands')
    return { text: 'PowerShell explicit commands only (no script auto-runner from cockpit)', exe: null };
  return { text: `code ${q}`, exe: 'code' };
}

function main() {
  const generatedAt = new Date().toISOString();
  const issues = [];
  let reg = readJsonSafe(REGISTRY, issues, 'registry_missing');

  if (!reg || typeof reg !== 'object') {
    const payload = {
      schema: 'z_ssws_cockpit_report_v1',
      generated_at: generatedAt,
      overall_signal: 'RED',
      phase: 'Z-SSWS-COCKPIT-1',
      issues: [{ signal: 'RED', code: 'registry_fatal', message: 'z_ssws_cockpit_registry.json invalid' }],
    };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ ok: false, overall_signal: 'RED', out_json: OUT_JSON }, null, 2));
    process.exit(1);
    return;
  }

  let overall = 'GREEN';

  const cockpitResolved = path.resolve(String(reg.cockpit_root || ''));
  const labsResolved = path.resolve(String(reg.labs_root || ''));

  if (!existsDir(cockpitResolved)) {
    issues.push({
      signal: 'RED',
      code: 'cockpit_root_missing',
      message: `cockpit_root not found on disk: ${cockpitResolved}`,
    });
    overall = maxSignal(overall, 'RED');
  }

  let labs_missing = false;
  if (!existsDir(labsResolved)) {
    labs_missing = true;
    issues.push({
      signal: 'YELLOW',
      code: 'labs_root_missing',
      message: `labs_root optional-recommended folder missing: ${labsResolved}`,
    });
    overall = maxSignal(overall, 'YELLOW');
  }

  const projectResults = [];
  const openingPlanPreview = [];

  for (const p of reg.projects || []) {
    if (p.launch_policy !== 'dry_run_only') {
      issues.push({
        signal: 'RED',
        code: 'launch_policy_breach',
        message: `${p.project_id}: launch_policy must be dry_run_only in Phase COCKPIT-1`,
      });
      overall = maxSignal(overall, 'RED');
    }
    if (p.auto_launch === true) {
      issues.push({ signal: 'RED', code: 'auto_launch_forbidden', message: `${p.project_id}: auto_launch must remain false` });
      overall = maxSignal(overall, 'RED');
    }

    const exp = String(p.root_expectation || 'optional');
    const rpRaw = String(p.root_path || '').trim();
    const rpResolved = rpRaw ? path.resolve(rpRaw) : '';
    let prSignal = 'GREEN';
    if (exp === 'required' && rpRaw && !existsDir(rpResolved)) {
      issues.push({ signal: 'RED', code: 'required_root_missing', message: `${p.project_id}: required root missing` });
      prSignal = 'RED';
      overall = maxSignal(overall, 'RED');
    } else if (exp === 'recommended' && rpRaw && !existsDir(rpResolved)) {
      issues.push({
        signal: 'YELLOW',
        code: 'recommended_root_missing',
        message: `${p.project_id}: recommended root missing (deep-work degraded)`,
      });
      prSignal = 'YELLOW';
      overall = maxSignal(overall, 'YELLOW');
    } else if (exp === 'optional' && rpRaw && !existsDir(rpResolved)) {
      issues.push({
        signal: 'YELLOW',
        code: 'optional_root_missing',
        message: `${p.project_id}: optional sibling path not present — skip or clone before deep work`,
      });
      prSignal = 'YELLOW';
      overall = maxSignal(overall, 'YELLOW');
    }

    if (String(p.preferred_mode || '') === 'blue_amk_gate') overall = maxSignal(overall, 'BLUE');

    projectResults.push({
      project_id: p.project_id,
      root_expectation: exp,
      exists: rpRaw ? existsDir(rpResolved) : null,
      signal: prSignal,
      preferred_mode: p.preferred_mode,
      preferred_ide: p.preferred_ide,
    });

    const hint = dryRunSuggestion(p);
    openingPlanPreview.push({
      project_id: p.project_id,
      posture: '(plan text only — not executed)',
      suggested_cli: hint.text,
      preferred_mode: p.preferred_mode,
    });
  }

  for (const d of reg.storage_domains || []) {
    if (d.live_mount === true && d.requires_amk_to_enable_live !== false) {
      const signed = Boolean(d.amk_gate_recorded === true || d.amk_charter_signed === true);
      if (!signed) {
        issues.push({
          signal: 'RED',
          code: 'live_storage_without_amk',
          message: `storage domain ${d.id}: live_mount without documented AMK gate fields`,
        });
        overall = maxSignal(overall, 'RED');
      }
    }
    if (d.sync_jobs_allowed === true) {
      issues.push({
        signal: 'RED',
        code: 'sync_jobs_forbidden_phase1',
        message: `storage domain ${d.id}: sync_jobs_allowed must remain false`,
      });
      overall = maxSignal(overall, 'RED');
    }
    if (d.deploy_route_enabled === true || d.live_tunnel === true) {
      const signed = Boolean(d.amk_gate_recorded === true || d.requires_amk_to_enable_live === false);
      if (!(signed && (d.amk_gate_recorded === true || reg.allow_cloudflare_live === true))) {
        issues.push({
          signal: 'RED',
          code: 'cloudflare_live_without_amk',
          message: `storage domain ${d.id}: deploy/tunnel flagged without charter`,
        });
        overall = maxSignal(overall, 'RED');
      }
    }
  }

  let ideEvidence = readJsonSafe(IDE_PATH_REPORT, issues, 'ide_path_report_optional');
  if (ideEvidence) {
    const v = ideEvidence.vscode || {};
    const c = ideEvidence.cursor || {};
    if (!v.code_on_path && !v.detected && !v.code_exe_localappdata_exists && !v.code_exe_programfiles_exists) {
      issues.push({
        signal: 'YELLOW',
        code: 'vscode_path_weak',
        message: 'z_pc_ide_path: VS Code PATH/install evidence weak — prefer CLI repair before Explorer reliance',
      });
      overall = maxSignal(overall, 'YELLOW');
    }
    if (!c.cursor_on_path && !c.detected && !c.cursor_exe_localappdata_exists) {
      issues.push({
        signal: 'YELLOW',
        code: 'cursor_path_weak',
        message: 'z_pc_ide_path: Cursor PATH/install evidence weak',
      });
      overall = maxSignal(overall, 'YELLOW');
    }
    if (ideEvidence.archive_build_root_warning === true) overall = maxSignal(overall, 'YELLOW');
  } else overall = maxSignal(overall, 'YELLOW');

  const fusionEvidence = readJsonSafe(FUSION_REPORT, issues, 'fusion_report_optional');
  const fusion_escalates = fusionEvidence?.overall_signal ? String(fusionEvidence.overall_signal).toUpperCase() : null;
  const fusion_issues = fusionEvidence?.issues || [];
  if (fusion_issues.some((x) => String(x?.code || '') === 'high_risk_file_overlap')) overall = maxSignal(overall, 'BLUE');

  if (!fusion_escalates && fusion_issues.some((x) => String(x?.message || '').toLowerCase().includes('high'))) {
    overall = maxSignal(overall, 'YELLOW');
  } else if (fusion_escalates === 'BLUE') overall = maxSignal(overall, 'BLUE');
  else if (fusion_escalates === 'YELLOW') overall = maxSignal(overall, 'YELLOW');
  else if (fusion_escalates === 'RED') overall = maxSignal(overall, 'RED');

  for (const i of issues) {
    overall = maxSignal(overall, i.signal);
  }

  const cockpitSignal = overall;

  const payload = {
    schema: 'z_ssws_cockpit_report_v1',
    generated_at: generatedAt,
    overall_signal: cockpitSignal,
    phase: 'Z-SSWS-COCKPIT-1',
    cockpit_root: cockpitResolved,
    labs_root: labsResolved,
    labs_folder_present: !labs_missing,
    preferred_workflow_summary: reg.recommended_daily_posture || null,
    ide_path_mirror: ideEvidence
      ? {
          overall_signal: ideEvidence.overall_signal,
          code_on_path: ideEvidence.vscode?.code_on_path,
          cursor_on_path: ideEvidence.cursor?.cursor_on_path,
          archive_build_root_warning: ideEvidence.archive_build_root_warning,
        }
      : null,
    fusion_mirror: fusionEvidence
      ? {
          overall_signal: fusionEvidence.overall_signal,
          active_sessions_status: fusionEvidence.active_sessions_status,
          conflict_risk: fusionEvidence.conflict_risk,
          session_count: fusionEvidence.session_count,
        }
      : null,
    project_results: projectResults,
    opening_plan_preview: openingPlanPreview,
    storage_posture_notes: reg.storage_domains || [],
    locked_law: reg.locked_law || [],
    issues,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-SSWS-COCKPIT-1 report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${cockpitSignal}**`,
    `- Cockpit root: \`${cockpitResolved}\``,
    `- Labs present: **${!labs_missing}**`,
    '',
    '## Preferred workflow',
    '',
    '- One cockpit window (overview, gates, reports).',
    '- One deep-work window (single project/module).',
    '- Treat multi-root workspaces as visibility + PATH discipline — **not permission to execute every root.**',
    '',
    '## IDE path (mirror)',
    '',
    payload.ide_path_mirror ? `- Report: overall **${payload.ide_path_mirror.overall_signal}**, code PATH **${payload.ide_path_mirror.code_on_path}**, cursor PATH **${payload.ide_path_mirror.cursor_on_path}**` : '- (report missing)',
    '',
    '## Fusion (mirror)',
    '',
    payload.fusion_mirror
      ? `- Report: overall **${payload.fusion_mirror.overall_signal}**, sessions **${payload.fusion_mirror.session_count}**, conflict risk **${payload.fusion_mirror.conflict_risk}**`
      : '- (report missing)',
    '',
    '## Opening plan preview (dry-run text only)',
    '',
    ...(openingPlanPreview.length
      ? openingPlanPreview.map((o) => `- **${o.project_id}** — \`${o.suggested_cli}\``)
      : ['- (none)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.signal}] ${i.code}: ${i.message}`) : ['- (none)']),
    '',
    '## Locked law',
    '',
    ...(reg.locked_law || []).map((line) => `- ${line}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: cockpitSignal !== 'RED',
        overall_signal: cockpitSignal,
        out_json: OUT_JSON,
        out_md: OUT_MD,
      },
      null,
      2,
    ),
  );

  process.exit(cockpitSignal === 'RED' ? 1 : 0);
}

main();
