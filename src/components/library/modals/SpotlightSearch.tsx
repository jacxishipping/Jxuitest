// @jxui/react v3.0.0 — SpotlightSearch (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { X, Search, ChevronRight, CornerDownLeft, Sparkles, Layers } from 'lucide-react';

// 19. SpotlightSearch
export const SpotlightSearch: React.FC = () => {
  return (
    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 rounded-xl text-xs flex items-center justify-between">
      <span className="font-semibold text-indigo-700 dark:text-indigo-300">Fullscreen Spotlight Engine</span>
      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-[10px]">⌘K</kbd>
    </div>
  );
};
