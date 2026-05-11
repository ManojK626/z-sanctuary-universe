# IDE Comm-Flow Guard — diagnosis (read-only)

Generated: 2026-04-29T15:43:58.398Z
Mirror: scripts/z_ide_commflow_guard.mjs (routing block; sync manually)

Total route mismatches: **1386** (files scanned 3499).
4000-file ceiling matches IDE guard walk; totals match guard when unchanged.

## Interpretation

- Roughly 88% of mismatches (~1224 paths) fall under **Amk_Goku Worldwide Loterry/** as first segment — sibling/nested-project tree scanned under hub root, not "core hub" drift.
- Mismatches are **not necessarily bugs** — the guard applies: _(extension × first path segment ∈ ROUTING allow-list)_.
- Residual **G_misc** often pairs like `.json|dashboard` (nested `.vscode/` under dashboard) versus allow-list concentrating json under data|.vscode.
- ide_commflow_guard remains advisory; this report **does not** change comm-flow verifier output or governance JSON.
- Eco-system comm-flow **amber for IDE guard** stays until guard policy adjusts or paths narrow — diagnosis is read-only signal.

## Aggregates — by extension

- `.json`: 591
- `.md`: 430
- `.html`: 182
- `.js`: 103
- `.mjs`: 57
- `.css`: 14
- `.ts`: 9

## Aggregates — current top (first segment)

- `Amk_Goku Worldwide Loterry`: 1224
- `apps`: 28
- `All APPs`: 22
- `core_engine`: 18
- `core`: 18
- `bots`: 18
- `packages`: 12
- `docs`: 9
- `archive`: 9
- `audio`: 6
- `.vscode`: 6
- `dashboard`: 5
- `.zpam`: 4
- `.pytest_basetemp_root`: 3
- `ethics`: 1
- `deploy`: 1
- `ai_tower`: 1
- `.github`: 1

## Top pairs extension × top

- `.json|Amk_Goku Worldwide Loterry`: 539
- `.md|Amk_Goku Worldwide Loterry`: 424
- `.html|Amk_Goku Worldwide Loterry`: 167
- `.js|Amk_Goku Worldwide Loterry`: 82
- `.mjs|apps`: 28
- `.json|core`: 18
- `.mjs|bots`: 17
- `.html|All APPs`: 14
- `.mjs|packages`: 12
- `.css|Amk_Goku Worldwide Loterry`: 12
- `.ts|core_engine`: 8
- `.json|docs`: 7
- `.js|core_engine`: 7
- `.js|All APPs`: 6
- `.js|.vscode`: 6
- `.json|dashboard`: 5
- `.json|audio`: 5
- `.json|archive`: 5
- `.json|.zpam`: 4
- `.json|core_engine`: 3
- `.json|.pytest_basetemp_root`: 3
- `.md|ethics`: 1
- `.css|docs`: 1
- `.js|docs`: 1
- `.json|deploy`: 1
- `.md|bots`: 1
- `.md|audio`: 1
- `.md|archive`: 1
- `.ts|archive`: 1
- `.html|archive`: 1
- `.js|archive`: 1
- `.json|All APPs`: 1
- `.css|All APPs`: 1
- `.md|ai_tower`: 1
- `.md|.github`: 1

## Thematic clusters

- **B_sibling_amk_goku_lotto_tree** (1224): embedded_sibling_or_nested_project — Separate app tree under hub root; router uses first segment only.
- **G_misc_residual_pairs** (139): misc_extension_x_top_residual — Dashboard .vscode/json, archive, apps outliers — finer split is in aggregates.
- **A_workspace_mjs_under_packages_vs_mjs_router** (12): router_rule_vs_monorepo_convention — .mjs allow-list is scripts|tools — npm workspaces still place .mjs in packages/ (@z-sanctuary/zuno-transformation-slice)
- **D_docs_tree_json_mirror** (7): stale_or_documentation_copy — JSON mirrors (e.g. registry copies) under docs/ vs data/config allow-list
- **C_docs_tree_static_assets** (2): path_convention_vs_interface_router — docs/public and similar assets — css/js/html routed to interface/dashboard in guard
- **E_ethics_root_markdown_cluster** (1): naming_choice_vs_router — ethics/ top-level charters vs clustered docs router
- **F_deploy_edge_bundle_tree** (1): edge_layout_outside_apps_packages — Cloudflare/deploy helpers may use ts/tsx outside ROUTING defaults

## Recommended fix batches (draft — no auto-apply)

- **1. batch-01-mjs-packages-workspace** [risk:medium] ~12 files
  - ~12 files: rule allows scripts|tools only; packages/ holds workspace slices.
  - Options: Policy: extend allowedTop with `packages` for .mjs (review impact).; Policy: exempt `packages/*/…` from guard (narrow glob in future guard PR).; Do nothing — keep advisory amber (recommended until layout project).
- **2. batch-02-docs-assets-static** [risk:low] ~9 files
  - Approx 2 css/js/html + 7 json under docs/ (see clusters).
  - Options: Extend .css docs top (narrow) vs move assets to docs-approved structure.; Exempt docs/public/\*\* selectively after human review.
- **3. batch-03-ethics-and-g_misc** [risk:low] ~1 files
  - 1+ G_misc:\* — charters and one-off layouts.
  - Options: Add ethics to EXEMPT_TOPS or relocate under docs/ethics\*.
- **4. batch-04-sibling-lottery** [risk:high] ~1224 files
  - Large subtree with own layout — first-segment rule flags many extensions.
  - Options: EXEMPT first segment folder when operator accepts (careful breadth).
- **5. batch-05-deploy** [risk:medium] ~1 files
  - Deploy scaffolding outside apps|packages ts router.
  - Options: Path-scoped exemptions or widen ts allow tops for deploy/\*_/_.
- **6. batch-06-residual-misc** [risk:low] ~139 files
  - Other extension×top combos — triage via pair table before policy change.
  - Options: No bulk move until buckets A–F addressed; revisit pair histogram.

Rollback: remove `scripts/z_ide_commflow_guard_diagnosis.mjs` and `data/reports/z_ide_commflow_guard_diagnosis.{json,md}` — no behavioral change.
