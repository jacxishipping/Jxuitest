// @jxui/react v3.0.0 — TriStateToggle (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 13. TriStateToggle
export const TriStateToggle: React.FC = () => {
  const [state, setState] = useState<'checked' | 'unchecked' | 'indeterminate'>('indeterminate');
  const cycle = () => {
    if (state === 'unchecked') setState('indeterminate');
    else if (state === 'indeterminate') setState('checked');
    else setState('unchecked');
  };
  return (
    <button onClick={cycle} className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer">
      {state === 'checked' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
      {state === 'indeterminate' && <Minus className="w-3.5 h-3.5 text-amber-500" />}
    </button>
  );
};
