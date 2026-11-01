// @jxui/react v3.0.0 — RangeSlider (JXUI v3.0 Unified Component Suite)
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

// 19. RangeSlider
export const RangeSlider: React.FC = () => {
  const [val, setVal] = useState(48);
  return (
    <div className="flex items-center gap-3 w-full">
      <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full accent-indigo-600" />
      <span className="font-mono text-xs text-slate-600 dark:text-slate-400 w-8">{val}%</span>
    </div>
  );
};
