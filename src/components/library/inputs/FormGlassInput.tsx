// @jxui/react v3.0.0 — FormGlassInput (JXUI v3.0 Unified Component Suite)
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

// 4. FormGlassInput (GlassInput form variant)
export const FormGlassInput: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  return (
    <input
      placeholder="Glassmorphic input..."
      className={`w-full px-3.5 py-2 text-xs bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 ${getRadiusClass('control')}`}
    />
  );
};
