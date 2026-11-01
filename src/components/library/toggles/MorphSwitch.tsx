// @jxui/react v3.0.0 — MorphSwitch (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 2. MorphSwitch
export const MorphSwitch: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { palette } = useJXTheme();
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
        checked ? palette.bg : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-xs transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}>
        {checked ? <Check className="w-3 h-3 text-indigo-600" /> : <X className="w-3 h-3 text-slate-400" />}
      </div>
    </button>
  );
};
