// @jxui/react v3.0.0 — SlidingTabs (JXUI v3.0 Unified Component Suite)
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

// 12. SlidingTabs
export const SlidingTabs: React.FC = () => {
  const { palette } = useJXTheme();
  const [active, setActive] = useState('Specs');
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
      {['Specs', 'Props', 'Changelog'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 relative cursor-pointer ${
            active === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          {tab}
          {active === tab && <div className={`absolute bottom-0 inset-x-0 h-0.5 ${palette.bg}`} />}
        </button>
      ))}
    </div>
  );
};
