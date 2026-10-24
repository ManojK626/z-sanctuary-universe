# Z-Connect runtime traceability 0.1

Local candidate only. Path B: the sealed fixture stays a reference. Contracts define runtime behavior.

| Item | Value |
| --- | --- |
| Historical runtime base | `e4ea6ab93ee0ee03aa12e77a442a3b2014ccf51f` |
| Canonical integration base | `867ed4aaf77a39d0bebded47ed1db808ef786619` |
| Canonical contract authority | main @ `867ed4aaf77a39d0bebded47ed1db808ef786619` |
| Historical contract source | PR #41 @ `2e2d55c1a65ed257b6e34defa7f618fc503800ad` |
| Doctrine reference | `da9027e3ba384ffc8c7123623b6d0cfbd12f308a` |
| Fixture reference | `ba13df8b6a97f922b95468eadacd36f3a94e65ad` |
| Candidate path | `apps/z-connect-candidate/` |
| Authority | `LOCAL_RUNTIME_CANDIDATE` |
| AnyDevice evidence | `GREEN_LOCAL` |
| Registry | `NOT_TESTED` |

## Authority separation

`HISTORICAL_RUNTIME_PROVENANCE` is `e4ea6ab93ee0ee03aa12e77a442a3b2014ccf51f` → `05c594bf760fdb91a1ea3d59480484b91d94bc9b` → `60935ff427ad9fb4e7f9154bf3830c2881552277` → `abb2f29ecdfaef25ab678dce51cd8f63d0e6132f`.

`HISTORICAL_CONTRACT_PROVENANCE` is PR #41 @ `2e2d55c1a65ed257b6e34defa7f618fc503800ad`, preserved in the exact packet commit `6417603404106d15c744329f4f216075a11ed260`.

`CURRENT_CANONICAL_CONTRACT_AUTHORITY` is main @ `867ed4aaf77a39d0bebded47ed1db808ef786619`, which includes the schema-reference correction `d629fae8fcadcd69112a8917bc7ef306b6d8b632`.

`CURRENT_RUNTIME_ADOPTION_STATUS` remains `LOCAL_RUNTIME_CANDIDATE`. Registry stays `NOT_TESTED`. AnyDevice evidence is `GREEN_LOCAL`, not canonical green.

## Consent reconciliation

General Welcome may continue without Discovery consent. That continuation is a general visitor journey.

The formal Discovery Journey cannot begin until both contract preconditions hold: `privacy-settings.allowDiscoveryJourney = true` and a valid in-memory `consent-record` whose scope id is `discovery_journey`.

Declining that optional scope leaves the feature unavailable and does not penalize the visitor. The checkbox is not pre-checked.

This candidate does not weaken those requirements. It also does not implement authentication, a consent log, or cascade delete. A decline clears only the visit-local record.

## Runtime behavior

| Runtime behavior | Contract source | Status |
| --- | --- | --- |
| Z-Connect is a human-centered Welcome | `docs/z-connect/Z_CONNECT_MASTER_BUILD_CHARTER.md` | IMPLEMENTED |
| AI assists; people decide | `docs/z-connect/Z_CONNECT_AI_CONSTITUTION_V1.md` | IMPLEMENTED |
| No destiny, soulmate certainty, or guaranteed compatibility result | `docs/z-connect/Z_CONNECT_MASTER_BUILD_CHARTER.md` | IMPLEMENTED |
| No single compatibility percentage | `docs/z-connect/Z_CONNECT_CONNECTION_CONFIDENCE.md` | IMPLEMENTED |
| No ranking of a person's worth | `docs/z-connect/Z_CONNECT_AI_CONSTITUTION_V1.md` | IMPLEMENTED |
| Visit confidence uses Limited information | `docs/z-connect/Z_CONNECT_CONNECTION_CONFIDENCE.md` | IMPLEMENTED |
| Guide copy is scripted, not a model call | candidate boundary; constitution forbids manufactured certainty | IMPLEMENTED |
| Welcome continues when Discovery consent is absent | `docs/z-connect/interaction-contracts/flows/CONSENT_FLOW.md` | IMPLEMENTED |
| Formal Discovery requires `allowDiscoveryJourney` and scope `discovery_journey` | `docs/z-connect/interaction-contracts/flows/AI_DISCOVERY_FLOW.md` | IMPLEMENTED |
| Decline shows no penalty copy | `docs/z-connect/interaction-contracts/flows/CONSENT_FLOW.md` | IMPLEMENTED |
| Sensitive consent box is not pre-checked | `docs/z-connect/interaction-contracts/flows/CONSENT_FLOW.md` | IMPLEMENTED |
| Visit-local consent record shape | `docs/z-connect/platform-contracts/consent/schemas/v1/consent-record.schema.json` | IMPLEMENTED |
| Visit-local privacy settings, Discovery closed by default | `docs/z-connect/platform-contracts/user/schemas/v1/privacy-settings.schema.json` | IMPLEMENTED |
| Return to Welcome does not withdraw a granted visit-local consent | candidate boundary; decline is the withdrawal | CANDIDATE_ONLY |
| Profile store, authentication, Shadow, and DRP on generative output | `docs/z-connect/interaction-contracts/flows/AI_DISCOVERY_FLOW.md` | NOT_IMPLEMENTED |
| Reflect room | no contract requires it in this foundation | NOT_IMPLEMENTED |
| AnyDevice presentation | shared runtime attached on the local candidate | GREEN_LOCAL |

## Fixture reuse register

| Element | Class | Note |
| --- | --- | --- |
| Paper and olive palette | VISUAL_REFERENCE | Atmosphere only |
| Small sprig mark | VISUAL_REFERENCE | Not the fixture garden scene |
| Sentence "Soulmates is a name, not a promise." | COPY_REFERENCE | Supports the charter ban on soulmate certainty; the sentence itself is fixture copy |
| Quiet decline beside an optional choice | INTERACTION_REFERENCE | Pacing only; the lock is contract-derived |
| Welcome, Discover rooms, Reflect rooms, marks, landscape, scripted guide panel | NOT_REUSED | Those fixture states are not this runtime |

`FIXTURE_REUSE_TRANSPARENT: PASS`

## Candidate-only annotations

These lines are labeled as foundation boundaries. They are not new product requirements.

| Annotation | Status |
| --- | --- |
| Banner and visit authority: `LOCAL_RUNTIME_CANDIDATE` | CANDIDATE_ONLY |
| Synthetic user and consent identifiers | CANDIDATE_ONLY |
| Decline clears the visit-local record only; no consent log and no cascade delete | CANDIDATE_ONLY |
| Reflect sentence says the room is outside this foundation | CANDIDATE_ONLY |
| Guide text is labeled scripted fixture copy | CANDIDATE_ONLY |
