/**
 * Pure domain logic and persistence engine for JXUI Favorites & Collections
 * Supports user bookmarks, custom collection grouping, and JSON export/import.
 */

export interface JXCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  componentIds: string[];
  isDefault?: boolean;
  createdAt: number;
}

export interface JXCollectionsState {
  favorites: string[]; // List of component IDs bookmarked
  collections: JXCollection[];
}

export const STORAGE_KEY_COLLECTIONS = 'jxui_collections_v2';

export const DEFAULT_COLLECTIONS: JXCollection[] = [
  {
    id: 'dashboard-kit',
    name: 'Enterprise Dashboard Kit',
    description: 'High-density grids, sparklines, and metric cards for analytical consoles.',
    icon: 'bar-chart',
    componentIds: ['jx-data-grid', 'jx-charts', 'jx-alert', 'jx-card', 'GlassCard'],
    isDefault: true,
    createdAt: 1700000000000,
  },
  {
    id: 'forms-auth',
    name: 'High-Converting Forms & Auth',
    description: 'Tactile inputs, entropy meters, biometric passkeys, and validation switches.',
    icon: 'sliders',
    componentIds: ['jx-text-field', 'jx-button', 'jx-switch', 'jx-rating', 'passkey-vault'],
    isDefault: true,
    createdAt: 1700000000000,
  },
  {
    id: 'landing-page',
    name: 'Tactile Landing Page Bento',
    description: 'Specular 3D tilt cards, magnetic docks, and liquid interactive buttons.',
    icon: 'sparkles',
    componentIds: ['jx-dock', 'canary-traffic-splitter', 'jx-button', 'jx-tabs'],
    isDefault: true,
    createdAt: 1700000000000,
  },
];

export const INITIAL_COLLECTIONS_STATE: JXCollectionsState = {
  favorites: ['jx-button', 'jx-data-grid', 'jx-dock', 'jx-switch'],
  collections: DEFAULT_COLLECTIONS,
};

export function loadCollectionsState(): JXCollectionsState {
  if (typeof window === 'undefined') {
    return INITIAL_COLLECTIONS_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
    if (!raw) return INITIAL_COLLECTIONS_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.favorites) || !Array.isArray(parsed.collections)) {
      return INITIAL_COLLECTIONS_STATE;
    }
    return parsed;
  } catch {
    return INITIAL_COLLECTIONS_STATE;
  }
}

export function saveCollectionsState(state: JXCollectionsState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save collections to localStorage', err);
  }
}

export function toggleFavorite(
  componentId: string,
  state: JXCollectionsState
): JXCollectionsState {
  const isFav = state.favorites.includes(componentId);
  const updatedFavorites = isFav
    ? state.favorites.filter((id) => id !== componentId)
    : [...state.favorites, componentId];

  const updatedState = { ...state, favorites: updatedFavorites };
  saveCollectionsState(updatedState);
  return updatedState;
}

export function isFavorite(componentId: string, state: JXCollectionsState): boolean {
  return state.favorites.includes(componentId);
}

export function createCollection(
  name: string,
  description: string = '',
  state: JXCollectionsState
): JXCollectionsState {
  const trimmed = name.trim();
  if (!trimmed) return state;

  const id = `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newCollection: JXCollection = {
    id,
    name: trimmed,
    description: description.trim(),
    icon: 'layers',
    componentIds: [],
    createdAt: Date.now(),
  };

  const updatedState = {
    ...state,
    collections: [...state.collections, newCollection],
  };
  saveCollectionsState(updatedState);
  return updatedState;
}

export function deleteCollection(
  collectionId: string,
  state: JXCollectionsState
): JXCollectionsState {
  const updatedState = {
    ...state,
    collections: state.collections.filter((c) => c.id !== collectionId),
  };
  saveCollectionsState(updatedState);
  return updatedState;
}

export function addComponentToCollection(
  collectionId: string,
  componentId: string,
  state: JXCollectionsState
): JXCollectionsState {
  const updatedCollections = state.collections.map((col) => {
    if (col.id === collectionId && !col.componentIds.includes(componentId)) {
      return { ...col, componentIds: [...col.componentIds, componentId] };
    }
    return col;
  });

  const updatedState = { ...state, collections: updatedCollections };
  saveCollectionsState(updatedState);
  return updatedState;
}

export function removeComponentFromCollection(
  collectionId: string,
  componentId: string,
  state: JXCollectionsState
): JXCollectionsState {
  const updatedCollections = state.collections.map((col) => {
    if (col.id === collectionId) {
      return { ...col, componentIds: col.componentIds.filter((id) => id !== componentId) };
    }
    return col;
  });

  const updatedState = { ...state, collections: updatedCollections };
  saveCollectionsState(updatedState);
  return updatedState;
}

export function exportCollectionsJSON(state: JXCollectionsState): string {
  return JSON.stringify(
    {
      app: 'JXUI Design System',
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      favorites: state.favorites,
      collections: state.collections,
    },
    null,
    2
  );
}

export function importCollectionsJSON(
  jsonStr: string,
  currentState: JXCollectionsState
): JXCollectionsState {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') throw new Error('Invalid JSON payload');
    const importedFavs = Array.isArray(data.favorites) ? data.favorites : [];
    const importedCols = Array.isArray(data.collections) ? data.collections : [];

    // Merge favorites uniquely
    const mergedFavs = Array.from(new Set([...currentState.favorites, ...importedFavs]));

    // Merge collections by id
    const existingIds = new Set(currentState.collections.map((c) => c.id));
    const mergedCols = [...currentState.collections];
    for (const col of importedCols) {
      if (col && typeof col.id === 'string' && typeof col.name === 'string') {
        if (!existingIds.has(col.id)) {
          mergedCols.push(col);
          existingIds.add(col.id);
        }
      }
    }

    const nextState = { favorites: mergedFavs, collections: mergedCols };
    saveCollectionsState(nextState);
    return nextState;
  } catch (err) {
    throw new Error('Could not parse or validate imported collections format.');
  }
}
