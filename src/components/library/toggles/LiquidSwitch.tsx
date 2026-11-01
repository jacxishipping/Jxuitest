// @jxui/react v3.0.0 — LiquidSwitch (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 1. LiquidSwitch
export const LiquidSwitch: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const { palette } = useJXTheme();
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`relative w-12 h-6.5 rounded-full transition-colors duration-300 p-0.5 cursor-pointer ${
        checked ? palette.bg : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div
        className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
          checked ? 'translate-x-5.5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
