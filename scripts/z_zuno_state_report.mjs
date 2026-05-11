import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_MD = path.join(REPORTS_DIR, 'zuno_system_state_report.md');
const OUT_JSON = path.join(REPORTS_DIR, 'zuno_system_state_report.json');
const HISTORY_JSON = path.join(REPORTS_DIR, 'zuno_state_history.json');
const LEGACY_DAILY_JSON = path.join(REPORTS_DIR, 'z_zuno_daily_report.json');
const LEGACY_DAILY_MD = path.join(REPORTS_DIR, 'z_zuno_daily_report.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function pct(num, den) {
  if (!den) return 0;
  return Number(((num / den) * 100).toFixed(1));
}

function ymd(iso) {
  return String(iso).slice(0, 10);
}

function trendDelta(current, base) {
  if (base === null || base === undefined) return null;
  return Number((current - base).toFixed(1));
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Visibility-only: AAFRTC context + GitHub/Cloudflare comms manifest recency (no control). */
function readExternalObservers(reportsDir) {
  const aafrtcPath = path.join(reportsDir, 'z_aafrtc_context.json');
  const ghPath = path.join(reportsDir, 'z_github_ai_comms_manifest.json');
  const cfPath = path.join(reportsDir, 'z_cloudflare_ai_comms_manifest.json');
  const aafrtcCtx = readJson(aafrtcPath, null);
  const ghManifest = readJson(ghPath, null);
  const cfManifest = readJson(cfPath, null);

  let cloudflare_observer_state = 'unknown';
  if (cfManifest && typeof cfManifest.ok === 'boolean') {
    cloudflare_observer_state = cfManifest.ok ? 'synced' : 'drift';
  }

  return {
    aafrtc_context_generated_at: aafrtcCtx?.generated_at ?? null,
    github_comms_manifest_generated_at: ghManifest?.generated_at ?? null,
    github_comms_manifest_ok: typeof ghManifest?.ok === 'boolean' ? ghManifest.ok : null,
    cloudflare_comms_manifest_generated_at: cfManifest?.generated_at ?? null,
    cloudflare_comms_manifest_ok: typeof cfManifest?.ok === 'boolean' ? cfManifest.ok : null,
    cloudflare_observer_state,
    manifest_files_present: {
      aafrtc_context: fs.existsSync(aafrtcPath),
      github_comms_manifest: fs.existsSync(ghPath),
      cloudflare_comms_manifest: fs.existsSync(cfPath)
    },
    note: 'Observability only — run npm run comms:github-ai / comms:cloudflare-ai and node scripts/z_aafrtc_resolve.mjs to refresh timestamps.'
  };
}

/** Observability only: Z-FPSMC Phase 1 read-only storage map (no gating). */
function readFpsmcStorage(reportsDir) {
  const fpsPath = path.join(reportsDir, 'z_fpsmc_storage_map.json');
  const raw = readJson(fpsPath, null);
  if (!raw || typeof raw !== 'object') {
    return {
      present: false,
      safety: null,
      fixed_drives: null,
      known_roots: null,
      container_volumes: null,
      warnings: null,
      generated_at: null,
      note: 'Run npm run fpsmc:scan to generate data/reports/z_fpsmc_storage_map.json.'
    };
  }
  const drives = Array.isArray(raw.drives) ? raw.drives : [];
  const projectRoots = Array.isArray(raw.project_roots) ? raw.project_roots : [];
  const wrn = Array.isArray(raw.warnings) ? raw.warnings : [];
  const containers = Array.isArray(raw.containers) ? raw.containers : [];
  let containerVolumes = 0;
  for (const c of containers) {
    if ((c?.kind === 'docker' || c?.kind === 'podman') && c.result && c.result.exit_code === 0) {
      const lines = String(c.result.stdout || '')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);
      containerVolumes += Math.max(0, lines.length - 1);
    }
  }
  return {
    present: true,
    safety: raw.safety ?? null,
    fixed_drives: drives.length,
    known_roots: projectRoots.length,
    container_volumes: containerVolumes,
    warnings: wrn.length,
    generated_at: raw.generated_at ?? null,
    schema_version: raw.schema_version ?? null,
    note: 'Read-only map — not a storage vault; see docs/Z-FPSMC-FREE-POWERSHELL-MULTI-CONTAINERS.md.'
  };
}

/** Observability only: Z-VHealth Core read-only health intelligence (no gating). */
function readVhealthCore(reportsDir) {
  const vhPath = path.join(reportsDir, 'z_vhealth_core_report.json');
  const raw = readJson(vhPath, null);
  if (!raw || typeof raw !== 'object') {
    return {
      present: false,
      posture: null,
      health_score: null,
      future_risk: null,
      top_challenge: null,
      authority: null,
      generated_at: null,
      file: 'data/reports/z_vhealth_core_report.json',
      note: 'Run npm run vhealth:report to generate data/reports/z_vhealth_core_report.json.'
    };
  }
  const rec = raw.recommended_challenge;
  const title = rec && typeof rec.title === 'string' ? rec.title : null;
  return {
    present: true,
    posture: raw.posture ?? null,
    health_score: typeof raw.health_score === 'number' ? raw.health_score : null,
    future_risk: raw.future_risk ?? null,
    top_challenge: title,
    authority: raw.authority ?? 'advisory_only_no_auto_execution',
    generated_at: raw.generated_at ?? null,
    file: 'data/reports/z_vhealth_core_report.json',
    note: 'Advisory only — see docs/Z-VHEALTH-CORE.md. Does not auto-execute or override release gates.'
  };
}

/** Observability only: Z-VDK Phase 1 read-only security scan summary (no gating). */
function readVdkSecurity(reportsDir) {
  const vdkPath = path.join(reportsDir, 'z_vdk_scan_report.json');
  const raw = readJson(vdkPath, null);
  if (!raw || typeof raw !== 'object') {
    return {
      present: false,
      safety: null,
      findings_total: null,
      critical: null,
      high: null,
      medium: null,
      low: null,
      review_report: null,
      generated_at: null,
      file: 'data/reports/z_vdk_scan_report.json',
      note: 'Run npm run vdk:scan to generate data/reports/z_vdk_scan_report.json.'
    };
  }
  const sum = raw.summary && typeof raw.summary === 'object' ? raw.summary : {};
  let reviewReport = null;
  try {
    const files = fs.readdirSync(reportsDir);
    const reviews = files.filter((f) => /^z_vdk_findings_review_\d{4}-\d{2}-\d{2}\.md$/.test(f));
    if (reviews.length) {
      reviews.sort();
      reviewReport = `data/reports/${reviews[reviews.length - 1]}`;
    }
  } catch {
    /* ignore */
  }
  return {
    present: true,
    safety: raw.safety ?? null,
    findings_total: typeof sum.findings_total === 'number' ? sum.findings_total : null,
    critical: typeof sum.critical === 'number' ? sum.critical : null,
    high: typeof sum.high === 'number' ? sum.high : null,
    medium: typeof sum.medium === 'number' ? sum.medium : null,
    low: typeof sum.low === 'number' ? sum.low : null,
    review_report: reviewReport,
    generated_at: raw.generated_at ?? null,
    file: 'data/reports/z_vdk_scan_report.json',
    note: 'Read-only scan — no auto quarantine. See docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md.'
  };
}

/** Non-blocking hint: are observer timestamps recent? Does not fail or gate releases. */
function computeExternalObserversHealth(observers, nowIso, staleThresholdHours) {
  const thresholdMs = staleThresholdHours * 3600 * 1000;
  const now = new Date(nowIso).getTime();
  const present = observers.manifest_files_present;
  const allFiles =
    present?.aafrtc_context && present?.github_comms_manifest && present?.cloudflare_comms_manifest;

  const stamps = [
    observers.aafrtc_context_generated_at,
    observers.github_comms_manifest_generated_at,
    observers.cloudflare_comms_manifest_generated_at
  ];
  const parsed = stamps.map((s) => (s ? new Date(s).getTime() : NaN));
  const valid = parsed.every((t) => !Number.isNaN(t));

  if (!allFiles) {
    return {
      status: 'partial',
      stale_threshold_hours: staleThresholdHours,
      max_age_hours: null,
      note: 'One or more observer files missing — run npm run zuno:external-observers-refresh from hub root.'
    };
  }
  if (!valid) {
    return {
      status: 'unknown',
      stale_threshold_hours: staleThresholdHours,
      max_age_hours: null,
      note: 'Could not parse all generated_at timestamps.'
    };
  }

  const oldest = Math.min(...parsed);
  const maxAgeMs = now - oldest;
  const maxAgeHours = Number((maxAgeMs / 3600000).toFixed(2));
  const anyStale = parsed.some((t) => now - t > thresholdMs);

  if (anyStale) {
    return {
      status: 'stale',
      stale_threshold_hours: staleThresholdHours,
      max_age_hours: maxAgeHours,
      note: 'At least one observer timestamp exceeds threshold — refresh comms + AAFRTC context, then re-run Zuno report.'
    };
  }
  return {
    status: 'fresh',
    stale_threshold_hours: staleThresholdHours,
    max_age_hours: maxAgeHours,
    note: 'All three observer files present and within freshness window.'
  };
}

const generatedAt = new Date().toISOString();
const today = ymd(generatedAt);

const hygiene = readJson(path.join(REPORTS_DIR, 'z_hygiene_status.json'), {});
const readiness = readJson(path.join(REPORTS_DIR, 'z_octave_readiness.json'), {});
const pending = readJson(path.join(REPORTS_DIR, 'z_pending_audit.json'), {});
const ai = readJson(path.join(REPORTS_DIR, 'z_ai_status.json'), {});
const autorun = readJson(path.join(REPORTS_DIR, 'z_autorun_audit.json'), {});
const otelShadow = readJson(path.join(REPORTS_DIR, 'z_otel_shadow_status.json'), {});
const policyShadow = readJson(path.join(REPORTS_DIR, 'z_policy_shadow_gate.json'), {});
const troublemaker = readJson(path.join(REPORTS_DIR, 'z_troublemaker_scan.json'), {});
const dataLeakAudit = readJson(path.join(REPORTS_DIR, 'z_data_leak_audit.json'), {});
const extensionGuard = readJson(path.join(REPORTS_DIR, 'z_extension_guard.json'), {});
const moduleRegistry = readJson(path.join(ROOT, 'data', 'Z_module_registry.json'), {});
const priorityQueue = readJson(path.join(ROOT, 'data', 'z_priority_queue.json'), {});
const bridgeReadiness = readJson(path.join(REPORTS_DIR, 'z_readiness_gate.json'), {});
const zciIntel = readJson(path.join(REPORTS_DIR, 'z_ci_intelligence.json'), null);
const zci = zciIntel?.summary ?? null;

const garagePlan = readJson(path.join(REPORTS_DIR, 'z_garage_upgrade_plan.json'), null);
const qaRpRegistry = readJson(path.join(ROOT, 'data', 'z_qa_rp_registry.json'), null);
const baseForUrls = (process.env.Z_MDGEV_BASE || '').replace(/\/+$/, '');
const qaRpDashboardUi = qaRpRegistry?.dashboard_ui ?? null;
const qa_rp = qaRpRegistry
  ? {
      registry_present: true,
      registry_file: 'data/z_qa_rp_registry.json',
      id: qaRpRegistry.id ?? null,
      title: qaRpRegistry.title ?? null,
      dashboard_ui: qaRpDashboardUi,
      dashboard_url_resolved:
        baseForUrls && qaRpDashboardUi ? `${baseForUrls}${qaRpDashboardUi}` : null,
      drp_gates_count: typeof qaRpRegistry.drp?.gates_count === 'number' ? qaRpRegistry.drp.gates_count : null,
    }
  : {
      registry_present: false,
      registry_file: 'data/z_qa_rp_registry.json',
      note: 'Registry file missing — optional; see docs/Z-QA-RP-ECOSYSTEM-SPEC.md',
    };

const aiEcosphereLedger = readJson(path.join(REPORTS_DIR, 'z_ai_ecosphere_ledger.json'), null);
const ai_ecosphere = aiEcosphereLedger
  ? {
      ledger_present: true,
      ledger_file: 'data/reports/z_ai_ecosphere_ledger.json',
      generated_at: aiEcosphereLedger.generated_at ?? null,
      overall_sync_score: aiEcosphereLedger.overall?.sync_score ?? null,
      overall_band: aiEcosphereLedger.overall?.band ?? null,
      rings_count: Array.isArray(aiEcosphereLedger.rings) ? aiEcosphereLedger.rings.length : 0,
      task_log_entries: aiEcosphereLedger.task_accomplishments?.total_entries ?? null,
    }
  : {
      ledger_present: false,
      ledger_file: 'data/reports/z_ai_ecosphere_ledger.json',
      note: 'Run npm run ai:ecosphere:ledger after SSWS / guardian / AI status refresh.',
    };

const signalHealthRaw = readJson(path.join(REPORTS_DIR, 'z_ai_signal_health.json'), null);
const signal_health = signalHealthRaw
  ? {
      present: true,
      status: signalHealthRaw.signal_health ?? 'unknown',
      total_entries: Number(signalHealthRaw.total_entries ?? 0),
      creator_entries: Number(signalHealthRaw.creator_entries ?? 0),
      business_entries: Number(signalHealthRaw.business_entries ?? 0),
      last_entry_at: signalHealthRaw.last_entry_at ?? null,
      trend: signalHealthRaw.trend ?? 'unknown',
      window_days: Number(signalHealthRaw.window_days ?? 7),
      note: signalHealthRaw.note ?? null,
      file: 'data/reports/z_ai_signal_health.json',
    }
  : {
      present: false,
      file: 'data/reports/z_ai_signal_health.json',
      note: 'Run npm run ai:signal:health to generate activity pulse.',
    };

const systemHealthRaw = readJson(path.join(REPORTS_DIR, 'z_system_health.json'), null);
const system_health = systemHealthRaw
  ? {
      present: true,
      health_score: Number(systemHealthRaw.health_score ?? 0),
      status: systemHealthRaw.status ?? 'unknown',
      pressure: systemHealthRaw.pressure ?? 'unknown',
      modules_total: Number(systemHealthRaw.modules_total ?? 0),
      healthy_modules: Number(systemHealthRaw.healthy_modules ?? 0),
      warning_modules: Number(systemHealthRaw.warning_modules ?? 0),
      critical_modules: Number(systemHealthRaw.critical_modules ?? 0),
      note: systemHealthRaw.note ?? null,
      file: 'data/reports/z_system_health.json',
    }
  : {
      present: false,
      file: 'data/reports/z_system_health.json',
      note: 'Run npm run ai:system:health after ZCI + garage planner.',
    };

const communicationHealthRaw = readJson(path.join(REPORTS_DIR, 'z_communication_health.json'), null);
const communication_health = communicationHealthRaw
  ? {
      present: true,
      health_score: Number(communicationHealthRaw.health_score ?? 0),
      flow_status: communicationHealthRaw.flow_status ?? 'unknown',
      status: communicationHealthRaw.status ?? 'unknown',
      observer_alignment: communicationHealthRaw.observer_alignment ?? 'unknown',
      issues_count: Array.isArray(communicationHealthRaw.issues)
        ? communicationHealthRaw.issues.length
        : 0,
      observer_freshness: communicationHealthRaw.observer_freshness?.status ?? 'unknown',
      manifest_alignment: communicationHealthRaw.manifests?.alignment ?? 'unknown',
      commflow_posture: communicationHealthRaw.commflow?.posture ?? 'unknown',
      note: communicationHealthRaw.note ?? null,
      file: 'data/reports/z_communication_health.json',
    }
  : {
      present: false,
      file: 'data/reports/z_communication_health.json',
      note: 'Run npm run ai:communication:health after comms manifests and commflow verifier exist.',
    };

const vaultSpineRaw = readJson(path.join(REPORTS_DIR, 'z_vault_spine_manifest.json'), null);
const vault_spine = vaultSpineRaw
  ? {
      present: true,
      status: vaultSpineRaw.status ?? 'unknown',
      spine_files: Number(vaultSpineRaw.totals?.spine_files ?? 0),
      links_checked: Number(vaultSpineRaw.totals?.links_checked ?? 0),
      broken: Number(vaultSpineRaw.totals?.broken ?? 0),
      file: 'data/reports/z_vault_spine_manifest.json',
      index: 'docs/z-vault/INDEX.md',
    }
  : {
      present: false,
      file: 'data/reports/z_vault_spine_manifest.json',
      index: 'docs/z-vault/INDEX.md',
      note: 'Run npm run vault:spine:verify (or full garage scan) after editing docs/z-vault.',
    };

const coherenceRaw = readJson(path.join(REPORTS_DIR, 'z_system_coherence.json'), null);
const system_coherence = coherenceRaw
  ? {
      present: true,
      coherence_score: Number(coherenceRaw.coherence_score ?? 0),
      status: coherenceRaw.status ?? 'unknown',
      confidence: coherenceRaw.confidence ?? 'unknown',
      contradictions_count: Array.isArray(coherenceRaw.contradictions)
        ? coherenceRaw.contradictions.length
        : 0,
      note: coherenceRaw.note ?? null,
      file: 'data/reports/z_system_coherence.json',
    }
  : {
      present: false,
      file: 'data/reports/z_system_coherence.json',
      note: 'Run npm run ai:system:coherence after health + consistency reports exist.',
    };

const adaptiveRaw = readJson(path.join(REPORTS_DIR, 'z_adaptive_coherence.json'), null);
const adaptive_coherence = adaptiveRaw
  ? {
      present: true,
      top_action: adaptiveRaw.summary?.top_action ?? null,
      prediction_risk: adaptiveRaw.prediction?.risk_level ?? 'unknown',
      prediction_next: adaptiveRaw.prediction?.next_state ?? 'unknown',
      root_causes_count: Array.isArray(adaptiveRaw.root_causes) ? adaptiveRaw.root_causes.length : 0,
      actions_count: Array.isArray(adaptiveRaw.recommended_actions)
        ? adaptiveRaw.recommended_actions.length
        : 0,
      file: 'data/reports/z_adaptive_coherence.json',
    }
  : {
      present: false,
      file: 'data/reports/z_adaptive_coherence.json',
      note: 'Run npm run ai:adaptive:coherence after ai:system:coherence.',
    };

const selfTuningRaw = readJson(path.join(REPORTS_DIR, 'z_self_tuning.json'), null);
const self_tuning = selfTuningRaw
  ? {
      present: true,
      learning_cycles: Number(selfTuningRaw.learning_cycles ?? 0),
      system_learning_state: selfTuningRaw.system_learning_state ?? 'unknown',
      confidence: selfTuningRaw.confidence ?? 'unknown',
      top_strategy: selfTuningRaw.top_strategies?.[0] ?? selfTuningRaw.best_strategy?.name ?? null,
      best_avg_impact: selfTuningRaw.best_strategy?.avg_impact ?? null,
      file: 'data/reports/z_self_tuning.json',
    }
  : {
      present: false,
      file: 'data/reports/z_self_tuning.json',
      note: 'Run npm run ai:self:tuning after adaptive coherence; append data/logs/z_ai_learning_log.jsonl to build cycles.',
    };

const experienceMemoryRaw = readJson(path.join(REPORTS_DIR, 'z_experience_memory.json'), null);
const experience_memory = experienceMemoryRaw
  ? {
      present: true,
      patterns_detected: Number(experienceMemoryRaw.patterns_detected ?? 0),
      cycles_detected: Number(experienceMemoryRaw.cycles_detected ?? 0),
      confidence: experienceMemoryRaw.confidence ?? 'low',
      top_insight: Array.isArray(experienceMemoryRaw.insights) ? experienceMemoryRaw.insights[0] ?? null : null,
      file: 'data/reports/z_experience_memory.json',
    }
  : {
      present: false,
      file: 'data/reports/z_experience_memory.json',
      note: 'Run npm run ai:experience:memory after self-tuning (learning log drives patterns).',
    };

const experienceIntelligenceRaw = readJson(path.join(REPORTS_DIR, 'z_experience_intelligence.json'), null);
const experience_intelligence = experienceIntelligenceRaw
  ? {
      present: true,
      top_strategy: experienceIntelligenceRaw.strategic_guidance?.top_strategy ?? null,
      system_focus: experienceIntelligenceRaw.strategic_guidance?.system_focus ?? 'stabilization',
      avoid_pattern: experienceIntelligenceRaw.strategic_guidance?.avoid_pattern ?? null,
      confidence:
        experienceIntelligenceRaw.strategic_guidance?.confidence ??
        experienceIntelligenceRaw.data_volume?.confidence ??
        'low',
      file: 'data/reports/z_experience_intelligence.json',
    }
  : {
      present: false,
      file: 'data/reports/z_experience_intelligence.json',
      note: 'Run npm run ai:experience:intelligence after STIL + EML.',
    };

const fusionCouncilRaw = readJson(path.join(REPORTS_DIR, 'z_fusion_council.json'), null);
const fusion_council = fusionCouncilRaw
  ? {
      present: true,
      primary_focus: fusionCouncilRaw.primary_focus ?? null,
      consensus: Number(fusionCouncilRaw.consensus ?? 0),
      confidence: fusionCouncilRaw.confidence ?? 'low',
      conflicts: Array.isArray(fusionCouncilRaw.conflicts) ? fusionCouncilRaw.conflicts : [],
      final_recommendation: fusionCouncilRaw.final_recommendation ?? null,
      file: 'data/reports/z_fusion_council.json',
    }
  : {
      present: false,
      file: 'data/reports/z_fusion_council.json',
      note: 'Run npm run ai:fusion:council after experience intelligence.',
    };

const dsrRaw = readJson(path.join(REPORTS_DIR, 'z_dsr_analysis.json'), null);
const dsr = dsrRaw
  ? {
      present: true,
      status: dsrRaw.status ?? 'unknown',
      duplicates: Number(dsrRaw.summary?.duplicates ?? 0),
      similar: Number(dsrRaw.summary?.similar ?? 0),
      conflicts: Number(dsrRaw.summary?.conflicts ?? 0),
      excluded_entries: Number(dsrRaw.summary?.excluded_entries ?? dsrRaw.policy_hints?.excluded_entries ?? 0),
      file: 'data/reports/z_dsr_analysis.json',
      note: Array.isArray(dsrRaw.recommendations) ? dsrRaw.recommendations[0] ?? null : null,
    }
  : {
      present: false,
      file: 'data/reports/z_dsr_analysis.json',
      note: 'Run npm run ai:dsr:analyze to detect duplicate/similar/conflict signals.',
    };

const formulaSyncRaw = readJson(path.join(REPORTS_DIR, 'z_formula_sync_check.json'), null);
const formula_sync = formulaSyncRaw
  ? {
      present: true,
      status: formulaSyncRaw.summary?.status ?? 'unknown',
      confidence: formulaSyncRaw.summary?.confidence ?? 'low',
      checks_pass: Number(formulaSyncRaw.summary?.checks_pass ?? 0),
      checks_total: Number(formulaSyncRaw.summary?.checks_total ?? 0),
      guidance: formulaSyncRaw.top_guidance ?? null,
      file: 'data/reports/z_formula_sync_check.json',
    }
  : {
      present: false,
      file: 'data/reports/z_formula_sync_check.json',
      note: 'Run npm run ai:formula:sync to verify formula + spine + base architecture alignment.',
    };

let z_garage_note = null;
if (garagePlan?.pressure === 'high') {
  z_garage_note =
    'High upgrade pressure — system stability improvements recommended before expansion.';
}
const z_garage = garagePlan
  ? {
      pressure: garagePlan.pressure ?? 'low',
      critical_projects: Number(garagePlan.summary?.critical ?? 0),
      note: z_garage_note,
    }
  : null;

/** Z-Brother: one-surface “today” pulse for Zuno — hub system-status, freshness, guardian, garage. */
const systemHubStatus = readJson(path.join(ROOT, 'data', 'system-status.json'), null);
const guardianReportFull = readJson(path.join(REPORTS_DIR, 'z_guardian_report.json'), null);
const projectFreshnessSnap = readJson(path.join(REPORTS_DIR, 'z_project_freshness.json'), null);

function summarizeFreshnessForBrother(pf) {
  if (!pf || !Array.isArray(pf.projects)) {
    return { present: false, note: 'Run node scripts/z_project_freshness_refresh.mjs' };
  }
  const projs = pf.projects;
  const ok = projs.filter((p) => p.presence === 'ok').length;
  const missing = projs.filter((p) => p.presence === 'missing').length;
  return {
    present: true,
    generated_at: pf.generated_at ?? null,
    ok_count: ok,
    missing_count: missing,
    total: projs.length,
  };
}

const freshnessBrother = summarizeFreshnessForBrother(projectFreshnessSnap);

const z_brother_today = {
  generated_for: today,
  alignment: 'Clarity, compassion, one core — operator-sovereign (Z-Brother).',
  system_status_hub: systemHubStatus
    ? {
        verify: systemHubStatus.verify ?? null,
        status: systemHubStatus.status ?? null,
        last_check: systemHubStatus.last_check ?? null,
        last_check_iso: systemHubStatus.last_check_iso ?? null,
        projects: systemHubStatus.projects ?? null,
        source: systemHubStatus.source ?? null,
      }
    : { present: false, note: 'Run node scripts/z_system_status_refresh.mjs' },
  guardian_suggestions: Array.isArray(guardianReportFull?.suggestions) ? guardianReportFull.suggestions : [],
  project_freshness: freshnessBrother,
  garage: z_garage
    ? { pressure: z_garage.pressure, critical_projects: z_garage.critical_projects, note: z_garage.note }
    : null,
  refresh_hint: 'npm run zuno:z-brother-daily',
};

const trafficIntelligenceRaw = readJson(path.join(REPORTS_DIR, 'z_traffic_intelligence.json'), null);
const traffic_intelligence = trafficIntelligenceRaw
  ? {
      present: true,
      traffic_state: trafficIntelligenceRaw.traffic_state ?? 'unknown',
      bottleneck: trafficIntelligenceRaw.bottleneck ?? 'unknown',
      priority_lane: trafficIntelligenceRaw.priority_lane ?? 'unknown',
      reasons: Array.isArray(trafficIntelligenceRaw.reasons) ? trafficIntelligenceRaw.reasons : [],
      file: 'data/reports/z_traffic_intelligence.json',
    }
  : {
      present: false,
      file: 'data/reports/z_traffic_intelligence.json',
      note: 'Run npm run ai:traffic:intelligence (RTRO Lite) after health/signal/comm/coherence reports.',
    };

const fhmffRaw = readJson(path.join(REPORTS_DIR, 'z_fhmff_lite.json'), null);
const fhmff_lite = fhmffRaw
  ? {
      present: true,
      system_state: fhmffRaw.system_state ?? 'unknown',
      confidence: fhmffRaw.confidence ?? 'unknown',
      frozen_count: Array.isArray(fhmffRaw.frozen_zones) ? fhmffRaw.frozen_zones.length : 0,
      hibernate_count: Array.isArray(fhmffRaw.hibernate_candidates)
        ? fhmffRaw.hibernate_candidates.length
        : 0,
      advisory: fhmffRaw.advisory !== false,
      file: 'data/reports/z_fhmff_lite.json',
    }
  : {
      present: false,
      file: 'data/reports/z_fhmff_lite.json',
      note: 'Run npm run ai:fhmff:lite (advisory) after traffic + learning layers; pairs with RTRO (focus vs frozen zones).',
    };

const zecceRaw = readJson(path.join(REPORTS_DIR, 'z_zecce_confirmations.json'), null);
const z_zecce = zecceRaw
  ? {
      present: true,
      advisory: zecceRaw.advisory !== false,
      overall_posture: zecceRaw.overall_posture ?? 'unknown',
      pass_count: zecceRaw.pass_count ?? null,
      total_steps: zecceRaw.total_steps ?? null,
      generated_at: zecceRaw.generated_at ?? null,
      file: 'data/reports/z_zecce_confirmations.json',
    }
  : {
      present: false,
      file: 'data/reports/z_zecce_confirmations.json',
      note: 'Run npm run z:codex:zecce:verify (advisory v1 — no enforcer authority) for Codex receipt bundle.',
    };

const kbozsuRaw = readJson(path.join(REPORTS_DIR, 'z_kbozsu_codex.json'), null);
const kbozsu_ingest = kbozsuRaw
  ? {
      present: true,
      schema_version: kbozsuRaw.schema_version ?? null,
      phase: kbozsuRaw.phase ?? null,
      generated_at: kbozsuRaw.generated_at ?? null,
      entry_count: kbozsuRaw.summary?.entry_count ?? null,
      hashed_files: kbozsuRaw.summary?.hashed_files ?? null,
      workspace_lint_status: kbozsuRaw.summary?.workspace_lint_status ?? null,
      file: 'data/reports/z_kbozsu_codex.json',
    }
  : {
      present: false,
      file: 'data/reports/z_kbozsu_codex.json',
      note: 'Run npm run kbozsu:refresh (or kbozsu:refresh:with-lint) to emit codex; ingest is read-only here.',
    };

const botGuardianRaw = readJson(path.join(REPORTS_DIR, 'z_bot_guardian.json'), null);
const botSyncRaw = readJson(path.join(REPORTS_DIR, 'z_bot_sync.json'), null);
const botHealthRaw = readJson(path.join(REPORTS_DIR, 'z_bot_health.json'), null);
const botAlertsRaw = readJson(path.join(REPORTS_DIR, 'z_bot_alerts.json'), null);
const botDecisionsRaw = readJson(path.join(REPORTS_DIR, 'z_bot_decisions.json'), null);
const botPatternsRaw = readJson(path.join(REPORTS_DIR, 'z_bot_patterns.json'), null);
const botRootcauseRaw = readJson(path.join(REPORTS_DIR, 'z_bot_rootcause.json'), null);
const botPredictRaw = readJson(path.join(REPORTS_DIR, 'z_bot_predictions.json'), null);
const botAdaptiveRaw = readJson(path.join(REPORTS_DIR, 'z_bot_adaptive.json'), null);
const botExecutionPlansRaw = readJson(path.join(REPORTS_DIR, 'z_bot_execution_plans.json'), null);
const botExecutionResultRaw = readJson(path.join(REPORTS_DIR, 'z_bot_execution_result.json'), null);
const botStrategyRaw = readJson(path.join(REPORTS_DIR, 'z_bot_strategy.json'), null);
const qosmeiSignalRaw = readJson(path.join(REPORTS_DIR, 'z_qosmei_core_signal.json'), null);
const mini_bots = {
  guardian: botGuardianRaw
    ? {
        present: true,
        generated_at: botGuardianRaw.generated_at ?? null,
        missing: botGuardianRaw.summary?.missing ?? null,
        present_count: botGuardianRaw.summary?.present ?? null,
        highest_severity: botGuardianRaw.summary?.highest_severity ?? null,
        severity: botGuardianRaw.summary?.severity ?? null,
        file: 'data/reports/z_bot_guardian.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_guardian.json',
        note: 'Run npm run bot:guardian (PC registry vs disk, observe-only).',
      },
  sync: botSyncRaw
    ? {
        present: true,
        generated_at: botSyncRaw.generated_at ?? null,
        latest_snapshot_dir: botSyncRaw.latest_snapshot_dir ?? null,
        file: 'data/reports/z_bot_sync.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_sync.json',
        note: 'Run npm run bot:sync (registry JSON snapshot, not full tree).',
      },
  health: botHealthRaw
    ? {
        present: true,
        generated_at: botHealthRaw.generated_at ?? null,
        memory_used_pct: botHealthRaw.memory?.used_pct ?? null,
        platform: botHealthRaw.platform ?? null,
        file: 'data/reports/z_bot_health.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_health.json',
        note: 'Run npm run bot:health (local Node/OS metrics).',
      },
};

const bot_alerts = botAlertsRaw
  ? {
      present: true,
      generated_at: botAlertsRaw.generated_at ?? null,
      overall: botAlertsRaw.overall ?? null,
      total_alerts: typeof botAlertsRaw.total_alerts === 'number' ? botAlertsRaw.total_alerts : null,
      by_level: botAlertsRaw.by_level ?? null,
      file: 'data/reports/z_bot_alerts.json',
    }
  : {
      present: false,
      file: 'data/reports/z_bot_alerts.json',
      note: 'Run npm run bot:guardian && npm run bot:health, then npm run bot:alerts (Phase 1.5, notify-only).',
    };

const decisionList = Array.isArray(botDecisionsRaw?.decisions) ? botDecisionsRaw.decisions : [];
const decisionLifecycle = {
  pending: decisionList.filter((d) => String(d?.status) === 'pending').length,
  acknowledged: decisionList.filter((d) => String(d?.status) === 'acknowledged').length,
  resolved: decisionList.filter((d) => String(d?.status) === 'resolved').length,
  dismissed: decisionList.filter((d) => String(d?.status) === 'dismissed').length,
};

const bot_decisions = botDecisionsRaw
  ? {
      present: true,
      schema_version: typeof botDecisionsRaw.schema_version === 'number' ? botDecisionsRaw.schema_version : null,
      generated_at: botDecisionsRaw.generated_at ?? null,
      total_decisions:
        typeof botDecisionsRaw.total_decisions === 'number'
          ? botDecisionsRaw.total_decisions
          : Array.isArray(botDecisionsRaw.decisions)
            ? botDecisionsRaw.decisions.length
            : null,
      lifecycle: decisionLifecycle,
      file: 'data/reports/z_bot_decisions.json',
    }
  : {
      present: false,
      file: 'data/reports/z_bot_decisions.json',
      note: 'Run npm run bot:awareness (full chain includes rootcause → predict → adaptive), then refresh.',
    };

const patterns_high = Array.isArray(botPatternsRaw?.patterns)
  ? botPatternsRaw.patterns.filter((p) => p.pattern_severity === 'HIGH').length
  : 0;
const decision_patterns = botPatternsRaw
  ? {
      present: true,
      generated_at: botPatternsRaw.generated_at ?? null,
      total_patterns: botPatternsRaw.total_patterns ?? null,
      total_log_entries: botPatternsRaw.total_log_entries ?? null,
      high_severity_count: patterns_high,
      file: 'data/reports/z_bot_patterns.json',
    }
  : {
      present: false,
      file: 'data/reports/z_bot_patterns.json',
      note: 'Run npm run bot:pattern after decision history (Phase 3).',
    };

const decision_insight = {
  rootcause: botRootcauseRaw
    ? {
        present: true,
        generated_at: botRootcauseRaw.generated_at ?? null,
        results_count: Array.isArray(botRootcauseRaw.results) ? botRootcauseRaw.results.length : 0,
        file: 'data/reports/z_bot_rootcause.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_rootcause.json',
        note: 'Run npm run bot:rootcause after patterns (Phase 3.5).',
      },
  predict: botPredictRaw
    ? {
        present: true,
        generated_at: botPredictRaw.generated_at ?? null,
        predictions_count: Array.isArray(botPredictRaw.predictions) ? botPredictRaw.predictions.length : 0,
        file: 'data/reports/z_bot_predictions.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_predictions.json',
        note: 'Run npm run bot:predict after decisions (Phase 3.5).',
      },
  adaptive: botAdaptiveRaw
    ? {
        present: true,
        generated_at: botAdaptiveRaw.generated_at ?? null,
        ranked_count: Array.isArray(botAdaptiveRaw.ranked) ? botAdaptiveRaw.ranked.length : 0,
        file: 'data/reports/z_bot_adaptive.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_adaptive.json',
        note: 'Run npm run bot:adaptive after predictions (Phase 4).',
      },
  execution: botExecutionPlansRaw
    ? {
        present: true,
        plans_file: 'data/reports/z_bot_execution_plans.json',
        result_file: 'data/reports/z_bot_execution_result.json',
        log_file: 'data/logs/z_execution_history.jsonl',
        plans_count: Array.isArray(botExecutionPlansRaw.plans) ? botExecutionPlansRaw.plans.length : 0,
        last_result_at: botExecutionResultRaw?.generated_at ?? null,
      }
    : {
        present: false,
        plans_file: 'data/reports/z_bot_execution_plans.json',
        note: 'Run npm run bot:execution:plan after decisions (Phase 5, advisory).',
      },
  strategy: botStrategyRaw
    ? {
        present: true,
        generated_at: botStrategyRaw.generated_at ?? null,
        strategy_count: botStrategyRaw.strategy_count ?? (Array.isArray(botStrategyRaw.strategies) ? botStrategyRaw.strategies.length : 0),
        top_priority: botStrategyRaw.top_priority ?? null,
        file: 'data/reports/z_bot_strategy.json',
      }
    : {
        present: false,
        file: 'data/reports/z_bot_strategy.json',
        note: 'Run npm run bot:strategy after awareness chain (Phase 6, advisory).',
      },
};

const qosmei_core = qosmeiSignalRaw
  ? {
      present: true,
      generated_at: qosmeiSignalRaw.generated_at ?? null,
      posture: qosmeiSignalRaw.posture ?? 'unknown',
      lane_priority: qosmeiSignalRaw.lane_priority ?? 'unknown',
      confidence_band: qosmeiSignalRaw.confidence_band ?? 'unknown',
      advisory_only: qosmeiSignalRaw.advisory_only !== false,
      score: {
        composite: qosmeiSignalRaw?.score?.composite ?? null,
        impact: qosmeiSignalRaw?.score?.impact ?? null,
        urgency: qosmeiSignalRaw?.score?.urgency ?? null,
        confidence: qosmeiSignalRaw?.score?.confidence ?? null,
        risk: qosmeiSignalRaw?.score?.risk ?? null,
        structural_patterns_score: qosmeiSignalRaw?.score?.structural_patterns_score ?? null,
        evolution_phase: qosmeiSignalRaw?.score?.evolution_phase ?? null,
      },
      recommendation: qosmeiSignalRaw.recommendation ?? null,
      file: 'data/reports/z_qosmei_core_signal.json',
    }
  : {
      present: false,
      file: 'data/reports/z_qosmei_core_signal.json',
      note: 'Run npm run qosmei:signal (or whale-bus surface_reinforce deck) to emit QOSMEI fusion signal.',
    };

const structuralPatternsRaw = readJson(path.join(REPORTS_DIR, 'z_structural_patterns.json'), null);
const crossSystemRaw = readJson(path.join(REPORTS_DIR, 'z_cross_system_learning.json'), null);
const cross_system = crossSystemRaw?.schema_version
  ? {
      present: true,
      generated_at: crossSystemRaw.generated_at ?? null,
      status: crossSystemRaw.alignment?.status ?? null,
      confidence: crossSystemRaw.alignment?.confidence ?? null,
      conflicts_n: Array.isArray(crossSystemRaw.conflicts) ? crossSystemRaw.conflicts.length : 0,
      file: 'data/reports/z_cross_system_learning.json',
    }
  : {
      present: false,
      file: 'data/reports/z_cross_system_learning.json',
      note: 'Run npm run cross:system after qosmei:signal (Whale Bus surface_reinforce includes it). Advisory-only alignment.',
    };
const predictiveIntelligenceRaw = readJson(path.join(REPORTS_DIR, 'z_predictive_intelligence.json'), null);
const predictiveIntelligenceCycles = Number(predictiveIntelligenceRaw?.learning_cycles);
const predictive_intelligence = predictiveIntelligenceRaw?.schema_version
  ? {
      present: true,
      generated_at: predictiveIntelligenceRaw.generated_at ?? null,
      predictions_n: Array.isArray(predictiveIntelligenceRaw.predictions)
        ? predictiveIntelligenceRaw.predictions.length
        : Number(predictiveIntelligenceRaw?.summary?.predictions_n ?? 0),
      highest_confidence: Number.isFinite(Number(predictiveIntelligenceRaw?.summary?.highest_confidence))
        ? Number(predictiveIntelligenceRaw.summary.highest_confidence)
        : 0,
      dominant_signal: predictiveIntelligenceRaw?.summary?.dominant_signal ?? null,
      confidence_cap_active:
        Number.isFinite(predictiveIntelligenceCycles) && predictiveIntelligenceCycles < 20,
      file: 'data/reports/z_predictive_intelligence.json',
    }
  : {
      present: false,
      file: 'data/reports/z_predictive_intelligence.json',
      note: 'Run npm run predictive:intel after cross:system; Whale Bus runs a second qosmei:signal so fusion can apply Phase 5 nudges.',
    };
const predictionValRaw = readJson(path.join(REPORTS_DIR, 'z_prediction_validation.json'), null);
const predValAcc = num(predictionValRaw?.validation_summary?.accuracy, NaN);
const predValN = num(predictionValRaw?.validation_summary?.validated, 0);
const prediction_validation = predictionValRaw?.schema_version
  ? {
      present: true,
      generated_at: predictionValRaw.generated_at ?? null,
      accuracy: Number.isFinite(predValAcc) ? predValAcc : 0,
      trend: predictionValRaw.trend ?? 'unknown',
      confidence_alignment: predictionValRaw.confidence_alignment ?? 'unknown',
      validated_n: predValN,
      file: 'data/reports/z_prediction_validation.json',
    }
  : {
      present: false,
      file: 'data/reports/z_prediction_validation.json',
      note: 'Run node scripts/z_prediction_validator.mjs after each predictive:intel to score predictions against logs (Phase 5.5).',
    };
const adaptiveLearningRaw = readJson(path.join(REPORTS_DIR, 'z_adaptive_learning_state.json'), null);
const adaptive_learning = adaptiveLearningRaw?.schema_version
  ? {
      present: true,
      learning_cycles: adaptiveLearningRaw.learning_cycles ?? 0,
      last_updated: adaptiveLearningRaw.last_updated ?? null,
      weights: adaptiveLearningRaw.weights ?? null,
      file: 'data/reports/z_adaptive_learning_state.json',
    }
  : {
      present: false,
      file: 'data/reports/z_adaptive_learning_state.json',
      note: 'Optional Phase 3: run npm run learning:eval and npm run learning:tune (after SPI decision friction). Remove file to reset weights.',
    };
const structural_intelligence = structuralPatternsRaw?.schema_version
  ? {
      present: true,
      generated_at: structuralPatternsRaw.generated_at ?? null,
      phase: structuralPatternsRaw.system_phase ?? null,
      evolution_phase: structuralPatternsRaw.evolution_phase ?? null,
      risk: structuralPatternsRaw.risk_band ?? null,
      score: structuralPatternsRaw.structural_patterns_score ?? null,
      note: structuralPatternsRaw.top_note ?? null,
      patterns_n: Array.isArray(structuralPatternsRaw.structural_patterns)
        ? structuralPatternsRaw.structural_patterns.length
        : 0,
      suggestions_n: Array.isArray(structuralPatternsRaw.decision_suggestions)
        ? structuralPatternsRaw.decision_suggestions.length
        : 0,
      file: 'data/reports/z_structural_patterns.json',
    }
  : {
      present: false,
      file: 'data/reports/z_structural_patterns.json',
      note: 'Run npm run spi:analyze (ideally after pc-root:catalog:diff when exercising drift), npm run spi:advice, then npm run qosmei:signal.',
    };

const modules = Array.isArray(moduleRegistry?.ZModules) ? moduleRegistry.ZModules : [];
const moduleDone = modules.filter((m) =>
  ['ready', 'imported', 'active'].includes(String(m?.ZStatus || '').toLowerCase())
).length;
const modulePct = pct(moduleDone, modules.length);

const tasks = Array.isArray(priorityQueue?.ZItems) ? priorityQueue.ZItems : [];
const taskOpen = tasks.filter((t) => String(t?.ZStatus || '').toLowerCase() === 'open').length;
const taskP1Open = tasks.filter(
  (t) => String(t?.ZStatus || '').toLowerCase() === 'open' && String(t?.ZPriority || '') === 'P1'
).length;
const taskCompletionPct = pct(tasks.length - taskOpen, tasks.length);

const readyGates = Array.isArray(readiness?.gates) ? readiness.gates : [];
const octaveGatesPass = readyGates.filter((g) => Boolean(g?.pass)).length;
const bridgeReadinessAllPass =
  bridgeReadiness?.summary?.status === 'PASS' &&
  Number(bridgeReadiness?.summary?.gates_pass) === 4 &&
  Number(bridgeReadiness?.summary?.gates_total || 0) === 4;
const readinessGatesTotal = Math.max(readyGates.length, 4);
const gatesPassing = bridgeReadinessAllPass ? Math.min(4, readinessGatesTotal) : octaveGatesPass;
const otelChecks = Array.isArray(otelShadow?.checks) ? otelShadow.checks : [];
const otelChecksPass = otelChecks.filter((c) => Boolean(c?.pass)).length;
const policyChecks = Array.isArray(policyShadow?.checks) ? policyShadow.checks : [];
const policyChecksPass = policyChecks.filter((c) => Boolean(c?.pass)).length;

const snapshot = {
  date: today,
  generated_at: generatedAt,
  status: String(hygiene?.status || '').toLowerCase() === 'green' ? 'GREEN' : 'HOLD',
  metrics: {
    module_total: modules.length,
    module_done: moduleDone,
    module_completion_pct: modulePct,
    task_total: tasks.length,
    task_open: taskOpen,
    task_p1_open: taskP1Open,
    task_completion_pct: taskCompletionPct,
    pending_total: Number(pending?.total || 0),
    hygiene_green: String(hygiene?.status || '').toLowerCase() === 'green',
    readiness_ready: Boolean(readiness?.ready) || bridgeReadinessAllPass,
    readiness_gates_total: readinessGatesTotal,
    readiness_gates_pass: gatesPassing,
    ai_agents: Number(ai?.ai_tower?.agent_count || 0),
    auto_tasks: Array.isArray(autorun?.auto_tasks) ? autorun.auto_tasks.length : 0,
    otel_shadow_status: String(otelShadow?.status || 'unknown'),
    otel_shadow_checks_total: otelChecks.length,
    otel_shadow_checks_pass: otelChecksPass,
    policy_shadow_status: String(policyShadow?.status || 'unknown'),
    policy_shadow_checks_total: policyChecks.length,
    policy_shadow_checks_pass: policyChecksPass,
    troublemaker_status: String(troublemaker?.status || 'unknown'),
    troublemaker_risk_class: String(troublemaker?.risk_class || 'unknown'),
    troublemaker_disturbance_score:
      typeof troublemaker?.disturbance_score === 'number' ? troublemaker.disturbance_score : null,
    troublemaker_failed_checks: Array.isArray(troublemaker?.failed_ids)
      ? troublemaker.failed_ids.length
      : 0,
    data_leak_status: String(dataLeakAudit?.status || 'unknown'),
    data_leak_findings: Number(dataLeakAudit?.findings_count || 0),
    extension_guard_status: String(extensionGuard?.status || 'unknown'),
    extension_guard_failed:
      Array.isArray(extensionGuard?.checks)
        ? extensionGuard.checks.filter((c) => !c.pass).length
        : 0,
  },
};

const historyRaw = readJson(HISTORY_JSON, []);
const history = Array.isArray(historyRaw) ? historyRaw : [];
const withoutToday = history.filter((x) => x?.date !== today);
const nextHistory = [...withoutToday, snapshot]
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  .slice(-90);
writeJson(HISTORY_JSON, nextHistory);

const last7 = nextHistory.slice(-7);
const oldestIn7 = last7[0] || null;
const newestIn7 = last7[last7.length - 1] || snapshot;
const greenDays = last7.filter((x) => x?.metrics?.hygiene_green).length;

const trend = {
  window_days: last7.length,
  module_completion_delta_pct: trendDelta(
    newestIn7.metrics.module_completion_pct,
    oldestIn7?.metrics?.module_completion_pct ?? null
  ),
  task_open_delta: trendDelta(newestIn7.metrics.task_open, oldestIn7?.metrics?.task_open ?? null),
  pending_delta: trendDelta(
    newestIn7.metrics.pending_total,
    oldestIn7?.metrics?.pending_total ?? null
  ),
  hygiene_green_days: greenDays,
  readiness_delta: trendDelta(
    newestIn7.metrics.readiness_gates_pass,
    oldestIn7?.metrics?.readiness_gates_pass ?? null
  ),
};

const externalObservers = readExternalObservers(REPORTS_DIR);
const fpsmcStorage = readFpsmcStorage(REPORTS_DIR);
const vdkSecurity = readVdkSecurity(REPORTS_DIR);
const vhealthCore = readVhealthCore(REPORTS_DIR);
const staleHours = Number(process.env.ZUNO_OBSERVER_STALE_HOURS || 24);
const externalObserversHealth = computeExternalObserversHealth(
  externalObservers,
  generatedAt,
  Number.isFinite(staleHours) && staleHours > 0 ? staleHours : 24
);

const reportJson = {
  generated_at: generatedAt,
  z_brother_today,
  zci,
  z_garage,
  qa_rp,
  ai_ecosphere,
  signal_health,
  system_health,
  communication_health,
  vault_spine,
  system_coherence,
  adaptive_coherence,
  self_tuning,
  experience_memory,
  experience_intelligence,
  fusion_council,
  dsr,
  formula_sync,
  traffic_intelligence,
  fhmff_lite,
  z_zecce,
  kbozsu_ingest,
  mini_bots,
  bot_alerts,
  bot_decisions,
  decision_patterns,
  decision_insight,
  qosmei_core,
  structural_intelligence,
  adaptive_learning,
  cross_system,
  predictive_intelligence,
  prediction_validation,
  external_observers: externalObservers,
  external_observers_health: externalObserversHealth,
  fpsmc_storage: fpsmcStorage,
  vdk_security: vdkSecurity,
  vhealth_core: vhealthCore,
  executive_status: {
    internal_operations: snapshot.status === 'GREEN' ? 'stable-green' : 'hold',
    public_launch: snapshot.metrics.readiness_ready ? 'ready' : 'not-ready',
    automation: snapshot.metrics.auto_tasks > 0 ? 'enabled' : 'limited',
    shadow_foundation:
      snapshot.metrics.otel_shadow_status === 'ready' &&
      snapshot.metrics.policy_shadow_status === 'ready'
        ? 'ready'
        : 'attention',
    extension_guard:
      snapshot.metrics.extension_guard_status === 'green'
        ? 'aligned'
        : snapshot.metrics.extension_guard_status === 'hold'
          ? 'attention'
          : 'unknown',
    data_leak_watch:
      snapshot.metrics.data_leak_status === 'green'
        ? 'clear'
        : snapshot.metrics.data_leak_status === 'hold'
          ? 'watch'
          : 'unknown',
    disturbance_watch:
      snapshot.metrics.troublemaker_status === 'green'
        ? 'clear'
        : snapshot.metrics.troublemaker_status === 'watch'
          ? 'watch'
          : 'alert',
  },
  current: snapshot,
  trend_7d: trend,
  notes: [
    'Readiness remains gated until governance and pilot evidence pass.',
    'AI agents remain observational unless explicitly promoted.',
  ],
};

const md = [
  '# Zuno AI System State Report',
  '',
  `Generated: ${generatedAt}`,
  '',
  '## Executive Status',
  `- Internal operations: **${reportJson.executive_status.internal_operations}**`,
  `- Public launch: **${reportJson.executive_status.public_launch}**`,
  `- Automation: **${reportJson.executive_status.automation}**`,
  `- Shadow foundation: **${reportJson.executive_status.shadow_foundation}**`,
  `- Extension guard: **${reportJson.executive_status.extension_guard}**`,
  `- Data leak watch: **${reportJson.executive_status.data_leak_watch}**`,
  `- Disturbance watch: **${reportJson.executive_status.disturbance_watch}**`,
  '',
  '## Z-Brother — Today (upgrades & full system pulse)',
  `_${z_brother_today.alignment}_`,
  ...(systemHubStatus
    ? [
        `- **Hub system-status:** verify **${z_brother_today.system_status_hub.verify}** · status **${z_brother_today.system_status_hub.status}** · last check **${z_brother_today.system_status_hub.last_check ?? 'n/a'}** · projects in view: **${z_brother_today.system_status_hub.projects ?? 'n/a'}**`,
      ]
    : [
        `- **Hub system-status:** missing \`data/system-status.json\` — ${z_brother_today.system_status_hub.note}`,
      ]),
  ...(freshnessBrother.present
    ? [
        `- **PC-root freshness:** **${freshnessBrother.ok_count}/${freshnessBrother.total}** on disk ok · missing **${freshnessBrother.missing_count}** · registry snapshot **${freshnessBrother.generated_at ?? 'n/a'}**`,
      ]
    : [`- **PC-root freshness:** ${freshnessBrother.note}`]),
  ...(z_garage
    ? [
        `- **Z-Garage (upgrade pressure):** **${z_garage.pressure}** · critical projects: **${z_garage.critical_projects}**${z_garage.note ? ` — ${z_garage.note}` : ''}`,
      ]
    : ['- **Z-Garage:** no `z_garage_upgrade_plan.json` summary — run garage scanner + planner']),
  ...(z_brother_today.guardian_suggestions.length
    ? z_brother_today.guardian_suggestions.map((s) => `- **Guardian:** ${s}`)
    : ['- **Guardian:** *(no suggestions in report — run `node scripts/z_guardian_report.mjs`)*']),
  '- **Structural health & ecosphere:** see *Z-System — Structural Health*, *Z-Communication*, and *Z AI Ecosphere* below.',
  `- **Re-run this pulse:** \`${z_brother_today.refresh_hint}\``,
  '',
  '## Z-Q&A&RP (pathways / DRP — registry echo)',
  ...(qa_rp.registry_present
    ? [
        `- Title: **${qa_rp.title ?? 'n/a'}** · id=\`${qa_rp.id ?? 'n/a'}\``,
        `- Dashboard UI (from registry): **\`${qa_rp.dashboard_ui ?? 'n/a'}\`**`,
        qa_rp.dashboard_url_resolved
          ? `- Resolved URL (Z_MDGEV_BASE set): **${qa_rp.dashboard_url_resolved}**`
          : '- Resolved URL: *set `Z_MDGEV_BASE` when generating to echo full URL*',
        `- DRP gates (count): **${qa_rp.drp_gates_count ?? 'n/a'}**`,
        `- Registry: \`${qa_rp.registry_file}\` · open helper: \`npm run dashboard:qa-rp-open\``,
      ]
    : [
        `- Registry: **missing** — expected at \`${qa_rp.registry_file}\``,
        `- ${qa_rp.note ?? 'n/a'}`,
      ]),
  '',
  '## Z AI Ecosphere (SSWS · formulas · tower · shadows)',
  ...(ai_ecosphere.ledger_present
    ? [
        `- Ledger: **${ai_ecosphere.overall_sync_score ?? 'n/a'}%** overall · band **${ai_ecosphere.overall_band ?? 'n/a'}**`,
        `- Rings: **${ai_ecosphere.rings_count}** · task log entries: **${ai_ecosphere.task_log_entries ?? 'n/a'}**`,
        `- File: \`${ai_ecosphere.ledger_file}\` · refresh: \`npm run ai:ecosphere:ledger\``,
      ]
    : [`- ${ai_ecosphere.note ?? 'n/a'}`, `- Expected: \`${ai_ecosphere.ledger_file}\``]),
  '',
  '## Z-Signal — Activity Pulse',
  ...(signal_health.present
    ? [
        `- Signal: **${String(signal_health.status).toUpperCase()}** · trend: **${signal_health.trend}**`,
        `- Entries (${signal_health.window_days}d): **${signal_health.total_entries}** (creator ${signal_health.creator_entries}, business ${signal_health.business_entries})`,
        `- Last log entry (any time): **${signal_health.last_entry_at ?? 'none'}**`,
        `- ${signal_health.note ?? 'n/a'}`,
      ]
    : [`- ${signal_health.note ?? 'n/a'}`, `- Expected: \`${signal_health.file}\``]),
  '',
  '## Z-System — Traffic Intelligence (RTRO Lite)',
  ...(traffic_intelligence.present
    ? [
        `- Traffic state: **${traffic_intelligence.traffic_state}** · bottleneck: **${traffic_intelligence.bottleneck}** · priority lane: **${traffic_intelligence.priority_lane}**`,
        ...traffic_intelligence.reasons.map((r) => `- ${r}`),
        `- File: \`${traffic_intelligence.file}\` · refresh: \`npm run ai:traffic:intelligence\``,
      ]
    : [`- ${traffic_intelligence.note ?? 'n/a'}`, `- Expected: \`${traffic_intelligence.file}\``]),
  '',
  '## Z-FHMFF Lite — frozen / hibernate (advisory, observer-only)',
  ...(fhmff_lite.present
    ? [
        `- System state: **${fhmff_lite.system_state}** · confidence: **${fhmff_lite.confidence}** · frozen/cold: **${fhmff_lite.frozen_count}** · hibernate candidates: **${fhmff_lite.hibernate_count}**`,
        '- Pairs with RTRO: *where to focus* vs *what is stale or inactive*. No auto-fix.',
        `- File: \`${fhmff_lite.file}\` · refresh: \`npm run ai:fhmff:lite\` (e.g. after \`z:garage:full-scan\` segment that includes it)`,
      ]
    : [`- ${fhmff_lite.note ?? 'n/a'}`, `- Expected: \`${fhmff_lite.file}\``]),
  '',
  '## Z-ZECCE — Codex confirmations (advisory v1)',
  ...(z_zecce.present
    ? [
        `- Posture: **${z_zecce.overall_posture}** · steps: **${z_zecce.pass_count}/${z_zecce.total_steps}** · generated: **${z_zecce.generated_at ?? 'n/a'}**`,
        '- Advisory only — no release or enforcer authority.',
        `- File: \`${z_zecce.file}\` · refresh: \`npm run z:codex:zecce:verify\``,
      ]
    : [`- ${z_zecce.note ?? 'n/a'}`, `- Expected: \`${z_zecce.file}\``]),
  '',
  '## Z-KBOZSU (codex — read-only ingest)',
  ...(kbozsu_ingest.present
    ? [
        `- Schema: **v${kbozsu_ingest.schema_version}** · phase: **${kbozsu_ingest.phase}** · generated: **${kbozsu_ingest.generated_at ?? 'n/a'}**`,
        `- Index entries: **${kbozsu_ingest.entry_count}** · core manifest hashes: **${kbozsu_ingest.hashed_files}** · workspace lint: **${kbozsu_ingest.workspace_lint_status}**`,
        `- File: \`${kbozsu_ingest.file}\` · refresh: \`npm run kbozsu:refresh\` or \`npm run kbozsu:refresh:with-lint\` · ecosphere HTML: \`docs/public/z_ecosphere_transparency_report/\``,
      ]
    : [`- ${kbozsu_ingest.note}`, `- Expected: \`${kbozsu_ingest.file}\``]),
  '',
  '## Z — Mini bot operators (Phase 1 + 1.5, observe + notify; no auto-fix)',
  mini_bots.guardian.present
    ? [
        `- **Guardian:** missing **${mini_bots.guardian.missing}** · on disk **${mini_bots.guardian.present_count}** · highest **${mini_bots.guardian.highest_severity ?? 'n/a'}** · at **${mini_bots.guardian.generated_at ?? 'n/a'}** → \`${mini_bots.guardian.file}\``,
      ]
    : [`- **Guardian:** ${mini_bots.guardian.note} → \`${mini_bots.guardian.file}\``],
  mini_bots.sync.present
    ? [
        `- **Sync (registry snapshot):** at **${mini_bots.sync.generated_at ?? 'n/a'}** · \`${mini_bots.sync.latest_snapshot_dir ?? 'n/a'}\` → \`${mini_bots.sync.file}\``,
      ]
    : [`- **Sync:** ${mini_bots.sync.note} → \`${mini_bots.sync.file}\``],
  mini_bots.health.present
    ? [
        `- **Health:** mem used **${mini_bots.health.memory_used_pct ?? 'n/a'}%** · **${mini_bots.health.platform ?? 'n/a'}** → \`${mini_bots.health.file}\` · at **${mini_bots.health.generated_at ?? 'n/a'}**`,
      ]
    : [`- **Health:** ${mini_bots.health.note} → \`${mini_bots.health.file}\``],
  bot_alerts.present
    ? [
        `- **Alerts (notify-only):** overall **${bot_alerts.overall}** · total **${bot_alerts.total_alerts}** (HIGH **${bot_alerts.by_level?.HIGH ?? 0}**, MED **${bot_alerts.by_level?.MEDIUM ?? 0}**) → \`${bot_alerts.file}\` · \`npm run bot:alerts\``,
      ]
    : [`- **Alerts:** ${bot_alerts.note} → \`${bot_alerts.file}\``],
  bot_decisions.present
    ? [
        `- **Decisions (Phase 2.5, guidance + lifecycle):** **${bot_decisions.total_decisions}** item(s) · pending **${bot_decisions.lifecycle?.pending ?? 0}** · ack **${bot_decisions.lifecycle?.acknowledged ?? 0}** · resolved **${bot_decisions.lifecycle?.resolved ?? 0}** · dismissed **${bot_decisions.lifecycle?.dismissed ?? 0}** → \`${bot_decisions.file}\` · panel: \`dashboard/panels/z_decision_panel.html\` · \`npm run bot:decision:act\` or \`npm run decision:bridge\` + panel`,
      ]
    : [`- **Decisions:** ${bot_decisions.note} → \`${bot_decisions.file}\``],
  decision_patterns.present
    ? [
        `- **Pattern learning (Phase 3, advisory):** **${decision_patterns.total_patterns}** id(s) · log lines **${decision_patterns.total_log_entries ?? 'n/a'}** · HIGH-severity pattern rows **${decision_patterns.high_severity_count ?? 0}** → \`${decision_patterns.file}\` · \`npm run bot:pattern\` after history append`,
      ]
    : [`- **Patterns:** ${decision_patterns.note} → \`${decision_patterns.file}\``],
  decision_insight.rootcause.present
    ? [
        `- **Root cause (Phase 3.5):** **${decision_insight.rootcause.results_count}** hint(s) → \`${decision_insight.rootcause.file}\` · \`npm run bot:rootcause\``,
      ]
    : [`- **Root cause:** ${decision_insight.rootcause.note} → \`${decision_insight.rootcause.file}\``],
  decision_insight.predict.present
    ? [
        `- **Predictions (Phase 3.5):** **${decision_insight.predict.predictions_count}** row(s) → \`${decision_insight.predict.file}\` · \`npm run bot:predict\``,
      ]
    : [`- **Predictions:** ${decision_insight.predict.note} → \`${decision_insight.predict.file}\``],
  decision_insight.adaptive.present
    ? [
        `- **Adaptive rank (Phase 4, advisory):** **${decision_insight.adaptive.ranked_count}** row(s) → \`${decision_insight.adaptive.file}\` · \`npm run bot:adaptive\` (merges \`context.adaptive\` into decisions JSON)`,
      ]
    : [`- **Adaptive:** ${decision_insight.adaptive.note} → \`${decision_insight.adaptive.file}\``],
  decision_insight.strategy.present
    ? [
        `- **Strategy layer (Phase 6, advisory):** **${decision_insight.strategy.strategy_count}** strategy row(s) · top priority **${decision_insight.strategy.top_priority ?? 'n/a'}** → \`${decision_insight.strategy.file}\` · \`npm run bot:strategy\``,
      ]
    : [`- **Strategy:** ${decision_insight.strategy.note} → \`${decision_insight.strategy.file}\``],
  decision_insight.execution.present
    ? [
        `- **Execution plans (Phase 5, safe mode):** **${decision_insight.execution.plans_count}** plan(s) · last result: **${decision_insight.execution.last_result_at ?? 'n/a'}** → plans \`${decision_insight.execution.plans_file}\` · \`npm run bot:execution:plan\` · preview \`npm run bot:execution:run -- preview <id>\` · bridge \`npm run execution:bridge\``,
      ]
    : [`- **Execution plans:** ${decision_insight.execution.note} → \`${decision_insight.execution.plans_file}\``],
  '- No auto-fix; pair with `ecosystem:workspace-drift` and PC-root registry discipline.',
  '',
  '## Z-QOSMEI core signal (fusion, advisory)',
  ...(qosmei_core.present
    ? [
        `- Posture: **${String(qosmei_core.posture || 'unknown').toUpperCase()}** · lane: **${qosmei_core.lane_priority}** · confidence: **${qosmei_core.confidence_band}**`,
        `- Score vector: composite **${qosmei_core.score.composite ?? 'n/a'}** · impact **${qosmei_core.score.impact ?? 'n/a'}** · urgency **${qosmei_core.score.urgency ?? 'n/a'}** · confidence **${qosmei_core.score.confidence ?? 'n/a'}** · risk **${qosmei_core.score.risk ?? 'n/a'}** · SPI **${qosmei_core.score.structural_patterns_score ?? 'n/a'}** · evolution **${qosmei_core.score.evolution_phase ?? 'n/a'}**`,
        `- Recommendation: ${qosmei_core.recommendation ?? 'n/a'}`,
        `- Advisory-only: **${qosmei_core.advisory_only ? 'yes' : 'no'}** · file: \`${qosmei_core.file}\` · refresh: \`npm run qosmei:signal\``,
      ]
    : [`- ${qosmei_core.note ?? 'n/a'}`, `- Expected: \`${qosmei_core.file}\``]),
  '',
  '## Z-Structural intelligence (SPI)',
  ...(structural_intelligence.present
    ? [
        `- Phase: **${structural_intelligence.phase ?? 'n/a'}** · evolution: **${structural_intelligence.evolution_phase ?? 'n/a'}** · risk: **${structural_intelligence.risk ?? 'n/a'}** · SPI score: **${structural_intelligence.score ?? 'n/a'}** · patterns: **${structural_intelligence.patterns_n}** · suggestions: **${structural_intelligence.suggestions_n ?? 0}**`,
        `- ${structural_intelligence.note ?? 'n/a'}`,
        `- File: \`${structural_intelligence.file}\` · refresh: \`npm run spi:analyze\` · \`npm run spi:advice\` · then \`npm run qosmei:signal\``,
      ]
    : [`- ${structural_intelligence.note ?? 'n/a'}`, `- Expected: \`${structural_intelligence.file}\``]),
  '',
  '## Z-Adaptive learning (Phase 3, bounded)',
  ...(adaptive_learning.present
    ? [
        `- Cycles: **${adaptive_learning.learning_cycles}** · last update: **${adaptive_learning.last_updated ?? 'n/a'}**`,
        `- Weights: \`${JSON.stringify(adaptive_learning.weights || {})}\` (delete file to reset) · file: \`${adaptive_learning.file}\` · \`npm run learning:eval\` then \`npm run learning:tune\` after friction cycles`,
      ]
    : [`- ${adaptive_learning.note ?? 'n/a'}`, `- Placeholder: \`${adaptive_learning.file}\``]),
  '',
  '## Z-Cross-system alignment (Phase 4, advisory)',
  ...(cross_system.present
    ? [
        `- Status: **${cross_system.status ?? 'n/a'}** · confidence: **${cross_system.confidence ?? 'n/a'}** · conflicts: **${cross_system.conflicts_n}**`,
        `- File: \`${cross_system.file}\` · refresh: \`npm run cross:system\` (after \`npm run qosmei:signal\`)`,
      ]
    : [`- ${cross_system.note ?? 'n/a'}`, `- Expected: \`${cross_system.file}\``]),
  '',
  '## Z-Predictive intelligence (Phase 5, advisory)',
  ...(predictive_intelligence.present
    ? [
        `- Predictions: **${predictive_intelligence.predictions_n}** · top confidence: **${predictive_intelligence.highest_confidence}** · dominant: **${predictive_intelligence.dominant_signal ?? 'n/a'}** · cap active: **${predictive_intelligence.confidence_cap_active ? 'yes' : 'no'}**`,
        `- File: \`${predictive_intelligence.file}\` · refresh: \`npm run predictive:intel\` (after \`npm run cross:system\`); re-run \`npm run qosmei:signal\` to fold fusion hint`,
      ]
    : [`- ${predictive_intelligence.note ?? 'n/a'}`, `- Expected: \`${predictive_intelligence.file}\``]),
  '',
  '## Z-Prediction validation (Phase 5.5, advisory)',
  ...(prediction_validation.present
    ? [
        `- Validated: **${prediction_validation.validated_n}** in rolling history · accuracy: **${prediction_validation.accuracy}** · trend: **${prediction_validation.trend}** · confidence alignment: **${prediction_validation.confidence_alignment}**`,
        `- File: \`${prediction_validation.file}\` · refresh: \`npm run prediction:validate\` after \`npm run predictive:intel\` (Whale Bus includes the step before post-QOSMEI)`,
      ]
    : [`- ${prediction_validation.note ?? 'n/a'}`, `- Placeholder: \`${prediction_validation.file}\``]),
  '',
  '## Z-System — Structural Health',
  ...(system_health.present
    ? [
        `- Health: **${system_health.health_score}%** (${system_health.status}) · garage pressure: **${system_health.pressure}**`,
        `- Modules: **${system_health.healthy_modules}** healthy · **${system_health.warning_modules}** warning · **${system_health.critical_modules}** critical (total **${system_health.modules_total}**)`,
        `- ${system_health.note ?? 'n/a'}`,
      ]
    : [`- ${system_health.note ?? 'n/a'}`, `- Expected: \`${system_health.file}\``]),
  '',
  '## Z-Communication — Flow health',
  ...(communication_health.present
    ? [
        `- Flow: **${String(communication_health.flow_status || 'n/a').toUpperCase()}** · score: **${communication_health.health_score}%** · structural: **${communication_health.status}**`,
        `- Observer alignment: **${communication_health.observer_alignment}** · freshness: **${communication_health.observer_freshness}** · manifests: **${communication_health.manifest_alignment}** · commflow: **${communication_health.commflow_posture}**`,
        `- Issues: **${communication_health.issues_count}** (see JSON \`issues\` array)`,
        `- ${communication_health.note ?? 'n/a'}`,
        `- Report: \`${communication_health.file}\` · refresh: \`npm run ai:communication:health\``,
      ]
    : [`- ${communication_health.note ?? 'n/a'}`, `- Expected: \`${communication_health.file}\``]),
  '',
  '## Z-Vault spine (doc link integrity)',
  ...(vault_spine.present
    ? [
        `- Status: **${String(vault_spine.status).toUpperCase()}** · spine files: **${vault_spine.spine_files}** · links checked: **${vault_spine.links_checked}** · broken: **${vault_spine.broken}**`,
        `- Index: \`${vault_spine.index}\` · manifest: \`${vault_spine.file}\` · verify: \`npm run vault:spine:verify\``,
      ]
    : [
        `- ${vault_spine.note ?? 'n/a'}`,
        `- Expected: \`${vault_spine.file}\` · index: \`${vault_spine.index}\``,
      ]),
  '',
  '## Z-System — Coherence',
  ...(system_coherence.present
    ? [
        `- **System coherence:** **${String(system_coherence.confidence || 'n/a').toUpperCase()}** (cross-layer confidence) · score **${system_coherence.coherence_score}%** · status **${system_coherence.status}**`,
        `- Contradictions flagged: **${system_coherence.contradictions_count}** · ${system_coherence.note ?? 'n/a'}`,
        `- Report: \`${system_coherence.file}\` · refresh: \`npm run ai:system:coherence\``,
      ]
    : [`- ${system_coherence.note ?? 'n/a'}`, `- Expected: \`${system_coherence.file}\``]),
  '',
  '## Z-System — Adaptive intelligence (ACI)',
  ...(adaptive_coherence.present
    ? [
        `- **Top action:** ${adaptive_coherence.top_action ?? 'n/a'}`,
        `- **Risk forecast:** **${String(adaptive_coherence.prediction_risk || 'n/a').toUpperCase()}** · next state (heuristic): **${adaptive_coherence.prediction_next}** · root causes mapped: **${adaptive_coherence.root_causes_count}** · ranked actions: **${adaptive_coherence.actions_count}**`,
        `- Report: \`${adaptive_coherence.file}\` · refresh: \`npm run ai:adaptive:coherence\``,
      ]
    : [`- ${adaptive_coherence.note ?? 'n/a'}`, `- Expected: \`${adaptive_coherence.file}\``]),
  '',
  '## Z-System — Self-Tuning Intelligence (STIL)',
  ...(self_tuning.present
    ? [
        `- Learning cycles: **${self_tuning.learning_cycles}** · state: **${self_tuning.system_learning_state}** · confidence: **${self_tuning.confidence}**`,
        `- Top strategy: **${self_tuning.top_strategy ?? 'n/a'}** · best avg impact: **${self_tuning.best_avg_impact ?? 'n/a'}**`,
        `- Report: \`${self_tuning.file}\` · refresh: \`npm run ai:self:tuning\` · log: \`data/logs/z_ai_learning_log.jsonl\``,
      ]
    : [`- ${self_tuning.note ?? 'n/a'}`, `- Expected: \`${self_tuning.file}\``]),
  '',
  '## Z-System — Experience Memory (EML)',
  ...(experience_memory.present
    ? [
        `- Patterns: **${experience_memory.patterns_detected}** · cycles (heuristic): **${experience_memory.cycles_detected}** · confidence: **${String(experience_memory.confidence || 'n/a').toUpperCase()}**`,
        `- Top insight: ${experience_memory.top_insight ?? 'n/a'}`,
        `- Report: \`${experience_memory.file}\` · refresh: \`npm run ai:experience:memory\``,
      ]
    : [`- ${experience_memory.note ?? 'n/a'}`, `- Expected: \`${experience_memory.file}\``]),
  '',
  '## Z-System — Experience Intelligence (XIL)',
  ...(experience_intelligence.present
    ? [
        `- Top strategy: **${experience_intelligence.top_strategy ?? 'n/a'}**`,
        `- Focus: **${experience_intelligence.system_focus ?? 'n/a'}** · avoid pattern: **${experience_intelligence.avoid_pattern ?? 'n/a'}** · confidence: **${String(experience_intelligence.confidence || 'n/a').toUpperCase()}**`,
        `- Report: \`${experience_intelligence.file}\` · refresh: \`npm run ai:experience:intelligence\``,
      ]
    : [`- ${experience_intelligence.note ?? 'n/a'}`, `- Expected: \`${experience_intelligence.file}\``]),
  '',
  '## Z-System — Fusion Council (Z-Fusion)',
  ...(fusion_council.present
    ? [
        `- Primary focus: **${fusion_council.primary_focus ?? 'n/a'}**`,
        `- Consensus: **${fusion_council.consensus}** · confidence: **${String(fusion_council.confidence || 'n/a').toUpperCase()}**`,
        `- Conflicts: **${fusion_council.conflicts.length ? fusion_council.conflicts.join(', ') : 'none'}**`,
        `- Final recommendation: ${fusion_council.final_recommendation ?? 'n/a'}`,
        `- Report: \`${fusion_council.file}\` · refresh: \`npm run ai:fusion:council\``,
      ]
    : [`- ${fusion_council.note ?? 'n/a'}`, `- Expected: \`${fusion_council.file}\``]),
  '',
  '## Z-System — DSR (Duplication & Clarity)',
  ...(dsr.present
    ? [
        `- Duplicates: **${dsr.duplicates}** · similar: **${dsr.similar}** · conflicts: **${dsr.conflicts}**`,
        `- Status: **${String(dsr.status || 'unknown').toUpperCase()}**`,
        `- Policy filter: excluded **${dsr.excluded_entries}** entries (archive/export noise)`,
        `- Note: ${dsr.note ?? 'n/a'}`,
        `- Report: \`${dsr.file}\` · refresh: \`npm run ai:dsr:analyze\``,
      ]
    : [`- ${dsr.note ?? 'n/a'}`, `- Expected: \`${dsr.file}\``]),
  '',
  '## Z-System — Formula + Spine Sync',
  ...(formula_sync.present
    ? [
        `- Status: **${String(formula_sync.status || 'unknown').toUpperCase()}** · confidence **${String(formula_sync.confidence || 'low').toUpperCase()}** · checks **${formula_sync.checks_pass}/${formula_sync.checks_total}**`,
        `- Guidance: ${formula_sync.guidance ?? 'n/a'}`,
        `- Report: \`${formula_sync.file}\` · refresh: \`npm run ai:formula:sync\``,
      ]
    : [`- ${formula_sync.note ?? 'n/a'}`, `- Expected: \`${formula_sync.file}\``]),
  '',
  '## External observers (comms / AAFRTC — visibility only)',
  `- AAFRTC context generated: **${externalObservers.aafrtc_context_generated_at ?? 'n/a'}** (file present: ${externalObservers.manifest_files_present.aafrtc_context})`,
  `- GitHub comms manifest: **${externalObservers.github_comms_manifest_generated_at ?? 'n/a'}** · ok=${externalObservers.github_comms_manifest_ok ?? 'n/a'}`,
  `- Cloudflare comms manifest: **${externalObservers.cloudflare_comms_manifest_generated_at ?? 'n/a'}** · ok=${externalObservers.cloudflare_comms_manifest_ok ?? 'n/a'} · observer state: **${externalObservers.cloudflare_observer_state}**`,
  `- ${externalObservers.note}`,
  `- **Freshness (hint):** **${externalObserversHealth.status}** (threshold ${externalObserversHealth.stale_threshold_hours}h · max age ${externalObserversHealth.max_age_hours ?? 'n/a'}h) — ${externalObserversHealth.note}`,
  '',
  '## Z-FPSMC (storage awareness — read-only)',
  `- Present: **${fpsmcStorage.present}** · safety: **${fpsmcStorage.safety ?? 'n/a'}** · fixed drives: **${fpsmcStorage.fixed_drives ?? 'n/a'}** · known roots: **${fpsmcStorage.known_roots ?? 'n/a'}** · container volume rows: **${fpsmcStorage.container_volumes ?? 'n/a'}** · warnings: **${fpsmcStorage.warnings ?? 'n/a'}**`,
  `- Map generated: **${fpsmcStorage.generated_at ?? 'n/a'}** — ${fpsmcStorage.note ?? ''}`,
  '',
  '## Z-VDK (security scan awareness — read-only, no auto-quarantine)',
  ...(vdkSecurity.present
    ? [
        `- **Z-VDK:** safety **\`${vdkSecurity.safety ?? 'n/a'}\`** · findings **${vdkSecurity.findings_total ?? 'n/a'}** (critical **${vdkSecurity.critical ?? 'n/a'}** · high **${vdkSecurity.high ?? 'n/a'}** · medium **${vdkSecurity.medium ?? 'n/a'}** · low **${vdkSecurity.low ?? 'n/a'}**)`,
        `- Scan generated: **${vdkSecurity.generated_at ?? 'n/a'}** · report: \`${vdkSecurity.file}\``,
        vdkSecurity.review_report
          ? `- Findings review: \`${vdkSecurity.review_report}\``
          : '- Findings review: *(no `z_vdk_findings_review_*.md` yet — see docs)*',
        '- Refresh: `npm run vdk:scan` · `npm run vdk:report` — ' + (vdkSecurity.note ?? ''),
      ]
    : [
        `- VDK scan **missing** — ${vdkSecurity.note ?? 'n/a'}`,
        '- Generate: `npm run vdk:scan` then `npm run vdk:report`',
      ]),
  '',
  '## Z-VHealth (predictive health + challenges — read-only, advisory)',
  ...(vhealthCore.present
    ? [
        `- **Z-VHealth:** **${String(vhealthCore.posture || 'n/a').toUpperCase()}** · score **${vhealthCore.health_score ?? 'n/a'}** · future risk: **${vhealthCore.future_risk ?? 'n/a'}** · top challenge: **${vhealthCore.top_challenge ?? 'n/a'}**`,
        `- Authority: **${vhealthCore.authority ?? 'n/a'}** · report: \`${vhealthCore.file}\` · generated: **${vhealthCore.generated_at ?? 'n/a'}** — ${vhealthCore.note ?? ''}`,
        '- Refresh: `npm run vhealth:report`',
      ]
    : [
        `- VHealth report **missing** — ${vhealthCore.note ?? 'n/a'}`,
        '- Generate: `npm run vhealth:report`',
      ]),
  '',
  '## Current Metrics',
  `- Module completion: **${snapshot.metrics.module_completion_pct}%** (${snapshot.metrics.module_done}/${snapshot.metrics.module_total})`,
  `- Priority completion: **${snapshot.metrics.task_completion_pct}%** (${snapshot.metrics.task_total - snapshot.metrics.task_open}/${snapshot.metrics.task_total})`,
  `- P1 open tasks: **${snapshot.metrics.task_p1_open}**`,
  `- Pending audit total: **${snapshot.metrics.pending_total}**`,
  `- Hygiene status: **${snapshot.metrics.hygiene_green ? 'green' : 'hold'}**`,
  `- Z-OCTAVE gates: **${snapshot.metrics.readiness_gates_pass}/${snapshot.metrics.readiness_gates_total}**`,
  '',
  '## Shadow Foundation',
  `- OTel shadow: **${snapshot.metrics.otel_shadow_status}** (${snapshot.metrics.otel_shadow_checks_pass}/${snapshot.metrics.otel_shadow_checks_total})`,
  `- Policy shadow: **${snapshot.metrics.policy_shadow_status}** (${snapshot.metrics.policy_shadow_checks_pass}/${snapshot.metrics.policy_shadow_checks_total})`,
  `- Extension guard: **${snapshot.metrics.extension_guard_status}** (failed=${snapshot.metrics.extension_guard_failed})`,
  `- Data leak status: **${snapshot.metrics.data_leak_status}** (findings=${snapshot.metrics.data_leak_findings})`,
  '',
  '## Trouble Maker Watch',
  `- Status: **${snapshot.metrics.troublemaker_status}**`,
  `- Risk class: **${snapshot.metrics.troublemaker_risk_class}**`,
  `- Disturbance score: **${snapshot.metrics.troublemaker_disturbance_score ?? 'n/a'}**`,
  `- Failed checks: **${snapshot.metrics.troublemaker_failed_checks}**`,
  '',
  '## 7-Day Trend',
  `- Window size: ${trend.window_days} day(s)`,
  `- Module completion delta: ${trend.module_completion_delta_pct ?? 'n/a'} pt`,
  `- Open tasks delta: ${trend.task_open_delta ?? 'n/a'}`,
  `- Pending audit delta: ${trend.pending_delta ?? 'n/a'}`,
  `- Readiness gate delta: ${trend.readiness_delta ?? 'n/a'}`,
  `- Hygiene green days: ${trend.hygiene_green_days}/${trend.window_days}`,
  '',
  '## Operational Notes',
  '- Readiness is intentionally conservative until charter/pilot/governance gates pass.',
  '- This report is generated automatically and is safe for daily operational review.',
  '- Human-authored **system level-ups digest** for Zuno and observers (narrative inventory — Super Chat, QADP, dashboard, accessibility, verification): `data/reports/zuno_reference_full_system_level_ups_2026-04-14.md`.',
  '',
];

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_MD, md.join('\n'));
writeJson(OUT_JSON, reportJson);

// Keep legacy daily report paths in sync for existing dashboards/integrations.
writeJson(LEGACY_DAILY_JSON, reportJson);
fs.writeFileSync(LEGACY_DAILY_MD, md.join('\n'));

console.log(`✅ Zuno state report written: ${OUT_MD}`);
