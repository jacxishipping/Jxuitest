import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  CornerDownLeft,
  ArrowUpDown,
  X,
  Terminal,
  Box,
  Download,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  History,
  Trash2,
  Clock,
  Github,
} from 'lucide-react';
import { COMPONENT_CATALOG, CATEGORIES, CategoryId, ComponentSpec } from '../data/catalog';
import { COMPONENTS_290, ComponentSpec290 } from '../data/catalog290';
import { UNIFIED_COMPONENTS_351 } from '../data/unifiedCatalog';
import {
  fuzzyScore,
  loadRecentlyViewedIds,
  persistRecentlyViewedComponent,
  clearRecentlyViewedIds,
  saveRecentlyViewedIds,
} from '../utils/jxuiLogic';
import { useJXTheme } from '../context/JXThemeContext';

export interface SpotlightQuickLink {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  targetSection?: string;
  isEncyclopediaToggle?: boolean;
}

const SPOTLIGHT_QUICK_LINKS: SpotlightQuickLink[] = [
  {
    id: 'spotlight-workbench',
    name: 'Workbench',
    subtitle: 'Top overview, telemetry KPIs, and MUI ergonomics matrix',
    badge: 'Overview',
    badgeColor:
      'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60',
    icon: Terminal,
    keywords: ['workbench', 'home', 'top', 'hero', 'telemetry', 'kpi', 'matrix', 'mui'],
    targetSection: 'top',
  },
  {
    id: 'spotlight-components',
    name: 'Components (61)',
    subtitle: 'Explore all 61 interactive component specifications across 8 batches',
    badge: '61 Modules',
    badgeColor:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    icon: Box,
    keywords: ['components', 'gallery', 'catalog', 'playground', 'batches', 'inputs', 'controls'],
    targetSection: 'interactive-playground',
  },
  {
    id: 'spotlight-tokens',
    name: 'Tokens & Themes',
    subtitle: 'Live W3C token exporter: palettes, radius tiers, and elevation shadows to JSON/CSS',
    badge: 'W3C Tokens',
    badgeColor:
      'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/60',
    icon: Download,
    keywords: ['tokens', 'themes', 'exporter', 'css', 'json', 'w3c', 'palettes', 'radii', 'variables'],
    targetSection: 'jx-design-token-exporter',
  },
  {
    id: 'spotlight-wcag',
    name: 'WCAG AA Standards',
    subtitle: 'Automated 17.4:1 contrast auditor, keyboard contracts, and screen reader matrix',
    badge: 'WCAG 2.1 AA',
    badgeColor:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    icon: ShieldCheck,
    keywords: ['wcag', 'accessibility', 'a11y', 'standards', 'aria', 'checklist', 'contrast', 'audit'],
    targetSection: 'jx-accessibility-aria-standards',
  },
  {
    id: 'spotlight-290-suite',
    name: '351 Master Suite',
    subtitle: 'Unified 18 categories: 61 Showcases + 290 Modular Primitives',
    badge: '351 Primitives',
    badgeColor:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
    icon: Sparkles,
    keywords: [
      '351',
      '290',
      'suite',
      'library',
      'categories',
      'glass',
      'buttons',
      'motion',
      'ai',
      'primitives',
      'master',
    ],
    targetSection: 'jx-290-component-suite',
  },
  {
    id: 'spotlight-encyclopedia',
    name: 'Docs Encyclopedia',
    subtitle: 'Full 61-component reference guide with legacy Material UI flaws vs JXUI upgrades',
    badge: 'Docs Guide',
    badgeColor:
      'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/60',
    icon: BookOpen,
    keywords: [
      'docs',
      'encyclopedia',
      'reference',
      'guide',
      'manual',
      'mui flaws',
      'upgrades',
      'documentation',
    ],
    isEncyclopediaToggle: true,
  },
  {
    id: 'spotlight-github',
    name: 'GitHub Page & Showcase',
    subtitle: 'Official repository overview, repo stats, live sandbox, and GitHub Pages CI guide',
    badge: 'GitHub',
    badgeColor:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    icon: Github,
    keywords: ['github', 'gh-pages', 'repo', 'repository', 'docs', 'readme', 'stars', 'fork', 'showcase'],
    targetSection: 'github-page',
  },
];

export interface CommandFinderModalProps {
  open: boolean;
  onClose: () => void;
  onSelectComponent: (spec: ComponentSpec) => void;
  onSelect290Component?: (spec: ComponentSpec290) => void;
  onSelectCategory?: (catId: CategoryId | 'all') => void;
  onNavigateToSection?: (sectionId: string) => void;
  onToggleEncyclopedia?: () => void;
}

type ResolvedRecentEntry =
  | { kind: 'component'; item: ComponentSpec; categoryLabel: string }
  | { kind: 'spec290'; item: ComponentSpec290; categoryLabel: string };

type CombinedSpotlightItem =
  | { kind: 'link'; item: SpotlightQuickLink; score: number }
  | { kind: 'component'; item: ComponentSpec; score: number; isRecent?: boolean }
  | { kind: 'spec290'; item: ComponentSpec290; score: number; isRecent?: boolean };

function resolveComponentById(id: string): ResolvedRecentEntry | null {
  const catalogSpec = COMPONENT_CATALOG.find((c) => c.id === id);
  if (catalogSpec) {
    const cat = CATEGORIES.find((c) => c.id === catalogSpec.category);
    return {
      kind: 'component',
      item: catalogSpec,
      categoryLabel: cat?.shortTitle || 'Showcase',
    };
  }

  const spec290 = COMPONENTS_290.find((c) => c.id === id);
  if (spec290) {
    return {
      kind: 'spec290',
      item: spec290,
      categoryLabel: `Cat ${spec290.categoryNumber}`,
    };
  }

  const unified = UNIFIED_COMPONENTS_351.find((c) => c.id === id);
  if (unified) {
    const fallbackSpec: ComponentSpec = {
      id: unified.id,
      number: unified.showcaseNumber || 0,
      name: unified.name,
      category: 'inputs',
      subtitle: unified.subtitle,
      muiFlaw: unified.muiFlaw,
      jxuiUpgrade: unified.jxuiUpgrade,
      jsxSnippet: unified.jsxSnippet,

    };
    return {
      kind: 'component',
      item: fallbackSpec,
      categoryLabel: unified.categoryTitle.replace(/^Category \d+:\s*/, ''),
    };
  }

  return null;
}

export const CommandFinderModal: React.FC<CommandFinderModalProps> = ({
  open,
  onClose,
  onSelectComponent,
  onSelect290Component,
  onNavigateToSection,
  onToggleEncyclopedia,
}) => {
  const { getRadiusClass, palette } = useJXTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    loadRecentlyViewedIds()
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync recentlyViewedIds when modal opens or when localStorage updates
  useEffect(() => {
    const syncFromStorage = () => {
      setRecentlyViewedIds(loadRecentlyViewedIds());
    };
    if (open) {
      syncFromStorage();
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 25);
    }
    window.addEventListener('jxui-recently-viewed-updated', syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('jxui-recently-viewed-updated', syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, [open]);

  // Resolve recently viewed IDs into full component specs
  const resolvedRecentItems: ResolvedRecentEntry[] = useMemo(() => {
    const list: ResolvedRecentEntry[] = [];
    for (const id of recentlyViewedIds) {
      const resolved = resolveComponentById(id);
      if (resolved) {
        list.push(resolved);
      }
    }
    return list;
  }, [recentlyViewedIds]);

  const handleSelectAndRecordComponent = useCallback(
    (spec: ComponentSpec) => {
      const updated = persistRecentlyViewedComponent(spec.id);
      setRecentlyViewedIds(updated);
      onSelectComponent(spec);
      onClose();
    },
    [onSelectComponent, onClose]
  );

  const handleSelectAndRecord290 = useCallback(
    (spec: ComponentSpec290) => {
      const updated = persistRecentlyViewedComponent(spec.id);
      setRecentlyViewedIds(updated);
      onClose();
      if (onSelect290Component) {
        onSelect290Component(spec);
      } else {
        onNavigateToSection?.('jx-290-component-suite');
      }
    },
    [onSelect290Component, onNavigateToSection, onClose]
  );

  const handleRemoveSingleRecent = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation();
    const next = recentlyViewedIds.filter((id) => id !== idToRemove);
    const saved = saveRecentlyViewedIds(next);
    setRecentlyViewedIds(saved);
  };

  const handleClearRecentlyViewed = () => {
    const cleared = clearRecentlyViewedIds();
    setRecentlyViewedIds(cleared);
  };

  const handleExecuteQuickLink = (link: SpotlightQuickLink) => {
    onClose();
    if (link.isEncyclopediaToggle) {
      onToggleEncyclopedia?.();
    } else if (link.targetSection) {
      onNavigateToSection?.(link.targetSection);
    }
  };

  // Filtered Spotlight Items
  const filteredItems: CombinedSpotlightItem[] = useMemo(() => {
    const recentSet = new Set(recentlyViewedIds);

    if (!query.trim()) {
      // Include recently viewed items at the very top of the keyboard-navigable stream when query is empty
      const recentStream: CombinedSpotlightItem[] = resolvedRecentItems.map((entry) =>
        entry.kind === 'component'
          ? { kind: 'component' as const, item: entry.item, score: 120, isRecent: true }
          : { kind: 'spec290' as const, item: entry.item, score: 120, isRecent: true }
      );

      const remainingComponents: CombinedSpotlightItem[] = COMPONENT_CATALOG.filter(
        (spec) => !recentSet.has(spec.id)
      ).map((spec) => ({
        kind: 'component' as const,
        item: spec,
        score: 80,
      }));

      const links: CombinedSpotlightItem[] = SPOTLIGHT_QUICK_LINKS.map((link) => ({
        kind: 'link' as const,
        item: link,
        score: 50,
      }));

      return [...recentStream, ...remainingComponents, ...links];
    }

    const q = query.trim().toLowerCase();

    // Score quick links
    const scoredLinks: CombinedSpotlightItem[] = SPOTLIGHT_QUICK_LINKS.map((link) => {
      const nameScore = fuzzyScore(link.name, q);
      const subScore = fuzzyScore(link.subtitle, q);
      const kwMatches = link.keywords.some((kw) => kw.includes(q) || q.includes(kw));
      const kwScore = kwMatches ? 95 : 0;
      const maxScore = Math.max(nameScore * 1.5, subScore, kwScore);
      return { kind: 'link' as const, item: link, score: maxScore };
    }).filter((x) => x.score > 0);

    // Score 61 components
    const scoredComponents: CombinedSpotlightItem[] = COMPONENT_CATALOG.map((item) => {
      const sName = fuzzyScore(item.name, q);
      const sSub = fuzzyScore(item.subtitle, q);
      const sUp = fuzzyScore(item.jxuiUpgrade, q);
      const isRecent = recentSet.has(item.id);
      const maxScore = Math.max(sName * 1.2, sSub, sUp * 0.8) + (isRecent ? 8 : 0);
      return { kind: 'component' as const, item, score: maxScore, isRecent };
    }).filter((x) => x.score > (x.isRecent ? 8 : 0));

    // Score 290 Suite components
    const scored290: CombinedSpotlightItem[] = COMPONENTS_290.map((item) => {
      const sName = fuzzyScore(item.name, q);
      const sSub = fuzzyScore(item.subtitle, q);
      const sUp = fuzzyScore(item.jxuiUpgrade, q);
      const isRecent = recentSet.has(item.id);
      const maxScore = Math.max(sName * 1.3, sSub, sUp * 0.8) + (isRecent ? 8 : 0);
      return { kind: 'spec290' as const, item, score: maxScore, isRecent };
    }).filter((x) => x.score > (x.isRecent ? 8 : 0));

    return [...scoredLinks, ...scoredComponents, ...scored290].sort((a, b) => b.score - a.score);
  }, [query, recentlyViewedIds, resolvedRecentItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length, query]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (filteredItems.length ? (i + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) =>
          filteredItems.length ? (i - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected.kind === 'link') {
          handleExecuteQuickLink(selected.item);
        } else if (selected.kind === 'spec290') {
          handleSelectAndRecord290(selected.item);
        } else {
          handleSelectAndRecordComponent(selected.item);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    open,
    filteredItems,
    selectedIndex,
    handleSelectAndRecordComponent,
    handleSelectAndRecord290,
    onClose,
  ]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 bg-slate-950/50 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="JX Spotlight Command Palette"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 jx-elevation-3 overflow-hidden shadow-2xl ${getRadiusClass(
          'card'
        )}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <Search className={`w-4 h-4 shrink-0 ${palette.text}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search JX Spotlight (e.g. Workbench, Tokens, WCAG, DataGrid, Button)..."
            aria-label="Search components and spotlight navigation"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Recently Viewed Components Section (Persisted in localStorage) */}
        <div
          data-testid="recently-viewed-section"
          className="px-3.5 py-2.5 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-200/70 dark:border-slate-800/80"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Recently Viewed
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800">
                {resolvedRecentItems.length} saved
              </span>
            </div>

            {resolvedRecentItems.length > 0 ? (
              <button
                type="button"
                data-testid="clear-recently-viewed"
                onClick={handleClearRecentlyViewed}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            ) : (
              <span className="font-mono text-[10px] text-slate-400">localStorage sync</span>
            )}
          </div>

          {resolvedRecentItems.length === 0 ? (
            <div
              data-testid="recently-viewed-empty"
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>
                  Select any component below or inspect a card to save it here for quick navigation.
                </span>
              </span>
            </div>
          ) : (
            <div
              data-testid="recently-viewed-list"
              className="flex flex-wrap items-center gap-1.5 pb-0.5"
            >
              {resolvedRecentItems.map((entry) => {
                const compId = entry.item.id;
                const compName = entry.item.name;
                return (
                  <div
                    key={compId}
                    data-testid={`recent-item-${compId}`}
                    className="group inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs transition-all shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (entry.kind === 'spec290') {
                          handleSelectAndRecord290(entry.item);
                        } else {
                          handleSelectAndRecordComponent(entry.item);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-left cursor-pointer"
                    >
                      <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {compName}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                        v3
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {entry.categoryLabel}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${compName} from recently viewed`}
                      onClick={(e) => handleRemoveSingleRecent(e, compId)}
                      className="p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Navigation Shelf (Visible when query is empty) */}
        {!query && (
          <div className="px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200/70 dark:border-slate-800/80">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>JX Spotlight Quick Navigation</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">7 Direct Links</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SPOTLIGHT_QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleExecuteQuickLink(link)}
                    className="px-2.5 py-1.5 rounded-lg text-left border bg-white/80 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer inline-flex items-center gap-1.5 group"
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      {link.name}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No results matched "{query}". Try "Tokens", "WCAG", "DataGrid", or "Button".
            </div>
          ) : (
            filteredItems.map((entry, idx) => {
              const isSelected = idx === selectedIndex;

              if (entry.kind === 'link') {
                const link = entry.item;
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleExecuteQuickLink(link)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${getRadiusClass(
                      'control'
                    )} ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {link.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold border ${link.badgeColor}`}
                          >
                            {link.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {link.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">Quick Jump</span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              }

              if (entry.kind === 'spec290') {
                const item = entry.item;
                return (
                  <button
                    key={`${entry.isRecent ? 'recent-' : ''}${item.id}`}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelectAndRecord290(item)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${getRadiusClass(
                      'control'
                    )} ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                            v3
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                            Cat {item.categoryNumber}
                          </span>
                          {entry.isRecent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                              Recent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">290 Suite</span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              }

              const item = entry.item;
              const cat = CATEGORIES.find((c) => c.id === item.category);

              return (
                <button
                  key={`${entry.isRecent ? 'recent-' : ''}${item.id}`}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSelectAndRecordComponent(item)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${getRadiusClass(
                    'control'
                  )} ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">
                        #{String(item.number).padStart(2, '0')}
                      </span>
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {item.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                        v3
                      </span>
                      {entry.isRecent && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                          Recent
                        </span>
                      )}
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                        ·
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.jxuiUpgrade}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {cat?.shortTitle || 'Showcase'}
                    </span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Execute / Jump
            </span>
          </div>
          <span className="font-mono tabular-nums">
            {filteredItems.length} items ({resolvedRecentItems.length} Recent · 61 Batches · 290 Suite)
          </span>
        </div>
      </div>
    </div>
  );
};

