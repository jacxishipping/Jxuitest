import React from 'react';
import {
  Menu,
  Terminal,
  SplitSquareHorizontal,
  Sun,
  Moon,
  Github,
} from 'lucide-react';
import {
  useJXTheme,
  ACCENT_PALETTES,
  AccentColor,
  RadiusScale,
} from '../../context/JXThemeContext';

export interface AppHeaderProps {
  onOpenCmd: () => void;
  onOpenMobileSidebar: () => void;
  currentView: 'workbench' | 'github-page';
  onToggleView: () => void;
}

const RADIUS_OPTIONS: { id: RadiusScale; label: string; scaleLabel: string }[] = [
  { id: 'sharp', label: 'Sharp (0px)', scaleLabel: '0.5x' },
  { id: 'sm', label: 'Crisp (8px)', scaleLabel: '0.75x' },
  { id: 'md', label: 'Default (12px)', scaleLabel: '1.0x' },
  { id: 'lg', label: 'Soft (16px)', scaleLabel: '1.35x' },
  { id: 'xl', label: 'Ultra (24px)', scaleLabel: '1.75x' },
];

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenCmd,
  onOpenMobileSidebar,
  currentView,
  onToggleView,
}) => {
  const {
    mode,
    toggleMode,
    accent,
    setAccent,
    radiusScale,
    setRadiusScale,
    compareMode,
    setCompareMode,
  } = useJXTheme();

  return (
    <header className="h-16 px-3 sm:px-6 lg:px-8 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 w-full max-w-full">
      {/* Zone 1 & 2: Mobile Nav Hamburger + Quick Find Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
        {/* Mobile Sidebar Hamburger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Quick Find / Cmd+K Search Trigger */}
        <div
          onClick={onOpenCmd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenCmd();
            }
          }}
          aria-label="Quick Find or Jump to Component (Press Command K)"
          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 px-3 py-1.5 rounded-xl cursor-pointer transition-colors text-slate-500 dark:text-slate-400 text-xs w-full max-w-[200px] xs:max-w-[240px] sm:max-w-xs md:max-w-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="font-medium text-slate-600 dark:text-slate-300 truncate text-[11px] sm:text-xs">
            <span className="inline sm:hidden">Search 351...</span>
            <span className="hidden sm:inline">Quick Find (351 Components)...</span>
          </span>
          <kbd className="hidden xs:inline-flex ml-auto px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[10px] text-slate-600 dark:text-slate-300 shadow-2xs border border-slate-200 dark:border-slate-700 shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Zone 3: Top Right Controls Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
        {/* Color Accent Swatches (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
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
                aria-label={`${pal.name} Palette`}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  active
                    ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
              />
            );
          })}
        </div>

        {/* Radius Scale Multipliers (Desktop) */}
        <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-semibold">
          {RADIUS_OPTIONS.slice(1, 4).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRadiusScale(r.id)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                radiusScale === r.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.scaleLabel}
            </button>
          ))}
        </div>

        {/* Split Compare Mode Toggle */}
        <button
          type="button"
          onClick={() => setCompareMode(compareMode === 'jxui' ? 'split' : 'jxui')}
          title="Toggle MUI vs JXUI Split Compare"
          aria-label="Toggle MUI vs JXUI Split Compare"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            compareMode === 'split'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <SplitSquareHorizontal className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline text-xs">Compare</span>
        </button>

        {/* Theme Luminance Toggle (Light/Dark) */}
        <button
          type="button"
          onClick={toggleMode}
          data-testid="theme-mode-toggle"
          aria-label={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} mode (current: ${mode})`}
          aria-pressed={mode === 'dark'}
          title={`Switch to ${mode === 'light' ? 'Dark Obsidian' : 'Light Alabaster'}`}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          {mode === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* GitHub Showcase Page View Toggle */}
        <button
          type="button"
          onClick={onToggleView}
          title={currentView === 'workbench' ? 'Switch to GitHub Showcase Page' : 'Return to Interactive Workbench'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
            currentView === 'github-page'
              ? 'bg-[#238636] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Github className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">
            {currentView === 'github-page' ? 'Workbench' : 'GitHub Page'}
          </span>
          <span className="inline sm:hidden">
            {currentView === 'github-page' ? 'App' : 'Docs'}
          </span>
        </button>
      </div>
    </header>
  );
};
