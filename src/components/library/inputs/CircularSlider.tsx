// @jxui/react v3.0.0 — CircularSlider (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';

export interface CircularSliderProps {
  size?: number;
  minAngle?: number;
  maxAngle?: number;
  defaultValue?: number;
  onChange?: (degrees: number) => void;
}

export const CircularSlider: React.FC<CircularSliderProps> = ({
  size = 80,
  minAngle = 0,
  maxAngle = 360,
  defaultValue = 240,
  onChange,
}) => {
  const { palette } = useJXTheme();
  const [angle, setAngle] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = size / 2 - 8;
  const strokeWidth = 6;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (angle / 360) * circumference;

  const calculateAngle = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let rad = Math.atan2(dy, dx); // [-PI, PI]
    let deg = (rad * 180) / Math.PI + 90; // Top is 0
    if (deg < 0) deg += 360;
    const clamped = Math.max(minAngle, Math.min(maxAngle, Math.round(deg)));
    setAngle(clamped);
    onChange?.(clamped);
  }, [minAngle, maxAngle, onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculateAngle(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      calculateAngle(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Coordinates for the thumb
  const thumbRad = ((angle - 90) * Math.PI) / 180;
  const thumbX = center + radius * Math.cos(thumbRad);
  const thumbY = center + radius * Math.sin(thumbRad);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ width: size, height: size }}
        className="relative cursor-pointer touch-none group"
      >
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Active arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#circular-grad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-75"
          />
          <defs>
            <linearGradient id="circular-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          {/* Rotary thumb */}
          <circle
            cx={thumbX}
            cy={thumbY}
            r={6}
            className="fill-white stroke-indigo-600 stroke-2 shadow-md filter drop-shadow cursor-grab active:cursor-grabbing transition-transform group-hover:scale-125"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
            {angle}°
          </span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-slate-400">Rotary Knob</span>
    </div>
  );
};
