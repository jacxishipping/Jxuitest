// @jxui/react v3.0.0 — SlidingSegmentedControl (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 9. SlidingSegmentedControl
export const SlidingSegmentedControl: React.FC = () => {
  const [active, setActive] = useState('Dev');
  const { palette } = useJXTheme();
  return (
    <div className="flex border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 text-xs font-medium">
      {['Dev', 'Stage', 'Prod'].map((env) => (
        <button
          key={env}
          onClick={() => setActive(env)}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${active === env ? `${palette.bg} text-white` : 'text-slate-500'}`}
        >
          {env}
        </button>
      ))}
    </div>
  );
};
