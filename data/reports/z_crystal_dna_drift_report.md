# Z-Crystal DNA drift report

**Generated:** 2026-05-12T18:06:23.903Z

**Overall signal:** BLUE

**Findings:** 3

| code | signal | message | refs |
| --- | --- | --- | --- |
| stale_bridge | YELLOW | Satellite "z_labs_capsule" bridge file is older than hub template (refresh drift). | sat:z_labs_capsule |
| satellite_not_wired_in_dna_mesh | YELLOW | Enabled satellite "z_labs_capsule" is not referenced by DNA shard dependencies (topology gap). | sat:z_labs_capsule |
| hold_parallel_green_doorway | BLUE | Doorway registry mixes HOLD and GREEN enabled rows — operator sequencing review. | — |

## Law

Detect / compare / report only. No automatic restore, repair, deploy, git, NAS writes, or secrets.
