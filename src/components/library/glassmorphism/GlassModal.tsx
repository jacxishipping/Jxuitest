// @jxui/react v3.0.0 — GlassModal (JXUI v3.0 Unified Component Suite)
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

// 8. GlassModal
export interface GlassModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}
export const GlassModal: React.FC<GlassModalProps> = ({ open = true, onClose, title = 'Frosted Dialog', children }) => {
  const { getRadiusClass } = useJXTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md p-6 bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 shadow-2xl ${getRadiusClass('card')}`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="py-4 text-sm text-slate-700 dark:text-slate-300">{children ?? <p>Refractive modal dialog with liquid translucent depth.</p>}</div>
      </div>
    </div>
  );
};
