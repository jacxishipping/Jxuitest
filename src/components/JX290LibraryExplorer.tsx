import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useJXTheme } from '../context/JXThemeContext';
import { 
  UNIFIED_COMPONENTS_351, 
  UNIFIED_CATEGORIES_18, 
  UnifiedComponentSpec, 
  ComponentTier,
  DifficultyLevel,
  FrameworkSupport,
  ALL_DIFFICULTIES,
  ALL_FRAMEWORKS,
  ALL_TAGS,
  UNIFIED_STATS 
} from '../data/unifiedCatalog';
import { InteractiveComponentPreview } from './InteractiveComponentPreview';
import { ComponentDocumentationModal } from './ComponentDocumentationModal';
import {
  loadCollectionsState,
  saveCollectionsState,
  toggleFavorite,
  isFavorite,
  createCollection,
  deleteCollection,
  exportCollectionsJSON,
  importCollectionsJSON,
  JXCollectionsState,
} from '../utils/jxuiCollections';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Star, 
  Filter, 
  BookOpen, 
  ShieldCheck, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  FolderPlus, 
  X,
  Layers,
  Sliders,
  ChevronDown,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export interface JX290LibraryExplorerProps {
  initialCategoryId?: string;
  initialComponentId?: string;
  onJumpToShowcase?: (specNumber: number) => void;
}

const ITEMS_PER_PAGE = 24;

export const JX290LibraryExplorer: React.FC<JX290LibraryExplorerProps> = ({
  initialCategoryId,
  initialComponentId,
  onJumpToShowcase,
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();

  // Collections & Favorites State
  const [collectionsState, setCollectionsState] = useState<JXCollectionsState>(() => loadCollectionsState());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSuite, setSelectedSuite] = useState<'all' | ComponentTier>('all');
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategoryId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'favorites' | string>('all');

  // UI & Documentation Modals
  const [activeDocSpec, setActiveDocSpec] = useState<UnifiedComponentSpec | null>(null);
  const [showManageCollections, setShowManageCollections] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [newCollectionDesc, setNewCollectionDesc] = useState<string>('');

  // Performance Pagination / Chunking
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Read and initialize from URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlDoc = params.get('doc');
      const urlCat = params.get('cat');
      const urlComp = params.get('comp');
      const urlCol = params.get('collection');

      if (urlDoc) {
        const found = UNIFIED_COMPONENTS_351.find((c) => c.id === urlDoc);
        if (found) {
          setActiveDocSpec(found);
        }
      }
      if (urlCat) {
        setSelectedCatId(urlCat);
      }
      if (urlCol) {
        setCollectionFilter(urlCol);
      }
      if (urlComp && !initialComponentId) {
        const comp = UNIFIED_COMPONENTS_351.find((c) => c.id === urlComp);
        if (comp) {
          setSelectedCatId(comp.categoryId);
          setHighlightedId(comp.id);
          setTimeout(() => {
            const el = document.getElementById(`spec-${comp.id}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 240);
          setTimeout(() => setHighlightedId(null), 3000);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  // Sync initial props
  useEffect(() => {
    if (initialComponentId) {
      const comp = UNIFIED_COMPONENTS_351.find((c) => c.id === initialComponentId);
      if (comp) {
        setSelectedCatId(comp.categoryId);
        setSelectedSuite('all');
        setSearchQuery('');
        setCollectionFilter('all');
        setHighlightedId(comp.id);
        setTimeout(() => {
          const el = document.getElementById(`spec-${comp.id}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
        setTimeout(() => setHighlightedId(null), 3000);
      }
    } else if (initialCategoryId) {
      setSelectedCatId(initialCategoryId);
    }
  }, [initialCategoryId, initialComponentId]);

  // Synchronize state with URL query parameters without reloading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (activeDocSpec) {
        url.searchParams.set('doc', activeDocSpec.id);
      } else {
        url.searchParams.delete('doc');
      }

      if (selectedCatId && selectedCatId !== 'all') {
        url.searchParams.set('cat', selectedCatId);
      } else {
        url.searchParams.delete('cat');
      }

      if (collectionFilter && collectionFilter !== 'all') {
        url.searchParams.set('collection', collectionFilter);
      } else {
        url.searchParams.delete('collection');
      }

      window.history.replaceState(null, '', url.toString());
    } catch {
      // fallback
    }
  }, [activeDocSpec, selectedCatId, collectionFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    searchQuery,
    selectedSuite,
    selectedCatId,
    selectedDifficulty,
    selectedFramework,
    selectedTag,
    collectionFilter,
  ]);

  // Filtering engine across 351 components
  const filteredComponents = useMemo(() => {
    let list = UNIFIED_COMPONENTS_351;

    // 1. Suite tier filter
    if (selectedSuite !== 'all') {
      list = list.filter((c) => c.tier === selectedSuite);
    }

    // 2. Category filter
    if (selectedCatId !== 'all') {
      list = list.filter((c) => c.categoryId === selectedCatId);
    }

    // 3. Difficulty filter
    if (selectedDifficulty !== 'all') {
      list = list.filter((c) => c.difficulty === selectedDifficulty);
    }

    // 4. Framework filter
    if (selectedFramework !== 'all') {
      list = list.filter((c) => c.frameworks.includes(selectedFramework as FrameworkSupport));
    }

    // 5. Tag filter
    if (selectedTag !== 'all') {
      list = list.filter((c) => c.tags.includes(selectedTag));
    }

    // 6. Favorites & Collections filter
    if (collectionFilter === 'favorites') {
      list = list.filter((c) => collectionsState.favorites.includes(c.id));
    } else if (collectionFilter !== 'all') {
      const col = collectionsState.collections.find((c) => c.id === collectionFilter);
      if (col) {
        list = list.filter((c) => col.componentIds.includes(c.id));
      }
    }

    // 7. Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.categoryTitle.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.difficulty.toLowerCase().includes(q) ||
          c.muiFlaw.toLowerCase().includes(q) ||
          c.jxuiUpgrade.toLowerCase().includes(q)
      );
    }

    return list;
  }, [
    selectedSuite,
    selectedCatId,
    selectedDifficulty,
    selectedFramework,
    selectedTag,
    collectionFilter,
    collectionsState,
    searchQuery,
  ]);

  // Slice for high-performance zero-lag DOM rendering
  const displayedComponents = useMemo(() => {
    return filteredComponents.slice(0, visibleCount);
  }, [filteredComponents, visibleCount]);

  const hasMore = visibleCount < filteredComponents.length;

  const handleCopyCode = (spec: UnifiedComponentSpec) => {
    navigator.clipboard.writeText(spec.jsxSnippet);
    setCopiedId(spec.id);
    pushToast({
      title: `Copied <${spec.name} />`,
      description: 'Clean JSX snippet ready to paste into your application',
      variant: 'success',
    });
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleToggleFav = (spec: UnifiedComponentSpec) => {
    const next = toggleFavorite(spec.id, collectionsState);
    setCollectionsState(next);
    const isNowFav = isFavorite(spec.id, next);
    pushToast({
      title: isNowFav ? 'Bookmarked' : 'Unstarred',
      description: `<${spec.name} /> ${isNowFav ? 'saved to' : 'removed from'} favorites`,
      variant: isNowFav ? 'success' : 'default',
    });
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const next = createCollection(newCollectionName, newCollectionDesc, collectionsState);
    setCollectionsState(next);
    setNewCollectionName('');
    setNewCollectionDesc('');
    pushToast({
      title: 'Collection Created',
      description: `New collection "${newCollectionName}" is ready`,
      variant: 'success',
    });
  };

  const handleDeleteCollection = (id: string, name: string) => {
    const next = deleteCollection(id, collectionsState);
    setCollectionsState(next);
    if (collectionFilter === id) setCollectionFilter('all');
    pushToast({
      title: 'Collection Removed',
      description: `Collection "${name}" deleted`,
      variant: 'default',
    });
  };

  const handleExportCollections = () => {
    const json = exportCollectionsJSON(collectionsState);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jxui-collections-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast({
      title: 'Exported Collections',
      description: 'Collections JSON file downloaded',
      variant: 'success',
    });
  };

  const handleImportCollections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const next = importCollectionsJSON(text, collectionsState);
        setCollectionsState(next);
        pushToast({
          title: 'Collections Imported',
          description: 'Custom collections merged successfully',
          variant: 'success',
        });
      } catch (err: any) {
        pushToast({
          title: 'Import Failed',
          description: err.message || 'Invalid collections file',
          variant: 'error',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSuite('all');
    setSelectedCatId('all');
    setSelectedDifficulty('all');
    setSelectedFramework('all');
    setSelectedTag('all');
    setCollectionFilter('all');
  };

  const isFiltered =
    searchQuery ||
    selectedSuite !== 'all' ||
    selectedCatId !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedFramework !== 'all' ||
    selectedTag !== 'all' ||
    collectionFilter !== 'all';

  return (
    <section id="jx-290-component-suite" className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 scroll-mt-16">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Architecture • {UNIFIED_STATS.totalComponents} Total Primitives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            18-Category Master Component Suite
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Multi-tier component search, live interactive previews, custom bookmark collections, and typed documentation pages. All 351 components feature verified <strong>WCAG 2.1 AA/AAA compliance</strong> and <strong>CLS = 0</strong>.
          </p>
        </div>

        {/* Collections Manager Trigger & Global Stats */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowManageCollections(!showManageCollections)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-500" />
            <span>Collections ({collectionsState.collections.length})</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold">
              ★ {collectionsState.favorites.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Collections Management Panel (Expandable) */}
      {showManageCollections && (
        <div className={`p-5 mb-8 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 ${getRadiusClass('card')} shadow-sm animate-fade-in`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-indigo-500" />
                <span>Favorites &amp; Custom Collections Organizer</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bookmark frequently used components, assemble project design systems, and export/import via JSON.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCollections}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <label className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportCollections}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowManageCollections(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left: Collections List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Collections
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div
                  onClick={() => setCollectionFilter('favorites')}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                    collectionFilter === 'favorites'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <div>
                      <span className="font-bold text-xs">Starred Favorites</span>
                      <p className="text-[10px] text-slate-400">Personal quick bookmarks</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    {collectionsState.favorites.length} components
                  </span>
                </div>

                {collectionsState.collections.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => setCollectionFilter(col.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      collectionFilter === col.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs">{col.name}</span>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{col.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {col.componentIds.length}
                      </span>
                      {!col.isDefault && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollection(col.id, col.name);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Create Collection Form */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Create New Collection
              </span>
              <form onSubmit={handleCreateCollection} className="mt-2 space-y-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection Name (e.g., Marketing Landing Kit)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <input
                  type="text"
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Save New Collection
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comprehensive Filter & Search Bar */}
      <div className={`p-4 mb-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 ${getRadiusClass('card')} shadow-sm space-y-3`}>
        {/* Top Search Input & Tier Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components by name, category, tags, or mui upgrade..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tier Switcher (All / Showcase / Primitive) */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shrink-0">
            {(['all', 'showcase', 'primitive'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedSuite(tier)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  selectedSuite === tier
                    ? `${palette.bg} text-white font-bold shadow-xs`
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tier === 'all' ? 'All (351)' : tier === 'showcase' ? 'Showcases (61)' : 'Primitives (290)'}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Dimensional Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All 18 Categories</option>
            {UNIFIED_CATEGORIES_18.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.number}. {cat.title} ({cat.totalCount})
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer capitalize"
          >
            <option value="all">All Difficulties</option>
            {ALL_DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff} className="capitalize">
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>

          {/* Framework Dropdown */}
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Frameworks</option>
            {ALL_FRAMEWORKS.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </select>

          {/* Tag Dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Tags</option>
            {ALL_TAGS.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>

          {/* Collection / Favorites Filter */}
          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Components</option>
            <option value="favorites">★ Starred Favorites ({collectionsState.favorites.length})</option>
            {collectionsState.collections.map((col) => (
              <option key={col.id} value={col.id}>
                📁 {col.name} ({col.componentIds.length})
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Active Filter Counters */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>
          Showing <strong>{displayedComponents.length}</strong> of <strong>{filteredComponents.length}</strong> components
          {isFiltered && <span className="text-indigo-600 dark:text-indigo-400 font-medium ml-1.5">(Filtered)</span>}
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          Render window: {visibleCount} items (Zero-lag pagination)
        </span>
      </div>

      {/* 5. 18-Category Horizontal Ribbon */}
      <div className="overflow-x-auto pb-3 mb-6 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setSelectedCatId('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedCatId === 'all'
                ? `${palette.bg} text-white border-transparent shadow-sm font-bold`
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            All Categories ({UNIFIED_STATS.totalComponents})
          </button>
          {UNIFIED_CATEGORIES_18.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? `${palette.bg} text-white border-transparent shadow-sm font-bold`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{cat.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Component Cards Grid */}
      {displayedComponents.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            No components match your current filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, removing active tags, or resetting difficulty filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedComponents.map((spec) => {
            const isCopied = copiedId === spec.id;
            const isShowcase = spec.tier === 'showcase';
            const isHighlighted = highlightedId === spec.id;
            const isFav = isFavorite(spec.id, collectionsState);

            return (
              <div
                key={spec.id}
                id={`spec-${spec.id}`}
                className={`p-5 bg-white dark:bg-slate-900 border transition-all duration-300 ${
                  isHighlighted
                    ? 'border-indigo-500 ring-4 ring-indigo-500/30 scale-[1.02] shadow-2xl'
                    : isShowcase
                    ? 'border-indigo-200 dark:border-indigo-900/60 shadow-md ring-1 ring-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 shadow-xs'
                } ${getRadiusClass(
                  'card'
                )} hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Header: Name, Star Bookmark, Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{spec.name}</span>
                        {isShowcase && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Showcase
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {spec.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Star Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFav(spec)}
                        title={isFav ? 'Remove from favorites' : 'Bookmark to favorites'}
                        className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded shrink-0 ${
                        isShowcase
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {spec.badge}
                      </span>
                    </div>
                  </div>

                  {/* Quality & Metadata Indicators Pill Bar */}
                  <div className="flex items-center gap-1.5 my-2 flex-wrap text-[10px] font-mono">
                    <span
                      data-testid="v3-badge"
                      title="Running on JXUI v3.0.0"
                      className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold"
                    >
                      v3
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{spec.quality.wcagScore}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold">
                      {spec.difficulty}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-semibold">
                      CLS=0
                    </span>
                  </div>

                  {/* Interactive Live Component Viewport */}
                  <div className="my-3 p-4 bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 rounded-xl min-h-[96px] flex items-center justify-center overflow-hidden">
                    <InteractiveComponentPreview
                      spec={spec}
                      onJumpToShowcase={onJumpToShowcase}
                    />
                  </div>

                  {/* MUI Flaw vs JXUI Upgrade Strip */}
                  <div className="flex flex-col gap-1 text-[11px] mb-3">
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 truncate">
                      <span className="font-bold uppercase text-[9px] px-1 bg-rose-50 dark:bg-rose-950/60 rounded">MUI</span>
                      <span className="truncate">{spec.muiFlaw}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 truncate">
                      <span className="font-bold uppercase text-[9px] px-1 bg-emerald-50 dark:bg-emerald-950/60 rounded">JXUI v3.0</span>
                      <span className="truncate">{spec.jxuiUpgrade}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer: Copy JSX & Open Docs */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDocSpec(spec)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Docs &amp; Props</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(spec)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-transparent'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy JSX'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Performance Pagination Controls (Load More) */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Load More Components ({filteredComponents.length - visibleCount} remaining)</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Displaying {displayedComponents.length} of {filteredComponents.length} items
          </span>
        </div>
      )}

      {/* 8. Component Documentation Modal Dialog */}
      <ComponentDocumentationModal
        spec={activeDocSpec}
        onClose={() => setActiveDocSpec(null)}
        collectionsState={collectionsState}
        onUpdateCollectionsState={setCollectionsState}
        onJumpToShowcase={onJumpToShowcase}
      />
    </section>
  );
};
