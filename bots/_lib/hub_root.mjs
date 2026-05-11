import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Hub root (ZSanctuary_Universe) from any `bots/<name>/*.mjs` file URL. */
export function hubRoot(importMetaUrl) {
  const dir = path.dirname(fileURLToPath(importMetaUrl));
  return path.resolve(dir, '../..');
}
