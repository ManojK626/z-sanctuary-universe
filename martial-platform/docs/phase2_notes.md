## Phase 2 Minimal Additions

- Added a spectator API (`GET /spectator`) that summarizes total challenges, score count, highest and average score so future spectator/UI builds have data.
- Extended the frontend UI with a Spectator Snapshot section to call the new endpoint and render its JSON payload on-demand.
- Updated `README.md` to mention the new endpoint and UI controls.

Future: tie the spectator stats into the recap cards, badges, and eventual Cloud Functions once Phase 1 core is rock-solid.
