/**
 * Z Super Chat — local interaction memory (JSON file, hub-only, no cloud).
 */
import fs from 'node:fs';
import path from 'node:path';

const MAX_ENTRIES = 500;

function ensureFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]\n', 'utf8');
  }
}

function readAll(filePath) {
  ensureFile(filePath);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAll(filePath, arr) {
  fs.writeFileSync(filePath, `${JSON.stringify(arr, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} hubRoot
 */
export function createMemoryStore(hubRoot) {
  const filePath = path.join(hubRoot, 'data', 'ai-memory.json');

  return {
    filePath,

    /** @returns {{ ai: string, message: string, reply?: string, timestamp: number }[]} */
    getRecent(limit = 5) {
      const all = readAll(filePath);
      if (limit <= 0) return [];
      return all.slice(-limit);
    },

    /** Last N entries for UI panel */
    getTail(limit = 20) {
      const all = readAll(filePath);
      return all.slice(-limit).reverse();
    },

    /** @param {{ ai: string, message: string, reply?: string, timestamp?: number }} entry */
    append(entry) {
      const all = readAll(filePath);
      const item = {
        ai: String(entry.ai || 'companion'),
        message: String(entry.message || '').slice(0, 2000),
        reply: entry.reply != null ? String(entry.reply).slice(0, 1200) : '',
        timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : Date.now()
      };
      all.push(item);
      writeAll(filePath, all.slice(-MAX_ENTRIES));
    }
  };
}

/**
 * Inject recent user messages into the reply (continuity layer).
 */
export function prependMemoryContext(baseReply, recentEntries) {
  if (!recentEntries?.length) return baseReply;
  const lines = recentEntries.map((e) => {
    const t = new Date(e.timestamp).toISOString().slice(11, 19);
    const msg = String(e.message || '').slice(0, 240);
    return `- [${e.ai}] ${msg} (${t})`;
  });
  return `I remember your recent thoughts:\n${lines.join('\n')}\n\n—\n\n${baseReply}`;
}
