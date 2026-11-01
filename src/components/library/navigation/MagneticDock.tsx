// @jxui/react v3.0.0 — MagneticDock (JXUI v3.0 Unified Component Suite)
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

// 1. MagneticDock
export interface MagneticDockProps {
  items?: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}
export const MagneticDock: React.FC<MagneticDockProps> = ({
  items = [
    { id: '1', label: 'Home', icon: Home },
    { id: '2', label: 'Explore', icon: Compass },
    { id: '3', label: 'Layers', icon: Layers },
    { id: '4', label: 'Settings', icon: Settings },
  ],
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`inline-flex items-end gap-3 px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800 shadow-xl ${getRadiusClass('pill')}`}>
      {items.map((it, idx) => {
        const Icon = it.icon;
        const isHovered = hoveredIdx === idx;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;
        const scale = isHovered ? 'scale-125 -translate-y-2' : isNeighbor ? 'scale-110 -translate-y-1' : 'scale-100';

        return (
          <button
            key={it.id}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            title={it.label}
            className={`w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-md transition-all duration-150 cursor-pointer ${scale} ${
              isHovered ? `${palette.bg} text-white border-transparent` : ''
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};
