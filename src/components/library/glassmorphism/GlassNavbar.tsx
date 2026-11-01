// @jxui/react v3.0.0 — GlassNavbar (JXUI v3.0 Unified Component Suite)
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

// 6. GlassNavbar
export interface GlassNavbarProps {
  brand?: string;
  links?: string[];
}
export const GlassNavbar: React.FC<GlassNavbarProps> = ({ brand = 'JX GlassNav', links = ['Docs', 'Tokens', 'API', 'Showcase'] }) => {
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <nav className={`px-4 py-2.5 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-md ${getRadiusClass('pill')} flex items-center justify-between`}>
      <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        {brand}
      </span>
      <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {link}
          </a>
        ))}
      </div>
      <button className={`px-3 py-1 text-xs font-semibold text-white ${palette.bg} rounded-full shadow-xs cursor-pointer`}>
        Launch
      </button>
    </nav>
  );
};
