// @jxui/react v3.0.0 — CollapsibleNavigation (JXUI v3.0 Unified Component Suite)
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

// 7. CollapsibleNavigation
export const CollapsibleNavigation: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-48 text-xs font-medium">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
        <span>Components</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-4 flex flex-col gap-1 pt-1">
          <a href="#buttons" className="p-1 text-slate-500 hover:text-indigo-600">Buttons (20)</a>
          <a href="#glass" className="p-1 text-slate-500 hover:text-indigo-600">Glassmorphism (20)</a>
          <a href="#nav" className="p-1 text-slate-500 hover:text-indigo-600">Navigation (20)</a>
        </div>
      )}
    </div>
  );
};
