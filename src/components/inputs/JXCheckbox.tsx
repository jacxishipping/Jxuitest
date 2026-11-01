// @jxui/react v3.0.0 — JXCheckbox (JXUI v3.0 Unified Component Suite)
import React, { useState, useId } from 'react';
import { Check, Minus } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: 'default' | 'card';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  label?: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
  spring?: boolean;
  className?: string;
}

export const JXCheckbox: React.FC<JXCheckboxProps> = ({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  variant = 'default',
  size = 'md',
  title,
  label,
  description,
  badge,
  disabled = false,
  spring = true,
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const id = useId();
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked! : internalChecked;

  const displayTitle = title || label;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const boxSize =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  const checkIndicator = (
    <div
      className={`mt-0.5 ${boxSize} rounded-md flex items-center justify-center border transition-all duration-200 ${
        spring ? 'jx-spring' : ''
      } ${
        isChecked || indeterminate
          ? `${palette.bg} border-transparent text-white scale-100`
          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
      }`}
    >
      {indeterminate ? (
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      ) : isChecked ? (
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      ) : null}
    </div>
  );

  if (variant === 'card') {
    return (
      <label
        htmlFor={id}
        className={`flex items-start justify-between gap-3 p-3.5 border cursor-pointer transition-all select-none ${
          spring ? 'jx-spring' : ''
        } ${getRadiusClass('control')} ${
          isChecked
            ? `${palette.border} ${palette.softBg}`
            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      >
        <div className="flex items-start gap-3">
          <input
            id={id}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : isChecked}
            onChange={handleToggle}
            className="sr-only"
          />
          {checkIndicator}
          <div>
            {displayTitle && (
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {displayTitle}
              </div>
            )}
            {description && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </div>
            )}
          </div>
        </div>
        {badge && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
            {badge}
          </span>
        )}
      </label>
    );
  }

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        onChange={handleToggle}
        className="sr-only"
      />
      {checkIndicator}
      {displayTitle && (
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
          {displayTitle}
        </span>
      )}
    </label>
  );
};
