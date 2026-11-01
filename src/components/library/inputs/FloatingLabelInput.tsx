// @jxui/react v3.0.0 — FloatingLabelInput (JXUI v3.0 Unified Component Suite)
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

// 2. FloatingLabelInput
export const FloatingLabelInput: React.FC<{ label?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
  label = 'Work Email',
  value = '',
  onChange,
}) => {
  const [val, setVal] = useState(value);
  const [focused, setFocused] = useState(false);
  const isFloating = focused || val.length > 0;
  const { getRadiusClass } = useJXTheme();

  return (
    <div className="relative w-full">
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none text-slate-400 ${
          isFloating ? 'top-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400' : 'top-2.5 text-xs'
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        value={val}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setVal(e.target.value);
          onChange?.(e);
        }}
        className={`w-full pt-4 pb-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 ${getRadiusClass('control')}`}
      />
    </div>
  );
};
