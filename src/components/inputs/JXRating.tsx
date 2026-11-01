// @jxui/react v3.0.0 — JXRating (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Star, Heart, Zap, ThumbsUp } from 'lucide-react';
import { getRatingSentiment } from '../../utils/jxuiLogic';

export type JXRatingPreset = 'star' | 'heart' | 'zap' | 'thumb';

export interface JXRatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  max?: number;
  precision?: 0.5 | 1;
  preset?: JXRatingPreset;
  onPresetChange?: (preset: JXRatingPreset) => void;
  showPresetSwitcher?: boolean;
  showSentimentBadge?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JXRating: React.FC<JXRatingProps> = ({
  value,
  defaultValue = 4.5,
  onChange,
  max = 5,
  precision = 0.5,
  preset = 'star',
  onPresetChange,
  showPresetSwitcher = false,
  showSentimentBadge = true,
  readOnly = false,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const [hoverVal, setHoverVal] = useState<number | null>(null);
  const activeDisplay = hoverVal ?? currentVal;

  const commit = (v: number) => {
    if (readOnly || disabled) return;
    const clamped = Math.min(max, Math.max(0, v));
    if (!isControlled) setInternalVal(clamped);
    onChange?.(clamped);
  };

  const IconComp =
    preset === 'heart'
      ? Heart
      : preset === 'zap'
      ? Zap
      : preset === 'thumb'
      ? ThumbsUp
      : Star;

  const iconSize =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div
          role="slider"
          aria-label="Rating"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={currentVal}
          tabIndex={disabled || readOnly ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              commit(currentVal + precision);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              commit(currentVal - precision);
            } else if (e.key === 'Home') {
              e.preventDefault();
              commit(0);
            } else if (e.key === 'End') {
              e.preventDefault();
              commit(max);
            }
          }}
          className="flex items-center gap-1 focus:outline-none"
        >
          {Array.from({ length: max }, (_, i) => i + 1).map((idx) => {
            const filled = idx <= Math.ceil(activeDisplay);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || readOnly}
                onMouseEnter={() => !readOnly && !disabled && setHoverVal(idx)}
                onMouseLeave={() => setHoverVal(null)}
                onClick={() => commit(idx)}
                aria-label={`Rate ${idx} out of ${max}`}
                className="p-1.5 transition-transform duration-150 hover:scale-125 focus:outline-none disabled:pointer-events-none"
              >
                <IconComp
                  className={`${iconSize} transition-colors ${
                    filled
                      ? preset === 'heart'
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {showSentimentBadge && (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
            {activeDisplay}/{max} · {getRatingSentiment(activeDisplay)}
          </span>
        )}
      </div>

      {showPresetSwitcher && onPresetChange && (
        <div className="flex items-center gap-2">
          {(['star', 'heart', 'zap'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPresetChange(p)}
              className={`px-2.5 py-1 text-[11px] font-medium capitalize rounded border transition-colors ${
                preset === p
                  ? 'border-slate-900 dark:border-slate-100 font-semibold text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {p} icon
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
