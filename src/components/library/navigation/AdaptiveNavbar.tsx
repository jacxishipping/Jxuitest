// @jxui/react v3.0.0 — AdaptiveNavbar (JXUI v3.0 Unified Component Suite)
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

// 3. AdaptiveNavbar
export interface AdaptiveNavbarProps {
  brand?: string;
}
export const AdaptiveNavbar: React.FC<AdaptiveNavbarProps> = ({ brand = 'JXUI Adaptive' }) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between ${getRadiusClass('control')}`}>
      <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        {brand}
      </span>
      <div className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
        <a href="#overview" className="hover:text-indigo-600">Overview</a>
        <a href="#components" className="hover:text-indigo-600">Components</a>
        <a href="#tokens" className="hover:text-indigo-600">Tokens</a>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
    </header>
  );
};
