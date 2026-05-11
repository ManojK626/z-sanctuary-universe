# Z-Sanctuary — GitHub and email (ecosystem integration)

This document ties your **GitHub account**, **primary email**, and **local/Cursor** workflows to the hub so AI and operators share one clear picture. Canonical machine data: **[data/z_ecosystem_github_identity.json](../data/z_ecosystem_github_identity.json)**.

**Sanctuary gate (private repo, protected `main`, CODEOWNERS, Actions, Releases):** [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md) — **`npm run verify:sanctuary-github-pr`** (alias **`npm run verify:all`**) vs **`verify:ci`** (includes execution enforcer).

**GitHub + AI precautions (comms-flow bound):** [Z-GITHUB-AI-COMMS-PRECAUTIONS.md](Z-GITHUB-AI-COMMS-PRECAUTIONS.md) · requirements [data/z_github_ai_comms_requirements.json](../data/z_github_ai_comms_requirements.json) · run **`npm run comms:github-ai`** for [data/reports/z_github_ai_comms_manifest.json](../data/reports/z_github_ai_comms_manifest.json).

**Cloudflare (same email, optional edge):** [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) · [data/z_cloudflare_contingency_identity.json](../data/z_cloudflare_contingency_identity.json) · **`npm run comms:cloudflare-ai`** → [data/reports/z_cloudflare_ai_comms_manifest.json](../data/reports/z_cloudflare_ai_comms_manifest.json).

## Identity (reference)

| Field | Value |
| ------------------------- | ------------------------------ |
| GitHub login | `ManojK626` |
| Profile | <https://github.com/ManojK626> |
| Primary email (ecosystem) | `manojkeerpal@gmail.com` |

Update **`data/z_ecosystem_github_identity.json`** if you change login, email, or add/remove ecosystem repos.

## 1. GitHub account and email (web)

1. Sign in at <https://github.com> as **ManojK626**.
2. **Settings → Emails**
   - Add **`manojkeerpal@gmail.com`** if not already listed.
   - **Verify** the address (GitHub sends a confirmation link).
   - Set as **Primary** if you want commits and notifications on this address.
3. **Settings → Notifications** — choose how you want repo and security alerts (email vs web); optional but avoids missed CI failures.
4. **Settings → Password and authentication** — enable **two-factor authentication (2FA)** for account safety (recommended before storing PATs or org access).

## 2. Local Git (every PC you use)

Match commit identity to the verified email so history and GitHub contributions line up:

```bash
git config --global user.name "Your public name"
git config --global user.email "manojkeerpal@gmail.com"
```

Confirm:

```bash
git config --global --get user.email
git config --global --get user.name
```

Per-repo override is fine (`git config user.email` inside one clone) if a repo must use a different address.

## 3. Authentication to GitHub (pick one)

- **SSH (recommended for daily push/pull)**
  - Generate a key, add the **public** key in GitHub → **Settings → SSH and GPG keys**.
  - Use remote URLs like `git@github.com:ManojK626/<repo>.git`.

- **HTTPS**
  - Use **Git Credential Manager** (Windows) or GitHub CLI (`gh auth login`) so tokens are not pasted into repo files.

**Never** commit Personal Access Tokens (PATs), SSH private keys, or `.env` secrets into `ZSanctuary_Universe` or any tracked path.

## 4. Cursor and this hub

- Open folders that are **clones** of your GitHub repos so Source Control uses the same remotes as on GitHub.
- For multi-root workspaces (`Z_All_Projects.code-workspace`), keep **path consistency** with [data/z_pc_root_projects.json](../data/z_pc_root_projects.json) when you add a project that also exists on GitHub (optional `dashboard_url` or notes field).
- AI agents should read **`data/z_ecosystem_github_identity.json`** when you ask for GitHub-related setup—do not invent another email or handle.

## 5. Ecosystem repos (from your dashboard)

Listed in JSON for quick linking:

- **ManojK626/zuno-outreach** — outreach / Zuno-related work; clone beside other pc_root projects if you want EAII visibility.
- **ManojK626/Super-Saiyan-Roulette-Pro-App** — aligns with roulette tooling; same rule: register local path when it exists.

Add more rows to **`ecosystem_repos`** when new GitHub projects become part of the control plane.

## 6. GitHub Copilot / Spark / “Ask” on GitHub.com

Using the **same** logged-in **ManojK626** session in the browser keeps Copilot, Issues, and PR context aligned with repositories you push from Cursor. No extra repo file is required—just consistent login and email verification.

## 7. CI and secrets

If you use **GitHub Actions** in any repo:

- Store tokens under **Repository → Settings → Secrets and variables → Actions**.
- Reference secrets only in workflow YAML as `${{ secrets.NAME }}`—never echo them in logs.

## 8. Privacy note

If **`ZSanctuary_Universe`** is pushed to a **public** GitHub repository, consider whether **`primary_email`** should remain in `z_ecosystem_github_identity.json`. Options: use a **private** repo for this hub, remove the email field from JSON and rely on local `git config` only, or replace with a neutral placeholder and keep the real address in operator-only storage.

---

**Verification:** After changes, run **`node scripts/z_registry_omni_verify.mjs`** — it checks that the identity file exists and is structurally valid for ecosystem sync.
