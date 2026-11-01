// @jxui/react v3.0.0 — SelectableCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 10. SelectableCard
export const SelectableCard: React.FC = () => {
  const [selected, setSelected] = useState(true);
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <div
      onClick={() => setSelected(!selected)}
      className={`p-3 border-2 cursor-pointer transition-all ${getRadiusClass('card')} ${
        selected ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Tier</span>
        {selected && <Check className="w-4 h-4 text-indigo-600" />}
      </div>
      <p className="text-[11px] text-slate-500 mt-1">Unlimited telemetry events</p>
    </div>
  );
};
