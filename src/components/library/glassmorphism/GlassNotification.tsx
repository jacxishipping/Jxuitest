// @jxui/react v3.0.0 — GlassNotification (JXUI v3.0 Unified Component Suite)
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

// 13. GlassNotification
export interface GlassNotificationProps {
  title?: string;
  message?: string;
  onDismiss?: () => void;
}
export const GlassNotification: React.FC<GlassNotificationProps> = ({
  title = 'Deployment Verified',
  message = 'Build #4892 completed in 2.1s with zero bundle regressions.',
  onDismiss,
}) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`relative p-4 max-w-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-emerald-500/30 shadow-xl ${getRadiusClass('card')} flex items-start gap-3`}>
      <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-xs text-slate-900 dark:text-white">{title}</h5>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{message}</p>
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-slate-400 hover:text-slate-600 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
