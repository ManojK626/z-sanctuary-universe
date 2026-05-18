-- Add OMNAI Creative Profile columns to existing projects table (idempotent)
alter table public.projects
  add column if not exists life_stage text,
  add column if not exists tone text,
  add column if not exists creative_profile jsonb default '{}';

comment on column public.projects.life_stage is 'OMNAI life-stage lane (seedling|rising|prime|reflection|legacy)';
comment on column public.projects.tone is 'OMNAI tone preset id';
comment on column public.projects.creative_profile is 'Future-ready OMNAI creative profile JSON (emotionalIntensity, pacingStyle, audienceMode)';
