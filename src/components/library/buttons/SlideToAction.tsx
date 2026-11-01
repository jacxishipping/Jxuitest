// @jxui/react v3.0.0 — SlideToAction (JXUI v3.0 Unified Component Suite)
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

// 12. SlideToAction
export interface SlideToActionProps {
  onComplete?: () => void;
  label?: string;
  completedText?: string;
}
export const SlideToAction: React.FC<SlideToActionProps> = ({
  onComplete,
  label = 'Slide to unlock',
  completedText = 'Unlocked! (Click to reset)',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [dragX, setDragX] = useState(0);
  const [completed, setCompleted] = useState(false);
  const maxDrag = 160;

  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDragX(val);
    if (val >= maxDrag) {
      setCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    if (completed) {
      setCompleted(false);
      setDragX(0);
    }
  };

  return (
    <div
      onClick={handleReset}
      className={`relative w-[220px] h-11 bg-slate-200 dark:bg-slate-800 ${getRadiusClass('pill')} p-1 flex items-center overflow-hidden select-none ${completed ? 'cursor-pointer ring-2 ring-emerald-500/40' : ''}`}
    >
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide pl-6">
        {completed ? completedText : label}
      </span>
      <div
        style={{ transform: `translateX(${dragX}px)` }}
        className={`relative z-10 w-9 h-9 ${completed ? 'bg-emerald-600' : palette.bg} text-white rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing transition-transform`}
      >
        {completed ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      {!completed && (
        <input
          type="range"
          min={0}
          max={maxDrag}
          value={dragX}
          onChange={handleDrag}
          aria-label={label}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
        />
      )}
    </div>
  );
};
