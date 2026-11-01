// @jxui/react v3.0.0 — GlassDock (JXUI v3.0 Unified Component Suite)
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

// 11. GlassDock
export interface GlassDockProps {
  icons?: React.ComponentType<{ className?: string }>[];
}
export const GlassDock: React.FC<GlassDockProps> = ({ icons = [Folder, FileText, Settings, Bell, Sparkles] }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/80 shadow-2xl ${getRadiusClass('pill')}`}>
      {icons.map((Icon, idx) => (
        <button
          key={idx}
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:-translate-y-1.5 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
