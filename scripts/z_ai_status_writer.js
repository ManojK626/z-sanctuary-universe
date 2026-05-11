// Z: scripts/z_ai_status_writer.js
// Writes AI status snapshots to data/reports/z_ai_status.json (server-side safe).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_PATH = path.join(ROOT, 'data', 'reports', 'z_ai_status.json');
const INTERVAL_MS = 60_000;
const WATCH_MODE = process.argv.includes('--watch');

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function buildSnapshot() {
  // Best-effort: use existing runtime artifacts if present.
  const moduleManifest = readJsonSafe(path.join(ROOT, 'data', 'z_module_manifest.json'));
  const hygieneStatus = readJsonSafe(path.join(ROOT, 'data', 'reports', 'z_hygiene_status.json'));
  const troublemakerStatus = readJsonSafe(
    path.join(ROOT, 'data', 'reports', 'z_troublemaker_scan.json')
  );
  const superGhostFeed = readJsonSafe(
    path.join(ROOT, 'data', 'reports', 'z_super_ghost_disturbance_feed.json')
  );
  const qosmei = readJsonSafe(path.join(ROOT, 'data', 'reports', 'z_qosmei_core_signal.json'));
  const hygieneOk = ['green', 'GREEN'].includes(String(hygieneStatus?.status || ''));
  const aiAgents = moduleManifest?.ZModules?.filter((m) => m.ZLayer === 'ai-agent') || [];
  const plannedRolloutOnly =
    aiAgents.length > 0 &&
    aiAgents.every((m) => String(m.ZStatus || 'planned').toLowerCase() === 'planned');
  // When every tower agent is still "planned" in the manifest, the comm-flow surface may show green
  // ("clear" normalizes to green) without implying live autonomous execution — only registry intent.
  const towerStatus =
    plannedRolloutOnly ? 'clear' : aiAgents.length === 0 ? 'unknown' : 'watch';

  return {
    generated_at: new Date().toISOString(),
    ai_tower: {
      status: towerStatus,
      frozen: false,
      agent_count: aiAgents.length,
      planned_rollout_only: plannedRolloutOnly,
      tower_phase: plannedRolloutOnly ? 'blueprint' : aiAgents.length === 0 ? 'unset' : 'mixed',
      // Observational labels only — not governance/release truth.
      intent_surface: plannedRolloutOnly
        ? 'planned_agents_manifest_only'
        : aiAgents.length === 0
          ? 'no_ai_agent_manifest_rows'
          : 'mixed_manifest_agent_status',
    },
    agents: aiAgents.map((m) => ({
      id: m.ZId,
      owner: m.ZOwner || 'AI Tower',
      status: m.ZStatus || 'planned',
      lastPulse: null,
    })),
    miniai: [
      { name: 'ScribeBot', online: hygieneOk, mode: 'observer' },
      { name: 'ProtectorBot', online: hygieneOk, mode: 'observer' },
      { name: 'DesignerBot', online: hygieneOk, mode: 'observer' },
      { name: 'NavigatorBot', online: hygieneOk, mode: 'observer' },
    ],
    hygiene: {
      status: hygieneStatus?.status || 'unknown',
      generated_at: hygieneStatus?.generated_at || null,
      pending_count:
        typeof hygieneStatus?.pending_count === 'number' ? hygieneStatus.pending_count : null,
    },
    disturbance_watch: {
      status: troublemakerStatus?.status || 'unknown',
      risk_class: troublemakerStatus?.risk_class || 'unknown',
      disturbance_score:
        typeof troublemakerStatus?.disturbance_score === 'number'
          ? troublemakerStatus.disturbance_score
          : null,
      failed_checks: Array.isArray(troublemakerStatus?.failed_ids)
        ? troublemakerStatus.failed_ids.length
        : 0,
    },
    super_ghost_feed: {
      status: superGhostFeed?.status || 'unknown',
      risk_class: superGhostFeed?.risk_class || 'unknown',
      message: superGhostFeed?.message || 'No disturbance feed yet.',
    },
    qosmei_core: {
      status: qosmei?.posture || 'unknown',
      lane_priority: qosmei?.lane_priority || 'unknown',
      composite_score:
        typeof qosmei?.score?.composite === 'number' ? qosmei.score.composite : null,
      confidence_band: qosmei?.confidence_band || 'unknown',
      generated_at: qosmei?.generated_at || null,
      advisory_only: qosmei?.advisory_only !== false,
    },
    notes:
      'Observational only. No execution authority.' +
      (plannedRolloutOnly
        ? ' AI Tower ai-agent modules in manifest are planned-only until explicitly promoted.'
        : ''),
  };
}

function writeSnapshot() {
  const snapshot = buildSnapshot();
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2));
  console.log('AI status written:', OUT_PATH);
}

writeSnapshot();
if (WATCH_MODE) {
  setInterval(writeSnapshot, INTERVAL_MS);
}
