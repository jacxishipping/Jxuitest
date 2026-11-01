// @jxui/react v3.0.0 — MegaMenu (JXUI v3.0 Unified Component Suite)
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

// 8. MegaMenu
export const MegaMenu: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${getRadiusClass('card')} grid grid-cols-3 gap-4 max-w-lg`}>
      <div>
        <h5 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Actions</h5>
        <div className="flex flex-col gap-1 text-[11px] text-slate-500">
          <span>Magnetic Buttons</span>
          <span>Hold to Confirm</span>
          <span>Slide to Action</span>
        </div>
      </div>
      <div>
        <h5 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Surfaces</h5>
        <div className="flex flex-col gap-1 text-[11px] text-slate-500">
          <span>Liquid Glass</span>
          <span>Frosted Panel</span>
          <span>Adaptive Glass</span>
        </div>
      </div>
      <div>
        <h5 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Enterprise</h5>
        <div className="flex flex-col gap-1 text-[11px] text-slate-500">
          <span>Notion Data Grid</span>
          <span>Waveform Scrubber</span>
          <span>Canary Splitter</span>
        </div>
      </div>
    </div>
  );
};
