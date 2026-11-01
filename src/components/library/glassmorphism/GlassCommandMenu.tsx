// @jxui/react v3.0.0 — GlassCommandMenu (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Sparkles, 
  Layers, 
  Search, 
  Sliders, 
  Bell, 
  X, 
  Folder, 
  FileText, 
  Settings, 
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';

// 18. GlassCommandMenu
export interface GlassCommandMenuProps {
  placeholder?: string;
}
export const GlassCommandMenu: React.FC<GlassCommandMenuProps> = ({ placeholder = 'Type a command or jump...' }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`w-full max-w-lg p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl ${getRadiusClass('card')}`}>
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
      </div>
      <div className="p-2 text-[11px] text-slate-500 font-mono">Suggested: /theme, /export, /audit</div>
    </div>
  );
};
