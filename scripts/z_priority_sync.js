#!/usr/bin/env node
// Z: scripts\z_priority_sync.js
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'data', 'z_codex_report.json');
const Z_REPORT_PATH = path.join(ROOT, 'data', 'Z_codex_report.json');
const QUEUE_PATH = path.join(ROOT, 'data', 'z_priority_queue.json');
const Z_QUEUE_PATH = path.join(ROOT, 'data', 'Z_priority_queue.json');

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function issueId(issue, idx) {
  const code =
    issue.ZCode || issue.code || issue.ZRule || issue.rule || issue.id || `repeat-${idx + 1}`;
  const safe = String(code).trim().replace(/\s+/g, '-');
  return `codex:${safe}`;
}

function issueTitle(issue) {
  return (
    issue.ZMessage ||
    issue.message ||
    issue.ZTitle ||
    issue.title ||
    issue.ZRule ||
    issue.rule ||
    issue.ZCode ||
    issue.code ||
    'Repeat issue'
  );
}

function sync() {
  const report = readJson(Z_REPORT_PATH, readJson(REPORT_PATH, { repeatIssues: [] }));
  const queue = readJson(Z_QUEUE_PATH, readJson(QUEUE_PATH, { updatedAt: '', items: [] }));
  const items = Array.isArray(queue.ZItems)
    ? queue.ZItems.map((item) => ({
        id: item.ZId || item.id,
        title: item.ZTitle || item.title,
        priority: item.ZPriority || item.priority,
        status: item.ZStatus || item.status,
        source: item.ZSource || item.source,
        tags: item.ZTags || item.tags,
        createdAt: item.ZCreatedAt || item.createdAt,
      }))
    : Array.isArray(queue.items)
      ? queue.items
      : [];
  const repeaters = Array.isArray(report.ZRepeatIssues)
    ? report.ZRepeatIssues
    : Array.isArray(report.repeatIssues)
      ? report.repeatIssues
      : Array.isArray(report.ZIssues)
        ? report.ZIssues
        : [];
  const existing = new Map(items.map((item) => [item.id, item]));

  repeaters.forEach((issue, idx) => {
    const id = issueId(issue, idx);
    const title = `Repeat: ${issueTitle(issue)}`;
    const entry = existing.get(id);
    if (entry) {
      if (!entry.priority) entry.priority = 'P1';
      if (!entry.status) entry.status = 'open';
      if (!entry.source) entry.source = 'codex';
      if (!entry.title) entry.title = title;
      return;
    }
    items.push({
      id,
      title,
      priority: 'P1',
      status: 'open',
      source: 'codex',
      tags: ['codex', 'repeat'],
      createdAt: issue.firstSeen || new Date().toISOString(),
    });
  });

  const updatedAt = new Date().toISOString();
  const payload = { updatedAt, items };
  writeJson(QUEUE_PATH, payload);
  const zPayload = {
    ZFormat: 'v1',
    ZUpdatedAt: updatedAt,
    ZItems: items.map((item) => ({
      ZId: item.id,
      ZTitle: item.title,
      ZPriority: item.priority,
      ZStatus: item.status,
      ZSource: item.source,
      ZTags: item.tags,
      ZCreatedAt: item.createdAt,
    })),
  };
  writeJson(Z_QUEUE_PATH, zPayload);
}

sync();
console.log('Z priority queue synced with Codex repeaters.');
