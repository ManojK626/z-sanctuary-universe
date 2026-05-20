# Z-Qualified Operator Access Ladder (Phase 0)

**Lane:** Z-QOAL-0  
**Purpose:** Prevent accidental overexposure of internal governance, formula doctrine, and topology truth.

Machine policy: `data/z_qualified_operator_access_policy.json`.

---

## Access levels

| Level | ID | May access | Must not |
| --------------------- | ------------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| **Public** | `public` | Outcomes, safeguards, short formula explanations | Full Ω notation, internal registries, deploy keys |
| **Contributors** | `contributors` | Public + limited topology summaries (ECO-MAP summaries) | Formula core, payment lanes, NAS paths |
| **Trusted operators** | `trusted_operators` | Governance docs, Z-ATE, Z-MDE, Z-FUSION, Z-WORK-PULSE, traffic reports | Change sacred policy without PR + AMK |
| **Core guardians** | `core_guardians` | Z-FORMULA-CORE, full stack map, qualified formula doc | Auto-merge, deploy, payment mutation |
| **AMK** | `amk_sacred` | All lanes + sacred moves | Delegate sacred authority without explicit charter |

Default for AI assistants in public contexts: **`public`** posture unless hub session is chartered.

---

## Document exposure matrix (summary)

| Doc class | public | contributors | trusted | core | AMK |
| ----------------------------------------- | ------------- | ---------------- | ---------- | ---- | --- |
| Z-FORMULAS-SHORT / PUBLIC-POLICY | yes | yes | yes | yes | yes |
| Z_GOVERNANCE_CIVILIZATION_STACK (summary) | outcomes only | partial | yes | yes | yes |
| Z-FORMULA-CORE / Z-ULTRA-INSTINCTS full | no | no | no | yes | yes |
| Payment / legal governance | no | no | supervised | yes | yes |
| `data/z_*_policy.json` internals | no | read-only subset | yes | yes | yes |

---

## AI and Cursor posture

- **Hub Cursor sessions** (chartered): may read full stack for Turtle PRs; still **no** sacred execution.
- **Cloud / unrestricted assistants:** treat as **public** unless operator explicitly opens qualified context.
- Never paste protected formula blocks into public repos, marketing, or client-facing sites.

---

## Relationship to Z-ATE

| Z-ATE label | Typical minimum operator level |
| --------------------- | ---------------------------------- |
| `AUTO_APPROVED` | trusted_operators + evidence gates |
| `SUPERVISED_REQUIRED` | trusted_operators |
| `AMK_REQUIRED` | amk_sacred |
| `BLOCKED` | all levels stop |

---

## Phase roadmap

| Phase | Scope |
| ----- | -------------------------------------------------------- |
| **0** | This ladder + JSON policy |
| **1** | Dashboard lens: show operator level hint (read-only) |
| **2** | Optional auth gate on internal panels (human-configured) |

No IAM product in Phase 0.

---

## Related

- [Z_GOVERNANCE_CIVILIZATION_STACK.md](./Z_GOVERNANCE_CIVILIZATION_STACK.md)
- [Z_FORMULA_CORE_REASONING_SPINE.md](./Z_FORMULA_CORE_REASONING_SPINE.md)
- [Z-FORMULAS-PUBLIC-POLICY.md](./Z-FORMULAS-PUBLIC-POLICY.md)
