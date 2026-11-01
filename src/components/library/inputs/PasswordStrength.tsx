// @jxui/react v3.0.0 — PasswordStrength (JXUI v3.0 Unified Component Suite)
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

// 15. PasswordStrength
export const PasswordStrength: React.FC = () => {
  const [pw, setPw] = useState('Secret!2026');
  const len = pw.length;
  const pct = Math.min(100, len * 10);
  return (
    <div className="w-full flex flex-col gap-1.5">
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
      />
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div style={{ width: `${pct}%` }} className={`h-full ${pct > 70 ? 'bg-emerald-500' : pct > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
      </div>
      <span className="text-[10px] text-slate-500 font-mono">Entropy: {pct}% Strong</span>
    </div>
  );
};
