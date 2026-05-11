import fs from 'node:fs';
import path from 'node:path';

export function resolveLabRoot(root = process.cwd()) {
  const internalPrimary = path.join(root, 'Z_Labs');
  const internalLegacy = path.join(root, 'ZSanctuary_Labs');

  const candidates = [internalPrimary, internalLegacy];
  const existing = candidates.find((candidate) => fs.existsSync(candidate));

  return {
    labRoot: existing || internalPrimary,
    policy: {
      mode: 'internal-only',
      primary: internalPrimary.replace(/\\/g, '/'),
      legacy_fallback: internalLegacy.replace(/\\/g, '/'),
      note: 'Lab automation is restricted to in-repo lab roots to avoid cross-project linkage.',
    },
  };
}
