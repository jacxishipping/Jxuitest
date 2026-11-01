// @jxui/react v3.0.0 — GlassTooltip (JXUI v3.0 Unified Component Suite)
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

// 10. GlassTooltip
export interface GlassTooltipProps {
  text: string;
  children: React.ReactNode;
}
export const GlassTooltip: React.FC<GlassTooltipProps> = ({ text, children }) => {
  const { getRadiusClass } = useJXTheme();
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 text-[11px] font-medium text-slate-900 dark:text-white bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/40 dark:border-slate-700/60 shadow-md ${getRadiusClass('control')} whitespace-nowrap`}>
          {text}
        </div>
      )}
    </div>
  );
};
