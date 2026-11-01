// @jxui/react v3.0.0 — GestureNavigation (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { ArrowLeft, ArrowRight, Compass, Shield, Zap, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Luminescence', icon: Sparkles, desc: 'Zero CLS dynamic radiance' },
  { id: 2, title: 'Tactile Physics', icon: Zap, desc: 'Spring kinematic velocity' },
  { id: 3, title: 'WCAG AAA', icon: Shield, desc: 'High-contrast ARIA audited' },
];

export const GestureNavigation: React.FC = () => {
  const { palette, getRadiusClass } = useJXTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const prevStep = () => setActiveStep((curr) => Math.max(0, curr - 1));
  const nextStep = () => setActiveStep((curr) => Math.min(STEPS.length - 1, curr + 1));

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    setDragOffset(delta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (dragOffset > 40) {
      prevStep();
    } else if (dragOffset < -40) {
      nextStep();
    }
    setDragOffset(0);
  };

  const current = STEPS[activeStep];
  const Icon = current.icon;

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none">
      {/* Swipeable Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ transform: `translateX(${dragOffset}px)` }}
        className={`w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? 'duration-0' : 'duration-200'
        } ${getRadiusClass('card')} flex items-center justify-between gap-3`}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prevStep(); }}
          disabled={activeStep === 0}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 min-w-0 text-center">
          <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
              {current.title}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {current.desc}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); nextStep(); }}
          disabled={activeStep === STEPS.length - 1}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Step Indicators & Gesture Hint */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStep(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeStep === idx ? 'w-4 bg-indigo-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <span className="text-[9px] font-mono text-slate-400">Swipe or drag left / right</span>
    </div>
  );
};
