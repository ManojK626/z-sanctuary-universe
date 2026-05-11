import { describe, expect, it } from 'vitest';
import { getRouteMeta, sanctuaryRouteMap } from './sanctuaryRouteMap.js';

describe('sanctuaryRouteMap', () => {
  it('is local-only metadata with no live bridge', () => {
    expect(sanctuaryRouteMap.localApp).toBe('z-questra');
    expect(sanctuaryRouteMap.bridgeStatus).toBe('not_connected');
    expect(sanctuaryRouteMap.posture).toBe('frontend_metadata_only');
  });

  it('exposes routes with required panel fields', () => {
    expect(sanctuaryRouteMap.routes.length).toBeGreaterThanOrEqual(2);
    for (const r of sanctuaryRouteMap.routes) {
      expect(r.panelId).toBeTruthy();
      expect(r.routeKey).toMatch(/\.local$/);
      expect(r.sanctuaryFamily).toBeTruthy();
      expect(r.guardianLevel).toBeTruthy();
      expect(Array.isArray(r.ageModes)).toBe(true);
      expect(r.accessibilityRole).toBeTruthy();
      expect(r.status).toBe('local_only');
    }
  });

  it('getRouteMeta finds zuno-guide', () => {
    const m = getRouteMeta('zuno-guide');
    expect(m?.futureBridge).toContain('zuno');
  });
});
