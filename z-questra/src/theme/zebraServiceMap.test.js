import { describe, expect, it } from 'vitest';
import {
  CERTIFICATION_DISCLAIMER,
  READINESS_CARDS,
  STANDARD_READINESS_TAG,
  ZEBRA_ROLES,
  ZEBRA_LOCAL_CHECKLIST_ITEMS,
} from './zebraServiceMap.js';

describe('zebraServiceMap', () => {
  it('defines ten zebra roles with required metadata', () => {
    expect(ZEBRA_ROLES.length).toBe(10);
    for (const z of ZEBRA_ROLES) {
      expect(z.zebraId).toBeTruthy();
      expect(z.name).toBeTruthy();
      expect(z.role).toBeTruthy();
      expect(z.currentStatus).toMatch(/local_preview|gated/);
      expect(z.bridgeStatus).toBe('not_connected');
      expect(Array.isArray(z.standardReadinessTags)).toBe(true);
    }
  });

  it('includes accessibility roadmap tags without asserting compliance', () => {
    const access = ZEBRA_ROLES.find((z) => z.zebraId === 'access');
    expect(access.standardReadinessTags).toContain(STANDARD_READINESS_TAG.WCAG_2_2_READINESS);
  });

  it('readiness cards cover visual, a11y, kids, notes, scheduler, bridge, roadmap', () => {
    const ids = READINESS_CARDS.map((c) => c.id);
    expect(ids).toContain('visual-comfort');
    expect(ids).toContain('cert-roadmap');
  });

  it('disclaimer avoids claiming official certification', () => {
    expect(CERTIFICATION_DISCLAIMER.toLowerCase()).toContain('official certification');
    expect(CERTIFICATION_DISCLAIMER.toLowerCase()).not.toContain('we are certified');
  });

  it('local checklist has preview items', () => {
    expect(ZEBRA_LOCAL_CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(4);
  });
});
