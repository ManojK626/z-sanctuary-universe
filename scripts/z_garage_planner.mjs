import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const ZCI_PATH = path.join(ROOT, 'data', 'reports', 'z_ci_intelligence.json');
const OUTPUT = path.join(ROOT, 'data', 'reports', 'z_garage_upgrade_plan.json');

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getRiskLevel(weight) {
  if (weight > 70) return 'CRITICAL';
  if (weight > 50) return 'HIGH';
  if (weight > 30) return 'MEDIUM';
  return 'LOW';
}

const zci = readJsonSafe(ZCI_PATH) || {};
const projects = Array.isArray(zci.projects) ? zci.projects : [];

function getUpgradeWeight(project) {
  let weight = 0;
  const score = Number(project.score);

  if (score < 50) weight += 50;
  else if (score < 70) weight += 30;
  else weight += 10;

  const w = project.weaknesses || [];
  if (w.includes('no_scripts')) weight += 25;
  if (w.includes('no_tests')) weight += 15;
  if (w.includes('no_lint')) weight += 10;

  return weight;
}

function buildTasks(project) {
  const tasks = [];
  const w = project.weaknesses || [];

  if (w.includes('no_scripts')) {
    tasks.push('Add npm scripts: start, build, test, lint');
  }

  if (w.includes('no_tests')) {
    tasks.push('Create minimal test suite');
  }

  if (w.includes('no_lint')) {
    tasks.push('Add ESLint configuration');
  }

  if (project.type === 'unknown') {
    tasks.push('Define project role clearly');
  }

  return tasks;
}

const plan = projects.map((p) => {
  const weight = getUpgradeWeight(p);
  const tasks = buildTasks(p);

  return {
    name: p.name,
    path: p.path,
    type: p.type,
    score: p.score,
    weight,
    risk: getRiskLevel(weight),
    priority: p.priority,
    next_action: tasks[0] || 'No action needed',
    tasks,
  };
});

plan.sort((a, b) => b.weight - a.weight);

const grouped = {};
for (const item of plan) {
  if (!grouped[item.type]) grouped[item.type] = [];
  grouped[item.type].push(item);
}

const summary = {
  total: plan.length,
  critical: plan.filter((p) => p.weight > 70).length,
  high: plan.filter((p) => p.weight > 50 && p.weight <= 70).length,
  medium: plan.filter((p) => p.weight > 30 && p.weight <= 50).length,
  low: plan.filter((p) => p.weight <= 30).length,
};

const pressure =
  summary.critical > 3 ? 'high' : summary.high > 5 ? 'medium' : 'low';

const patternMap = {};
for (const p of plan) {
  for (const task of p.tasks) {
    if (!patternMap[task]) patternMap[task] = 0;
    patternMap[task]++;
  }
}

const patterns = Object.entries(patternMap)
  .map(([task, count]) => ({ task, count }))
  .sort((a, b) => b.count - a.count);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      summary,
      pressure,
      patterns: patterns.slice(0, 5),
      plan,
      grouped,
    },
    null,
    2,
  ),
  'utf8',
);

console.log('Z-Garage Upgrade Plan ready');
console.log(`Output: ${OUTPUT}`);
