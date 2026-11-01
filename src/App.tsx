import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Sparkles } from 'lucide-react';
import {
  JXThemeProvider,
  useJXTheme,
} from './context/JXThemeContext';
import {
  COMPONENT_CATALOG,
  ComponentSpec,
} from './data/catalog';
import { ComponentSpec290 } from './data/catalog290';
import { UNIFIED_CATEGORIES_18, UNIFIED_COMPONENTS_351 } from './data/unifiedCatalog';
import {
  JXCollectionsState,
  loadCollectionsState,
} from './utils/jxuiCollections';
import { persistRecentlyViewedComponent } from './utils/jxuiLogic';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { AppWorkbench } from './components/layout/AppWorkbench';

// Phase 1: High-Performance Code-Splitting via React.lazy
const CommandFinderModal = lazy(() =>
  import('./components/CommandFinderModal').then((m) => ({ default: m.CommandFinderModal }))
);
const GitHubPage = lazy(() =>
  import('./components/GitHubPage').then((m) => ({ default: m.GitHubPage }))
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

const WorkbenchShell: React.FC = () => {
  const { pushToast } = useJXTheme();

  // Unified Catalog Navigation States
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cat = new URLSearchParams(window.location.search).get('cat');
      if (cat) return cat;
    }
    return 'all';
  });

  const [activeTier, setActiveTier] = useState<'all' | 'showcase' | 'primitive' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState<boolean>(false);
  const [encyclopediaFilter, setEncyclopediaFilter] = useState<string>('');
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);
  const [springPressActive, setSpringPressActive] = useState<boolean>(true);
  const [haloFocusActive, setHaloFocusActive] = useState<boolean>(true);

  // Collections & Bookmarks State
  const [collectionsState, setCollectionsState] = useState<JXCollectionsState>(() => loadCollectionsState());

  const [currentView, setCurrentView] = useState<'workbench' | 'github-page'>(() => {
    if (typeof window !== 'undefined') {
      const v = new URLSearchParams(window.location.search).get('view');
      if (v === 'github-page' || v === 'workbench') return v;
    }
    return 'workbench';
  });

  // URL sync for currentView and activeCategory
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (currentView === 'github-page') {
        url.searchParams.set('view', 'github-page');
      } else {
        url.searchParams.delete('view');
      }

      if (activeCategory && activeCategory !== 'all') {
        url.searchParams.set('cat', activeCategory);
      } else {
        url.searchParams.delete('cat');
      }

      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
  }, [currentView, activeCategory]);

  const handleSelect290Component = (item: ComponentSpec290) => {
    persistRecentlyViewedComponent(item.id);
    setCurrentView('workbench');
    const cat = UNIFIED_CATEGORIES_18.find((c) => c.number === item.categoryNumber);
    if (cat) {
      setActiveCategory(cat.id);
    }
    setMobileSidebarOpen(false);
    setCmdOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`spec-${item.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      } else if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen]);

  const handleCopyInstall = () => {
    navigator.clipboard?.writeText('npm i jxui-react').catch(() => {});
    setCopiedInstall(true);
    pushToast({
      title: 'Copied installation command',
      description: '$ npm i jxui-react copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleTriggerToast = () => {
    pushToast({
      title: 'Tactile Luminescence Event',
      description: 'Zero cumulative layout shift (CLS = 0) with spring physics settling.',
      variant: 'default',
    });
  };

  const handleJumpToComponent = (spec: ComponentSpec) => {
    persistRecentlyViewedComponent(spec.id);
    setCurrentView('workbench');
    const unifiedMatch = UNIFIED_COMPONENTS_351.find((c) => c.id === spec.id);
    if (unifiedMatch && !document.getElementById(`spec-${spec.id}`)) {
      setActiveCategory(unifiedMatch.categoryId);
    }
    setMobileSidebarOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`spec-${spec.id}`) || document.getElementById(spec.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (sectionId === 'github-page') {
      setCurrentView('github-page');
      setMobileSidebarOpen(false);
      setCmdOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView('workbench');
    setMobileSidebarOpen(false);
    setCmdOpen(false);
    setTimeout(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleToggleEncyclopedia = () => {
    setShowEncyclopedia(true);
    setMobileSidebarOpen(false);
    setCmdOpen(false);
    setTimeout(() => {
      const el = document.getElementById('jx-encyclopedia-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  // Filtered count across all 351 components
  const filteredCount = useMemo(() => {
    let list = UNIFIED_COMPONENTS_351;
    if (activeTier === 'showcase') {
      list = list.filter((c) => c.tier === 'showcase');
    } else if (activeTier === 'primitive') {
      list = list.filter((c) => c.tier === 'primitive');
    } else if (activeTier === 'favorites') {
      list = list.filter((c) => collectionsState.favorites.includes(c.id));
    }

    if (activeCategory !== 'all') {
      list = list.filter((c) => c.categoryId === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.categoryTitle.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.length;
  }, [activeCategory, activeTier, searchQuery, collectionsState]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
      {/* 1. Unified Single Component Navigation Sidebar */}
      <AppSidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        activeTier={activeTier}
        onSelectTier={setActiveTier}
        sidebarQuery={searchQuery}
        onSidebarQueryChange={setSearchQuery}
        filteredCount={filteredCount}
        totalCount={UNIFIED_COMPONENTS_351.length}
        favoritesCount={collectionsState.favorites.length}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        currentView={currentView}
        onNavigateToSection={handleNavigateToSection}
        onOpenEncyclopedia={handleToggleEncyclopedia}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Navigation Header */}
        <AppHeader
          onOpenCmd={() => setCmdOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          currentView={currentView}
          onToggleView={() => setCurrentView(currentView === 'workbench' ? 'github-page' : 'workbench')}
        />

        {/* 3. Main Content: GitHub Showcase Page OR Unified 351 Component Suite */}
        {currentView === 'github-page' ? (
          <Suspense fallback={<SectionSkeletonFallback label="Loading GitHub Showcase & Docs..." />}>
            <GitHubPage
              onBackToWorkbench={() => {
                setCurrentView('workbench');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToCategory={(catId) => {
                setCurrentView('workbench');
                setActiveCategory(catId);
                setTimeout(() => {
                  const el = document.getElementById('unified-component-suite');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
              }}
            />
          </Suspense>
        ) : (
          <AppWorkbench
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeTier={activeTier}
            setActiveTier={setActiveTier}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCopyInstall={handleCopyInstall}
            copiedInstall={copiedInstall}
            onTriggerToast={handleTriggerToast}
            showEncyclopedia={showEncyclopedia}
            onToggleEncyclopedia={handleToggleEncyclopedia}
            encyclopediaFilter={encyclopediaFilter}
            onEncyclopediaFilterChange={setEncyclopediaFilter}
            springPressActive={springPressActive}
            onToggleSpringPress={() => setSpringPressActive((v) => !v)}
            haloFocusActive={haloFocusActive}
            onToggleHaloFocus={() => setHaloFocusActive((v) => !v)}
            collectionsState={collectionsState}
            onUpdateCollectionsState={setCollectionsState}
            onJumpToComponent={handleJumpToComponent}
          />
        )}
      </div>

      {/* Global Cmd+K Component Finder / JX Spotlight Modal */}
      <Suspense fallback={null}>
        <CommandFinderModal
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onSelectComponent={handleJumpToComponent}
          onSelect290Component={handleSelect290Component}
          onSelectCategory={(catId) => setActiveCategory(catId)}
          onNavigateToSection={handleNavigateToSection}
          onToggleEncyclopedia={handleToggleEncyclopedia}
        />
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <JXThemeProvider>
      <WorkbenchShell />
    </JXThemeProvider>
  );
}
