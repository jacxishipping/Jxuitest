// @jxui/react v3.0.0 — NavigationRail (JXUI v3.0 Unified Component Suite)
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

// 13. NavigationRail
export const NavigationRail: React.FC = () => {
  const { palette } = useJXTheme();
  const [active, setActive] = useState(0);
  const icons = [Home, Compass, Layers, Settings];
  return (
    <div className="w-14 py-4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
      {icons.map((Icon, idx) => (
        <button
          key={idx}
          onClick={() => setActive(idx)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            active === idx ? `${palette.bg} text-white shadow-sm` : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
