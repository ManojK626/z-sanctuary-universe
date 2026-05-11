import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const settingsPath = path.join(ROOT, '.vscode', 'settings.json');
const tasksPath = path.join(ROOT, '.vscode', 'tasks.json');
const outPath = path.join(ROOT, 'data', 'reports', 'z_autorun_audit.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

const settings = readJson(settingsPath) || {};
const tasks = readJson(tasksPath) || {};

const autoTasksSetting = settings['task.allowAutomaticTasks'] || 'unset';
const taskList = Array.isArray(tasks.tasks) ? tasks.tasks : [];
const autoTasks = taskList.filter((t) => t?.runOptions?.runOn === 'folderOpen');

const requiredAutoTasks = [
  'Z: SSWS Auto Boot',
];

function taskByLabel(label) {
  return taskList.find((t) => t?.label === label) || null;
}

function dependsOnLabel(task, label) {
  const deps = Array.isArray(task?.dependsOn) ? task.dependsOn : [];
  return deps.includes(label);
}

const sswsTask = taskByLabel('Z: SSWS Auto Boot');
const backgroundTask = taskByLabel('Z: Full Background Run (Auto)');

const checks = [
  {
    id: 'auto_tasks_setting',
    pass: autoTasksSetting === 'on',
    note: `task.allowAutomaticTasks=${autoTasksSetting}`,
  },
  {
    id: 'auto_tasks_present',
    pass: requiredAutoTasks.every((label) => autoTasks.some((t) => t.label === label)),
    note: `auto tasks: ${autoTasks.map((t) => t.label).join(', ') || 'none'}`,
  },
  {
    id: 'background_run_covered',
    pass:
      autoTasks.some((t) => t.label === 'Z: Full Background Run (Auto)') ||
      dependsOnLabel(sswsTask, 'Z: Full Background Run (Auto)') ||
      Boolean(backgroundTask && dependsOnLabel(backgroundTask, 'Z: Privacy Gate Check')),
    note: 'background run is either auto task or chained by SSWS auto boot',
  },
];

const payload = {
  generated_at: new Date().toISOString(),
  status: checks.every((c) => c.pass) ? 'green' : 'hold',
  auto_tasks_setting: autoTasksSetting,
  auto_tasks: autoTasks.map((t) => t.label),
  checks,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

console.log('✅ Auto-run audit written:', outPath);
