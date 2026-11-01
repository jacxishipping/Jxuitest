// @jxui/react v3.0.0 — CommandInput (JXUI v3.0 Unified Component Suite)
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

// 8. CommandInput
export const CommandInput: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-slate-950 text-emerald-400 font-mono text-xs ${getRadiusClass('control')}`}>
      <Terminal className="w-3.5 h-3.5 text-emerald-500" />
      <span className="text-emerald-500">$</span>
      <input placeholder="npx @jxui/cli add button" className="w-full bg-transparent focus:outline-none placeholder-slate-600 text-white" />
    </div>
  );
};
