# Z-MAOS — Cross-Project Linking Policy

**Purpose:** **Cross-link, don’t cross-contaminate.**

---

## 1. Allowed

- Docs and registry **pointers** (`repoPathNote`, URLs to internal docs).
- `data/z_pc_root_projects.json` as roster truth.
- Reference-only entries for XL2 and other satellites.

---

## 2. Forbidden without charter

- Importing satellite **source** into hub to “speed up” work.
- Shared secrets or tokens across repos.
- Hub scripts that **write** into sibling repo trees.
- Implicit coupling (hardcoded paths to one machine) checked into JSON without `repoPath: null` + note.

---

## 3. XL2

**Reference-only** in hub manifests until a **separate approved** Z-Sanctuary ↔ XL2 coupling charter exists.

---

## 4. Z-UCCR / Z-HOAI

Visual and triage doctrines link outward; they do not become merge channels for product code.
