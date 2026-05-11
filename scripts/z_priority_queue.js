#!/usr/bin/env node
// Z: scripts\z_priority_queue.js
import fs from 'node:fs';
import path from 'node:path';

const FILE_PATH = path.resolve(process.cwd(), 'data', 'z_priority_queue.json');
const Z_FILE_PATH = path.resolve(process.cwd(), 'data', 'Z_priority_queue.json');

function readQueue() {
  try {
    const raw = fs.existsSync(Z_FILE_PATH)
      ? fs.readFileSync(Z_FILE_PATH, 'utf8')
      : fs.readFileSync(FILE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return {
      updatedAt: data.ZUpdatedAt || data.updatedAt || '',
      items: Array.isArray(data.ZItems)
        ? data.ZItems.map((item) => ({
            id: item.ZId || item.id,
            title: item.ZTitle || item.title,
            priority: item.ZPriority || item.priority,
            status: item.ZStatus || item.status,
            source: item.ZSource || item.source,
            tags: item.ZTags || item.tags,
            createdAt: item.ZCreatedAt || item.createdAt,
          }))
        : Array.isArray(data.items)
          ? data.items
          : [],
    };
  } catch (err) {
    return { updatedAt: '', items: [] };
  }
}

function writeQueue(queue) {
  const payload = {
    updatedAt: new Date().toISOString(),
    items: queue.items || [],
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(payload, null, 2));
  const zPayload = {
    ZFormat: 'v1',
    ZUpdatedAt: payload.updatedAt,
    ZItems: payload.items.map((item) => ({
      ZId: item.id,
      ZTitle: item.title,
      ZPriority: item.priority,
      ZStatus: item.status,
      ZSource: item.source,
      ZTags: item.tags,
      ZCreatedAt: item.createdAt,
    })),
  };
  fs.writeFileSync(Z_FILE_PATH, JSON.stringify(zPayload, null, 2));
}

function formatItem(item) {
  const priority = item.priority || 'P3';
  const status = item.status || 'open';
  const tags = Array.isArray(item.tags) && item.tags.length ? ` [${item.tags.join(', ')}]` : '';
  return `${item.id} ${priority} ${status} - ${item.title}${tags}`;
}

function nextId(queue, priority) {
  const prefix = `${priority}-`;
  const matches = queue.items
    .map((item) => String(item.id || ''))
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.replace(prefix, ''), 10))
    .filter((n) => Number.isFinite(n));
  const next = matches.length ? Math.max(...matches) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

function parseArgs(args) {
  const options = {};
  let cursor = 0;
  while (cursor < args.length) {
    const token = args[cursor];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = args[cursor + 1];
      options[key] = value === undefined ? true : value;
      cursor += value === undefined ? 1 : 2;
    } else {
      options._ = options._ || [];
      options._.push(token);
      cursor += 1;
    }
  }
  return options;
}

function list(queue) {
  if (!queue.items.length) {
    console.log('No priority items found.');
    return;
  }
  queue.items.forEach((item) => {
    console.log(formatItem(item));
  });
}

function add(queue, title, options) {
  if (!title) {
    console.log(
      'Title required. Example: node scripts/z_priority_queue.js add "Fix charts" --priority P1'
    );
    return;
  }
  const priority = String(options.priority || 'P2').toUpperCase();
  const id = String(options.id || nextId(queue, priority));
  const tags = options.tags
    ? String(options.tags)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const item = {
    id,
    title,
    priority,
    status: 'open',
    source: options.source || 'cli',
    tags,
    createdAt: new Date().toISOString(),
  };
  queue.items.push(item);
  writeQueue(queue);
  console.log(`Added: ${formatItem(item)}`);
}

function updateStatus(queue, id, status) {
  const item = queue.items.find((entry) => entry.id === id);
  if (!item) {
    console.log(`Item not found: ${id}`);
    return;
  }
  item.status = status;
  writeQueue(queue);
  console.log(`Updated: ${formatItem(item)}`);
}

function remove(queue, id) {
  const idx = queue.items.findIndex((entry) => entry.id === id);
  if (idx === -1) {
    console.log(`Item not found: ${id}`);
    return;
  }
  const [removed] = queue.items.splice(idx, 1);
  writeQueue(queue);
  console.log(`Removed: ${formatItem(removed)}`);
}

function updatePriority(queue, id, priority) {
  const item = queue.items.find((entry) => entry.id === id);
  if (!item) {
    console.log(`Item not found: ${id}`);
    return;
  }
  item.priority = priority;
  writeQueue(queue);
  console.log(`Updated: ${formatItem(item)}`);
}

function usage() {
  console.log('Z Priority Queue');
  console.log('Usage:');
  console.log('  node scripts/z_priority_queue.js list');
  console.log('  node scripts/z_priority_queue.js add "Title" --priority P1 --tags ui,governance');
  console.log('  node scripts/z_priority_queue.js done <ID>');
  console.log('  node scripts/z_priority_queue.js open <ID>');
  console.log('  node scripts/z_priority_queue.js promote <ID> --priority P0');
  console.log('  node scripts/z_priority_queue.js remove <ID>');
}

const [command, ...rest] = process.argv.slice(2);
const queue = readQueue();
const options = parseArgs(rest);

if (!command) {
  usage();
  process.exit(0);
}

if (command === 'list') {
  list(queue);
} else if (command === 'add') {
  const title = options._ && options._.length ? options._.join(' ') : '';
  add(queue, title, options);
} else if (command === 'done') {
  updateStatus(queue, options._ ? options._[0] : null, 'done');
} else if (command === 'open') {
  updateStatus(queue, options._ ? options._[0] : null, 'open');
} else if (command === 'remove') {
  remove(queue, options._ ? options._[0] : null);
} else if (command === 'promote') {
  const id = options._ ? options._[0] : null;
  const priority = String(options.priority || (options._ && options._[1]) || 'P0').toUpperCase();
  updatePriority(queue, id, priority);
} else {
  usage();
}
