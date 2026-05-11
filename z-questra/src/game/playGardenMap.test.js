import { describe, expect, it } from 'vitest';
import { ROUTE_FLOW, ROUTE_STATUS, countRoutesByStatus, routeStatusLabel } from './playGardenMap.js';

describe('playGardenMap', () => {
  it('includes a gated future bridge', () => {
    const bridge = ROUTE_FLOW.find((r) => r.id === 'bridge');
    expect(bridge?.status).toBe(ROUTE_STATUS.GATED);
    expect(routeStatusLabel(ROUTE_STATUS.GATED)).toContain('Gated');
  });

  it('counts active routes', () => {
    expect(countRoutesByStatus(ROUTE_STATUS.ACTIVE)).toBeGreaterThanOrEqual(4);
  });

  it('marks PlayGarden as local-only surface', () => {
    const pg = ROUTE_FLOW.find((r) => r.id === 'playgarden');
    expect(pg?.status).toBe(ROUTE_STATUS.LOCAL_ONLY);
  });
});
