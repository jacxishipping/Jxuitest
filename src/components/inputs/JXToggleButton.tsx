// @jxui/react v3.0.0 — JXToggleButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXToggleOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface JXToggleButtonProps {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const JXToggleButton: React.FC<JXToggleButtonProps> = ({
  selected = false,
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-mono font-semibold transition-all jx-spring whitespace-nowrap ${getRadiusClass('control')} ${
        selected
          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white jx-elevation-1'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      } ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export interface JXToggleButtonGroupProps {
  options?: JXToggleOption[];
  value?: string;
  defaultValue?: string;
  exclusive?: boolean;
  onChange?: (val: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export const JXToggleButtonGroup: React.FC<JXToggleButtonGroupProps> = ({
  options = [
    { value: '1h', label: '1h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
  ],
  value,
  defaultValue = '24h',
  onChange,
  ariaLabel = 'Segmented toggle control',
  disabled = false,
  helperText,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const handleSelect = (v: string) => {
    if (disabled) return;
    if (!isControlled) setInternalVal(v);
    onChange?.(v);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 ${getRadiusClass('control')} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {options.map((opt) => (
          <JXToggleButton
            key={opt.value}
            value={opt.value}
            selected={currentVal === opt.value}
            disabled={opt.disabled || disabled}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </JXToggleButton>
        ))}
      </div>
      {helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
