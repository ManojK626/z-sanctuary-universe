import { getSupabaseBrowser } from '@/lib/supabase';
import type { ScriptScene, CreativeProfile } from '@/lib/creative-profile';
import {
  resolveStorageMode,
  updateProject,
  type StorageMode,
  type GenesisProjectRecord,
} from '@/lib/projects';

const MOCK_SCENES_KEY = 'genesis-studio-mock-scenes-v1';

type SceneStore = Record<string, ScriptScene[]>;

function readSceneStore(): SceneStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MOCK_SCENES_KEY);
    return raw ? (JSON.parse(raw) as SceneStore) : {};
  } catch {
    return {};
  }
}

function writeSceneStore(store: SceneStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_SCENES_KEY, JSON.stringify(store));
}

export async function loadScenes(
  projectId: string
): Promise<{ scenes: ScriptScene[]; storageMode: StorageMode }> {
  const storageMode = await resolveStorageMode();

  if (storageMode === 'mock' || projectId.startsWith('mock-')) {
    const scenes = readSceneStore()[projectId] ?? [];
    return {
      scenes: [...scenes].sort((a, b) => a.orderIndex - b.orderIndex),
      storageMode: 'mock',
    };
  }

  const client = getSupabaseBrowser();
  if (!client) {
    const scenes = readSceneStore()[projectId] ?? [];
    return { scenes, storageMode: 'mock' };
  }

  const { data, error } = await client
    .from('scenes')
    .select('id, title, script_text, order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error || !data) {
    return { scenes: [], storageMode };
  }

  const scenes: ScriptScene[] = data.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    body: (row.script_text as string) ?? '',
    orderIndex: row.order_index as number,
  }));

  return { scenes, storageMode: 'supabase' };
}

export interface SaveProjectScenesInput {
  projectId: string;
  title: string;
  description: string;
  status: GenesisProjectRecord['status'];
  lifeStage: string;
  tone: string;
  creativeProfile: CreativeProfile;
  scenes: ScriptScene[];
}

export async function saveProjectScenes(
  input: SaveProjectScenesInput
): Promise<{ storageMode: StorageMode; savedAt: string }> {
  const savedAt = new Date().toISOString();
  const storageMode = await resolveStorageMode();

  await updateProject(input.projectId, {
    title: input.title,
    description: input.description,
    status: input.status,
    lifeStage: input.lifeStage,
    tone: input.tone,
    creativeProfile: input.creativeProfile,
  });

  if (storageMode === 'mock' || input.projectId.startsWith('mock-')) {
    const store = readSceneStore();
    store[input.projectId] = input.scenes.map((s, i) => ({ ...s, orderIndex: i }));
    writeSceneStore(store);
    return { storageMode: 'mock', savedAt };
  }

  const client = getSupabaseBrowser();
  const { data: sessionData } = await client!.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!client || !userId) {
    const store = readSceneStore();
    store[input.projectId] = input.scenes.map((s, i) => ({ ...s, orderIndex: i }));
    writeSceneStore(store);
    return { storageMode: 'mock', savedAt };
  }

  await client.from('scenes').delete().eq('project_id', input.projectId);

  if (input.scenes.length > 0) {
    const rows = input.scenes.map((scene, index) => ({
      project_id: input.projectId,
      user_id: userId,
      title: scene.title,
      script_text: scene.body,
      order_index: index,
    }));

    const { error } = await client.from('scenes').insert(rows);
    if (error) {
      const store = readSceneStore();
      store[input.projectId] = input.scenes.map((s, i) => ({ ...s, orderIndex: i }));
      writeSceneStore(store);
      return { storageMode: 'mock', savedAt };
    }
  }

  return { storageMode: 'supabase', savedAt };
}
