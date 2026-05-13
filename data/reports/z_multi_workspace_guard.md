# Z Multi Workspace Guard

- Generated: 2026-05-12T18:59:21.617Z
- Status: GREEN
- Workspace: CORE
- Role: production

## Checks

- [x] identity_file_present: workspace=CORE
- [x] policy_file_present: policy_version=0.2
- [x] identity_external_writes_disabled: allow_external_writes=false
- [x] multi_workspace_enabled: enabled=true
- [x] multi_workspace_strict_isolation: mode=strict
- [x] cross_workspace_writes_disabled: cross_workspace_writes=false
- [x] promotion_requires_flag: promotion_requires_explicit_flag=true
- [x] version_match_required_for_merge: require_version_match_for_merge=true
- [x] broadcast_workspace_matches_identity: broadcast.workspace=CORE
- [x] version_workspace_matches_identity: version.workspace=CORE
