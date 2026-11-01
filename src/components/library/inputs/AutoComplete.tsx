// @jxui/react v3.0.0 — AutoComplete (JXUI v3.0 Unified Component Suite)
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

// 9. AutoComplete
export const AutoComplete: React.FC = () => {
  const [val, setVal] = useState('');
  const [open, setOpen] = useState(false);
  const items = ['React 19', 'Next.js 15', 'Vite 8', 'Tailwind v4', 'TypeScript 5.8'];
  const filtered = items.filter((i) => i.toLowerCase().includes(val.toLowerCase()));
  const { getRadiusClass } = useJXTheme();

  return (
    <div className="relative w-full">
      <input
        value={val}
        onFocus={() => setOpen(true)}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Type framework (e.g. React)..."
        className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none ${getRadiusClass('control')}`}
      />
      {open && filtered.length > 0 && (
        <div className={`absolute top-full mt-1 inset-x-0 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg py-1 ${getRadiusClass('control')}`}>
          {filtered.map((item) => (
            <div
              key={item}
              onMouseDown={() => {
                setVal(item);
                setOpen(false);
              }}
              className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
