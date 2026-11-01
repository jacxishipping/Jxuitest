// @jxui/react v3.0.0 — MultiLevelMenu (JXUI v3.0 Unified Component Suite)
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

// 19. MultiLevelMenu
export const MultiLevelMenu: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  const [subOpen, setSubOpen] = useState(false);
  return (
    <div className={`w-44 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${getRadiusClass('control')} text-xs relative`}>
      <button onMouseEnter={() => setSubOpen(true)} className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
        <span>Export</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      {subOpen && (
        <div onMouseLeave={() => setSubOpen(false)} className={`absolute top-0 left-full ml-1 w-36 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${getRadiusClass('control')}`}>
          <div className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">JSON Tokens</div>
          <div className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">CSS Variables</div>
        </div>
      )}
    </div>
  );
};
