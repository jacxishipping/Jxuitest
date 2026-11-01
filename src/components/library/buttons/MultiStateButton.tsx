// @jxui/react v3.0.0 — MultiStateButton (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Sparkles, 
  Check, 
  Loader2, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Command, 
  MousePointer, 
  Flame, 
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

// 20. MultiStateButton
export interface MultiStateButtonProps {
  states?: string[];
  activeState?: string;
  onCycle?: (nextState: string) => void;
}
export const MultiStateButton: React.FC<MultiStateButtonProps> = ({
  states = ['Pending', 'In Review', 'Approved', 'Rejected'],
  activeState,
  onCycle,
}) => {
  const { getRadiusClass } = useJXTheme();
  const [internalState, setInternalState] = useState<string>(activeState ?? states[0]);
  const current = activeState ?? internalState;

  const handleNext = () => {
    const idx = states.indexOf(current);
    const next = states[(idx + 1) % states.length];
    setInternalState(next);
    onCycle?.(next);
  };

  const getTone = (st: string) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40';
      case 'In Review':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40';
      default:
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <button
      type="button"
      onClick={handleNext}
      className={`px-3.5 py-2 text-xs font-semibold border ${getRadiusClass('pill')} ${getTone(current)} active:scale-95 transition-all cursor-pointer flex items-center gap-2 shadow-xs`}
    >
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <span>Status: {current}</span>
      <span className="text-[10px] opacity-70 font-mono">(Click to cycle)</span>
    </button>
  );
};
