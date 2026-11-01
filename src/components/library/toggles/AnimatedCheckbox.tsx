// @jxui/react v3.0.0 — AnimatedCheckbox (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 4. AnimatedCheckbox
export const AnimatedCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const { palette } = useJXTheme();
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
        checked ? `${palette.bg} border-transparent text-white` : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
      }`}
    >
      {checked && <Check className="w-3.5 h-3.5 animate-scale-in" />}
    </button>
  );
};
