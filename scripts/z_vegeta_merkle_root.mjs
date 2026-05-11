#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

function usage() {
  console.log('Usage: node scripts/z_vegeta_merkle_root.mjs <receipts-dir> [output-json]');
  console.log('Example: node scripts/z_vegeta_merkle_root.mjs ./receipts');
}

async function walkFiles(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walkFiles(fullPath);
      results.push(...sub);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.receipt.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildMerkleRoot(leafHashes) {
  if (leafHashes.length === 0) {
    return sha256Hex('');
  }

  let layer = [...leafHashes];
  while (layer.length > 1) {
    const next = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] ?? left;
      next.push(sha256Hex(left + right));
    }
    layer = next;
  }
  return layer[0];
}

async function main() {
  const receiptsDirArg = process.argv[2];
  const outputArg = process.argv[3];
  if (!receiptsDirArg || receiptsDirArg === '--help' || receiptsDirArg === '-h') {
    usage();
    process.exit(receiptsDirArg ? 0 : 1);
  }

  const receiptsDir = path.resolve(receiptsDirArg);
  const stat = await fs.stat(receiptsDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    throw new Error(`Receipts directory not found: ${receiptsDir}`);
  }

  const outputPath = outputArg
    ? path.resolve(outputArg)
    : path.join(receiptsDir, 'vegeta_root.merkle.json');

  const receiptFiles = await walkFiles(receiptsDir);
  receiptFiles.sort((a, b) => a.localeCompare(b));

  const leaves = [];
  for (const filePath of receiptFiles) {
    const body = await fs.readFile(filePath, 'utf8');
    leaves.push({
      file: path.relative(receiptsDir, filePath).replace(/\\/g, '/'),
      hash: sha256Hex(body),
    });
  }

  const leafHashes = leaves.map((leaf) => leaf.hash);
  const root = buildMerkleRoot(leafHashes);

  const output = {
    root,
    leafCount: leaves.length,
    leaves,
    algorithm: 'sha256',
    timestamp: new Date().toISOString(),
    sourceDir: receiptsDir.replace(/\\/g, '/'),
  };

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ outputPath, root, leafCount: leaves.length }, null, 2));
}

main().catch((error) => {
  console.error(`[z_vegeta_merkle_root] ${error.message}`);
  process.exit(1);
});
