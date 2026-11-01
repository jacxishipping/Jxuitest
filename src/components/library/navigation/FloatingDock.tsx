// @jxui/react v3.0.0 — FloatingDock (JXUI v3.0 Unified Component Suite)
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

// 2. FloatingDock
export interface FloatingDockProps {
  onSearch?: () => void;
}
export const FloatingDock: React.FC<FloatingDockProps> = ({ onSearch }) => {
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <div className={`inline-flex items-center gap-2 p-1.5 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-xl border border-slate-700/80 shadow-2xl ${getRadiusClass('pill')}`}>
      <button className="p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer" title="Home"><Home className="w-4 h-4" /></button>
      <button className="p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer" title="Search" onClick={onSearch}><Search className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-slate-700" />
      <button className={`px-3 py-1 text-xs font-semibold rounded-full ${palette.bg} cursor-pointer`}>Action</button>
    </div>
  );
};
