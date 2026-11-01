// @jxui/react v3.0.0 — SearchInput (JXUI v3.0 Unified Component Suite)
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

// 6. SearchInput
export const SearchInput: React.FC<{ onSearch?: (q: string) => void }> = ({ onSearch }) => {
  const [q, setQ] = useState('');
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`relative flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg ${getRadiusClass('control')}`}>
      <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder="Search components..."
        className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
      />
      {q && <button onClick={() => setQ('')} className="p-0.5 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>}
    </div>
  );
};
