/**
 * Local route explorer — labels only; no network or bridge.
 */

export const ROUTE_STATUS = {
  ACTIVE: 'active',
  LOCAL_ONLY: 'local_only',
  GATED: 'gated',
};

/** Ordered trail through Z-QUESTRA surfaces (Comfort Zone mental model). */
export const ROUTE_FLOW = [
  {
    id: 'comfort',
    label: 'Comfort',
    status: ROUTE_STATUS.ACTIVE,
    detail: 'Comfort bar · age modes · dyslexia-friendly paths',
  },
  {
    id: 'notes',
    label: 'Notes',
    status: ROUTE_STATUS.ACTIVE,
    detail: 'Local Notebook · opt-in memory · guardian preview',
  },
  {
    id: 'playgarden',
    label: 'PlayGarden',
    status: ROUTE_STATUS.LOCAL_ONLY,
    detail: 'Kaleidoscope + receipt poster + garden — UI only, no hub runtime (see questra.playgarden.local metadata)',
  },
  {
    id: 'zebras',
    label: 'Zebras',
    status: ROUTE_STATUS.ACTIVE,
    detail: 'Z-Zebras Family · readiness cards',
  },
  {
    id: 'learning',
    label: 'Learning',
    status: ROUTE_STATUS.ACTIVE,
    detail: 'Learning cards panel',
  },
  {
    id: 'guardian',
    label: 'Guardian',
    status: ROUTE_STATUS.ACTIVE,
    detail: 'filterOutput & local posture · no live hub calls in this build',
  },
  {
    id: 'bridge',
    label: 'Future Bridge',
    status: ROUTE_STATUS.GATED,
    detail: 'Sanctuary bridge · blocked until DRP + human gate',
  },
];

export function routeStatusLabel(status) {
  if (status === ROUTE_STATUS.GATED) return 'Gated — not active';
  if (status === ROUTE_STATUS.LOCAL_ONLY) return 'Local only';
  return 'Active';
}

export function countRoutesByStatus(status) {
  return ROUTE_FLOW.filter((r) => r.status === status).length;
}
