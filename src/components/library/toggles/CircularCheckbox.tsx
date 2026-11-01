// @jxui/react v3.0.0 — CircularCheckbox (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 6. CircularCheckbox
export const CircularCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { palette } = useJXTheme();
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${
        checked ? `${palette.bg} border-transparent text-white` : 'border-slate-300 dark:border-slate-700'
      }`}
    >
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </button>
  );
};
