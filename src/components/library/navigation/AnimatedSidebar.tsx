// @jxui/react v3.0.0 — AnimatedSidebar (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Home, 
  Compass, 
  Layers, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X, 
  Sliders, 
  Folder, 
  FileText,
  Share2,
  Grid,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Bell
} from 'lucide-react';

// 5. AnimatedSidebar
export interface AnimatedSidebarProps {
  collapsed?: boolean;
}
export const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({ collapsed = false }) => {
  const { palette } = useJXTheme();
  return (
    <aside className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} p-3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-2`}>
      <div className="flex items-center gap-2 p-2 font-bold text-xs text-slate-900 dark:text-white">
        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
        {!collapsed && <span>Workspace</span>}
      </div>
      <div className="flex flex-col gap-1">
        {['Dashboard', 'Projects', 'Analytics', 'Settings'].map((item) => (
          <button key={item} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <Folder className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
};
