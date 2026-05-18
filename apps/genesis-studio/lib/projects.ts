import { getSupabaseBrowser } from '@/lib/supabase';
import { MOCK_PROJECTS, type GenesisProject } from '@/lib/mock-projects';
import type { CreativeProfile } from '@/lib/creative-profile';

export type ProjectStatus = 'draft' | 'review' | 'published';

export type StorageMode = 'mock' | 'supabase';

export interface GenesisProjectRecord extends GenesisProject {
  lifeStage?: string;
  tone?: string;
  creativeProfile?: CreativeProfile;
}

export interface PersistenceReceipt {
  storageMode: StorageMode;
  storageLabel: string;
  lastSavedAt: string | null;
  projectId: string | null;
  humanReviewRequired: true;
  providerStatus: 'none';
  saveStatus: 'idle' | 'saved' | 'error';
  message?: string;
}

const MOCK_STORE_KEY = 'genesis-studio-mock-store-v1';
const ACTIVE_PROJECT_KEY = 'genesis-studio-active-project-id';

interface MockStore {
  projects: GenesisProjectRecord[];
}

function readMockStore(): MockStore {
  if (typeof window === 'undefined') {
    return { projects: [...MOCK_PROJECTS] };
  }
  try {
    const raw = localStorage.getItem(MOCK_STORE_KEY);
    if (!raw) {
      const seed: MockStore = { projects: [...MOCK_PROJECTS] };
      localStorage.setItem(MOCK_STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as MockStore;
  } catch {
    return { projects: [...MOCK_PROJECTS] };
  }
}

function writeMockStore(store: MockStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_STORE_KEY, JSON.stringify(store));
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseBrowser() !== null;
}

export async function resolveStorageMode(): Promise<StorageMode> {
  const client = getSupabaseBrowser();
  if (!client) return 'mock';
  const { data } = await client.auth.getSession();
  return data.session?.user ? 'supabase' : 'mock';
}

export function getStorageLabel(mode: StorageMode): string {
  if (mode === 'supabase') return 'Supabase (signed in)';
  if (isSupabaseConfigured()) return 'Mock fallback (sign in to use Supabase)';
  return 'Mock fallback (Supabase env not configured)';
}

export function getActiveProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

function mapDbProject(row: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  life_stage: string | null;
  tone: string | null;
  creative_profile: CreativeProfile | null;
  created_at: string;
}): GenesisProjectRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    status: (row.status as ProjectStatus) || 'draft',
    updatedAt: row.created_at,
    lifeStage: row.life_stage ?? undefined,
    tone: row.tone ?? undefined,
    creativeProfile: row.creative_profile ?? undefined,
  };
}

export async function listProjects(): Promise<{
  projects: GenesisProjectRecord[];
  storageMode: StorageMode;
}> {
  const storageMode = await resolveStorageMode();
  if (storageMode === 'mock') {
    return { projects: readMockStore().projects, storageMode };
  }

  const client = getSupabaseBrowser();
  if (!client) {
    return { projects: readMockStore().projects, storageMode: 'mock' };
  }

  const { data, error } = await client
    .from('projects')
    .select('id, title, description, status, life_stage, tone, creative_profile, created_at')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return { projects: readMockStore().projects, storageMode: 'mock' };
  }

  return {
    projects: data.map((row) => mapDbProject(row as Parameters<typeof mapDbProject>[0])),
    storageMode: 'supabase',
  };
}

export async function createProject(input?: {
  title?: string;
  description?: string;
}): Promise<{ project: GenesisProjectRecord; storageMode: StorageMode }> {
  const title = input?.title?.trim() || 'Untitled Genesis Project';
  const description = input?.description?.trim() || 'Draft OMNAI creative project';
  const storageMode = await resolveStorageMode();
  const now = new Date().toISOString();

  if (storageMode === 'mock') {
    const store = readMockStore();
    const project: GenesisProjectRecord = {
      id: `mock-${Date.now()}`,
      title,
      description,
      status: 'draft',
      updatedAt: now,
    };
    store.projects = [project, ...store.projects];
    writeMockStore(store);
    setActiveProjectId(project.id);
    return { project, storageMode };
  }

  const client = getSupabaseBrowser();
  const { data: sessionData } = await client!.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!client || !userId) {
    const store = readMockStore();
    const project: GenesisProjectRecord = {
      id: `mock-${Date.now()}`,
      title,
      description,
      status: 'draft',
      updatedAt: now,
    };
    store.projects = [project, ...store.projects];
    writeMockStore(store);
    setActiveProjectId(project.id);
    return { project, storageMode: 'mock' };
  }

  const { data, error } = await client
    .from('projects')
    .insert({
      user_id: userId,
      title,
      description,
      status: 'draft',
      creative_profile: {},
    })
    .select('id, title, description, status, life_stage, tone, creative_profile, created_at')
    .single();

  if (error || !data) {
    const store = readMockStore();
    const project: GenesisProjectRecord = {
      id: `mock-${Date.now()}`,
      title,
      description,
      status: 'draft',
      updatedAt: now,
    };
    store.projects = [project, ...store.projects];
    writeMockStore(store);
    setActiveProjectId(project.id);
    return { project, storageMode: 'mock' };
  }

  const project = mapDbProject(data as Parameters<typeof mapDbProject>[0]);
  setActiveProjectId(project.id);
  return { project, storageMode: 'supabase' };
}

export async function loadProject(
  projectId: string
): Promise<{ project: GenesisProjectRecord | null; storageMode: StorageMode }> {
  const storageMode = await resolveStorageMode();

  if (storageMode === 'mock' || projectId.startsWith('mock-')) {
    const found = readMockStore().projects.find((p) => p.id === projectId) ?? null;
    return { project: found, storageMode: 'mock' };
  }

  const client = getSupabaseBrowser();
  if (!client) {
    const found = readMockStore().projects.find((p) => p.id === projectId) ?? null;
    return { project: found, storageMode: 'mock' };
  }

  const { data, error } = await client
    .from('projects')
    .select('id, title, description, status, life_stage, tone, creative_profile, created_at')
    .eq('id', projectId)
    .maybeSingle();

  if (error || !data) {
    return { project: null, storageMode };
  }

  return {
    project: mapDbProject(data as Parameters<typeof mapDbProject>[0]),
    storageMode: 'supabase',
  };
}

export async function updateProject(
  projectId: string,
  patch: {
    title?: string;
    description?: string;
    status?: ProjectStatus;
    lifeStage?: string;
    tone?: string;
    creativeProfile?: CreativeProfile;
  }
): Promise<{ project: GenesisProjectRecord | null; storageMode: StorageMode }> {
  const storageMode = await resolveStorageMode();
  const now = new Date().toISOString();

  if (storageMode === 'mock' || projectId.startsWith('mock-')) {
    const store = readMockStore();
    const idx = store.projects.findIndex((p) => p.id === projectId);
    if (idx < 0) return { project: null, storageMode: 'mock' };
    const current = store.projects[idx];
    const updated: GenesisProjectRecord = {
      ...current,
      ...patch,
      title: patch.title ?? current.title,
      description: patch.description ?? current.description,
      status: patch.status ?? current.status,
      lifeStage: patch.lifeStage ?? current.lifeStage,
      tone: patch.tone ?? current.tone,
      creativeProfile: patch.creativeProfile ?? current.creativeProfile,
      updatedAt: now,
    };
    store.projects[idx] = updated;
    writeMockStore(store);
    return { project: updated, storageMode: 'mock' };
  }

  const client = getSupabaseBrowser();
  if (!client) {
    return { project: null, storageMode: 'mock' };
  }

  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.lifeStage !== undefined) row.life_stage = patch.lifeStage;
  if (patch.tone !== undefined) row.tone = patch.tone;
  if (patch.creativeProfile !== undefined) row.creative_profile = patch.creativeProfile;

  const { data, error } = await client
    .from('projects')
    .update(row)
    .eq('id', projectId)
    .select('id, title, description, status, life_stage, tone, creative_profile, created_at')
    .single();

  if (error || !data) {
    return { project: null, storageMode };
  }

  return {
    project: mapDbProject(data as Parameters<typeof mapDbProject>[0]),
    storageMode: 'supabase',
  };
}

export function buildPersistenceReceipt(
  partial: Partial<PersistenceReceipt> & Pick<PersistenceReceipt, 'storageMode'>
): PersistenceReceipt {
  return {
    storageMode: partial.storageMode,
    storageLabel: partial.storageLabel ?? getStorageLabel(partial.storageMode),
    lastSavedAt: partial.lastSavedAt ?? null,
    projectId: partial.projectId ?? null,
    humanReviewRequired: true,
    providerStatus: 'none',
    saveStatus: partial.saveStatus ?? 'idle',
    message: partial.message,
  };
}
