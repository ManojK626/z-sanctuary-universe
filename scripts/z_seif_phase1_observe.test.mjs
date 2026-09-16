import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { observe, formatReport } from './z_seif_phase1_observe.mjs';
import { parseObserveArgs } from './z_seif_github_public_evidence.mjs';

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

test('Atlas identity loads from present canonical source', async () => {
  const result = await observe({ hubRoot: ROOT });
  assert.equal(result.ok, true);
  assert.match(result.projectIdentity, /Z_Sanctuary_Universe/);
  assert.match(result.identitySource, /Z-Atlas registry v0\.5/);
  assert.equal(result.atlasGateState, 'HOLD');
});

test('absent universe project registry is not required', async () => {
  const registry = path.join(ROOT, 'data', 'z_universe_project_registry.json');
  assert.equal(fs.existsSync(registry), false);
  const result = await observe({ hubRoot: ROOT });
  assert.equal(result.ok, true);
  assert.equal(result.universeRegistryUsed, false);
});

test('matching origin produces MATCH when expected identity is canonically available', async () => {
  const dir = makeFixture({
    origin: 'https://github.com/ManojK626/z-sanctuary-universe.git',
    hubRepo: 'ManojK626/z-sanctuary-universe',
  });
  const result = await observe({ hubRoot: dir });
  assert.equal(result.expectedRepository, 'ManojK626/z-sanctuary-universe');
  assert.equal(result.repositoryMatch, 'MATCH');
  assert.ok(!result.signals.includes('REPOSITORY_MISMATCH'));
});

test('mismatched origin produces REPOSITORY_MISMATCH / CONFLICT without mutation', async () => {
  const dir = makeFixture({
    origin: 'https://github.com/example/other.git',
    hubRepo: 'ManojK626/z-sanctuary-universe',
  });
  const before = git(dir, ['status', '--porcelain']);
  const result = await observe({ hubRoot: dir });
  const after = git(dir, ['status', '--porcelain']);
  assert.equal(result.repositoryMatch, 'CONFLICT');
  assert.ok(result.signals.includes('REPOSITORY_MISMATCH'));
  assert.equal(after, before);
});

test('missing expected repo produces UNKNOWN rather than fabricated MATCH', async () => {
  const result = await observe({ hubRoot: ROOT });
  assert.equal(result.expectedRepository, 'UNKNOWN');
  assert.equal(result.repositoryMatch, 'UNKNOWN');
  assert.notEqual(result.repositoryMatch, 'MATCH');
});

test('Cloudflare without authorized live read is UNKNOWN', async () => {
  const result = await observe({ hubRoot: ROOT });
  assert.equal(result.cloudflareRuntime, 'UNKNOWN');
  assert.equal(result.cloudflareEvidence, 'LIVE_READ_NOT_AUTHORIZED_IN_THIS_SLICE');
  assert.equal(result.cloudflareLiveRead, 'NOT_ATTEMPTED');
  assert.ok(result.signals.includes('PROVIDER_STATE_UNKNOWN'));
});

test('missing optional receipt produces UNKNOWN without crashing', async () => {
  const dir = makeFixture({ origin: 'https://github.com/example/other.git' });
  const result = await observe({ hubRoot: dir });
  assert.equal(result.ok, true);
  assert.match(result.receiptEvidence, /UNKNOWN/);
  assert.match(result.provenance, /UNKNOWN/);
});

test('output contains no secret-looking values', async () => {
  const result = await observe({ hubRoot: ROOT });
  const text = formatReport(result);
  assert.equal(/(ghp_|gho_|github_pat_|sk-|CLOUDFLARE_API|BEGIN [A-Z ]*PRIVATE KEY)/i.test(text), false);
  assert.equal(/C:\\Z-Wheel Cracker/i.test(text), false);
});

test('observer writes no registry or state file', async () => {
  const seifData = path.join(ROOT, 'data', 'z_seif');
  const existed = fs.existsSync(seifData);
  await observe({ hubRoot: ROOT });
  assert.equal(fs.existsSync(seifData), existed);
});

test('running observer twice does not change tracked files', async () => {
  const before = git(ROOT, ['status', '--porcelain']);
  await observe({ hubRoot: ROOT });
  await observe({ hubRoot: ROOT });
  const after = git(ROOT, ['status', '--porcelain']);
  assert.equal(after, before);
});

function mockGithubFetch(router) {
  const fetchImpl = async (url, init = {}) => {
    fetchImpl.calls.push({ url, init });
    const spec = router(url, init) || { status: 500, body: {} };
    if (spec.networkError) throw new Error('network down');
    return {
      status: spec.status,
      headers: {
        get(name) {
          if (String(name).toLowerCase() === 'x-ratelimit-remaining') return '48';
          return null;
        },
      },
      async text() {
        if (spec.raw === '') return '';
        return JSON.stringify(spec.body ?? {});
      },
    };
  };
  fetchImpl.calls = [];
  return fetchImpl;
}

function allowlistedDir() {
  return makeFixture({ origin: 'https://github.com/ManojK626/z-sanctuary-universe.git' });
}

function successRouter(head) {
  return (url) => {
    if (url.endsWith('/repos/ManojK626/z-sanctuary-universe')) {
      return {
        status: 200,
        body: {
          full_name: 'ManojK626/z-sanctuary-universe',
          private: false,
          archived: false,
          default_branch: 'main',
        },
      };
    }
    if (url.endsWith('/repos/ManojK626/z-sanctuary-universe/branches/main')) {
      return { status: 200, body: { name: 'main', protected: true, commit: { sha: 'abc123def' } } };
    }
    if (url.includes(`/repos/ManojK626/z-sanctuary-universe/commits/${head}`)) {
      return { status: 200, body: { sha: head, parents: [{ sha: 'parent1' }] } };
    }
    if (url.includes(`/repos/ManojK626/z-sanctuary-universe/actions/runs?head_sha=${head}`)) {
      return {
        status: 200,
        body: { workflow_runs: [{ name: 'CI', conclusion: 'success', status: 'completed', id: 1 }] },
      };
    }
    return { status: 500, body: { message: 'unexpected' } };
  };
}

test('local-only observer performs ZERO GitHub network calls', async () => {
  const fetchImpl = mockGithubFetch(() => ({ status: 200, body: {} }));
  const result = await observe({ hubRoot: ROOT, fetchImpl, githubPublic: false });
  assert.equal(fetchImpl.calls.length, 0);
  assert.equal(result.githubApiRead, 'NOT_ATTEMPTED');
});

test('--github-public enables the targeted reader', () => {
  assert.equal(parseObserveArgs(['--github-public']).githubPublic, true);
  assert.equal(parseObserveArgs([]).githubPublic, false);
});

test('exact allowlisted repository is accepted and GET-only without Authorization', async () => {
  const dir = allowlistedDir();
  const head = git(dir, ['rev-parse', 'HEAD']);
  const fetchImpl = mockGithubFetch(successRouter(head));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.githubApiRead, 'AVAILABLE');
  assert.equal(result.githubProbeTarget, 'ManojK626/z-sanctuary-universe');
  assert.equal(result.observedGithubRepository, 'ManojK626/z-sanctuary-universe');
  assert.equal(result.observedGithubVisibility, 'PUBLIC');
  assert.equal(result.observedDefaultBranch, 'main');
  assert.equal(result.observedRemoteBranchSha, 'abc123def');
  assert.equal(result.observedLocalHeadRemoteExistence, 'YES');
  assert.equal(result.observedRemoteCommitSha, head);
  assert.match(result.observedWorkflowState, /CI:success/);
  assert.equal(result.githubAuthorityClass, 'OBSERVED_PROVIDER_EVIDENCE');
  assert.equal(result.localRemoteProviderConsistency, 'MATCH');
  assert.equal(result.expectedRepository, 'UNKNOWN');
  assert.equal(result.repositoryMatch, 'UNKNOWN');
  assert.equal(fetchImpl.calls.length, 4);
  for (const call of fetchImpl.calls) {
    assert.equal(call.init.method, 'GET');
    assert.equal(call.init.headers.Authorization, undefined);
  }
});

test('non-allowlisted repository is NOT queried', async () => {
  const dir = makeFixture({ origin: 'https://github.com/example/other.git' });
  const fetchImpl = mockGithubFetch(() => ({ status: 200, body: {} }));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(fetchImpl.calls.length, 0);
  assert.equal(result.githubApiRead, 'NOT_ATTEMPTED');
  assert.ok(result.signals.includes('REPOSITORY_MISMATCH'));
});

test('zero workflow runs reports NO_RUNS_FOUND and does not crash', async () => {
  const dir = allowlistedDir();
  const head = git(dir, ['rev-parse', 'HEAD']);
  const fetchImpl = mockGithubFetch((url) => {
    const base = successRouter(head)(url);
    if (url.includes('/actions/runs')) return { status: 200, body: { workflow_runs: [] } };
    return base;
  });
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.ok, true);
  assert.equal(result.observedWorkflowState, 'NO_RUNS_FOUND');
  assert.equal(result.observedWorkflowRuns, '0');
});

test('repository 404 becomes NOT_FOUND_OR_NOT_VISIBLE / UNKNOWN', async () => {
  const dir = allowlistedDir();
  const fetchImpl = mockGithubFetch(() => ({ status: 404, body: { message: 'Not Found' } }));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.githubReason, 'NOT_FOUND_OR_NOT_VISIBLE');
  assert.equal(result.observedGithubRepository, 'UNKNOWN');
  assert.equal(result.expectedRepository, 'UNKNOWN');
  assert.equal(result.repositoryMatch, 'UNKNOWN');
});

test('403/rate limit becomes UNKNOWN, not product FAIL', async () => {
  const dir = allowlistedDir();
  const fetchImpl = mockGithubFetch(() => ({ status: 403, body: { message: 'rate limit' } }));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.ok, true);
  assert.equal(result.githubApiRead, 'UNAVAILABLE');
  assert.equal(result.githubReason, 'ACCESS_OR_RATE_LIMIT');
  assert.notEqual(result.atlasHealthState, 'RED');
});

test('network failure becomes PROVIDER_STATE_UNKNOWN', async () => {
  const dir = allowlistedDir();
  const fetchImpl = mockGithubFetch(() => ({ networkError: true }));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.githubApiRead, 'UNAVAILABLE');
  assert.ok(result.signals.includes('PROVIDER_STATE_UNKNOWN'));
});

test('GitHub evidence does not populate EXPECTED_REPOSITORY or promote REPOSITORY_MATCH', async () => {
  const dir = allowlistedDir();
  const head = git(dir, ['rev-parse', 'HEAD']);
  const fetchImpl = mockGithubFetch(successRouter(head));
  const result = await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  assert.equal(result.expectedRepository, 'UNKNOWN');
  assert.equal(result.repositoryMatch, 'UNKNOWN');
  assert.equal(result.localRemoteProviderConsistency, 'MATCH');
});

test('github-public observer writes no persisted API response', async () => {
  const dir = allowlistedDir();
  const head = git(dir, ['rev-parse', 'HEAD']);
  const fetchImpl = mockGithubFetch(successRouter(head));
  const before = git(dir, ['status', '--porcelain']);
  await observe({ hubRoot: dir, githubPublic: true, fetchImpl });
  const after = git(dir, ['status', '--porcelain']);
  assert.equal(after, before);
  assert.equal(fs.existsSync(path.join(dir, 'data', 'z_seif')), false);
});

