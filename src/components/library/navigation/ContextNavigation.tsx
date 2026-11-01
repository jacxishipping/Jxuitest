// @jxui/react v3.0.0 — ContextNavigation (JXUI v3.0 Unified Component Suite)
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

// 18. ContextNavigation
export const ContextNavigation: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 ${getRadiusClass('control')} flex items-center justify-between text-xs`}>
      <span className="font-semibold text-indigo-900 dark:text-indigo-200">1 item selected</span>
      <div className="flex items-center gap-1.5">
        <button className="px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-xs cursor-pointer">Duplicate</button>
        <button className="px-2 py-1 bg-white dark:bg-slate-800 text-rose-600 rounded shadow-xs cursor-pointer">Delete</button>
      </div>
    </div>
  );
};
