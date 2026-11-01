// @jxui/react v3.0.0 — MultiSelect (JXUI v3.0 Unified Component Suite)
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

// 10. MultiSelect
export const MultiSelect: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['TypeScript', 'Tailwind']);
  const available = ['React', 'TypeScript', 'Tailwind', 'Motion', 'Vite'];
  const { palette } = useJXTheme();

  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
      {selected.map((s) => (
        <span key={s} className={`px-2 py-0.5 text-[11px] font-semibold text-white ${palette.bg} rounded-full flex items-center gap-1`}>
          {s}
          <button onClick={() => setSelected(selected.filter((x) => x !== s))}><X className="w-3 h-3" /></button>
        </span>
      ))}
      <select
        onChange={(e) => {
          if (e.target.value && !selected.includes(e.target.value)) {
            setSelected([...selected, e.target.value]);
          }
        }}
        className="text-xs bg-transparent text-slate-500 focus:outline-none cursor-pointer"
      >
        <option value="">+ Add Tag</option>
        {available.filter((a) => !selected.includes(a)).map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
};
