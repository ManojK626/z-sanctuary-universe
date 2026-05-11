# Z Cross-Project Upgrade Audit

Generated: 2026-04-14T15:46:24.643Z
Overall: PASS_WITH_GAPS
Projects: 11 (PASS 8 | PASS_WITH_GAPS 3 | FAIL 0)

## Project Verdicts

- PASS: AT Princess & Blackie Copitol (`C:\Cursor Projects Organiser\AT Princess&Blackie Copitol`)
- PASS: Z-SANCTUARY AI SKYSCRAPER (`C:\Cursor Projects Organiser\Z-SANCTUARY AI SKYSCRAPER`)
- PASS: Z-OMNI-Sanctuary (`C:\Cursor Projects Organiser\Z-OMNI-Sanctuary`)
- PASS: Amk-Goku Dashboards 2 (`C:\Cursor Projects Organiser\Amk-Goku Dashboards 2`)
- PASS_WITH_GAPS: Amk-Goku Vaults (`C:\Cursor Projects Organiser\Amk-Goku Vaults`)
- PASS_WITH_GAPS: Ireland Projects (ÉirMind) (`C:\Cursor Projects Organiser\Ireland Projects`)
- PASS: ZSanctuary_Universe (`C:\Cursor Projects Organiser\ZSanctuary_Universe`)
- PASS: Sister Aisling Sol (`C:\Cursor Projects Organiser\Z-Sister Aisling Sol`)
- PASS_WITH_GAPS: AT PB Copilot (`C:\Cursor Projects Organiser\AT PB Copilot`)
- PASS: Z-Sanctuary Claude (Core) (`C:\Cursor Projects Organiser\Z-Sanctuary Claude`)
- PASS: z-sanctuary-aimanity (`C:\Cursor Projects Organiser\z-sanctuary-aimanity`)

## Evidence Table

| Project | Check | Status | Evidence |
| ----------------------------- | ------------------------ | ------ | ------------------------------------------------------------------------------------------ |
| AT Princess & Blackie Copitol | path_exists | PASS | C:\Cursor Projects Organiser\AT Princess&Blackie Copitol |
| AT Princess & Blackie Copitol | package_json | PASS | C:\Cursor Projects Organiser\AT Princess&Blackie Copitol\package.json |
| AT Princess & Blackie Copitol | scripts_lint_test_verify | PASS | lint=true, test=true, verify=true |
| AT Princess & Blackie Copitol | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\AT Princess&Blackie Copitol\z-html-do.html |
| AT Princess & Blackie Copitol | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| AT Princess & Blackie Copitol | powershell_docs_presence | PASS | .ps1=3, .md=39, runtime_manifest=false (sample depth<=3) |
| Z-SANCTUARY AI SKYSCRAPER | path_exists | PASS | C:\Cursor Projects Organiser\Z-SANCTUARY AI SKYSCRAPER |
| Z-SANCTUARY AI SKYSCRAPER | package_json | PASS | C:\Cursor Projects Organiser\Z-SANCTUARY AI SKYSCRAPER\z_project_runtime.json |
| Z-SANCTUARY AI SKYSCRAPER | scripts_lint_test_verify | N/A | non-node-runtime-or-missing-package |
| Z-SANCTUARY AI SKYSCRAPER | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Z-SANCTUARY AI SKYSCRAPER\z-sanctuary-aimanity\z-html-do.html |
| Z-SANCTUARY AI SKYSCRAPER | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Z-SANCTUARY AI SKYSCRAPER | powershell_docs_presence | PASS | .ps1=0, .md=30, runtime_manifest=true (sample depth<=3) |
| Z-OMNI-Sanctuary | path_exists | PASS | C:\Cursor Projects Organiser\Z-OMNI-Sanctuary |
| Z-OMNI-Sanctuary | package_json | PASS | C:\Cursor Projects Organiser\Z-OMNI-Sanctuary\z_project_runtime.json |
| Z-OMNI-Sanctuary | scripts_lint_test_verify | N/A | non-node-runtime-or-missing-package |
| Z-OMNI-Sanctuary | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Z-OMNI-Sanctuary\z-html-do.html |
| Z-OMNI-Sanctuary | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Z-OMNI-Sanctuary | powershell_docs_presence | PASS | .ps1=0, .md=10, runtime_manifest=true (sample depth<=3) |
| Amk-Goku Dashboards 2 | path_exists | PASS | C:\Cursor Projects Organiser\Amk-Goku Dashboards 2 |
| Amk-Goku Dashboards 2 | package_json | PASS | C:\Cursor Projects Organiser\Amk-Goku Dashboards 2\package.json |
| Amk-Goku Dashboards 2 | scripts_lint_test_verify | PASS | lint=true, test=true, verify=true |
| Amk-Goku Dashboards 2 | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Amk-Goku Dashboards 2\z-html-do.html |
| Amk-Goku Dashboards 2 | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Amk-Goku Dashboards 2 | powershell_docs_presence | PASS | .ps1=0, .md=36, runtime_manifest=true (sample depth<=3) |
| Amk-Goku Vaults | path_exists | PASS | C:\Cursor Projects Organiser\Amk-Goku Vaults |
| Amk-Goku Vaults | package_json | PASS | C:\Cursor Projects Organiser\Amk-Goku Vaults\z_project_runtime.json |
| Amk-Goku Vaults | scripts_lint_test_verify | N/A | non-node-runtime-or-missing-package |
| Amk-Goku Vaults | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Amk-Goku Vaults\z-html-do.html |
| Amk-Goku Vaults | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Amk-Goku Vaults | powershell_docs_presence | GAPS | .ps1=0, .md=0, runtime_manifest=true (sample depth<=3) |
| Ireland Projects (ÉirMind) | path_exists | GAPS | C:\Cursor Projects Organiser\Ireland Projects (registry status: Missing (needs re-link)) |
| Ireland Projects (ÉirMind) | package_json | N/A | project marked missing/retired in registry |
| Ireland Projects (ÉirMind) | scripts_lint_test_verify | N/A | project marked missing/retired in registry |
| Ireland Projects (ÉirMind) | dashboard_z_html_do | N/A | project marked missing/retired in registry |
| Ireland Projects (ÉirMind) | sanctuary_link_file | N/A | project marked missing/retired in registry |
| Ireland Projects (ÉirMind) | powershell_docs_presence | N/A | project marked missing/retired in registry |
| ZSanctuary_Universe | path_exists | PASS | C:\Cursor Projects Organiser\ZSanctuary_Universe |
| ZSanctuary_Universe | package_json | PASS | C:\Cursor Projects Organiser\ZSanctuary_Universe\package.json |
| ZSanctuary_Universe | scripts_lint_test_verify | PASS | lint=true, test=true, verify=true |
| ZSanctuary_Universe | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\ZSanctuary_Universe\docs\public\z-html-do.html |
| ZSanctuary_Universe | sanctuary_link_file | N/A | hub skipped by emitter design |
| ZSanctuary_Universe | powershell_docs_presence | PASS | .ps1=7, .md=421, runtime_manifest=false (sample depth<=3) |
| Sister Aisling Sol | path_exists | PASS | C:\Cursor Projects Organiser\Z-Sister Aisling Sol |
| Sister Aisling Sol | package_json | PASS | C:\Cursor Projects Organiser\Z-Sister Aisling Sol\z_project_runtime.json |
| Sister Aisling Sol | scripts_lint_test_verify | N/A | non-node-runtime-or-missing-package |
| Sister Aisling Sol | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Z-Sister Aisling Sol\z-html-do.html |
| Sister Aisling Sol | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Sister Aisling Sol | powershell_docs_presence | PASS | .ps1=0, .md=24, runtime_manifest=true (sample depth<=3) |
| AT PB Copilot | path_exists | GAPS | C:\Cursor Projects Organiser\AT PB Copilot (registry status: Missing (needs re-link)) |
| AT PB Copilot | package_json | N/A | project marked missing/retired in registry |
| AT PB Copilot | scripts_lint_test_verify | N/A | project marked missing/retired in registry |
| AT PB Copilot | dashboard_z_html_do | N/A | project marked missing/retired in registry |
| AT PB Copilot | sanctuary_link_file | N/A | project marked missing/retired in registry |
| AT PB Copilot | powershell_docs_presence | N/A | project marked missing/retired in registry |
| Z-Sanctuary Claude (Core) | path_exists | PASS | C:\Cursor Projects Organiser\Z-Sanctuary Claude |
| Z-Sanctuary Claude (Core) | package_json | PASS | C:\Cursor Projects Organiser\Z-Sanctuary Claude\z_project_runtime.json |
| Z-Sanctuary Claude (Core) | scripts_lint_test_verify | N/A | non-node-runtime-or-missing-package |
| Z-Sanctuary Claude (Core) | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\Z-Sanctuary Claude\z-html-do.html |
| Z-Sanctuary Claude (Core) | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| Z-Sanctuary Claude (Core) | powershell_docs_presence | PASS | .ps1=7, .md=23, runtime_manifest=true (sample depth<=3) |
| z-sanctuary-aimanity | path_exists | PASS | C:\Cursor Projects Organiser\z-sanctuary-aimanity |
| z-sanctuary-aimanity | package_json | PASS | C:\Cursor Projects Organiser\z-sanctuary-aimanity\package.json |
| z-sanctuary-aimanity | scripts_lint_test_verify | PASS | lint=true, test=true, verify=true |
| z-sanctuary-aimanity | dashboard_z_html_do | PASS | C:\Cursor Projects Organiser\z-sanctuary-aimanity\z-html-do.html |
| z-sanctuary-aimanity | sanctuary_link_file | PASS | z_sanctuary_link.json present |
| z-sanctuary-aimanity | powershell_docs_presence | PASS | .ps1=0, .md=30, runtime_manifest=true (sample depth<=3) |
