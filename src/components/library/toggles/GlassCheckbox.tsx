// @jxui/react v3.0.0 — GlassCheckbox (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 5. GlassCheckbox
export const GlassCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(true);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className="w-5 h-5 rounded bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700 flex items-center justify-center cursor-pointer"
    >
      {checked && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" />}
    </button>
  );
};
