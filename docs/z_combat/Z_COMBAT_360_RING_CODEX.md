<!-- Z: docs\z_combat\Z_COMBAT_360_RING_CODEX.md -->

# Z Combat 360 Ring Codex (AMK-Goku Vision)

Version: 1.1
Status: Draft for Review -> Verify -> Apply

## 1. Purpose

This codex defines the 360-degree ring model with voxel cubes, body-reach expansion, animal archetype overlays, and the last-inch 270-degree twist booster. It is designed to be integrated into the Z-Sanctuary Super Saiyan core as a performance engine for movement, timing, and impact precision.

## 2. Core Concepts

- Center of gravity is the origin (0,0,0).
- 360-degree rings expand from the center in radial shells.
- Each shell is subdivided into uniform cubic voxels (4-5 cm recommended).
- Each voxel stores reach, angle, movement type, and impact potential.
- The last inch before impact is a boost zone for precision twist and breath release.

## 3. Units and Dimensions

- Default unit: centimeters.
- Voxel (cube) size: 4-5 cm.
- Minimum reach segment: 3-5 cm (micro reach for flex and breath burst).
- Body reach radius expands by limb length and posture mode.

## 4. 360 Ring System

A ring system is defined as a set of concentric shells:

- Ring 0: center (core gravity).
- Ring 1..N: radial shells expanding outward in increments of voxel size.

Each ring is indexed by:

- ring_index (integer)
- ring_radius_cm = ring_index \* voxel_size_cm

## 5. Voxel Lattice

The 360 space is discretized into cubic voxels that form a spherical lattice around the core.
Each voxel stores:

- position (x,y,z)
- radius (distance from center)
- angle (azimuth and elevation)
- permitted movement types
- contact potential score

## 6. Body Segment Mapping

All movement is mapped by segment reach.
Suggested segments:

- head_front, head_back
- shoulders_left/right
- elbows_left/right
- hands_left/right
- torso
- hips
- knees_left/right
- feet_left/right

Each segment has:

- max_reach_cm
- default posture offset
- movement constraints

## 7. Movement Types

- strike_linear (jab, thrust)
- strike_arc (hook, round)
- strike_vertical (upper)
- kick_front
- kick_side
- kick_round
- elbow_close
- knee_close
- ground_roll
- ground_recover

Each movement maps to voxel sectors (angles + range).

## 8. Animal Archetype Overlays

Each archetype modifies movement angles, timing, and posture:

- serpent: coil + twist priority, continuous angular flow
- caterpillar: segmented wave acceleration, step chaining
- cockroach: inversion recovery and low-ground vertical response
- mantis: precision lock + snap strike
- jaguar: composed burst, fast reach calculation
- tiger: relentless pressure, timing control, strike release

Overlay rules:

- applies modifiers to timing, reach, and preferred angles
- can be toggled per training mode

## 9. Ground and Inversion Modes

- ground mode: posture flips to horizontal plane; voxels map to body line on ground.
- inversion mode: back/side recovery mapping for cockroach overlay.
- quadruped mode: jaguar/tiger angle sets on 4-limb base.

## 10. Last-Inch Booster (Sharpest Booster)

Definition:

- the final 1 inch (2.54 cm) before contact is the boost zone.
- activated when target voxel distance <= 2.54 cm.

Boost mechanics:

- apply 270-degree micro-twist (not full 360).
- align twist axis with target angle.
- synchronize with breath release.

Effect:

- maximum impulse transfer within a minimal distance.
- reduces overshoot and improves precision.

## 11. Power Efficiency Curve (Per Ring)

To avoid brute-force scaling, apply a power curve:

- power rises from ring 0 to mid-range, then tapers.
- this prioritizes precision and control over raw distance.

Suggested curve (concept):

- ring 0..mid: power_scale increases linearly
- mid..max: power_scale decreases by a decay factor

## 12. Micro-Stability Trigger

Before booster activation, perform a micro-stability check (50-80 ms):

- If balance >= threshold -> allow 270-degree twist
- If balance < threshold -> reduce to 180-degree twist

## 13. Dual-Axis Twist (Optional)

For serpent/mantis modes, allow a secondary micro-roll axis:

- improves cutting-angle precision
- kept under safety torque limits

## 14. Breath-Lock Pulse (6-9-8)

Bind the booster to your 6-9-8 cadence:

- 6 = align
- 9 = lock
- 8 = release

This creates a timing key that fuses biomechanics with ritual control.

## 15. Voxel Priority Memory (BeeVision)

Store top 7 most-used voxels per session:

- creates reactive defense zones
- speeds next-move targeting
- forms personalized movement lanes

## 16. Adaptive Animal Stacking

Allow blended overlays:

- jaguar + mantis = precision burst
- tiger + serpent = relentless flow

This yields hybrid modes for advanced performance.

## 17. Silent Threat Ring

Add a passive 360 ring that maps danger zones:

- no action, only awareness
- helps defensive movement
- improves timing for entry/exit

## 18. Control Formula (Conceptual)

Let:

- d = distance to target
- r = ring radius
- t = twist angle
- b = breath factor (0..1)
- p = power_scale from ring curve

If d <= 2.54 cm:

- t = 270 degrees (unless stability fails)
- `impact_power = base_power * (1 + b) * twist_multiplier * p`

Where twist_multiplier is derived from posture + archetype overlay.

## 19. Safety and Limits

- The booster should not exceed user-defined torque limits.
- If posture is unstable, reduce twist to 180 degrees.
- If breath sync is missing, reduce multiplier to avoid imbalance.

## 20. Integration Notes

- This codex is to be linked with the Z-Sanctuary Super Saiyan core.
- Each movement decision should be logged to the Vault Echo Archive.
- The 360 ring can be visualized as a radial map with voxel highlights.

## 21. Review Checklist

- Voxel size confirmed
- Body segment lengths configured
- Archetype overlays enabled
- Booster limits set
- Power curve defined
- Stability thresholds validated

End of Codex
