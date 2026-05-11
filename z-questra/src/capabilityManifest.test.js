import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(__dirname, '..', 'data', 'z_questra_capability_manifest.json');

describe('z_questra_capability_manifest (QX-1)', () => {
  it('parses JSON and matches cross-project access contract', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf8'));
    expect(m.schema).toBe('z_questra_capability_manifest_v1');
    expect(m.project).toBe('z-questra');
    expect(typeof m.version).toBe('string');
    expect(m.version.length).toBeGreaterThan(0);
    expect(m.bridge_status).toBe('reference_only');
    expect(m.memory_status).toBe('local_only_or_future_gated');
    expect(m.drp_gate_required).toBe(true);
    expect(m.charter_required_for_live_bridge).toBe(true);

    const caps = [
      'comfort_modes',
      'accessibility_toolset',
      'z_zebras_readiness',
      'local_notebook',
      'notebook_import_export',
      'playgarden_2d_canvas',
      'uncertainty_kaleidoscope',
      'receipt_poster',
      'z_music_engine_sme',
      'future_shape_canvas',
      'future_visual_mapper',
    ];
    expect(m.capabilities).toEqual(caps);

    expect(m.allowed_reuse_modes).toEqual(['docs_link', 'hub_catalog_reference', 'manual_operator_launch']);
    expect(m.future_gated_reuse_modes).toEqual([
      'iframe_embed',
      'shared_component_package',
      'local_file_bridge',
      'cross_project_memory',
      'live_service_api',
    ]);

    const forbidden = [
      'cloud_sync',
      'email_calendar_api',
      'live_ai_generation',
      'provider_calls',
      'multiplayer',
      'payments',
      'kids_online_sharing',
      'gambling_or_prediction_mechanics',
      'heavy_3d_engine',
    ];
    expect(m.forbidden_without_charter).toEqual(forbidden);
  });
});
