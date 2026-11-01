// @jxui/react v3.0.0 — SegmentedControl (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 8. SegmentedControl
export const SegmentedControl: React.FC = () => {
  const [val, setVal] = useState('Daily');
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <div className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800 ${getRadiusClass('pill')}`}>
      {['Daily', 'Weekly', 'Monthly'].map((opt) => (
        <button
          key={opt}
          onClick={() => setVal(opt)}
          className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all ${
            val === opt ? `${palette.bg} text-white shadow-xs` : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
