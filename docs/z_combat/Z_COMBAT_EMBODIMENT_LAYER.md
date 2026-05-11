<!-- Z: docs\z_combat\Z_COMBAT_EMBODIMENT_LAYER.md -->

# Z Combat Embodiment Layer (AI Specification)

Version: 1.1
Status: Draft for Review -> Verify -> Apply

## 1. Purpose

Defines the AI embodiment layer that maps body state, environment, and intent into the Z Combat 360 Ring system. This is the interface between sensor inputs and decision outputs.

## 2. Inputs

- body_state: posture, balance, limb positions
- breath_state: inhale/hold/exhale phase
- emotion_state: calm, focused, alert, surge
- environment_state: target distance, angle, obstacles
- time_sync: internal timing markers (e.g., 10:01, 14:14)

## 3. Internal State Model

- core_state: gravity center vector
- ring_state: active ring index based on reach
- voxel_state: reachable voxels with priority scores
- archetype_state: active animal overlay
- booster_state: last-inch eligibility flag
- power_curve_state: ring power scale
- stability_state: micro-stability threshold pass/fail

## 4. Decision Logic (High Level)

1. Read body_state and environment_state
2. Compute reachable rings and voxels
3. Apply archetype modifiers
4. Evaluate booster eligibility (d <= 2.54 cm)
5. Run micro-stability check (50-80 ms)
6. Apply dual-axis twist if enabled
7. Apply breath-lock (6-9-8) if enabled
8. Select movement with highest stability + impact score
9. Emit guidance or execution plan

## 5. Output

- movement_plan: movement_type, target_voxel, twist_angle
- breath_cue: inhale/hold/exhale alignment
- stability_cue: adjust stance, reduce twist if needed
- log_entry: store to Vault Echo Archive

## 6. Modes

- training_mode: lower risk, slow timing
- combat_mode: normal timing
- precision_mode: booster zone emphasis
- ground_mode: inversion handling
- quadruped_mode: jaguar/tiger overlays

## 7. Safety Constraints

- max_twist_degrees configurable per user
- reduce twist under instability
- no booster without breath sync
- movement rejects if joint angle exceeds configured limits

## 8. Integration Points

- Z-Sanctuary Core: persistence and logging
- BeeVision v2: micro-pattern awareness
- Shadow Echo: silent feedback loop
- Time Pulse Engine: 10:01, 14:14 anchors

## 9. Testing Plan

- static posture tests
- ring reach tests
- booster activation tests
- archetype overlay tests
- ground/inversion recovery tests
- stability micro-check tests

End of Spec
