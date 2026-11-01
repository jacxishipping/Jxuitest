// @jxui/react v3.0.0 — PasswordReveal (JXUI v3.0 Unified Component Suite)
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

// 16. PasswordReveal
export const PasswordReveal: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center w-full">
      <input
        type={show ? 'text' : 'password'}
        defaultValue="TactileDesignTokens"
        className="w-full px-3 py-1.5 pr-8 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
      />
      <button onClick={() => setShow(!show)} className="absolute right-2.5 text-slate-400 hover:text-slate-600">
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
