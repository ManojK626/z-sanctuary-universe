import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, 'data', 'Z_priority_queue.json');
const QUEUE_PATH_FALLBACK = path.join(ROOT, 'data', 'z_priority_queue.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_priority_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_priority_audit.md');

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

const queue = readJson(QUEUE_PATH) || readJson(QUEUE_PATH_FALLBACK) || {};
const items = Array.isArray(queue.ZItems)
  ? queue.ZItems.map((item) => ({
      id: item.ZId || item.id,
      title: item.ZTitle || item.title,
      priority: item.ZPriority || item.priority || 'P3',
      status: item.ZStatus || item.status || 'open',
      tags: item.ZTags || item.tags || [],
    }))
  : Array.isArray(queue.items)
    ? queue.items
    : [];

const total = items.length;
const open = items.filter((i) => String(i.status).toLowerCase() === 'open').length;
const byPriority = items.reduce((acc, item) => {
  const key = String(item.priority || 'P3').toUpperCase();
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const payload = {
  generated_at: new Date().toISOString(),
  total,
  open,
  by_priority: byPriority,
  notes: total ? 'Priority queue audit complete.' : 'No priority items found.',
};

writeJson(OUT_JSON, payload);

const md = [
  '# Z-Sanctuary Priority Audit',
  '',
  `Generated: ${payload.generated_at}`,
  `Total items: ${total}`,
  `Open items: ${open}`,
  '',
  '## By Priority',
  ...Object.entries(byPriority).map(([k, v]) => `- ${k}: ${v}`),
  '',
];

fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_MD, md.join('\n'));

console.log('✅ Priority audit written:', OUT_JSON);
