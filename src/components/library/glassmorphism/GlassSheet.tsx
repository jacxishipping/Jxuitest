// @jxui/react v3.0.0 — GlassSheet (JXUI v3.0 Unified Component Suite)
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

// 17. GlassSheet
export interface GlassSheetProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}
export const GlassSheet: React.FC<GlassSheetProps> = ({ open = true, onClose, title = 'Properties Inspector', children }) => {
  const { getRadiusClass } = useJXTheme();
  if (!open) return null;
  return (
    <aside className={`w-80 p-5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-l border-slate-200/50 dark:border-slate-800 shadow-2xl flex flex-col justify-between h-full ${getRadiusClass('card')}`}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="pt-4 text-xs text-slate-600 dark:text-slate-300">{children ?? <p>Sliding translucent inspector drawer panel.</p>}</div>
      </div>
    </aside>
  );
};
