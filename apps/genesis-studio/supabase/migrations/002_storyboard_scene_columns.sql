-- Storyboard provider shell — scene metadata only (no external URLs on scenes)
alter table public.scenes
  add column if not exists storyboard_style text,
  add column if not exists storyboard_prompt text,
  add column if not exists storyboard_asset_id uuid references public.assets (id) on delete set null;

comment on column public.scenes.storyboard_style is 'Style preset id: cinematic|documentary|abstract';
comment on column public.scenes.storyboard_prompt is 'Governed prompt preview — not a live provider payload log';
comment on column public.scenes.storyboard_asset_id is 'FK to assets when real image stored locally — never external CDN URL on scenes';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'scenes_storyboard_asset_id_fkey'
  ) then
    alter table public.scenes
      add constraint scenes_storyboard_asset_id_fkey
      foreign key (storyboard_asset_id) references public.assets (id) on delete set null;
  end if;
end $$;
