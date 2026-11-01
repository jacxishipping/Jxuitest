import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ArrowUpRight,
  Search,
  Filter,
  Star,
  BookOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  X,
  Layers,
  Compass,
  Box,
  Bell,
  LayoutGrid,
  BarChart3,
  Table,
  Volume2,
  Columns,
  Workflow,
  Lock,
  FileCode,
  Clock,
  ShieldCheck,
  ExternalLink,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  useJXTheme,
  ACCENT_PALETTES,
  AccentColor,
  RadiusScale,
} from '../../context/JXThemeContext';
import {
  COMPONENT_CATALOG,
  ComponentSpec,
} from '../../data/catalog';
import {
  UNIFIED_COMPONENTS_351,
  UNIFIED_CATEGORIES_18,
  UnifiedComponentSpec,
  UnifiedCategorySpec,
  DifficultyLevel,
  FrameworkSupport,
} from '../../data/unifiedCatalog';
import {
  JXCollectionsState,
  toggleFavorite,
  isFavorite,
  createCollection,
  deleteCollection,
  exportCollectionsJSON,
  importCollectionsJSON,
} from '../../utils/jxuiCollections';
import { InteractiveComponentPreview } from '../InteractiveComponentPreview';
import { ComponentDocumentationModal } from '../ComponentDocumentationModal';
import { LivePlayground, InlineLivePlayground } from '../LivePlayground';
import {
  CopyCodeMode,
  formatCopyableJsxCode,
  PlaygroundPropValues,
  PlaygroundCssVariables,
  DEFAULT_PLAYGROUND_PROPS,
  DEFAULT_PLAYGROUND_CSS_VARS,
  serializePlaygroundJsx,
  persistRecentlyViewedComponent,
} from '../../utils/jxuiLogic';
import {
  resolveRawComponentSource,
  getCachedRawSource,
  copyTextToClipboard,
} from '../../utils/rawSourceLoader';

// Lazy-loaded studio modules
const DesignTokenExporter = lazy(() =>
  import('../DesignTokenExporter').then((m) => ({ default: m.DesignTokenExporter }))
);
const AccessibilityAriaSection = lazy(() =>
  import('../AccessibilityAriaSection').then((m) => ({ default: m.AccessibilityAriaSection }))
);

const SectionSkeletonFallback: React.FC<{ label?: string }> = ({
  label = 'Loading component suite...',
}) => (
  <div className="w-full min-h-[300px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center animate-pulse">
    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-3 text-indigo-600 dark:text-indigo-400">
      <Sparkles className="w-4 h-4 animate-spin" />
    </div>
    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
      {label}
    </span>
    <span className="text-[10px] text-slate-400 font-mono mt-1">
      Zero CLS Dynamic Chunk Loading
    </span>
  </div>
);

const RADIUS_OPTIONS: { id: RadiusScale; label: string; scaleLabel: string }[] = [
  { id: 'sharp', label: 'Sharp (0px)', scaleLabel: '0.5x' },
  { id: 'sm', label: 'Crisp (8px)', scaleLabel: '0.75x' },
  { id: 'md', label: 'Default (12px)', scaleLabel: '1.0x' },
  { id: 'lg', label: 'Soft (16px)', scaleLabel: '1.35x' },
  { id: 'xl', label: 'Ultra (24px)', scaleLabel: '1.75x' },
];

const CATEGORY_ICONS_18: Record<string, React.ComponentType<{ className?: string }>> = {
  'buttons-actions': Zap,
  'glass-surfaces': Layers,
  navigation: Compass,
  'inputs-forms': Sliders,
  'toggles-selection': CheckCircle2,
  'modals-overlays': Box,
  'feedback-notifications': Bell,
  'loading-progress': Sparkles,
  'cards-content': LayoutGrid,
  'data-visualization': BarChart3,
  'tables-datagrids': Table,
  'media-audio-visual': Volume2,
  'layout-workspace': Columns,
  'animation-motion': Workflow,
  'security-authentication': Lock,
  'editors-creative': FileCode,
  'time-scheduling': Clock,
  'advanced-utilities': ShieldCheck,
};

const ITEMS_PER_PAGE = 24;

export interface AppWorkbenchProps {
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  activeTier: 'all' | 'showcase' | 'primitive' | 'favorites';
  setActiveTier: (tier: 'all' | 'showcase' | 'primitive' | 'favorites') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCopyInstall: () => void;
  copiedInstall: boolean;
  onTriggerToast: () => void;
  showEncyclopedia: boolean;
  onToggleEncyclopedia: () => void;
  encyclopediaFilter: string;
  onEncyclopediaFilterChange: (q: string) => void;
  springPressActive: boolean;
  onToggleSpringPress: () => void;
  haloFocusActive: boolean;
  onToggleHaloFocus: () => void;
  collectionsState: JXCollectionsState;
  onUpdateCollectionsState: (next: JXCollectionsState) => void;
  onJumpToComponent?: (spec: ComponentSpec) => void;
}

export const AppWorkbench: React.FC<AppWorkbenchProps> = ({
  activeCategory,
  setActiveCategory,
  activeTier,
  setActiveTier,
  searchQuery,
  setSearchQuery,
  onCopyInstall,
  copiedInstall,
  onTriggerToast,
  showEncyclopedia,
  onToggleEncyclopedia,
  encyclopediaFilter,
  onEncyclopediaFilterChange,
  springPressActive,
  onToggleSpringPress,
  haloFocusActive,
  onToggleHaloFocus,
  collectionsState,
  onUpdateCollectionsState,
  onJumpToComponent,
}) => {
  const {
    palette,
    accent,
    setAccent,
    radiusScale,
    setRadiusScale,
    getRadiusClass,
    compareMode,
    setCompareMode,
    pushToast,
  } = useJXTheme();

  // Filter States
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  // UI Modals & Pagination
  const [activeDocSpec, setActiveDocSpec] = useState<UnifiedComponentSpec | null>(null);
  const [showManageCollections, setShowManageCollections] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [newCollectionDesc, setNewCollectionDesc] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMode, setCopiedMode] = useState<CopyCodeMode>('jsx');
  const [cardCodeModes, setCardCodeModes] = useState<Record<string, CopyCodeMode>>({});
  const [expandedCodeIds, setExpandedCodeIds] = useState<Record<string, boolean>>({});
  const [rawCodeMap, setRawCodeMap] = useState<Record<string, string>>({});

  // Live Playground States (Studio + Inline Card Playgrounds)
  const [playgroundComponentId, setPlaygroundComponentId] = useState<string>('jx-button');
  const [expandedPlaygroundIds, setExpandedPlaygroundIds] = useState<Record<string, boolean>>({});
  const [cardPlaygroundTabs, setCardPlaygroundTabs] = useState<
    Record<string, 'props' | 'css' | 'changelog'>
  >({});
  const [cardPlaygroundProps, setCardPlaygroundProps] = useState<Record<string, PlaygroundPropValues>>({});
  const [cardPlaygroundCssVars, setCardPlaygroundCssVars] = useState<Record<string, PlaygroundCssVariables>>({});

  // URL Deep link check on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlDoc = params.get('doc');
      if (urlDoc) {
        const found = UNIFIED_COMPONENTS_351.find((c) => c.id === urlDoc);
        if (found) {
          setActiveDocSpec(found);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  // URL Sync & Recently Viewed persistence when activeDocSpec changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (activeDocSpec) {
        url.searchParams.set('doc', activeDocSpec.id);
        persistRecentlyViewedComponent(activeDocSpec.id);
      } else {
        url.searchParams.delete('doc');
      }
      window.history.replaceState(null, '', url.toString());
    } catch {
      // fallback
    }
  }, [activeDocSpec]);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    activeCategory,
    activeTier,
    searchQuery,
    selectedDifficulty,
    selectedFramework,
    selectedCollection,
  ]);

  // Unified Filtering Engine across all 351 Components
  const filteredComponents = useMemo(() => {
    let list = UNIFIED_COMPONENTS_351;

    // 1. Tier filter
    if (activeTier === 'showcase') {
      list = list.filter((c) => c.tier === 'showcase');
    } else if (activeTier === 'primitive') {
      list = list.filter((c) => c.tier === 'primitive');
    } else if (activeTier === 'favorites') {
      list = list.filter((c) => collectionsState.favorites.includes(c.id));
    }

    // 2. Category filter
    if (activeCategory !== 'all') {
      list = list.filter((c) => c.categoryId === activeCategory);
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.categoryTitle.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.muiFlaw.toLowerCase().includes(q) ||
          c.jxuiUpgrade.toLowerCase().includes(q)
      );
    }

    // 4. Difficulty filter
    if (selectedDifficulty !== 'all') {
      list = list.filter((c) => c.difficulty === selectedDifficulty);
    }

    // 5. Framework filter
    if (selectedFramework !== 'all') {
      list = list.filter((c) => c.frameworks.includes(selectedFramework as FrameworkSupport));
    }

    // 6. Custom collection filter
    if (selectedCollection !== 'all') {
      const col = collectionsState.collections.find((c) => c.id === selectedCollection);
      if (col) {
        list = list.filter((c) => col.componentIds.includes(c.id));
      }
    }

    return list;
  }, [
    activeCategory,
    activeTier,
    searchQuery,
    selectedDifficulty,
    selectedFramework,
    selectedCollection,
    collectionsState,
  ]);

  const visibleComponents = useMemo(() => {
    return filteredComponents.slice(0, visibleCount);
  }, [filteredComponents, visibleCount]);

  const getCardMode = (specId: string): CopyCodeMode => cardCodeModes[specId] || 'jsx';

  const handleSetCardMode = async (spec: UnifiedComponentSpec, mode: CopyCodeMode) => {
    setCardCodeModes((prev) => ({ ...prev, [spec.id]: mode }));
    if (mode === 'raw' && !rawCodeMap[spec.id]) {
      const resolved = await resolveRawComponentSource({
        name: spec.name,
        subtitle: spec.subtitle,
        jsxSnippet: spec.jsxSnippet,
        muiFlaw: spec.muiFlaw,
        jxuiUpgrade: spec.jxuiUpgrade,
        props: spec.doc.props,
      });
      setRawCodeMap((prev) => ({ ...prev, [spec.id]: resolved }));
    }
  };

  const handleToggleCardCode = async (spec: UnifiedComponentSpec) => {
    const nextOpen = !expandedCodeIds[spec.id];
    setExpandedCodeIds((prev) => ({ ...prev, [spec.id]: nextOpen }));
    if (nextOpen && !rawCodeMap[spec.id]) {
      const resolved = await resolveRawComponentSource({
        name: spec.name,
        subtitle: spec.subtitle,
        jsxSnippet: spec.jsxSnippet,
        muiFlaw: spec.muiFlaw,
        jxuiUpgrade: spec.jxuiUpgrade,
        props: spec.doc.props,
      });
      setRawCodeMap((prev) => ({ ...prev, [spec.id]: resolved }));
    }
  };

  const handleCopyCode = async (spec: UnifiedComponentSpec, overrideMode?: CopyCodeMode) => {
    const mode = overrideMode || getCardMode(spec.id);
    let textToCopy = '';
    if (mode === 'raw') {
      textToCopy =
        rawCodeMap[spec.id] ||
        (await resolveRawComponentSource({
          name: spec.name,
          subtitle: spec.subtitle,
          jsxSnippet: spec.jsxSnippet,
          muiFlaw: spec.muiFlaw,
          jxuiUpgrade: spec.jxuiUpgrade,
          props: spec.doc.props,
        }));
      setRawCodeMap((prev) => ({ ...prev, [spec.id]: textToCopy }));
    } else {
      textToCopy =
        spec.doc.usageCode || formatCopyableJsxCode(spec.jsxSnippet, spec.name, true);
    }

    await copyTextToClipboard(textToCopy);
    setCopiedId(spec.id);
    setCopiedMode(mode);
    pushToast({
      title: `Copied <${spec.name} /> ${mode === 'raw' ? 'Raw Source' : 'JSX'}`,
      description:
        mode === 'raw'
          ? 'Full TypeScript implementation copied to clipboard'
          : 'Import and working JSX copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFav = (specId: string, specName: string) => {
    const next = toggleFavorite(specId, collectionsState);
    onUpdateCollectionsState(next);
    const isNowFav = isFavorite(specId, next);
    pushToast({
      title: isNowFav ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      description: `<${specName} /> ${isNowFav ? 'added to' : 'removed from'} your starred list`,
      variant: isNowFav ? 'success' : 'default',
    });
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const next = createCollection(newCollectionName.trim(), newCollectionDesc.trim(), collectionsState);
    onUpdateCollectionsState(next);
    setNewCollectionName('');
    setNewCollectionDesc('');
    pushToast({
      title: 'Collection Created',
      description: `Created "${newCollectionName.trim()}"`,
      variant: 'success',
    });
  };

  const handleDeleteCollection = (id: string, name: string) => {
    const next = deleteCollection(id, collectionsState);
    onUpdateCollectionsState(next);
    if (selectedCollection === id) setSelectedCollection('all');
    pushToast({
      title: 'Collection Deleted',
      description: `Removed "${name}"`,
      variant: 'default',
    });
  };

  const handleExportCollections = () => {
    const jsonStr = exportCollectionsJSON(collectionsState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jxui-collections-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast({
      title: 'Collections Exported',
      description: 'Saved your bookmarks and collections to JSON',
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
        onUpdateCollectionsState(next);
        pushToast({
          title: 'Collections Imported',
          description: `Loaded ${next.collections.length} collections and ${next.favorites.length} bookmarks`,
          variant: 'success',
        });
      } catch {
        pushToast({
          title: 'Import Failed',
          description: 'Invalid JSON collections schema',
          variant: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  // 61 Architectural encyclopedia filter
  const encyclopediaItems = COMPONENT_CATALOG.filter((item) => {
    if (!encyclopediaFilter.trim()) return true;
    const q = encyclopediaFilter.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.muiFlaw.toLowerCase().includes(q) ||
      item.jxuiUpgrade.toLowerCase().includes(q)
    );
  });

  const activeCategorySpec = UNIFIED_CATEGORIES_18.find((c) => c.id === activeCategory);

  return (
    <main className="w-full flex-1 px-4 sm:px-8 py-6 sm:py-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Specular Ambient Glow Layer */}
      <div className="relative w-full overflow-hidden pt-2">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[340px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* 1. HERO HEADER WITH LIVE ARCHITECTURAL COMPARISON STATS */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span>JXUI v3.0.0 · The Unified React 19 Component Suite</span>
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                <span className="font-mono text-[11px] opacity-90">351 Total Primitives</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                All 351 React Components. Unified &amp; Interactive.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                61 flagship showcases + 290 atomic primitives categorized into 18 unified domains. Zero runtime CSS overhead, 200ms damped spring physics, and 100% WCAG AA certification.
              </p>
            </div>

            {/* Quick NPM Install Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 shadow-md whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 select-none">$</span>
                  <span className="text-slate-200">npm i jxui-react</span>
                </div>
                <button
                  type="button"
                  onClick={onCopyInstall}
                  aria-label="Copy npm install command"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedInstall ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={onToggleEncyclopedia}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span>61 Architectural Flaws</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  vs JXUI
                </span>
              </button>
            </div>
          </div>

          {/* 3 Key Pillar Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  CSS Engine &amp; Styling
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                  MUI: Emotion (14kB)
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero-Runtime CSS Variables + Tailwind</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                No CSS-in-JS compilation stalls; sub-millisecond SSR hydration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Interactions &amp; Haptics
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  MUI: CSS Ripple
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tactile Damped Spring Physics (200ms)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Natural mass, damping scale(0.98), and 3px roving focus halos.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  TypeScript &amp; React 19
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 text-[10px] font-bold">
                  MUI: React 17/18
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Native React 19 Actions &amp; Strict Polymorphism</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Zero type mismatch with 'as', strict polymorphic component slots.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RUNTIME THEME STUDIO & CONTROLS TOOLBAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Palette Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Accent:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(Object.keys(ACCENT_PALETTES) as AccentColor[]).map((key) => {
                const pal = ACCENT_PALETTES[key];
                const active = accent === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAccent(key)}
                    style={{ backgroundColor: pal.hex }}
                    title={`${pal.name} Palette`}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      active
                        ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Radius Scale Multipliers */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Radius:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRadiusScale(r.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    radiusScale === r.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Mode */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              View:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCompareMode('jxui')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  compareMode === 'jxui'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                JXUI Pure
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('split')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  compareMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                MUI vs JXUI Split
              </button>
            </div>
          </div>
        </div>

        {/* Tactile & Toast Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSpringPress}
            title={springPressActive ? 'Spring Press Physics Active (scale 0.98)' : 'Physics Springs Disabled'}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              springPressActive
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Spring (200ms)</span>
          </button>

          <button
            type="button"
            onClick={onToggleHaloFocus}
            title={haloFocusActive ? '3px Roving Tactile Focus Halos Active' : 'Focus Halos Disabled'}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              haloFocusActive
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span>3px Focus Halo</span>
          </button>

          <button
            type="button"
            onClick={onTriggerToast}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Test 3D Toast
          </button>

          <button
            type="button"
            onClick={() => {
              setAccent('indigo');
              setRadiusScale('md');
              setCompareMode('jxui');
              onToggleSpringPress();
              onToggleHaloFocus();
            }}
            title="Reset Studio to Defaults"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3. UNIFIED 18-CATEGORY HORIZONTAL PILL SELECTOR RAIL */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scroll-smooth">
          {/* All Categories Button */}
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Categories</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/15">
              351
            </span>
          </button>

          {/* 18 Individual Category Pills */}
          {UNIFIED_CATEGORIES_18.map((cat) => {
            const Icon = CATEGORY_ICONS_18[cat.id] || Box;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{cat.title.replace(/^Category \d+:\s*/, '')}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {cat.totalCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3B. INTERACTIVE LIVE PLAYGROUND STUDIO */}
      <LivePlayground
        selectedComponentId={playgroundComponentId}
        onSelectComponentId={setPlaygroundComponentId}
        onOpenDocs={setActiveDocSpec}
      />

      {/* 4. MASTER COMPONENT EXPLORER: FILTERS & CONTROLS BAR */}
      <div id="unified-component-suite" className="scroll-mt-24 space-y-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Search input */}
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, tags, props..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Center: Tier Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTier('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTier === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All (351)
            </button>
            <button
              type="button"
              onClick={() => setActiveTier('showcase')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTier === 'showcase'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>Showcases (61)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTier('primitive')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTier === 'primitive'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Primitives (290)
            </button>
            <button
              type="button"
              onClick={() => setActiveTier('favorites')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTier === 'favorites'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Starred ({collectionsState.favorites.length})</span>
            </button>
          </div>

          {/* Right: Dropdowns & Collections Manager */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by difficulty"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="enterprise">Enterprise</option>
            </select>

            {/* Framework Dropdown */}
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              aria-label="Filter by framework"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Frameworks</option>
              <option value="React 19">React 19</option>
              <option value="Next.js 15">Next.js 15</option>
              <option value="Vite">Vite</option>
            </select>

            {/* Collections Manager Button */}
            <button
              type="button"
              onClick={() => setShowManageCollections(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Collections ({collectionsState.collections.length})</span>
            </button>
          </div>
        </div>

        {/* Category Header & Filter Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{activeCategorySpec ? activeCategorySpec.title : 'All 351 Components'}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                {filteredComponents.length} results
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeCategorySpec
                ? activeCategorySpec.description
                : 'Browse all 61 showcase architectures and 290 atomic primitives in one unified interface.'}
            </p>
          </div>

          {(activeCategory !== 'all' || activeTier !== 'all' || searchQuery || selectedDifficulty !== 'all' || selectedFramework !== 'all' || selectedCollection !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTier('all');
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedFramework('all');
                setSelectedCollection('all');
              }}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 5. MASTER UNIFIED COMPONENT GRID */}
        {visibleComponents.length === 0 ? (
          <div className="w-full p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No matching components found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, tier filter, or category selection to find what you need.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTier('all');
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedFramework('all');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleComponents.map((spec) => {
              const isFav = collectionsState.favorites.includes(spec.id);
              const isCopied = copiedId === spec.id;
              const currentMode = getCardMode(spec.id);
              const isCodeExpanded = Boolean(expandedCodeIds[spec.id]);
              const isPlaygroundExpanded = Boolean(expandedPlaygroundIds[spec.id]);
              const activeCardProps = cardPlaygroundProps[spec.id];
              const activeCardCssVars = cardPlaygroundCssVars[spec.id];
              const activeCodeText =
                currentMode === 'raw'
                  ? rawCodeMap[spec.id] ||
                    getCachedRawSource({
                      name: spec.name,
                      subtitle: spec.subtitle,
                      jsxSnippet: spec.jsxSnippet,
                      muiFlaw: spec.muiFlaw,
                      jxuiUpgrade: spec.jxuiUpgrade,
                      props: spec.doc.props,
                    })
                  : activeCardProps
                  ? serializePlaygroundJsx(spec.name, activeCardProps, true)
                  : spec.doc.usageCode ||
                    formatCopyableJsxCode(spec.jsxSnippet, spec.name, true);

              return (
                <div
                  key={spec.id}
                  id={`spec-${spec.id}`}
                  data-jxui-version={spec.version}
                  className={`group relative rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600`}
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                          &lt;{spec.name} /&gt;
                        </h3>

                        {/* Tier & v3 Version Badges */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            data-testid="v3-badge"
                            title="Running on JXUI v3.0.0"
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80"
                          >
                            v3
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            spec.tier === 'showcase'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {spec.tier === 'showcase' ? `★ Showcase #${spec.showcaseNumber}` : 'Primitive'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {spec.categoryTitle.replace(/^Category \d+:\s*/, '')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {spec.subtitle}
                    </p>
                  </div>

                  {/* Real Interactive Component Showcase Area with Copy Code Controls */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col relative overflow-visible group-hover:border-indigo-200 dark:group-hover:border-indigo-900/60 transition-colors">
                    {/* Showcase Top Code Toolbar: JSX vs Raw Implementation + Copy Code + View Code */}
                    <div className="px-3 py-1.5 border-b border-slate-200/60 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-2 bg-slate-100/60 dark:bg-slate-900/60 rounded-t-xl">
                      <div
                        role="group"
                        aria-label={`Code mode for ${spec.name}`}
                        className="inline-flex items-center rounded-md bg-slate-200/80 dark:bg-slate-800 p-0.5 text-[10px] font-mono shrink-0"
                      >
                        <button
                          type="button"
                          onClick={() => handleSetCardMode(spec, 'jsx')}
                          className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                            currentMode === 'jsx'
                              ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          JSX
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetCardMode(spec, 'raw')}
                          className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                            currentMode === 'raw'
                              ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Raw (.tsx)
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            persistRecentlyViewedComponent(spec.id);
                            const currentlyOpen = expandedPlaygroundIds[spec.id];
                            const currentTab = cardPlaygroundTabs[spec.id] || 'props';
                            if (currentlyOpen && currentTab !== 'changelog') {
                              setExpandedPlaygroundIds((prev) => ({ ...prev, [spec.id]: false }));
                            } else {
                              setCardPlaygroundTabs((prev) => ({ ...prev, [spec.id]: 'props' }));
                              setExpandedPlaygroundIds((prev) => ({ ...prev, [spec.id]: true }));
                            }
                          }}
                          aria-expanded={
                            isPlaygroundExpanded &&
                            (cardPlaygroundTabs[spec.id] || 'props') !== 'changelog'
                          }
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                            isPlaygroundExpanded &&
                            (cardPlaygroundTabs[spec.id] || 'props') !== 'changelog'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
                          }`}
                        >
                          <Sliders className="w-2.5 h-2.5 shrink-0" />
                          <span>Playground</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            persistRecentlyViewedComponent(spec.id);
                            const currentlyOpen = expandedPlaygroundIds[spec.id];
                            const currentTab = cardPlaygroundTabs[spec.id] || 'props';
                            if (currentlyOpen && currentTab === 'changelog') {
                              setExpandedPlaygroundIds((prev) => ({ ...prev, [spec.id]: false }));
                            } else {
                              setCardPlaygroundTabs((prev) => ({
                                ...prev,
                                [spec.id]: 'changelog',
                              }));
                              setExpandedPlaygroundIds((prev) => ({ ...prev, [spec.id]: true }));
                            }
                          }}
                          aria-expanded={
                            isPlaygroundExpanded && cardPlaygroundTabs[spec.id] === 'changelog'
                          }
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                            isPlaygroundExpanded && cardPlaygroundTabs[spec.id] === 'changelog'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
                          }`}
                        >
                          <History className="w-2.5 h-2.5 shrink-0" />
                          <span>Changelog</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleCardCode(spec)}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                            isCodeExpanded
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <FileCode className="w-2.5 h-2.5 shrink-0" />
                          <span>{isCodeExpanded ? 'Hide Code' : 'View Code'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(spec)}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-2.5 h-2.5 shrink-0" />
                              <span>Copied {copiedMode === 'raw' ? 'Raw' : 'JSX'}!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5 shrink-0" />
                              <span>Copy {currentMode === 'raw' ? 'Raw' : 'JSX'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Live Preview Stage */}
                    <div className="min-h-[110px] flex items-center justify-center p-3 relative overflow-visible">
                      <InteractiveComponentPreview
                        spec={spec}
                        onOpenDocs={setActiveDocSpec}
                        playgroundProps={isPlaygroundExpanded ? activeCardProps || DEFAULT_PLAYGROUND_PROPS : activeCardProps}
                        playgroundCssVars={isPlaygroundExpanded ? activeCardCssVars || DEFAULT_PLAYGROUND_CSS_VARS : activeCardCssVars}
                        onJumpToShowcase={onJumpToComponent ? (specNumber: number) => {
                          const s = COMPONENT_CATALOG.find((c) => c.number === spec.showcaseNumber);
                          if (s) { onJumpToComponent(s); }
                        } : undefined}
                      />
                    </div>

                    {/* Inline Live Playground Drawer for Real-Time Props, CSS Variables & v3 Changelog */}
                    {isPlaygroundExpanded && (
                      <InlineLivePlayground
                        componentName={spec.name}
                        initialTab={cardPlaygroundTabs[spec.id] || 'props'}
                        propsState={activeCardProps || DEFAULT_PLAYGROUND_PROPS}
                        onChangeProps={(next) =>
                          setCardPlaygroundProps((prev) => ({ ...prev, [spec.id]: next }))
                        }
                        cssVars={activeCardCssVars || DEFAULT_PLAYGROUND_CSS_VARS}
                        onChangeCssVars={(next) =>
                          setCardPlaygroundCssVars((prev) => ({ ...prev, [spec.id]: next }))
                        }
                        onReset={() => {
                          setCardPlaygroundProps((prev) => {
                            const copy = { ...prev };
                            delete copy[spec.id];
                            return copy;
                          });
                          setCardPlaygroundCssVars((prev) => {
                            const copy = { ...prev };
                            delete copy[spec.id];
                            return copy;
                          });
                        }}
                      />
                    )}

                    {/* Collapsible Inline JSX / Raw Implementation Code Drawer */}
                    {isCodeExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 rounded-b-xl overflow-hidden">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>
                            {currentMode === 'raw'
                              ? `${spec.name}.tsx · Raw Implementation`
                              : `${spec.name} · JSX Usage Snippet`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(spec)}
                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] font-mono text-indigo-200 overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">
                          <code>{activeCodeText}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions & Quality Tags */}
                  <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/70">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{spec.quality.wcagScore}</span>
                      </span>
                      <span className="capitalize">{spec.difficulty}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      {/* Inspect Docs Button */}
                      <button
                        type="button"
                        onClick={() => setActiveDocSpec(spec)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Inspect Docs</span>
                      </button>

                      {/* Copy Code Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(spec)}
                        title={`Copy ${currentMode === 'raw' ? 'Raw Implementation' : 'JSX'} Code`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>

                      {/* Bookmark Star Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFav(spec.id, spec.name)}
                        title={isFav ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination Button */}
        {filteredComponents.length > visibleCount && (
          <div className="text-center pt-4 pb-2">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
            >
              Load More Components ({filteredComponents.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* 6. EXPANDABLE 61-COMPONENT ARCHITECTURAL ENCYCLOPEDIA */}
      <AnimatePresence initial={false}>
        {showEncyclopedia && (
          <motion.section
            id="jx-encyclopedia-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="scroll-mt-24 overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Complete 61-Component Architectural Encyclopedia (#01–#61)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every component’s legacy Material UI flaw, JXUI ergonomic upgrade, and live inspection.
                </p>
              </div>
              <input
                type="text"
                value={encyclopediaFilter}
                onChange={(e) => onEncyclopediaFilterChange(e.target.value)}
                placeholder="Search all 61 component specs..."
                aria-label="Search all 61 component specifications"
                className="w-full sm:w-72 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
              />
            </div>

            <div className="max-h-96 overflow-y-auto border border-slate-200/80 dark:border-slate-800 rounded-xl divide-y divide-slate-200/70 dark:divide-slate-800">
              {encyclopediaItems.map((spec) => (
                <div
                  key={spec.id}
                  className="p-3.5 sm:p-4 bg-slate-50/40 dark:bg-slate-950/30 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        #{String(spec.number).padStart(2, '0')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800 text-[10px] font-mono font-bold">
                        v3.0
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {spec.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        · {spec.subtitle}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong className="text-rose-600 dark:text-rose-400">MUI Flaw:</strong>{' '}
                      {spec.muiFlaw}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        JXUI v3.0 Upgrade:
                      </strong>{' '}
                      {spec.jxuiUpgrade}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const foundUnified = UNIFIED_COMPONENTS_351.find((c) => c.id === spec.id);
                      if (foundUnified) {
                        setActiveDocSpec(foundUnified);
                      }
                    }}
                    className="self-start inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 shrink-0 cursor-pointer"
                  >
                    <span>Inspect Docs</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 7. DESIGN TOKEN EXPORTER MODULE */}
      <Suspense fallback={<SectionSkeletonFallback label="Loading Design Token Exporter Studio..." />}>
        <div id="jx-design-token-exporter" className="scroll-mt-20">
          <DesignTokenExporter />
        </div>
      </Suspense>

      {/* 8. ACCESSIBILITY & ARIA STANDARDS WCAG 2.1 AA CHECKLIST */}
      <Suspense fallback={<SectionSkeletonFallback label="Loading Accessibility & ARIA Matrix..." />}>
        <div id="jx-accessibility-aria-standards" className="scroll-mt-20">
          <AccessibilityAriaSection onJumpToComponent={onJumpToComponent} />
        </div>
      </Suspense>

      {/* COMPONENT DOCUMENTATION MODAL */}
      {activeDocSpec && (
        <ComponentDocumentationModal
          spec={activeDocSpec}
          onClose={() => setActiveDocSpec(null)}
          collectionsState={collectionsState}
          onUpdateCollectionsState={onUpdateCollectionsState}
          onJumpToShowcase={onJumpToComponent ? (specNumber: number) => {
            const s = COMPONENT_CATALOG.find((c) => c.number === activeDocSpec.showcaseNumber);
            if (s) { onJumpToComponent(s); }
          } : undefined}
        />
      )}

      {/* MANAGE COLLECTIONS MODAL */}
      {showManageCollections && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="collections-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${palette.bg}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="collections-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Collections &amp; Bookmarks
                  </h3>
                  <p className="text-xs text-slate-400">
                    Organize components into custom workspace collections
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManageCollections(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Create new collection */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Create New Collection
              </span>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name (e.g. Design System V1)"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="text"
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Collection</span>
              </button>
            </div>

            {/* Existing Collections List */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Collections ({collectionsState.collections.length})
              </span>
              <div className="space-y-1.5">
                {collectionsState.collections.map((col) => (
                  <div
                    key={col.id}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{col.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {col.componentIds.length} items
                        </span>
                      </h4>
                      {col.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {col.description}
                        </p>
                      )}
                    </div>
                    {!col.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(col.id, col.name)}
                        title="Delete collection"
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Import JSON Footer */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleExportCollections}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportCollections}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
