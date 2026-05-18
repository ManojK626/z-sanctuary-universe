# Genesis Studio — Z-Sanctuary OMNAI Creative Engine Shell

Cinematic, governed creative workspace for scripts, storyboards, editing, audio, and publishing — **stub providers only** in this phase.

Future lanes: movies, songs, eBooks, posters, podcasts, images, drawings, and multi-format media.

**Roadmap:** [GENESIS_STUDIO_OMNAI_ROADMAP.md](GENESIS_STUDIO_OMNAI_ROADMAP.md) — phased Turtle build order (Phase 3A next: project persistence).

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components (Card, Button, Textarea, Tabs)
- Supabase (auth + database — optional until env configured)
- Framer Motion

## Setup

```bash
cd apps/genesis-studio
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY when ready
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

From monorepo root:

```bash
npm install
npm run dev --workspace=genesis-studio
```

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable **Email** and **Google** under Authentication → Providers (operator choice).
4. Add URL + anon key to `.env.local` — never commit secrets.

Row Level Security: users may only access rows where `auth.uid() = user_id`.

## Genesis Core Registry (future)

`lib/genesis-core-registry.ts` defines the hidden pipeline layer:

```text
script → scenes → storyboard → audio_plan → edit → publish → receipt
```

Later bridges: OMNAI, Z-Music, Visual Engine, eBook Engine, Podcast Engine, Zuno Orchestrator.

## OMNAI Creative Profile

Shared constants and Zod schemas: `lib/creative-profile.ts`

- **Life-stage** and **tone** dropdowns on Script page
- Future-ready optional fields: `emotionalIntensity`, `pacingStyle`, `audienceMode` (schema only; UI Phase 2+)
- **Creative DNA** card + editable scene cards with local reorder
- Every script response includes `governance: { providerStatus: "stub-only", humanReviewRequired: true, drpSafe: true }`

Supabase: `projects.life_stage`, `projects.tone`, `projects.creative_profile` (see `supabase/migrations/001_creative_profile_columns.sql`).

## Storyboard Provider Shell

**Status:** stub-only — no Replicate, SDXL, Flux, or real image generation.

- Shared `lib/storyboard-profile.ts` — style presets, Zod schemas, `buildStoryboardPrompt()`
- `POST /api/generate-storyboard` — mock frames with `promptPreview`, `imageUrl: ""`, and governance (no external URLs)
- Storyboard page: style preset selector, mock frame cards, local state only
- Supabase: `scenes.storyboard_style`, `storyboard_prompt`, `storyboard_asset_id` (see `supabase/migrations/002_storyboard_scene_columns.sql`)
- Future images → **`assets` table only**, not URLs on `scenes`

## Phase 2B — Narrative Audio Intelligence Shell

**Status:** stub-only — no TTS, music generation, uploads, billing, or provider SDKs.

- Shared `lib/audio-profile.ts` — narration styles, soundtrack moods, audio cue types, Zod schemas
- `POST /api/generate-audio-plan` — mock cue plans + governance (no ElevenLabs / OpenAI audio / Suno / Udio)
- Audio page: style selectors, plan cards, upload/play remain placeholders
- Supabase: `scenes.narration_style`, `soundtrack_mood`, `audio_plan`, `audio_asset_id` (see `supabase/migrations/003_audio_plan_scene_columns.sql`)
- Future real audio → **`assets` table only**, not URLs on `scenes`
- Provider gates: `lib/provider-boundaries.ts` (`elevenlabs`, `openai_audio`, `local_tts`, `z_music_engine`)

## Phase 3A — Project Persistence Shell

**Status:** Supabase-backed when env + auth session exist; otherwise **mock fallback** (localStorage).

- `lib/projects.ts` — create, list, load, update projects
- `lib/scenes.ts` — save/load scenes for a project (explicit save only)
- `components/persistence-receipt-card.tsx` — storage mode, last saved, provider status `none`
- Dashboard: project list, mock-mode label, **New Project** creates draft
- Script: **Save to Project** persists title, description, status, creative profile, scenes
- **No** media uploads, background sync, billing, deployment, or provider SDKs
- RLS: `auth.uid() = user_id` (see `supabase/schema.sql`)

## API (stub)

`POST /api/generate-script` with `{ "prompt": "...", "lifeStage": "prime", "tone": "cinematic" }` returns mock JSON with `creativeProfile`, `scenes[]`, and `governance`.
Comment in route marks where OpenAI / OMNAI adapter would run **after DRP + human approval**.

`POST /api/generate-storyboard` with `{ "sceneId", "sceneText", "stylePreset" }` returns mock `promptPreview`, empty `imageUrl`, and stub governance (`providerStatus`, `humanReviewRequired`, `drpSafe`).

`POST /api/generate-audio-plan` with `{ "sceneId", "sceneText", "narrationStyle", "soundtrackMood" }` returns mock `cues[]` and stub governance.

## Safety / governance

- **No** real OpenAI, media generation, billing, or deployment in this shell.
- **No** hidden automation or silent network calls to providers.
- Export UI warns: **human review required before publishing**.
- Align with hub: [Z_AI_AGENT_COLLABORATION_LAW.md](../../docs/Z_AI_AGENT_COLLABORATION_LAW.md), Turtle Mode, 14 DRP.

## Scripts

| Command         | Purpose                 |
| --------------- | ----------------------- |
| `npm run dev`   | Dev server on port 3010 |
| `npm run build` | Production build        |
| `npm run start` | Start production server |
