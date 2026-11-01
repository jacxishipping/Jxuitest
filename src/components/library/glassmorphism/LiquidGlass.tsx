// @jxui/react v3.0.0 — LiquidGlass (JXUI v3.0 Unified Component Suite)
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

// 1. LiquidGlass
export interface LiquidGlassProps {
  children?: React.ReactNode;
  className?: string;
}
export const LiquidGlass: React.FC<LiquidGlassProps> = ({ children, className = '' }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`relative overflow-hidden p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] ${getRadiusClass('card')} ${className}`}>
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10">{children ?? <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Liquid Refractive Glass Surface</p>}</div>
    </div>
  );
};
