// @jxui/react v3.0.0 — GlassFloatingPanel (JXUI v3.0 Unified Component Suite)
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

// 19. GlassFloatingPanel
export interface GlassFloatingPanelProps {
  title?: string;
  children?: React.ReactNode;
}
export const GlassFloatingPanel: React.FC<GlassFloatingPanelProps> = ({ title = 'Live Performance Monitor', children }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`p-4 w-72 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl ${getRadiusClass('card')}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/40 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-white">{title}</span>
        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">{children ?? <p>60 FPS • 0.8ms Frame Budget</p>}</div>
    </div>
  );
};
