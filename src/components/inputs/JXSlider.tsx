// @jxui/react v3.0.0 — JXSlider (JXUI v3.0 Unified Component Suite)
import React, { useState, useId } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXSliderMark {
  value: number;
  label?: string;
}

export interface JXSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  showHistogram?: boolean;
  histogramData?: number[];
  magneticMarks?: JXSliderMark[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_HISTOGRAM = [18, 34, 65, 92, 78, 54, 40, 28, 15, 10, 8, 5];

export const JXSlider: React.FC<JXSliderProps> = ({
  value,
  defaultValue = 140,
  onChange,
  min = 20,
  max = 480,
  step = 10,
  label,
  unit = 'ms',
  showHistogram = true,
  histogramData = DEFAULT_HISTOGRAM,
  magneticMarks = [
    { value: 20, label: '20ms (Edge)' },
    { value: 250, label: '250ms (Regional)' },
    { value: 480, label: '480ms (Max)' },
  ],
  disabled = false,
  className = '',
}) => {
  const { palette } = useJXTheme();
  const id = useId();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const commit = (raw: number) => {
    if (disabled) return;
    let snapped = raw;
    for (const m of magneticMarks) {
      if (Math.abs(raw - m.value) <= step * 0.8) {
        snapped = m.value;
        break;
      }
    }
    const clamped = Math.min(max, Math.max(min, snapped));
    if (!isControlled) setInternalVal(clamped);
    onChange?.(clamped);
  };

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          <span className={`font-mono text-xs font-bold tabular-nums ${palette.text}`}>
            {currentVal} {unit}
          </span>
        </div>
      )}

      {showHistogram && histogramData.length > 0 && (
        <div className="flex items-end gap-1 h-10 px-1" aria-hidden="true">
          {histogramData.map((h, i) => {
            const barThreshold =
              min + ((i + 1) / histogramData.length) * (max - min);
            const active = barThreshold <= currentVal;
            return (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-t transition-colors duration-150 ${
                  active ? palette.bg : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      )}

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={currentVal}
        onChange={(e) => commit(Number(e.target.value))}
        aria-label={label || 'Slider'}
        className="w-full accent-indigo-600 cursor-pointer"
      />

      {magneticMarks.length > 0 && (
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          {magneticMarks.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => commit(m.value)}
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {m.label || `${m.value}${unit}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
