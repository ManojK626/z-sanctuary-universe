-- Genesis Studio — Supabase schema (run in SQL editor after project create)
-- Auth: enable Email + Google in Supabase Dashboard → Authentication → Providers

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft',
  life_stage text,
  tone text,
  creative_profile jsonb default '{}',
  created_at timestamptz not null default now()
);

-- scenes
create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  script_text text,
  order_index int not null default 0,
  storyboard_style text,
  storyboard_prompt text,
  storyboard_asset_id uuid,
  narration_style text,
  soundtrack_mood text,
  audio_plan jsonb default '{}',
  audio_asset_id uuid,
  created_at timestamptz not null default now()
);

-- assets
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.scenes enable row level security;
alter table public.assets enable row level security;

-- RLS: users may only access their own rows
create policy "projects_select_own" on public.projects
  for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects
  for update using (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = user_id);

create policy "scenes_select_own" on public.scenes
  for select using (auth.uid() = user_id);
create policy "scenes_insert_own" on public.scenes
  for insert with check (auth.uid() = user_id);
create policy "scenes_update_own" on public.scenes
  for update using (auth.uid() = user_id);
create policy "scenes_delete_own" on public.scenes
  for delete using (auth.uid() = user_id);

create policy "assets_select_own" on public.assets
  for select using (auth.uid() = user_id);
create policy "assets_insert_own" on public.assets
  for insert with check (auth.uid() = user_id);
create policy "assets_update_own" on public.assets
  for update using (auth.uid() = user_id);
create policy "assets_delete_own" on public.assets
  for delete using (auth.uid() = user_id);
