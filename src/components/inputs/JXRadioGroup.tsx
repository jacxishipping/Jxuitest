// @jxui/react v3.0.0 — JXRadioGroup (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXRadioOption {
  value: string;
  title: string;
  specs?: string;
  price?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface JXRadioGroupProps {
  options: JXRadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  variant?: 'bento-cards' | 'segmented-pill' | 'dots';
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const JXRadioGroup: React.FC<JXRadioGroupProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  variant = 'bento-cards',
  label,
  ariaLabel = 'Selection group',
  disabled = false,
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue || options[0]?.value || '');
  const currentVal = isControlled ? value! : internalVal;

  const selectOption = (val: string) => {
    if (disabled) return;
    if (!isControlled) setInternalVal(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = options[(idx + 1) % options.length];
      if (next && !next.disabled) selectOption(next.value);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = options[(idx - 1 + options.length) % options.length];
      if (prev && !prev.disabled) selectOption(prev.value);
    }
  };

  if (variant === 'segmented-pill') {
    return (
      <div
        role="radiogroup"
        aria-label={label || ariaLabel}
        className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 ${getRadiusClass('control')} ${className}`}
      >
        {options.map((opt, idx) => {
          const active = opt.value === currentVal;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              disabled={disabled || opt.disabled}
              onClick={() => selectOption(opt.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-all jx-spring whitespace-nowrap ${getRadiusClass('control')} ${
                active
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white jx-elevation-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {opt.title}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={label || ariaLabel}
      className={`space-y-2.5 ${className}`}
    >
      {label && (
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </div>
      )}
      {options.map((opt, idx) => {
        const active = opt.value === currentVal;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={disabled || opt.disabled}
            onClick={() => selectOption(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`w-full text-left p-3.5 border flex items-center justify-between gap-4 transition-all jx-spring ${getRadiusClass('control')} ${
              active
                ? `${palette.border} ${palette.softBg} ring-2 ring-indigo-500/20`
                : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            } ${disabled || opt.disabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-3">
              {opt.icon ? (
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active
                      ? `${palette.bg} text-white`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {opt.icon}
                </div>
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? palette.border : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {active && <div className={`w-2 h-2 rounded-full ${palette.bg}`} />}
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {opt.title}
                </div>
                {opt.specs && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {opt.specs}
                  </div>
                )}
              </div>
            </div>
            {opt.price && (
              <div className="text-right font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0">
                {opt.price}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
