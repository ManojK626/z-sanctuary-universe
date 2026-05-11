# Z-FBAP — Fire Backs Awareness Protocol

**Purpose:** **Security and resilience awareness** for **data movement**, **suspicious drift**, **unknown sources**, and **backup / reconvergence** events — using **authorized defensive metadata only**. Z-FBAP **lights warning fires**; it does **not** become a surveillance system.

## What “original location” means (critical)

> **“Original location”** means the **original file, service identifier, or source path inside our authorized Z-Sanctuary ecosystem** — **not** a person’s hidden real-world location, **not** deanonymization behind a VPN, **not** covert identity linking.

## What Z-FBAP should **not** do

- Bypass VPNs or attempt to pierce anonymity.
- Reveal or infer someone’s **private real location** or identity without lawful basis and consent.
- Track people without consent or outside policy.
- Collect private location data beyond what is **legally and ethically** allowed.
- Run **live network surveillance** or persistent user tracking from the hub in Phase MCBURB-1.

## What Z-FBAP **may** record (authorized defensive metadata)

When a future implementation is chartered, **only** metadata classes that policy allows, for example:

- Observed **endpoint or request origin** where **legally and technically** available and **policy-approved** (often aggregate or infrastructure-tier, not end-user deanonymization).
- **Consented** device or session identity (where a product explicitly collects it under consent).
- **Repo / file path provenance** (relative paths under hub or approved workspaces).
- **Data type** moved or changed (class label, not payload content).
- **Source folder / target folder** (authorized paths).
- **Timestamp** and **correlation id** for operator forensics (no secrets).
- **Risk score** (coarse band, not fine-grained surveillance).
- **VPN / proxy signal** — **suspected only**, as **risk metadata**, with **no** deanonymization (see taxonomy `PROXY_OR_VPN_SIGNAL`).
- **Trusted / unknown / blocked** access classification at infrastructure boundary where applicable.
- **Which DRP / DOP rule** applies to the event class (reference, not automated adjudication).

## Sensitive domains

Any **sensitive data**, **user location**, **children**, **privacy**, **account/security logs**, or **health/crisis** paths require **14 DRP / 14 DOP** human review before expanding logging or automation — see Hierarchy Chief and vault policy.

## Reconvergence and gates

- **Reconvergence suggestions** are **report-only** until **AMK / human** approval and rollback plan exist.
- **Auto-restore, delete, overwrite, merge, deploy, bridge, or billing** actions are **forbidden** without an explicit gate (ZAG L4/L5 and charter).

## Event taxonomy (metadata)

- **Machine-readable:** [data/z_fbap_event_taxonomy.json](../../data/z_fbap_event_taxonomy.json)
- Each event type lists **severity**, **privacy_class**, **allowed_metadata**, **forbidden_metadata**, **required_human_review**, and **retention_note**.

## Relationship to Z-MCBURB

- **Z-MCBURB** protects **memory and spine alignment** (backups, registries, drift).
- **Z-FBAP** provides a **language and taxonomy** for **awareness events** so future logs and reports stay **ethical, minimal, and gateable**.

## Relationship to Z-VH100

- **Z-VH100** holds the **defensive attitude layer** (Vegeta challenge + Hashirai guardian discipline) so FBAP and MCBURB stay **shield-oriented**, not surveillance-oriented: [Z_VH100_VEGETA_HARISHA_SECURITY_CORE.md](./Z_VH100_VEGETA_HARISHA_SECURITY_CORE.md).

## Phase receipt

- [PHASE_MCBURB_1_GREEN_RECEIPT.md](./PHASE_MCBURB_1_GREEN_RECEIPT.md)
