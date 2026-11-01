// @jxui/react v3.0.0 — TagInput (JXUI v3.0 Unified Component Suite)
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

// 11. TagInput
export const TagInput: React.FC = () => {
  const [tags, setTags] = useState(['v3.0', 'stable']);
  const [inputVal, setInputVal] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
      {tags.map((t) => (
        <span key={t} className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-800 rounded font-mono flex items-center gap-1">
          {t}
          <button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
        </span>
      ))}
      <input
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputVal.trim()) {
            setTags([...tags, inputVal.trim()]);
            setInputVal('');
          }
        }}
        placeholder="Type tag & Enter..."
        className="text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white min-w-[120px]"
      />
    </div>
  );
};
