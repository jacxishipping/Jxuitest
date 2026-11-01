// @jxui/react v3.0.0 — JXNumberField (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useId } from 'react';
import { Minus, Plus, MoveHorizontal } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXNumberFieldProps {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  unitOptions?: string[];
  onUnitChange?: (unit: string) => void;
  scrubbableLabel?: boolean;
  holdAcceleration?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JXNumberField: React.FC<JXNumberFieldProps> = ({
  value,
  defaultValue = 16,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  label,
  unit = 'GB',
  unitOptions,
  onUnitChange,
  scrubbableLabel = true,
  holdAcceleration = true,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const id = useId();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const holdTimerRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; startVal: number } | null>(null);

  const clampValue = (v: number) => Math.min(max, Math.max(min, v));

  const commit = (next: number) => {
    const clamped = clampValue(next);
    if (!isControlled) setInternalVal(clamped);
    onChange?.(clamped);
  };

  const stopHold = () => {
    if (holdTimerRef.current !== null) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const startHold = (direction: 1 | -1) => {
    if (disabled) return;
    commit(currentVal + direction * step);
    if (!holdAcceleration) return;
    stopHold();
    let latestVal = currentVal + direction * step;
    holdTimerRef.current = window.setInterval(() => {
      latestVal = clampValue(latestVal + direction * step);
      if (!isControlled) setInternalVal(latestVal);
      onChange?.(latestVal);
    }, 110);
  };

  const handleLabelPointerDown = (e: React.PointerEvent) => {
    if (!scrubbableLabel || disabled) return;
    dragStartRef.current = { x: e.clientX, startVal: currentVal };
    const handleMove = (moveEvent: PointerEvent) => {
      if (!dragStartRef.current) return;
      const deltaPx = moveEvent.clientX - dragStartRef.current.x;
      const stepsDelta = Math.round(deltaPx / 8) * step;
      commit(dragStartRef.current.startVal + stepsDelta);
    };
    const handleUp = () => {
      dragStartRef.current = null;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const btnSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-9 h-9';

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || unitOptions) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              onPointerDown={handleLabelPointerDown}
              className={`text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 select-none ${
                scrubbableLabel ? 'cursor-ew-resize' : ''
              }`}
              title={scrubbableLabel ? 'Drag horizontally to scrub value' : undefined}
            >
              <span>{label}</span>
              {scrubbableLabel && (
                <MoveHorizontal className="w-3 h-3 text-slate-400" />
              )}
            </label>
          )}
          {unitOptions && unitOptions.length > 0 && (
            <div className="flex items-center gap-1">
              {unitOptions.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => onUnitChange?.(u)}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                    unit === u
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={`flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:ring-3 ${palette.ring} ${getRadiusClass('control')} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <button
          type="button"
          disabled={disabled || currentVal <= min}
          onMouseDown={() => startHold(-1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          aria-label="Decrease value"
          className={`${btnSize} rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform disabled:opacity-40`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center justify-center gap-1 px-3">
          {unit === '$' && (
            <span className="font-mono text-sm font-bold text-slate-400">$</span>
          )}
          <input
            id={id}
            type="number"
            value={currentVal}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              if (!Number.isNaN(parsed)) commit(parsed);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                commit(currentVal + step);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                commit(currentVal - step);
              }
            }}
            className="w-16 text-center font-mono text-base font-bold tabular-nums bg-transparent text-slate-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && unit !== '$' && (
            <span className="font-mono text-xs font-semibold text-slate-500">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={disabled || currentVal >= max}
          onMouseDown={() => startHold(1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          aria-label="Increase value"
          className={`${btnSize} rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform disabled:opacity-40`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
