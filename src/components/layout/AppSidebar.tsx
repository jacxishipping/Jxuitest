import React from 'react';
import {
  Search,
  Sparkles,
  Github,
  Star,
  Zap,
  Layers,
  Compass,
  Sliders,
  CheckCircle2,
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
  X,
  BookOpen,
  Palette,
  Check,
} from 'lucide-react';
import { UNIFIED_CATEGORIES_18, UnifiedCategorySpec } from '../../data/unifiedCatalog';
import { useJXTheme } from '../../context/JXThemeContext';

export interface AppSidebarProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  activeTier: 'all' | 'showcase' | 'primitive' | 'favorites';
  onSelectTier: (tier: 'all' | 'showcase' | 'primitive' | 'favorites') => void;
  sidebarQuery: string;
  onSidebarQueryChange: (q: string) => void;
  filteredCount: number;
  totalCount: number;
  favoritesCount: number;
  mobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  currentView: 'workbench' | 'github-page';
  onNavigateToSection: (sectionId: string) => void;
  onOpenEncyclopedia: () => void;
}

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

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeCategory,
  onSelectCategory,
  activeTier,
  onSelectTier,
  sidebarQuery,
  onSidebarQueryChange,
  filteredCount,
  totalCount,
  favoritesCount,
  mobileSidebarOpen,
  onCloseMobileSidebar,
  currentView,
  onNavigateToSection,
  onOpenEncyclopedia,
}) => {
  const { palette } = useJXTheme();

  const content = (
    <div className="flex flex-col h-full justify-between overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="./favicon.png"
              alt="JXUI Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-800 bg-slate-950/5 dark:bg-white/5"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  JXUI
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-semibold">
                  v3.0.0
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">jxui-react · 351 Primitives</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobileSidebar}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Search Input */}
        <div className="px-3.5 py-2.5 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={sidebarQuery}
              onChange={(e) => onSidebarQueryChange(e.target.value)}
              placeholder="Search all 351 components..."
              aria-label="Search all 351 components"
              className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-indigo-500/40 transition-colors"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300">
              {filteredCount}
            </span>
          </div>
        </div>

        {/* Global Component Tier Quick Filters */}
        <div className="p-3 border-b border-slate-200/50 dark:border-slate-800/50 space-y-1.5 shrink-0 text-xs">
          {/* All 351 Components */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              onSelectTier('all');
              onCloseMobileSidebar();
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeCategory === 'all' && activeTier === 'all'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All 351 Components</span>
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">
              {totalCount}
            </span>
          </button>

          {/* Tier Pills Grid */}
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => {
                onSelectTier('showcase');
                onCloseMobileSidebar();
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer ${
                activeTier === 'showcase'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              Showcases (61)
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTier('primitive');
                onCloseMobileSidebar();
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer ${
                activeTier === 'primitive'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              Primitives (290)
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTier('favorites');
                onCloseMobileSidebar();
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors text-center cursor-pointer flex items-center justify-center gap-1 ${
                activeTier === 'favorites'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
              <span>Starred ({favoritesCount})</span>
            </button>
          </div>
        </div>

        {/* 18 Unified Categories Single Scroll List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1 text-xs">
          <div className="px-2.5 pt-1 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>18 Unified Categories</span>
            <span className="font-mono">Combined</span>
          </div>

          {UNIFIED_CATEGORIES_18.map((cat: UnifiedCategorySpec) => {
            const Icon = CATEGORY_ICONS_18[cat.id] || Box;
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  onCloseMobileSidebar();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold ring-1 ring-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isCatActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0 truncate">
                    <span className="text-xs truncate font-medium">
                      {cat.title.replace(/^Category \d+:\s*/, '')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cat.showcaseCount} showcases · {cat.primitiveCount} primitives
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {cat.showcaseCount > 0 && (
                    <span className="text-[10px] text-amber-500 font-bold" title={`${cat.showcaseCount} Flagship Showcases`}>
                      ★
                    </span>
                  )}
                  <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
                    isCatActive
                      ? 'bg-indigo-200/70 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {cat.totalCount}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Studio Tools & Fast Links Section */}
          <div className="pt-3 pb-1">
            <div className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Studio &amp; Governance
            </div>

            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onNavigateToSection('jx-live-playground');
                  onCloseMobileSidebar();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Live Component Playground</span>
                </span>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Live</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenEncyclopedia();
                  onCloseMobileSidebar();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>61 MUI Flaws vs JXUI</span>
                </span>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Delta</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateToSection('jx-design-token-exporter');
                  onCloseMobileSidebar();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-violet-500" />
                  <span>Design Token Studio</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">JSON/CSS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateToSection('jx-accessibility-aria-standards');
                  onCloseMobileSidebar();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WCAG 2.1 AA Checklist</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateToSection('github-page');
                  onCloseMobileSidebar();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                  currentView === 'github-page'
                    ? 'bg-[#238636] text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Showcase &amp; Docs</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-500 font-bold">v3.0</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Compliance & Framework Footer */}
      <div className="p-3.5 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>WCAG 2.1 AA Certified</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-full rounded-full" />
        </div>
        <p className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>React 19 Actions</span>
          <span>Zero Runtime CSS</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Nav Rail */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 z-40">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileSidebar}
          />
          <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
