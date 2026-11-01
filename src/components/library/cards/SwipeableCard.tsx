// @jxui/react v3.0.0 — SwipeableCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, X, RotateCcw } from 'lucide-react';

// 9. SwipeableCard
// Interactive drag gesture card with spring reset and left/right decision triggers
export interface SwipeableCardProps {
  title?: string;
  subtitle?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  title = 'Deploy to Edge Canary',
  subtitle = 'Swipe right to approve rollout, swipe left to reject.',
  onSwipeLeft,
  onSwipeRight,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swiped, setSwiped] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX - dragX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentDrag = e.clientX - startXRef.current;
    setDragX(currentDrag);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 80) {
      setSwiped('right');
      onSwipeRight?.();
    } else if (dragX < -80) {
      setSwiped('left');
      onSwipeLeft?.();
    } else {
      setDragX(0);
    }
  };

  const handleReset = () => {
    setSwiped(null);
    setDragX(0);
  };

  if (swiped) {
    return (
      <div
        className={`p-5 border text-center space-y-3 ${getRadiusClass('card')} ${
          swiped === 'right'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
        } ${className}`}
      >
        <div className="flex items-center justify-center gap-2 font-bold text-sm">
          {swiped === 'right' ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
          <span>{swiped === 'right' ? 'Action Approved' : 'Action Rejected'}</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Card</span>
        </button>
      </div>
    );
  }

  const rotation = (dragX / 100) * 8;
  const opacity = Math.max(0.4, 1 - Math.abs(dragX) / 250);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
      }}
      className={`relative p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ${getRadiusClass(
        'card'
      )} cursor-grab active:cursor-grabbing select-none space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          Swipeable Gesture
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {dragX > 40 ? '👉 Approve' : dragX < -40 ? '👈 Reject' : 'Drag Card'}
        </span>
      </div>
      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  );
};
