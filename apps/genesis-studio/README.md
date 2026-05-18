# Genesis Studio — Z-Sanctuary OMNAI Creative Engine Shell

Cinematic, governed creative workspace for scripts, storyboards, editing, audio, and publishing — **stub providers only** in this phase.

Future lanes: movies, songs, eBooks, posters, podcasts, images, drawings, and multi-format media.

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
script → scenes → storyboard → audio → edit → publish → receipt
```

Later bridges: OMNAI, Z-Music, Visual Engine, eBook Engine, Podcast Engine, Zuno Orchestrator.

## API (stub)

`POST /api/generate-script` with `{ "prompt": "..." }` returns mock JSON.
Comment in route marks where OpenAI / OMNAI adapter would run **after DRP + human approval**.

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
