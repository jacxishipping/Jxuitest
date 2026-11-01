// @jxui/react v3.0.0 — GlassButton (JXUI v3.0 Unified Component Suite)
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

// 15. GlassButton
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
export const GlassButton: React.FC<GlassButtonProps> = ({ children = 'Glass Action', className = '', ...props }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <button
      className={`px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-700/60 active:scale-95 transition-all shadow-xs cursor-pointer ${getRadiusClass('control')} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
