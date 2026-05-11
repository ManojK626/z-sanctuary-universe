/**
 * Frontend-only route / bridge metadata.
 * No network calls — names for future Z-Sanctuary dashboard linking only.
 */

export const sanctuaryRouteMap = {
  localApp: 'z-questra',
  bridgeStatus: 'not_connected',
  posture: 'frontend_metadata_only',
  routes: [
    {
      panelId: 'zuno-guide',
      routeKey: 'zuno.guide.local',
      sanctuaryFamily: 'zuno_guidance',
      guardianLevel: 'standard',
      ageModes: ['kids', 'teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/zuno-guide',
      status: 'local_only',
    },
    {
      panelId: 'learning-cards',
      routeKey: 'learning.cards.local',
      sanctuaryFamily: 'education',
      guardianLevel: 'age_mode_filtered',
      ageModes: ['kids', 'teens', 'adults'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/learning',
      status: 'local_only',
    },
    {
      panelId: 'workstation-shell',
      routeKey: 'questra.shell.local',
      sanctuaryFamily: 'workstation',
      guardianLevel: 'standard',
      ageModes: ['teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/hodp-placeholder',
      status: 'local_only',
    },
    {
      panelId: 'visual-structure',
      routeKey: 'structure.view.local',
      sanctuaryFamily: 'knowledge_visual',
      guardianLevel: 'standard',
      ageModes: ['kids', 'teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/visual-structure-placeholder',
      status: 'local_only',
    },
    {
      panelId: 'local-notebook',
      routeKey: 'questra.notes.local',
      sanctuaryFamily: 'notes_local',
      guardianLevel: 'standard',
      ageModes: ['kids', 'teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/notes-placeholder',
      status: 'local_only',
    },
    {
      panelId: 'play-garden',
      routeKey: 'questra.playgarden.local',
      sanctuaryFamily: 'play_garden',
      guardianLevel: 'standard',
      ageModes: ['kids', 'teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/play-garden-placeholder',
      status: 'local_only',
    },
    {
      panelId: 'z-music-engine',
      routeKey: 'questra.music.local',
      sanctuaryFamily: 'z_music_engine',
      guardianLevel: 'age_mode_filtered',
      ageModes: ['kids', 'teens', 'adults', 'enterprise'],
      accessibilityRole: 'region',
      futureBridge: 'z-sanctuary/amk-goku-commander-placeholder',
      status: 'local_only',
    },
  ],
};

export function getRouteMeta(panelId) {
  return sanctuaryRouteMap.routes.find((r) => r.panelId === panelId) || null;
}

export function assertLocalOnlyBridge(meta) {
  if (!meta) return true;
  return meta.status === 'local_only' || meta.bridgeStatus === 'not_connected';
}
