# ChatGPT → hub handoff (sanitized exports)

Put **reviewed** Markdown or text copied from ChatGPT **projects/chats** here, one subfolder per topic, e.g.:

`docs/chatgpt_exports/vs-code-lottery-pipeline/README.md`

## Stable link to tracking (rename-safe)

After you create a subfolder, add a sidecar so **`npm run chatgpt:verify`** can detect renames and stay aligned with [data/z_chatgpt_projects_tracking.json](../../data/z_chatgpt_projects_tracking.json):

**`docs/chatgpt_exports/<folder>/.z-chatgpt-tracking.json`**

```json
{
  "ZFormat": "v1",
  "id": "<same id as the entry in z_chatgpt_projects_tracking.json>"
}
```

Set optional **`export_folder`** on that entry to the same `<folder>` name. If you **rename the folder on disk**, keep the sidecar and **id** unchanged; update **`export_folder`** in the tracking JSON to the new folder name (and record the old ChatGPT label under **`previous_names`** when the UI renames the project).

**Do not** commit:

- Raw OpenAI export zips (keep outside git or in private storage).
- Vault content, API keys, or unreleased proprietary material you are not ready to share.

**Provenance header example** (first lines of each file):

```text
Source: ChatGPT project "<name>" · exported <YYYY-MM-DD> · reviewed by Amk-Goku
```

Canonical integration still flows through **`docs/Z-CHATGPT-MODULES-INDEX.md`** and the module manifest when promoting work.
