// @jxui/react v3.0.0 — GlassSidebar (JXUI v3.0 Unified Component Suite)
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

// 7. GlassSidebar
export interface GlassSidebarProps {
  items?: string[];
}
export const GlassSidebar: React.FC<GlassSidebarProps> = ({ items = ['Overview', 'Analytics', 'Components', 'Settings'] }) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [active, setActive] = useState('Overview');
  return (
    <aside className={`w-48 p-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg ${getRadiusClass('card')} flex flex-col gap-1`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Navigation</span>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setActive(item)}
          className={`px-3 py-1.5 text-xs font-medium text-left rounded-lg transition-all cursor-pointer ${
            active === item
              ? `${palette.bg} text-white shadow-xs`
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          {item}
        </button>
      ))}
    </aside>
  );
};
