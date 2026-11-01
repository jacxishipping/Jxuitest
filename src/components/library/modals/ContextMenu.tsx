// @jxui/react v3.0.0 — ContextMenu (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { X, Search, ChevronRight, CornerDownLeft, Sparkles, Layers } from 'lucide-react';

// 13. ContextMenu
export const ContextMenu: React.FC = () => {
  return (
    <div className="w-40 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs flex flex-col gap-0.5">
      <div className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Inspect Element</div>
      <div className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Copy Token CSS</div>
    </div>
  );
};
