// @jxui/react v3.0.0 — JXAppBar (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXAppBarProps {
  title?: string;
  islandMode?: boolean;
  defaultIslandMode?: boolean;
  onIslandModeChange?: (island: boolean) => void;
  showModeToggle?: boolean;
  commandShortcut?: string;
  onCommandClick?: () => void;
  className?: string;
}

export const JXAppBar: React.FC<JXAppBarProps> = ({
  title = 'JXUI Cloud',
  islandMode,
  defaultIslandMode = true,
  onIslandModeChange,
  showModeToggle = true,
  commandShortcut = '⌘K',
  onCommandClick,
  className = '',
}) => {
  const { palette } = useJXTheme();
  const isControlled = islandMode !== undefined;
  const [internalIsland, setInternalIsland] = useState(defaultIslandMode);
  const isIsland = isControlled ? islandMode! : internalIsland;

  const toggleIsland = () => {
    const next = !isIsland;
    if (!isControlled) setInternalIsland(next);
    onIslandModeChange?.(next);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showModeToggle && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleIsland}
            className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Mode: {isIsland ? 'Floating Pill Island' : 'Full-Width Sticky Glass'}
          </button>
        </div>
      )}

      <div className="p-4 bg-slate-100/80 dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800">
        <div
          className={`px-4 py-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 jx-elevation-2 flex items-center justify-between transition-all ${
            isIsland ? 'mx-4 rounded-2xl' : 'rounded-none'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Sparkles className={`w-4 h-4 ${palette.text}`} />
            <span>{title}</span>
          </div>
          <button
            type="button"
            onClick={onCommandClick}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>Quick Jump...</span>
            <kbd className="font-mono text-[10px]">{commandShortcut}</kbd>
          </button>
        </div>
      </div>
    </div>
  );
};
