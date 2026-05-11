# Phase 1 to Phase 2 Transition

## Phase 1 Completed

- Minimal folder skeleton /martial-platform
- Challenge loop script for local persistence + leaderboard
- Phase 1 lock file detailing scope
- README explains how to run the loop

## Phase 2 Goals (Layer-by-layer expansion)

1. Replace local loop with small backend service (Node/Express or Flask) to expose create/score/read endpoints.
2. Build a simple UI/test harness (CLI or lightweight web page) that consumes the JSON file via the new API.
3. Prepare the exports/packaging workflows once the backend is in place.
4. Begin packaging the actual modules (cloud functions, spectator UI, assets) only after backend + UI are solid.

## Future Signals

- Once `martial-platform/backend` contains a working REST endpoint, the repo is ready for automation packages.
- Keep PHASE_1_LOCK.md trusted; update before adding new layers.
