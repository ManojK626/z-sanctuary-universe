import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const CFG = path.join(ROOT, 'config', 'z_runtime_lanes.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_runtime_lane_dispatch.json');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function run() {
  const cfg = readJson(CFG, { lanes: [] });
  const lanes = Array.isArray(cfg.lanes) ? cfg.lanes : [];
  const cpuCount = os.cpus()?.length || 1;
  const lanePlans = lanes.map((lane, idx) => ({
    id: lane.id,
    priority: lane.priority || 'medium',
    resource_bias: lane.resource_bias || 'cpu',
    slot: idx + 1,
    thread_hint:
      lane.resource_bias === 'cpu'
        ? Math.max(1, Math.floor(cpuCount / lanes.length))
        : Math.max(1, Math.floor(cpuCount / 2)),
    tasks: lane.tasks || [],
  }));

  const payload = {
    generated_at: new Date().toISOString(),
    profile: cfg.profile || 'quad-lane',
    cpu_count: cpuCount,
    lane_count: lanes.length,
    lanes: lanePlans,
    note: 'Dispatch plan only (read-only). Execution remains task-driven.',
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`Runtime lane dispatch written: ${OUT}`);
}

run();
