-- Phase 2B: Narrative audio intelligence — scene metadata only (no audio URLs on scenes)
alter table public.scenes
  add column if not exists narration_style text,
  add column if not exists soundtrack_mood text,
  add column if not exists audio_plan jsonb default '{}',
  add column if not exists audio_asset_id uuid;

comment on column public.scenes.narration_style is 'Narration preset: warm_guide|documentary|cinematic_trailer|child_friendly|elder_wisdom';
comment on column public.scenes.soundtrack_mood is 'Soundtrack mood: ambient|uplifting|mysterious|playful|dramatic';
comment on column public.scenes.audio_plan is 'Governed cue plan JSON — stub metadata until provider charter';
comment on column public.scenes.audio_asset_id is 'FK to assets when real audio stored — never external URL on scenes';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'scenes_audio_asset_id_fkey'
  ) then
    alter table public.scenes
      add constraint scenes_audio_asset_id_fkey
      foreign key (audio_asset_id) references public.assets (id) on delete set null;
  end if;
end $$;
