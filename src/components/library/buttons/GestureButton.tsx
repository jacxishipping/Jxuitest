// @jxui/react v3.0.0 — GestureButton (JXUI v3.0 Unified Component Suite)
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

// 19. GestureButton
export interface GestureButtonProps {
  onSwipeRight?: () => void;
  label?: string;
}
export const GestureButton: React.FC<GestureButtonProps> = ({
  onSwipeRight,
  label = 'Tap / Double-Tap Gesture',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [gestureState, setGestureState] = useState<'idle' | 'tapped' | 'double'>('idle');

  const handleClick = () => {
    setGestureState('tapped');
    onSwipeRight?.();
    setTimeout(() => setGestureState('idle'), 900);
  };

  const handleDoubleClick = () => {
    setGestureState('double');
    onSwipeRight?.();
    setTimeout(() => setGestureState('idle'), 1100);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`px-4 py-2 text-xs font-semibold text-white ${
        gestureState === 'double'
          ? 'bg-emerald-600'
          : gestureState === 'tapped'
          ? 'bg-violet-600'
          : palette.bg
      } ${getRadiusClass('control')} shadow-md active:scale-95 transition-all cursor-pointer select-none`}
    >
      <div className="flex items-center gap-1.5">
        <MousePointer className="w-3.5 h-3.5" />
        <span>
          {gestureState === 'double'
            ? 'Double-Tap Recognized!'
            : gestureState === 'tapped'
            ? 'Tap Impulse Fired!'
            : label}
        </span>
      </div>
    </button>
  );
};
