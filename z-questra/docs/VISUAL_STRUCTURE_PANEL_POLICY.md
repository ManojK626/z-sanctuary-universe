# Visual Structure Panel — policy (Phase 2.3)

## Intent

Show **Question → meaning → ideas → guardian → action → route** as a **local visual flow** so operators can think structurally before future AI or hub tooling.

## Current behaviour

- Data is **sample / static** (`SAMPLE_VISUAL_FLOW`) or later can bind to **local UI state only**.
- **No** LLM calls, **no** parsing of chat transcripts, **no** Z-Sanctuary APIs.
- Disclaimer on screen: _local UI only; does not call external AI or Z-Sanctuary services._

## Future (chartered)

Could connect to read-only reports or approved bridges; until then, metadata stays in `sanctuaryRouteMap.js` style references only.

## Safety

If flow content ever becomes user-generated, keep **guardian copy** human-reviewable and avoid storing secrets in the client.
