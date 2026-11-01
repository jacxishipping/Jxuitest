// @jxui/react v3.0.0 — AnimatedInput (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Search, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  Lock, 
  Terminal, 
  Palette, 
  Sliders, 
  PenTool, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

// 3. AnimatedInput
export const AnimatedInput: React.FC = () => {
  const [active, setActive] = useState(false);
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border ${active ? 'border-indigo-500 shadow-sm' : 'border-slate-300 dark:border-slate-700'} ${getRadiusClass('control')} transition-all`}>
      <Sparkles className={`w-4 h-4 transition-transform ${active ? 'text-indigo-500 scale-110' : 'text-slate-400'}`} />
      <input
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        placeholder="Animated focus reaction..."
        className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
      />
    </div>
  );
};
