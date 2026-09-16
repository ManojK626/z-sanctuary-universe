import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { observe, formatReport } from './z_seif_phase1_observe.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function git(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true });
  assert.equal(r.status, 0, r.stderr || r.error?.message || args.join(' '));
  return (r.stdout || '').trim();
}

function makeFixture({ origin, hubRepo, provenance, receipts } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'z-seif-observe-'));
  writeJson(path.join(dir, 'data', 'z_atlas', 'z_atlas_registry_v0_5.json'), {
    nodes: [
      {
        nodeId: 'root.z-sanctuary-universe',
        nodeType: 'ROOT',
        label: 'Z_Sanctuary_Universe hub',
        gateState: 'HOLD',
        healthState: 'UNKNOWN',
      },
    ],
    edges: [],
  });
  writeJson(path.join(dir, 'data', 'z_pc_root_projects.json'), {
    projects: [{ id: 'z-sanctuary-universe', name: 'Z_Sanctuary_Universe', path: 'Z_Sanctuary_Universe', role: 'hub' }],
  });
  const repos = hubRepo
    ? [{ full_name: hubRepo, html_url: `https://github.com/${hubRepo}`, role: 'hub' }]
    : [{ full_name: 'ManojK626/zuno-outreach', html_url: 'https://github.com/ManojK626/zuno-outreach', role: 'zuno_outreach' }];
  writeJson(path.join(dir, 'data', 'z_ecosystem_github_identity.json'), {
    github: { login: 'ManojK626' },
    ecosystem_repos: repos,
  });
  if (provenance) {
    writeJson(path.join(dir, 'config', 'provenance_manifest.json'), provenance);
  }
  if (receipts) {
    fs.mkdirSync(path.join(dir, 'docs', 'z_seif'), { recursive: true });
    for (const [name, body] of Object.entries(receipts)) {
      fs.writeFileSync(path.join(dir, 'docs', 'z_seif', name), body, 'utf8');
    }
  }
  git(dir, ['init']);
  git(dir, ['config', 'user.email', 'seif-test@example.invalid']);
  git(dir, ['config', 'user.name', 'seif-test']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
  fs.writeFileSync(path.join(dir, 'README.md'), 'fixture\n', 'utf8');
  git(dir, ['add', 'README.md']);
  git(dir, ['commit', '-m', 'fixture']);
  git(dir, ['remote', 'add', 'origin', origin || 'https://github.com/example/unrelated.git']);
  return dir;
}

test('Atlas identity loads from present canonical source', () => {
  const result = observe({ hubRoot: ROOT });
  assert.equal(result.ok, true);
  assert.match(result.projectIdentity, /Z_Sanctuary_Universe/);
  assert.match(result.identitySource, /Z-Atlas registry v0\.5/);
  assert.equal(result.atlasGateState, 'HOLD');
});

test('absent universe project registry is not required', () => {
  const registry = path.join(ROOT, 'data', 'z_universe_project_registry.json');
  assert.equal(fs.existsSync(registry), false);
  const result = observe({ hubRoot: ROOT });
  assert.equal(result.ok, true);
  assert.equal(result.universeRegistryUsed, false);
});

test('matching origin produces MATCH when expected identity is canonically available', () => {
  const dir = makeFixture({
    origin: 'https://github.com/ManojK626/z-sanctuary-universe.git',
    hubRepo: 'ManojK626/z-sanctuary-universe',
  });
  const result = observe({ hubRoot: dir });
  assert.equal(result.expectedRepository, 'ManojK626/z-sanctuary-universe');
  assert.equal(result.repositoryMatch, 'MATCH');
  assert.ok(!result.signals.includes('REPOSITORY_MISMATCH'));
});

test('mismatched origin produces REPOSITORY_MISMATCH / CONFLICT without mutation', () => {
  const dir = makeFixture({
    origin: 'https://github.com/example/other.git',
    hubRepo: 'ManojK626/z-sanctuary-universe',
  });
  const before = git(dir, ['status', '--porcelain']);
  const result = observe({ hubRoot: dir });
  const after = git(dir, ['status', '--porcelain']);
  assert.equal(result.repositoryMatch, 'CONFLICT');
  assert.ok(result.signals.includes('REPOSITORY_MISMATCH'));
  assert.equal(after, before);
});

test('missing expected repo produces UNKNOWN rather than fabricated MATCH', () => {
  const result = observe({ hubRoot: ROOT });
  assert.equal(result.expectedRepository, 'UNKNOWN');
  assert.equal(result.repositoryMatch, 'UNKNOWN');
  assert.notEqual(result.repositoryMatch, 'MATCH');
});

test('Cloudflare without authorized live read is UNKNOWN', () => {
  const result = observe({ hubRoot: ROOT });
  assert.equal(result.cloudflareRuntime, 'UNKNOWN');
  assert.equal(result.cloudflareEvidence, 'LIVE_READ_NOT_AUTHORIZED_IN_THIS_SLICE');
  assert.equal(result.cloudflareLiveRead, 'NOT_ATTEMPTED');
  assert.ok(result.signals.includes('PROVIDER_STATE_UNKNOWN'));
});

test('missing optional receipt produces UNKNOWN without crashing', () => {
  const dir = makeFixture({ origin: 'https://github.com/example/other.git' });
  const result = observe({ hubRoot: dir });
  assert.equal(result.ok, true);
  assert.match(result.receiptEvidence, /UNKNOWN/);
  assert.match(result.provenance, /UNKNOWN/);
});

test('output contains no secret-looking values', () => {
  const result = observe({ hubRoot: ROOT });
  const text = formatReport(result);
  assert.equal(/(ghp_|gho_|github_pat_|sk-|CLOUDFLARE_API|BEGIN [A-Z ]*PRIVATE KEY)/i.test(text), false);
  assert.equal(/C:\\Z-Wheel Cracker/i.test(text), false);
});

test('observer writes no registry or state file', () => {
  const seifData = path.join(ROOT, 'data', 'z_seif');
  const existed = fs.existsSync(seifData);
  observe({ hubRoot: ROOT });
  assert.equal(fs.existsSync(seifData), existed);
});

test('running observer twice does not change tracked files', () => {
  const before = git(ROOT, ['status', '--porcelain']);
  observe({ hubRoot: ROOT });
  observe({ hubRoot: ROOT });
  const after = git(ROOT, ['status', '--porcelain']);
  assert.equal(after, before);
});
