#!/usr/bin/env node
/**
 * Compact markdown table pipes to satisfy MD060/table-column-style (compact):
 * trim cells, `| Name |` spacing, and empty cells as `|` + ` |` (no doubled spaces).
 *
 * Usage:
 *   node scripts/z_markdown_table_compact.mjs
 *   node scripts/z_markdown_table_compact.mjs --dir=docs/commercial
 *   node scripts/z_markdown_table_compact.mjs --dry-run
 *   node scripts/z_markdown_table_compact.mjs --help
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const args = new Set(argv);
const dryRun = args.has('--dry-run');
const help = args.has('--help') || args.has('-h');
const dirArg = argv.find((a) => a.startsWith('--dir='));
const startDir = dirArg ? path.resolve(ROOT, dirArg.slice('--dir='.length)) : ROOT;

if (help) {
  console.log(`z_markdown_table_compact

Compacts markdown table rows for markdownlint MD060 style "compact":
  |  padded  |  col b  |
to:
  | padded | col b |
(one space after each opening column pipe and before each closing column pipe; trims cell text only.)

Options:
  --dir=REL   Root-relative directory to scan (default: repo root)
  --dry-run   Show what would change, do not write files
  --help      Show this help
`);
  process.exit(0);
}

const IGNORE_DIR_NAMES = new Set(['.git', '.cursor', '.pytest_cache', 'node_modules', 'safe_pack']);
const IGNORE_PATH_PARTS = [
  path.normalize(path.join('Amk_Goku Worldwide Loterry', 'exports')),
  path.normalize(path.join('apps', 'web', '.next')),
];

function shouldSkipDir(absDir) {
  const base = path.basename(absDir);
  if (IGNORE_DIR_NAMES.has(base)) return true;
  const rel = path.normalize(path.relative(ROOT, absDir));
  return IGNORE_PATH_PARTS.some((segment) => rel.includes(segment));
}

function shouldSkipFile(absFile) {
  const rel = path.relative(ROOT, absFile).replace(/\\/g, '/');
  if (!rel.endsWith('.md')) return true;
  if (/^docs\/ZALS_DELIVERABLE_.*\.md$/i.test(rel)) return true;
  return false;
}

async function collectMarkdownFiles(startDir) {
  const out = [];
  const queue = [startDir];

  while (queue.length) {
    const dir = queue.pop();
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!shouldSkipDir(abs)) queue.push(abs);
        continue;
      }
      if (entry.isFile() && !shouldSkipFile(abs)) out.push(abs);
    }
  }

  return out;
}

function isTableRow(line) {
  if (!line) return false;
  if (!line.includes('|')) return false;
  if (!/^\s*\|.*\|\s*$/.test(line)) return false;
  const parts = line.trim().split('|');
  // Leading/trailing empty from split: need at least one cell (single-column is length 3).
  const cells = parts.slice(1, -1);
  return cells.length >= 1;
}

function compactTableRow(line) {
  const trimmed = line.trim();
  const parts = trimmed.split('|');
  const cells = parts.slice(1, -1).map((cell) => cell.trim());
  if (cells.length === 0) return trimmed;
  // MD060 style "compact": one space around non-empty cell text; empty cells are `|` with no padding
  // (avoid `join(' | ')` which turns `||` into `|  |`).
  let row = '|';
  for (const cell of cells) {
    if (cell.length === 0) {
      row += ' |';
    } else {
      row += ` ${cell} |`;
    }
  }
  return row;
}

function compactMarkdownTables(content) {
  const lines = content.split(/\r?\n/);
  let changed = false;
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!isTableRow(line)) continue;

    const next = compactTableRow(line);
    if (next !== line.trim()) {
      lines[i] = next;
      changed = true;
    }
  }

  return { changed, content: lines.join('\n') };
}

async function main() {
  const files = await collectMarkdownFiles(startDir);
  let changedFiles = 0;
  let changedRows = 0;

  for (const file of files) {
    let raw = '';
    try {
      raw = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }

    const beforeRows = raw.split(/\r?\n/).filter(isTableRow).length;
    const result = compactMarkdownTables(raw);
    if (!result.changed) continue;

    const afterRows = result.content.split(/\r?\n/).filter(isTableRow).length;
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    changedFiles += 1;
    changedRows += Math.max(0, beforeRows - afterRows) + 1;

    if (dryRun) {
      console.log(`[dry-run] compacted table spacing in ${rel}`);
      continue;
    }

    await fs.writeFile(file, result.content, 'utf8');
    console.log(`compacted table spacing in ${rel}`);
  }

  const mode = dryRun ? 'dry-run' : 'apply';
  const rootRel = path.relative(ROOT, startDir).replace(/\\/g, '/') || '.';
  console.log(
    `z_markdown_table_compact (${mode}) from ${rootRel}: ${changedFiles} file(s) changed, approx ${changedRows} row group(s) touched`
  );
}

main().catch((err) => {
  console.error(`z_markdown_table_compact failed: ${err?.message || err}`);
  process.exit(1);
});
