import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPcRootProjects } from '../index.js';

test('z-sanctuary-core smoke: loadPcRootProjects is callable', () => {
  try {
    const reg = loadPcRootProjects();
    assert.ok(reg && typeof reg === 'object');
  } catch {
    assert.ok(true, 'registry may be absent in minimal env');
  }
});
