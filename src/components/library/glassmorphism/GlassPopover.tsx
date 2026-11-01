// @jxui/react v3.0.0 — GlassPopover (JXUI v3.0 Unified Component Suite)
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

// 9. GlassPopover
export interface GlassPopoverProps {
  triggerLabel?: string;
  content?: string;
}
export const GlassPopover: React.FC<GlassPopoverProps> = ({ triggerLabel = 'Open Glass Popover', content = 'Lightweight floating popover layer.' }) => {
  const { getRadiusClass } = useJXTheme();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`px-3 py-1.5 text-xs font-semibold bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-300 dark:border-slate-700 ${getRadiusClass('control')} shadow-xs cursor-pointer`}
      >
        {triggerLabel}
      </button>
      {open && (
        <div className={`absolute top-full mt-2 left-0 z-30 w-56 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl ${getRadiusClass('card')}`}>
          <p className="text-xs text-slate-700 dark:text-slate-300">{content}</p>
        </div>
      )}
    </div>
  );
};
