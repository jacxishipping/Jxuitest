// @jxui/react v3.0.0 — MorphingNavbar (JXUI v3.0 Unified Component Suite)
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

// 4. MorphingNavbar
export interface MorphingNavbarProps {
  compact?: boolean;
}
export const MorphingNavbar: React.FC<MorphingNavbarProps> = ({ compact = false }) => {
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <nav className={`transition-all duration-300 ${compact ? 'py-1.5 px-3 max-w-md' : 'py-3 px-6 max-w-3xl'} mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-md ${getRadiusClass('pill')} flex items-center justify-between`}>
      <span className="text-xs font-bold text-slate-900 dark:text-white">Morphing Navigation</span>
      <span className="text-[11px] font-mono text-slate-500">{compact ? 'Compact Mode' : 'Expanded Mode'}</span>
    </nav>
  );
};
