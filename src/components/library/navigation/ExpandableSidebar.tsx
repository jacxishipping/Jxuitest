// @jxui/react v3.0.0 — ExpandableSidebar (JXUI v3.0 Unified Component Suite)
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

// 6. ExpandableSidebar
export const ExpandableSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`transition-all duration-300 ${isExpanded ? 'w-52' : 'w-14'} p-2 bg-slate-900 text-white flex flex-col gap-2 rounded-xl`}
    >
      <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
        <Home className="w-4 h-4 shrink-0" />
        {isExpanded && <span className="text-xs font-medium">Home</span>}
      </button>
      <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
        <Compass className="w-4 h-4 shrink-0" />
        {isExpanded && <span className="text-xs font-medium">Explore</span>}
      </button>
    </div>
  );
};
